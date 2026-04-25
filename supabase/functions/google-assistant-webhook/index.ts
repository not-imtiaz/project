import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Config ─────────────────────────────────────────────────────────────
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SB_ANON_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ──────────────────────────────────────────────────────────────
interface ParsedCommand {
  title?: string;
  category?: string;
  status?: string;
  note?: string;
  ingredients?: string[];
}

// ─── Voice Command Parser ───────────────────────────────────────────────
function parseVoiceCommand(text: string): ParsedCommand {
  const result: ParsedCommand = {};
  const lower = text.toLowerCase().trim();

  const titleMatch = lower.match(/title[:\s]+([^,]+)/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const categoryMatch = lower.match(/category[:\s]+([^,]+)/i);
  if (categoryMatch) result.category = categoryMatch[1].trim();

  const statusMatch = lower.match(/status[:\s]+([^,]+)/i);
  if (statusMatch) result.status = statusMatch[1].trim();

  const noteMatch = lower.match(/note[:\s]+(.+)/i);
  if (noteMatch) result.note = noteMatch[1].trim();

  const ingMatch = lower.match(/ingredients?[:\s]+([^,]+(?:,\s*[^,]+)*)/i);
  if (ingMatch) result.ingredients = ingMatch[1].split(",").map((s) => s.trim()).filter(Boolean);

  return result;
}

// ─── Database Operations ────────────────────────────────────────────────
async function createProject(p: ParsedCommand) {
  if (!p.title) throw new Error("Title is required");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: p.title,
      category: p.category || "Personal",
      status: p.status || "Planning",
      project_note: p.note || null,
      project_ingredients: p.ingredients?.length ? p.ingredients : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function appendNote(p: ParsedCommand) {
  if (!p.title) throw new Error("Title is required");
  if (!p.note) throw new Error("Note content is required");

  const { data: existing, error: findErr } = await supabase
    .from("projects")
    .select("id, project_note")
    .ilike("title", `%${p.title}%`)
    .limit(1)
    .single();

  if (findErr || !existing) throw new Error(`Project "${p.title}" not found`);

  const timestamp = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
  const newNote = `${existing.project_note || ""}\n\n**Voice (${timestamp})**: ${p.note}`;

  const { data, error: updateErr } = await supabase
    .from("projects")
    .update({ project_note: newNote })
    .eq("id", existing.id)
    .select()
    .single();

  if (updateErr) throw new Error(updateErr.message);
  return data;
}

async function updateStatus(p: ParsedCommand) {
  if (!p.title) throw new Error("Title is required");
  if (!p.status) throw new Error("Status is required");

  const validStatuses = ["Planning", "In Progress", "Review", "Done", "Archived"];
  if (!validStatuses.includes(p.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const { data: existing, error: findErr } = await supabase
    .from("projects")
    .select("id")
    .ilike("title", `%${p.title}%`)
    .limit(1)
    .single();

  if (findErr || !existing) throw new Error(`Project "${p.title}" not found`);

  const { data, error: updateErr } = await supabase
    .from("projects")
    .update({ status: p.status })
    .eq("id", existing.id)
    .select()
    .single();

  if (updateErr) throw new Error(updateErr.message);
  return data;
}

async function addIngredients(p: ParsedCommand) {
  if (!p.title) throw new Error("Title is required");
  if (!p.ingredients?.length) throw new Error("Ingredients required");

  const { data: existing, error: findErr } = await supabase
    .from("projects")
    .select("id, project_ingredients")
    .ilike("title", `%${p.title}%`)
    .limit(1)
    .single();

  if (findErr || !existing) throw new Error(`Project "${p.title}" not found`);

  const current: string[] = existing.project_ingredients || [];
  const merged = [...new Set([...current, ...p.ingredients])];

  const { data, error: updateErr } = await supabase
    .from("projects")
    .update({ project_ingredients: merged })
    .eq("id", existing.id)
    .select()
    .single();

  if (updateErr) throw new Error(updateErr.message);
  return data;
}

// ─── Router ─────────────────────────────────────────────────────────────
const handlers: Record<string, Function> = {
  create_project: createProject,
  append_note: appendNote,
  update_status: updateStatus,
  add_ingredients: addIngredients,
};

// ─── Main ───────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token || token !== WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse payload
    const body = await req.json();
    const { action_type, text_payload } = body;

    if (!action_type || !text_payload) {
      return new Response(JSON.stringify({ success: false, error: "Missing action_type or text_payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const handler = handlers[action_type];
    if (!handler) {
      return new Response(JSON.stringify({ success: false, error: `Unknown action_type: ${action_type}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsed = parseVoiceCommand(text_payload);
    const result = await handler(parsed);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
