<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ImtuDev — Project Manager</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --card: #16161f;
    --border: #1e1e2e;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --accent3: #43e97b;
    --text: #e8e8f0;
    --muted: #6b6b85;
    --code-bg: #0d0d15;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    min-height: 100vh;
  }

  /* ── GRID BG ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 24px 80px;
    position: relative;
    z-index: 1;
  }

  /* ── HERO BANNER ── */
  .hero {
    position: relative;
    border-radius: 0 0 24px 24px;
    overflow: hidden;
    margin-bottom: 48px;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%);
    border: 1px solid var(--border);
    border-top: none;
    padding: 60px 48px 48px;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(108,99,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(108,99,255,0.1) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .hero-glow {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .hero-glow.purple { background: rgba(108,99,255,0.25); top: -100px; right: -80px; }
  .hero-glow.pink   { background: rgba(255,101,132,0.15); bottom: -100px; left: -80px; }
  .hero-glow.green  { background: rgba(67,233,123,0.1); top: 50%; left: 40%; }

  .hero-inner { position: relative; z-index: 1; }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.3);
    border-radius: 100px;
    padding: 4px 12px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .hero-tag::before { content: '▸'; }

  .hero h1 {
    font-family: 'Space Mono', monospace;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .hero h1 span.grad {
    background: linear-gradient(90deg, #6c63ff, #ff6584, #43e97b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    color: var(--muted);
    font-size: 15px;
    font-weight: 300;
    margin-bottom: 28px;
    max-width: 480px;
  }

  /* ── BADGES ── */
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .badge:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.5); }

  .badge-left {
    background: #1a1a2e;
    color: #8888aa;
    padding: 5px 10px;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .badge-right { padding: 5px 10px; color: #fff; }
  .badge-right.purple { background: #6c63ff; }
  .badge-right.pink   { background: #ff6584; }
  .badge-right.green  { background: #27ae60; }
  .badge-right.blue   { background: #2980b9; }
  .badge-right.orange { background: #e67e22; }
  .badge-right.teal   { background: #1abc9c; }
  .badge-right.dark   { background: #2c3e50; }

  /* ── PLATFORM PILLS ── */
  .platforms {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .platform-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 13px;
    color: var(--text);
  }
  .platform-pill .icon { font-size: 18px; }
  .platform-pill .pill-label { font-weight: 500; }
  .platform-pill .pill-tech { color: var(--muted); font-size: 11px; font-family: 'Space Mono', monospace; }

  /* ── SECTION ── */
  section { margin-bottom: 48px; }

  h2 {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── FEATURES GRID ── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .feature-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feature-card:hover { border-color: rgba(108,99,255,0.4); transform: translateY(-2px); }

  .feature-icon { font-size: 22px; margin-bottom: 8px; }
  .feature-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
  .feature-desc { color: var(--muted); font-size: 13px; line-height: 1.5; }

  /* ── TECH TABLE ── */
  .tech-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .tech-table th {
    background: rgba(108,99,255,0.08);
    padding: 10px 16px;
    text-align: left;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .tech-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
  }
  .tech-table tr:last-child td { border-bottom: none; }
  .tech-table tr:hover td { background: rgba(255,255,255,0.02); }
  .tech-label { color: var(--muted); font-size: 12px; font-family: 'Space Mono', monospace; }
  .tech-val { font-weight: 500; }
  .tech-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
  }

  /* ── STEPS ── */
  .steps { display: flex; flex-direction: column; gap: 0; }

  .step {
    display: flex;
    gap: 16px;
    position: relative;
  }
  .step-line {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .step-num {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(108,99,255,0.5);
  }
  .step-connector {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin: 4px 0;
    min-height: 20px;
  }
  .step:last-child .step-connector { display: none; }

  .step-body { padding-bottom: 28px; padding-top: 4px; flex: 1; }
  .step-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; }

  /* ── CODE BLOCK ── */
  .code-block {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin: 12px 0;
  }
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border);
  }
  .code-dots { display: flex; gap: 6px; }
  .code-dots span {
    width: 10px; height: 10px; border-radius: 50%;
    background: #333;
  }
  .code-dots span:nth-child(1) { background: #ff5f57; }
  .code-dots span:nth-child(2) { background: #febc2e; }
  .code-dots span:nth-child(3) { background: #28c840; }
  .code-lang {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .code-block pre {
    padding: 16px;
    overflow-x: auto;
    font-family: 'Space Mono', monospace;
    font-size: 12.5px;
    line-height: 1.7;
    color: #c9c9e3;
  }
  .kw { color: #ff79c6; }
  .str { color: #f1fa8c; }
  .cmt { color: #6272a4; font-style: italic; }
  .fn { color: #50fa7b; }
  .num { color: #bd93f9; }
  .key { color: #8be9fd; }

  /* ── FILE STRUCTURE ── */
  .file-tree {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    font-family: 'Space Mono', monospace;
    font-size: 12.5px;
    line-height: 2;
  }
  .ft-dir { color: #6c63ff; font-weight: 700; }
  .ft-file { color: #c9c9e3; }
  .ft-comment { color: var(--muted); font-style: italic; }
  .ft-indent { display: inline-block; }

  /* ── SECURITY TABLE ── */
  .sec-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .sec-table th {
    background: rgba(255,101,132,0.08);
    padding: 10px 16px;
    text-align: left;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .sec-table td {
    padding: 11px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .sec-table tr:last-child td { border-bottom: none; }
  .ok  { color: var(--accent3); font-family: 'Space Mono', monospace; font-size: 12px; }
  .no  { color: var(--accent2); font-family: 'Space Mono', monospace; font-size: 12px; }

  /* ── TROUBLESHOOT ── */
  .trouble-list { display: flex; flex-direction: column; gap: 10px; }
  .trouble-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
    align-items: start;
  }
  .trouble-issue {
    font-weight: 600;
    font-size: 13px;
    color: var(--accent2);
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }
  .trouble-issue::before { content: '⚠'; font-size: 12px; margin-top: 1px; flex-shrink: 0; }
  .trouble-fix { font-size: 13px; color: var(--muted); }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--border);
    padding-top: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: gap;
    gap: 16px;
  }
  .footer-logo {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 18px;
    background: linear-gradient(90deg, #6c63ff, #ff6584);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--accent); }
  .footer-mit {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    margin-top: 16px;
  }

  /* ── INFO CALLOUT ── */
  .callout {
    display: flex;
    gap: 12px;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    margin: 12px 0;
  }
  .callout.info { background: rgba(41,128,185,0.1); border: 1px solid rgba(41,128,185,0.25); }
  .callout.warn { background: rgba(255,101,132,0.08); border: 1px solid rgba(255,101,132,0.2); color: #f0c0c8; }
  .callout-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

  /* ── DIVIDER ── */
  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 40px 0;
  }

  /* animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-inner { animation: fadeUp 0.6s ease both; }
  section { animation: fadeUp 0.6s ease both; }

  @media (max-width: 600px) {
    .hero { padding: 40px 24px 32px; }
    .features-grid { grid-template-columns: 1fr; }
    .trouble-item { grid-template-columns: 1fr; }
    .footer { flex-direction: column; }
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════ HERO ═══════════════════════════════ -->
<header class="hero">
  <div class="hero-grid"></div>
  <div class="hero-glow purple"></div>
  <div class="hero-glow pink"></div>
  <div class="hero-glow green"></div>

  <div class="hero-inner wrap" style="padding-top:0;padding-bottom:0;">
    <div class="hero-tag">v1.0.0 — Open Source</div>
    <h1><span class="grad">ImtuDev</span><br>Project Manager</h1>
    <p class="hero-sub">A minimalist, iPhone-inspired project manager for hardware &amp; software projects. Track components, collaborators, code, and status — synced across all devices.</p>

    <div class="badges">
      <span class="badge">
        <span class="badge-left">platform</span>
        <span class="badge-right purple">Expo / React Native</span>
      </span>
      <span class="badge">
        <span class="badge-left">platform</span>
        <span class="badge-right blue">Electron / Web</span>
      </span>
      <span class="badge">
        <span class="badge-left">backend</span>
        <span class="badge-right green">Supabase</span>
      </span>
      <span class="badge">
        <span class="badge-left">license</span>
        <span class="badge-right dark">MIT</span>
      </span>
      <span class="badge">
        <span class="badge-left">node</span>
        <span class="badge-right teal">≥ v18</span>
      </span>
      <span class="badge">
        <span class="badge-left">build</span>
        <span class="badge-right orange">EAS</span>
      </span>
    </div>

    <div class="platforms">
      <div class="platform-pill">
        <span class="icon">📱</span>
        <div>
          <div class="pill-label">Mobile</div>
          <div class="pill-tech">React Native · Expo</div>
        </div>
      </div>
      <div class="platform-pill">
        <span class="icon">🖥️</span>
        <div>
          <div class="pill-label">Desktop</div>
          <div class="pill-tech">Electron · HTML/CSS/JS</div>
        </div>
      </div>
      <div class="platform-pill">
        <span class="icon">☁️</span>
        <div>
          <div class="pill-label">Backend</div>
          <div class="pill-tech">Supabase · PostgreSQL</div>
        </div>
      </div>
    </div>
  </div>
</header>

<div class="wrap">

<!-- ═══════════════════════════════ FEATURES ═══════════════════════════════ -->
<section>
  <h2>✨ Features</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">🗂️</div>
      <div class="feature-title">Project Grid</div>
      <div class="feature-desc">Browse all projects with category and status filters at a glance.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔍</div>
      <div class="feature-title">Instant Search</div>
      <div class="feature-desc">Find any project by title or category in milliseconds.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔩</div>
      <div class="feature-title">Hardware Tracker</div>
      <div class="feature-desc">100+ common parts — ESP32, sensors, modules — built in.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">👥</div>
      <div class="feature-title">Collaborators</div>
      <div class="feature-desc">Add contributors with names and financial contribution tracking.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">💻</div>
      <div class="feature-title">Code Snippets</div>
      <div class="feature-desc">Store code with a syntax-highlighted editor per project.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📝</div>
      <div class="feature-title">Markdown Notes</div>
      <div class="feature-desc">Write rich project notes with full Markdown support.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <div class="feature-title">Full CRUD</div>
      <div class="feature-desc">Create, read, update, and delete projects seamlessly.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔄</div>
      <div class="feature-title">Cross-Device Sync</div>
      <div class="feature-desc">Phone and desktop share one Supabase database in real time.</div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════ TECH STACK ═══════════════════════════════ -->
<section>
  <h2>🏗️ Tech Stack</h2>
  <table class="tech-table">
    <thead>
      <tr><th>Layer</th><th>Technology</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="tech-label">Frontend — Mobile</td>
        <td class="tech-val"><span class="tech-dot" style="background:#61dafb"></span>React Native (Expo)</td>
      </tr>
      <tr>
        <td class="tech-label">Frontend — Desktop</td>
        <td class="tech-val"><span class="tech-dot" style="background:#f0db4f"></span>HTML / CSS / JavaScript (Electron)</td>
      </tr>
      <tr>
        <td class="tech-label">Backend / DB</td>
        <td class="tech-val"><span class="tech-dot" style="background:#3ecf8e"></span>Supabase (PostgreSQL)</td>
      </tr>
      <tr>
        <td class="tech-label">Build Tool</td>
        <td class="tech-val"><span class="tech-dot" style="background:#6c63ff"></span>EAS — Expo Application Services</td>
      </tr>
    </tbody>
  </table>
</section>

<!-- ═══════════════════════════════ SUPABASE ═══════════════════════════════ -->
<section>
  <h2>🗄️ Supabase Setup</h2>

  <div class="steps">
    <div class="step">
      <div class="step-line"><div class="step-num">1</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Create a Supabase project</div>
        <p style="color:var(--muted);font-size:13px;">Go to <strong style="color:var(--text)">supabase.com</strong>, click <strong style="color:var(--text)">New Project</strong>. Name it <code style="background:var(--code-bg);padding:2px 6px;border-radius:4px;font-family:'Space Mono',monospace;font-size:12px">ImtuDev</code>, set a strong DB password, and pick the region closest to you.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-line"><div class="step-num">2</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Create the projects table</div>
        <p style="color:var(--muted);font-size:13px;margin-bottom:8px;">In the Supabase dashboard → <strong style="color:var(--text)">SQL Editor → New Query</strong>, run:</p>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-lang">sql</span>
          </div>
          <pre><span class="cmt">-- Create the projects table</span>
<span class="kw">CREATE TABLE</span> projects (
  id          <span class="key">UUID</span>      <span class="fn">DEFAULT gen_random_uuid</span>() <span class="kw">PRIMARY KEY</span>,
  title       <span class="key">TEXT</span>      <span class="kw">NOT NULL</span>,
  category    <span class="key">TEXT</span>,
  status      <span class="key">TEXT</span>,
  created_at  <span class="key">TIMESTAMPTZ</span> <span class="fn">DEFAULT NOW</span>(),
  project_note         <span class="key">TEXT</span>,
  project_ingredients  <span class="key">JSONB</span>,
  project_code         <span class="key">TEXT</span>,
  project_collaborators <span class="key">JSONB</span>
);

<span class="cmt">-- Enable Row Level Security</span>
<span class="kw">ALTER TABLE</span> projects <span class="kw">ENABLE ROW LEVEL SECURITY</span>;

<span class="cmt">-- Allow all operations (public access for dev)</span>
<span class="kw">CREATE POLICY</span> <span class="str">"Allow all operations"</span> <span class="kw">ON</span> projects
  <span class="kw">FOR ALL USING</span> (<span class="num">true</span>) <span class="kw">WITH CHECK</span> (<span class="num">true</span>);</pre>
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step-line"><div class="step-num">3</div></div>
      <div class="step-body">
        <div class="step-title">Get your API keys</div>
        <p style="color:var(--muted);font-size:13px;margin-bottom:10px;">Go to <strong style="color:var(--text)">Settings → API</strong> in your dashboard. Copy your <strong style="color:var(--accent3)">Project URL</strong> and <strong style="color:var(--accent3)">anon public key</strong>.</p>
        <div class="callout warn">
          <span class="callout-icon">⚠️</span>
          <span>Use the <strong>anon/public</strong> key — NOT the <code>service_role</code> secret key. The service role bypasses all security and should never touch your frontend.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════ MOBILE SETUP ═══════════════════════════════ -->
<section>
  <h2>📱 Mobile Setup — React Native / Expo</h2>
  <div class="steps">
    <div class="step">
      <div class="step-line"><div class="step-num">1</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Clone and install</div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">bash</span></div>
          <pre>git clone https://github.com/not-imtiaz/project.git
cd project
npm install</pre>
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-line"><div class="step-num">2</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Configure credentials — <code style="font-size:11px">app.config.js</code></div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">javascript</span></div>
          <pre><span class="kw">export default</span> {
  expo: {
    name: <span class="str">'ImtuDev'</span>,
    slug: <span class="str">'project'</span>,
    version: <span class="str">'1.0.0'</span>,
    orientation: <span class="str">'portrait'</span>,
    userInterfaceStyle: <span class="str">'automatic'</span>,
    android: {
      package: <span class="str">'com.imtudev.app'</span>,
      usesCleartextTraffic: <span class="num">true</span>,
    },
    extra: {
      SUPABASE_URL: <span class="str">'YOUR_SUPABASE_URL_HERE'</span>,
      SUPABASE_KEY: <span class="str">'YOUR_ANON_KEY_HERE'</span>,
    },
  },
};</pre>
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-line"><div class="step-num">3</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Start the dev server</div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">bash</span></div>
          <pre>npx expo start</pre>
        </div>
        <p style="color:var(--muted);font-size:13px;margin-top:8px;">Scan the QR code with <strong style="color:var(--text)">Expo Go</strong> on your phone.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-line"><div class="step-num">4</div></div>
      <div class="step-body">
        <div class="step-title">Build a standalone APK</div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">bash</span></div>
          <pre>eas login
eas build:configure          <span class="cmt"># Select "Android"</span>
eas build -p android --profile preview</pre>
        </div>
        <p style="color:var(--muted);font-size:13px;margin-top:8px;">Download and install the APK directly on your device from the EAS dashboard link.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════ DESKTOP SETUP ═══════════════════════════════ -->
<section>
  <h2>🖥️ Desktop Setup — Electron / Browser</h2>
  <div class="steps">
    <div class="step">
      <div class="step-line"><div class="step-num">1</div><div class="step-connector"></div></div>
      <div class="step-body">
        <div class="step-title">Create <code style="font-size:11px">desktop/.env</code></div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">.env</span></div>
          <pre>SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_KEY=YOUR_ANON_KEY_HERE</pre>
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-line"><div class="step-num">2</div></div>
      <div class="step-body">
        <div class="step-title">Run the app</div>
        <p style="color:var(--muted);font-size:13px;margin-bottom:10px;">Two options:</p>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">Electron</span></div>
          <pre>cd desktop
electron .</pre>
        </div>
        <div class="code-block">
          <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-lang">Browser</span></div>
          <pre>cd desktop
npx http-server -p 3000 --cors
<span class="cmt"># then open http://localhost:3000</span></pre>
        </div>
        <div class="callout info" style="margin-top:10px">
          <span class="callout-icon">ℹ️</span>
          <span>Mobile and desktop share the same Supabase database — changes sync automatically when you navigate back to the home screen.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════ FILE STRUCTURE ═══════════════════════════════ -->
<section>
  <h2>📁 Project Structure</h2>
  <div class="file-tree">
<span class="ft-dir">project/</span>
├── <span class="ft-file">App.js</span>                       <span class="ft-comment"># Mobile entry · navigation setup</span>
├── <span class="ft-file">app.config.js</span>                <span class="ft-comment"># Expo config & Supabase credentials</span>
├── <span class="ft-file">supabaseClient.js</span>            <span class="ft-comment"># Supabase connection (mobile)</span>
├── <span class="ft-dir">screens/</span>
│   ├── <span class="ft-file">HomeScreen.js</span>            <span class="ft-comment"># Project grid + search + filters</span>
│   ├── <span class="ft-file">AddProjectScreen.js</span>      <span class="ft-comment"># New project form</span>
│   └── <span class="ft-file">ProjectDetailScreen.js</span>   <span class="ft-comment"># Edit / delete (detail view)</span>
├── <span class="ft-dir">components/</span>
│   ├── <span class="ft-file">ProjectCard.js</span>           <span class="ft-comment"># Card component for grid</span>
│   └── <span class="ft-file">ConfirmModal.js</span>          <span class="ft-comment"># Delete confirmation dialog</span>
├── <span class="ft-dir">desktop/</span>
│   ├── <span class="ft-file">index.html</span>               <span class="ft-comment"># Desktop dashboard structure</span>
│   ├── <span class="ft-file">style.css</span>                <span class="ft-comment"># Apple-inspired minimalist styling</span>
│   └── <span class="ft-file">renderer.js</span>              <span class="ft-comment"># Desktop logic & Supabase ops</span>
├── <span class="ft-dir">assets/</span>                          <span class="ft-comment"># Icons, splash screen</span>
├── <span class="ft-file">.gitignore</span>
└── <span class="ft-file">README.md</span>
  </div>
</section>

<!-- ═══════════════════════════════ SECURITY ═══════════════════════════════ -->
<section>
  <h2>🔒 Security Notes</h2>
  <table class="sec-table">
    <thead>
      <tr><th>File</th><th>Contains</th><th>Commit to Git?</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code style="font-size:12px;font-family:'Space Mono',monospace">app.config.js</code></td>
        <td style="font-size:13px;color:var(--muted)">Supabase anon key</td>
        <td class="ok">✅ Yes — anon key is public-safe</td>
      </tr>
      <tr>
        <td><code style="font-size:12px;font-family:'Space Mono',monospace">desktop/.env</code></td>
        <td style="font-size:13px;color:var(--muted)">Supabase credentials</td>
        <td class="no">❌ No — in .gitignore</td>
      </tr>
      <tr>
        <td><code style="font-size:12px;font-family:'Space Mono',monospace">service_role key</code></td>
        <td style="font-size:13px;color:var(--muted)">Admin / full DB access</td>
        <td class="no">❌ Never in frontend code</td>
      </tr>
    </tbody>
  </table>
</section>

<!-- ═══════════════════════════════ TROUBLESHOOTING ═══════════════════════════════ -->
<section>
  <h2>❓ Troubleshooting</h2>
  <div class="trouble-list">
    <div class="trouble-item">
      <div class="trouble-issue">Network request failed</div>
      <div class="trouble-fix">Check your Supabase URL and anon key. Free projects pause after 7 days — resume at supabase.com/dashboard.</div>
    </div>
    <div class="trouble-item">
      <div class="trouble-issue">Invalid API key</div>
      <div class="trouble-fix">Make sure you're using the <code style="font-size:11px;font-family:'Space Mono',monospace">anon</code> key (starts with <code style="font-size:11px;font-family:'Space Mono',monospace">eyJ...</code>), NOT the service_role key.</div>
    </div>
    <div class="trouble-item">
      <div class="trouble-issue">column "id" does not exist</div>
      <div class="trouble-fix">Re-run the SQL from the Supabase Setup section to create the table.</div>
    </div>
    <div class="trouble-item">
      <div class="trouble-issue">RLS policy error</div>
      <div class="trouble-fix">Run the <code style="font-size:11px;font-family:'Space Mono',monospace">CREATE POLICY</code> SQL command from the setup section.</div>
    </div>
    <div class="trouble-item">
      <div class="trouble-issue">White screen on phone</div>
      <div class="trouble-fix">Check the terminal for errors. Run <code style="font-size:11px;font-family:'Space Mono',monospace">npx expo start --clear</code> to clear the cache.</div>
    </div>
    <div class="trouble-item">
      <div class="trouble-issue">Desktop not connecting</div>
      <div class="trouble-fix">Verify <code style="font-size:11px;font-family:'Space Mono',monospace">desktop/.env</code> exists with the correct values.</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- ═══════════════════════════════ FOOTER ═══════════════════════════════ -->
<footer>
  <div class="footer">
    <div>
      <div class="footer-logo">ImtuDev</div>
      <div class="footer-mit">MIT License · Built with 🔩 &amp; ☕</div>
    </div>
    <div class="footer-links">
      <a href="https://supabase.com/dashboard">Supabase Dashboard ↗</a>
      <a href="https://supabase.com/docs/reference/javascript">Supabase JS Docs ↗</a>
      <a href="https://docs.expo.dev">Expo Docs ↗</a>
      <a href="https://docs.expo.dev/build">EAS Build ↗</a>
    </div>
  </div>
</footer>

</div><!-- /wrap -->
</body>
</html>
