const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── State ────────────────────────────────────────────────────────────────────
let allProjects = [];
let activeFilter = 'all';
let activeCategory = null;
let searchQuery = '';
let ingredientTags = [];
let currentDetailProject = null;   // for editing

const COMMON_PARTS = [
  'ESP32', 'Arduino Uno', 'Raspberry Pi 4', 'Capacitive Sensor',
  'DHT11', 'DHT22', 'MQTT', 'LoRa', 'GPS Module', 'OLED Display',
  'BME280', 'Servo Motor', 'Stepper Motor', 'Relay Module',
  'LiPo Battery', 'Solar Panel', 'Buck Converter'
];

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
  bindUI();
  initIngredientSuggestions();
});

// ─── Data ─────────────────────────────────────────────────────────────────────
async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  allProjects = data.map(normalizeProject) || [];
  updateSidebarCounts();
  applyFilters();
}

function normalizeProject(p) {
  return {
    ...p,
    project_collaborators: normalizeCollaborators(p.project_collaborators)
  };
}

function normalizeCollaborators(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(c => {
      if (typeof c === 'string') return { name: c, contribution: 0 };
      return c;
    });
  }
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.map(c => (typeof c === 'string' ? { name: c, contribution: 0 } : c));
  } catch {}
  return [];
}

// ─── Sidebar Counts ───────────────────────────────────────────────────────────
function updateSidebarCounts() {
  const set = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
  set('count-all', allProjects.length);
  const activeProjects = allProjects.filter(p => !p.status || p.status.toLowerCase() !== 'archived');
  const archivedProjects = allProjects.filter(p => p.status && p.status.toLowerCase() === 'archived');
  set('count-active', activeProjects.length);
  set('count-archive', archivedProjects.length);
  set('count-personal', allProjects.filter(p => p.category === 'Personal').length);
  set('count-business', allProjects.filter(p => p.category === 'Business').length);
  set('count-educational', allProjects.filter(p => p.category === 'Educational').length);

  const sub = document.getElementById('page-count');
  if (sub) sub.textContent = `${allProjects.length} projects`;
}

// ─── Filtering ────────────────────────────────────────────────────────────────
function applyFilters() {
  let projects = [...allProjects];
  if (activeFilter === 'active') {
    projects = projects.filter(p => !p.status || p.status.toLowerCase() !== 'archived');
  } else if (activeFilter === 'archive') {
    projects = projects.filter(p => p.status && p.status.toLowerCase() === 'archived');
  }
  if (activeCategory) {
    projects = projects.filter(p => p.category === activeCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    projects = projects.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.project_note || '').toLowerCase().includes(q)
    );
  }
  renderProjects(projects);
}

// ─── Render Grid ──────────────────────────────────────────────────────────────
function renderProjects(projects) {
  const list = document.getElementById('project-list');
  if (!list) return;
  if (!projects.length) {
    list.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;
                  justify-content:center;padding:60px 20px;gap:10px;color:var(--text-tertiary)">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
        <p style="font-size:14px">No projects found</p>
      </div>`;
    return;
  }

  list.innerHTML = projects.map((p, i) => {
    const catClass = (p.category || '').toLowerCase();
    const statusClass = (p.status || '').toLowerCase().replace(/\s+/g, '-');
    const ingredients = parseArray(p.project_ingredients);
    const collaborators = p.project_collaborators || [];
    const date = p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    const ingredientChips = ingredients.slice(0, 3).map(i =>
      `<span class="ingredient">${escHtml(i)}</span>`
    ).join('') + (ingredients.length > 3 ? `<span class="ingredient">+${ingredients.length - 3}</span>` : '');

    const totalContrib = collaborators.reduce((sum, c) => sum + (Number(c.contribution) || 0), 0);
    const collabSummary = collaborators.length ? `${collaborators.length} collab${collaborators.length>1?'s':''} · $${totalContrib}` : '';

    const avatarStack = collaborators.slice(0, 3).map(c =>
      `<div class="collab-avatar" title="${escHtml(c.name)}">${initials(c.name)}</div>`
    ).join('') + (collaborators.length > 3
      ? `<div class="collab-avatar collab-overflow">+${collaborators.length - 3}</div>` : '');

    const codePreview = p.project_code
      ? `<div class="card-code-preview">
           <span class="code-lang">code</span>
           <code>${escHtml(p.project_code.split('\n')[0].slice(0, 60))}</code>
         </div>` : '';

    return `
      <div class="project-card" style="animation-delay:${i * 0.04}s" data-id="${p.id}">
        <div class="card-header">
          <div class="card-meta-top">
            <span class="category-pill ${catClass}">${escHtml(p.category || '')}</span>
            <span class="status-badge ${statusClass}">${escHtml(p.status || '')}</span>
          </div>
          <button class="card-menu" title="Options" onclick="event.stopPropagation()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>
        <div class="card-title">${escHtml(p.title || 'Untitled')}</div>
        ${p.project_note ? `<div class="card-note">${escHtml(p.project_note)}</div>` : ''}
        ${ingredients.length ? `<div class="card-ingredients">${ingredientChips}</div>` : ''}
        ${codePreview}
        <div class="card-footer">
          <div class="collaborators">
            ${avatarStack ? `<div class="avatar-stack">${avatarStack}</div>` : ''}
            ${collabSummary ? `<span class="collab-label">${collabSummary}</span>` : ''}
          </div>
          <span class="card-date">${date}</span>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const proj = allProjects.find(p => String(p.id) === card.dataset.id);
      if (proj) openDetail(proj);
    });
  });
}

// ─── UI Bindings ──────────────────────────────────────────────────────────────
function bindUI() {
  document.getElementById('btn-new-project')?.addEventListener('click', openNewModal);
  document.getElementById('modal-close')?.addEventListener('click', closeNewModal);
  document.getElementById('btn-cancel')?.addEventListener('click', closeNewModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeNewModal();
  });

  document.getElementById('detail-close')?.addEventListener('click', closeDetail);
  document.getElementById('detail-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetail();
  });

  document.getElementById('search-input')?.addEventListener('input', e => {
    searchQuery = e.target.value;
    applyFilters();
  });

  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      activeFilter = el.dataset.filter;
      applyFilters();
    });
  });

  document.querySelectorAll('[data-category]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-category]').forEach(x => x.classList.remove('active'));
      const cat = el.dataset.category;
      if (activeCategory === cat) {
        activeCategory = null;
      } else {
        el.classList.add('active');
        activeCategory = cat;
      }
      applyFilters();
    });
  });

  document.getElementById('nav-all')?.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach(x => x.classList.remove('active'));
    activeCategory = null;
    applyFilters();
  });

  const tagInput = document.getElementById('ingredient-input');
  tagInput?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.value.trim()) {
      e.preventDefault();
      addIngredientTag(tagInput.value.trim().replace(/,$/, ''));
      tagInput.value = '';
      hideSuggestions();
    }
    if (e.key === 'Backspace' && !tagInput.value && ingredientTags.length) {
      ingredientTags.pop();
      renderIngredientTags();
    }
  });

  document.getElementById('btn-create')?.addEventListener('click', saveProject);

  // Confirmation dialog bindings
  document.getElementById('confirm-cancel')?.addEventListener('click', closeConfirm);
  document.getElementById('confirm-delete')?.addEventListener('click', executeDelete);
}

// ─── Ingredient Auto-Suggest ─────────────────────────────────────────────────
let suggestionBox = null;

function initIngredientSuggestions() {
  const input = document.getElementById('ingredient-input');
  if (!input) return;

  suggestionBox = document.createElement('div');
  suggestionBox.className = 'suggestions-dropdown';
  suggestionBox.style.display = 'none';
  input.parentNode.appendChild(suggestionBox);

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) { hideSuggestions(); return; }
    const matches = COMMON_PARTS.filter(part => part.toLowerCase().includes(val));
    if (matches.length > 0) {
      suggestionBox.innerHTML = matches.map(m => `<div class="suggestion-item">${escHtml(m)}</div>`).join('');
      suggestionBox.style.display = 'block';
      suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          addIngredientTag(item.textContent);
          input.value = '';
          hideSuggestions();
        });
      });
    } else {
      hideSuggestions();
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => hideSuggestions(), 200);
  });
}

function hideSuggestions() {
  if (suggestionBox) suggestionBox.style.display = 'none';
}

// ─── Ingredient Tags ──────────────────────────────────────────────────────────
function addIngredientTag(val, list = ingredientTags, renderFn = renderIngredientTags) {
  if (val && !list.includes(val)) {
    list.push(val);
    renderFn();
  }
}

function renderIngredientTags() {
  const list = document.getElementById('tag-list');
  if (!list) return;
  list.innerHTML = ingredientTags.map((t, i) => `
    <span class="tag-chip">
      ${escHtml(t)}
      <button onclick="removeTag(${i})" title="Remove">×</button>
    </span>`).join('');
}

window.removeTag = function(i) {
  ingredientTags.splice(i, 1);
  renderIngredientTags();
};

// ─── New Project Modal ────────────────────────────────────────────────────────
function openNewModal() {
  ingredientTags = [];
  renderIngredientTags();
  document.getElementById('new-project-form')?.reset();
  document.getElementById('modal-overlay')?.classList.add('open');
  hideSuggestions();
}

function closeNewModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}

async function saveProject() {
  const title = document.getElementById('input-title')?.value.trim();
  if (!title) { document.getElementById('input-title')?.focus(); return; }

  const collaboratorsRaw = document.getElementById('input-collaborators')?.value || '';
  const collabObjects = collaboratorsRaw.split(',').map(s => s.trim()).filter(Boolean)
    .map(name => ({ name, contribution: 0 }));

  const payload = {
    title,
    category:               document.getElementById('input-category')?.value || null,
    status:                 document.getElementById('input-status')?.value || null,
    project_note:           document.getElementById('input-note')?.value.trim() || null,
    project_ingredients:    ingredientTags.length ? ingredientTags : null,
    project_code:           document.getElementById('input-code')?.value.trim() || null,
    project_collaborators:  collabObjects.length ? collabObjects : null,
  };

  const btn = document.getElementById('btn-create');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  const { error } = await supabase.from('projects').insert(payload);
  btn.textContent = 'Create Project';
  btn.disabled = false;

  if (error) { alert('Error: ' + error.message); return; }
  closeNewModal();
  await fetchProjects();
}

// ─── Detail Panel (Editor) ────────────────────────────────────────────────────
function openDetail(p) {
  currentDetailProject = p;
  const catClass = (p.category || '').toLowerCase();
  const statusClass = (p.status || '').toLowerCase().replace(/\s+/g, '-');
  const ingredients = parseArray(p.project_ingredients);
  const collaborators = p.project_collaborators ? [...p.project_collaborators] : [];
  const date = p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  const panel = document.getElementById('detail-content');
  if (!panel) return;

  // Build ingredient tags
  const ingredientTagsHtml = ingredients.map((ing, i) =>
    `<span class="tag-chip">${escHtml(ing)}<button onclick="removeDetailIngredient(${i})">×</button></span>`
  ).join('');

  // Build collaborators list
  const collabListHtml = collaborators.map((c, i) => `
    <div class="collaborator-item">
      <div class="collaborator-info">
        <span class="collaborator-name">${escHtml(c.name)}</span>
        <span class="collaborator-contribution">$${Number(c.contribution).toLocaleString()}</span>
      </div>
      <button class="btn-remove-collab" onclick="removeCollaborator(${i})">Remove</button>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="detail-content">
      <div class="detail-header">
        <div class="detail-header-top">
          <div class="detail-meta">
            <span class="category-pill ${catClass}">${escHtml(p.category || '')}</span>
            <span class="status-badge ${statusClass}">${escHtml(p.status || '')}</span>
          </div>
          <button class="modal-close" id="detail-close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round">
              <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
            </svg>
          </button>
        </div>
        <input type="text" class="detail-title-input" id="edit-title" value="${escHtml(p.title || '')}">
        <div class="detail-date">${date}</div>
      </div>

      <div class="detail-body">
        <div class="detail-section">
          <div class="detail-label">Status</div>
          <div class="select-wrap">
            <select class="form-select" id="edit-status">
              <option value="Planning" ${(p.status === 'Planning') ? 'selected' : ''}>Planning</option>
              <option value="In Progress" ${(p.status === 'In Progress') ? 'selected' : ''}>In Progress</option>
              <option value="Review" ${(p.status === 'Review') ? 'selected' : ''}>Review</option>
              <option value="Done" ${(p.status === 'Done') ? 'selected' : ''}>Done</option>
            </select>
            <svg class="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Notes</div>
          <textarea class="detail-textarea" id="edit-note" rows="4">${escHtml(p.project_note || '')}</textarea>
        </div>

        <div class="detail-section">
          <div class="detail-label">Hardware Ingredients</div>
          <div class="detail-ingredients-wrap" id="detail-tag-wrap">
            <div class="tag-list" id="detail-tag-list">${ingredientTagsHtml}</div>
            <input type="text" class="tag-input" id="detail-ingredient-input" placeholder="Add ingredient…">
          </div>
        </div>

        ${p.project_code ? `
          <div class="detail-section">
            <div class="detail-label">Code Snippet</div>
            <div class="detail-code">
              <div class="code-editor-header">
                <div class="editor-dots"><span></span><span></span><span></span></div>
                <span class="editor-lang">snippet</span>
              </div>
              <pre class="code-block">${escHtml(p.project_code)}</pre>
            </div>
          </div>` : ''}

        <div class="detail-section">
          <div class="detail-label">Collaborators</div>
          <div class="collaborator-list" id="detail-collab-list">${collabListHtml || '<div style="color: var(--text-tertiary); font-size:13px;">No collaborators yet</div>'}</div>
          <div class="add-collab-form">
            <input type="text" class="form-input" id="new-collab-name" placeholder="Name">
            <input type="number" class="form-input" id="new-collab-contrib" placeholder="Contribution $" style="width:120px;">
            <button class="btn-add" id="btn-add-collab">Add</button>
          </div>
        </div>
      </div>

      <div class="detail-footer">
        <button class="btn-delete" id="btn-delete-project">Delete Project</button>
        <button class="btn-save" id="btn-save-changes">Save Changes</button>
      </div>
    </div>
  `;

  // Bind events inside the detail panel
  document.getElementById('detail-close').addEventListener('click', closeDetail);
  document.getElementById('btn-save-changes').addEventListener('click', updateProject);
  document.getElementById('btn-delete-project').addEventListener('click', confirmDeleteProject);

  // Ingredient input in detail
  const detailTagInput = document.getElementById('detail-ingredient-input');
  const detailTagList = document.getElementById('detail-tag-list');
  let detailIngredients = [...ingredients];

  function renderDetailIngredients() {
    if (detailTagList) {
      detailTagList.innerHTML = detailIngredients.map((ing, i) =>
        `<span class="tag-chip">${escHtml(ing)}<button onclick="removeDetailIngredient(${i})">×</button></span>`
      ).join('');
    }
  }

  window.removeDetailIngredient = function(i) {
    detailIngredients.splice(i, 1);
    renderDetailIngredients();
  };

  detailTagInput?.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && detailTagInput.value.trim()) {
      e.preventDefault();
      const val = detailTagInput.value.trim().replace(/,$/, '');
      if (val && !detailIngredients.includes(val)) {
        detailIngredients.push(val);
        renderDetailIngredients();
      }
      detailTagInput.value = '';
    }
    if (e.key === 'Backspace' && !detailTagInput.value && detailIngredients.length) {
      detailIngredients.pop();
      renderDetailIngredients();
    }
  });

  // Collaborator add
  document.getElementById('btn-add-collab').addEventListener('click', () => {
    const nameInput = document.getElementById('new-collab-name');
    const contribInput = document.getElementById('new-collab-contrib');
    const name = nameInput.value.trim();
    const contrib = parseFloat(contribInput.value) || 0;
    if (!name) return;
    collaborators.push({ name, contribution: contrib });
    refreshCollaboratorList(collaborators);
    nameInput.value = '';
    contribInput.value = '';
    nameInput.focus();
  });

  // Expose collaborators to global scope for remove
  window._detailCollabs = collaborators;
  window.removeCollaborator = function(i) {
    window._detailCollabs.splice(i, 1);
    refreshCollaboratorList(window._detailCollabs);
  };

  function refreshCollaboratorList(list) {
    const container = document.getElementById('detail-collab-list');
    if (!container) return;
    container.innerHTML = list.map((c, i) => `
      <div class="collaborator-item">
        <div class="collaborator-info">
          <span class="collaborator-name">${escHtml(c.name)}</span>
          <span class="collaborator-contribution">$${Number(c.contribution).toLocaleString()}</span>
        </div>
        <button class="btn-remove-collab" onclick="removeCollaborator(${i})">Remove</button>
      </div>
    `).join('') || '<div style="color: var(--text-tertiary); font-size:13px;">No collaborators yet</div>';
  }

  document.getElementById('detail-overlay')?.classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-overlay')?.classList.remove('open');
  currentDetailProject = null;
}

async function updateProject() {
  if (!currentDetailProject) return;

  const title = document.getElementById('edit-title')?.value.trim();
  const status = document.getElementById('edit-status')?.value;
  const note = document.getElementById('edit-note')?.value.trim();

  // Gather ingredients from detail view
  const ingredientSpans = document.querySelectorAll('#detail-tag-list .tag-chip');
  const ingredients = [];
  ingredientSpans.forEach(chip => {
    const text = chip.childNodes[0].textContent.trim();
    if (text) ingredients.push(text);
  });

  const collaborators = window._detailCollabs || [];

  const payload = {
    title: title || null,
    status: status || null,
    project_note: note || null,
    project_ingredients: ingredients.length ? ingredients : null,
    project_collaborators: collaborators.length ? collaborators : null,
  };

  const btn = document.getElementById('btn-save-changes');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  const { error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', currentDetailProject.id);

  btn.textContent = 'Save Changes';
  btn.disabled = false;

  if (error) {
    alert('Error saving: ' + error.message);
    return;
  }

  // Refresh and close
  await fetchProjects();
  closeDetail();
}

// ─── Delete logic ─────────────────────────────────────────────────────────────
let projectToDelete = null;

function confirmDeleteProject() {
  if (!currentDetailProject) return;
  projectToDelete = currentDetailProject;
  document.getElementById('confirm-overlay')?.classList.add('open');
}

function closeConfirm() {
  document.getElementById('confirm-overlay')?.classList.remove('open');
  projectToDelete = null;
}

async function executeDelete() {
  if (!projectToDelete) return;
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectToDelete.id);

  if (error) {
    alert('Error deleting: ' + error.message);
  } else {
    await fetchProjects();
    closeDetail();
  }
  closeConfirm();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initials(name) {
  return (name || '?').split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function parseArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed.filter(Boolean); }
  catch { /* not JSON */ }
  return String(val).split(',').map(s => s.trim()).filter(Boolean);
}

function simpleMarkdown(md) {
  let html = escHtml(md);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  html = '<p>' + html + '</p>';
  return html;
}
