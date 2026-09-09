/**
 * MUHAMMED SINAN KP — ADVANCED VISUAL CMS & UI REBUILDER
 * Login: KSINANP / 3518
 * Features:
 *  - Full Proficiency & Metrics Editing (Sliders, live progress bars, badges)
 *  - Searchable Lucide Icon Picker (70+ curated icons for skills, pillars, badges)
 *  - Dynamic Skill Tabs & Skills Manager (Add, edit, delete, reorder, tag chips, filter tabs)
 *  - Media & Image Manager (File upload / drag-and-drop with canvas downscaling, URL, presets)
 *  - Complete Theme Engine (6 rich themes: Light Gold, Dark Cyber, Midnight OLED, Cyberpunk, Emerald, Sunset)
 *  - Accent Palettes & Custom Dual-Color Pickers (live CSS variables)
 *  - Typography Engine (8 Google Fonts, curated pairings, font scale)
 *  - UI & Layout Rebuilder (Card radius, glassmorphism blur/opacity, tilt toggle, particle tuning, section toggles)
 *  - Inline Visual Content Editing (contenteditable + live progress click-to-edit)
 *  - Custom CSS Live Editor
 *  - JSON Backup, Export & Import with instantaneous re-render
 *  - Auto-persistence in localStorage + Ctrl+S shortcut
 */

/* ==========================================================================
   1. CONSTANTS & DEFAULTS
   ========================================================================== */
const ADMIN_USER = 'KSINANP';
const ADMIN_PASS = '3518';
const STORAGE_KEY_MASTER = 'sinankp_master_config_v2';

const ACCENT_PRESETS = [
  { name: 'Gold',        main: '#c9a84c', deep: '#a07830', light: '#e0bb72', pale: '#f5e9c8', subtle: 'rgba(201,168,76,0.12)',  border: 'rgba(201,168,76,0.28)' },
  { name: 'Emerald',     main: '#10b981', deep: '#059669', light: '#34d399', pale: '#d1fae5', subtle: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)' },
  { name: 'Rose',        main: '#e11d48', deep: '#be123c', light: '#fb7185', pale: '#ffe4e6', subtle: 'rgba(225,29,72,0.1)',    border: 'rgba(225,29,72,0.25)'  },
  { name: 'Violet',      main: '#7c3aed', deep: '#6d28d9', light: '#a78bfa', pale: '#ede9fe', subtle: 'rgba(124,58,237,0.1)',   border: 'rgba(124,58,237,0.25)' },
  { name: 'Sky',         main: '#0284c7', deep: '#0369a1', light: '#38bdf8', pale: '#e0f2fe', subtle: 'rgba(2,132,199,0.1)',    border: 'rgba(2,132,199,0.25)'  },
  { name: 'Amber',       main: '#d97706', deep: '#b45309', light: '#fbbf24', pale: '#fef3c7', subtle: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.28)'  },
  { name: 'Neon Cyan',   main: '#00f0ff', deep: '#00a8b3', light: '#70f5ff', pale: 'rgba(0,240,255,0.2)', subtle: 'rgba(0,240,255,0.12)', border: 'rgba(0,240,255,0.35)' },
  { name: 'Slate',       main: '#475569', deep: '#334155', light: '#94a3b8', pale: '#f1f5f9', subtle: 'rgba(71,85,105,0.1)',    border: 'rgba(71,85,105,0.25)'  },
];

const LUCIDE_ICONS_CATALOG = [
  'layout', 'smartphone', 'globe', 'image', 'video', 'sparkle', 'sparkles',
  'palette', 'layers', 'zap', 'cpu', 'shield', 'shield-check', 'code', 'terminal',
  'monitor', 'compass', 'feather', 'pen-tool', 'camera', 'film', 'box', 'database',
  'cloud', 'activity', 'award', 'bookmark', 'check', 'clock', 'eye', 'file-text',
  'folder', 'grid', 'heart', 'help-circle', 'mail', 'map-pin', 'maximize-2',
  'message-circle', 'message-square', 'mic', 'moon', 'music', 'package', 'phone',
  'play', 'plus', 'radio', 'refresh-cw', 'search', 'send', 'settings', 'share-2',
  'sliders', 'star', 'sun', 'tag', 'tool', 'trending-up', 'user', 'users',
  'volume-2', 'wifi', 'wrench', 'zoom-in', 'briefcase', 'graduation-cap', 'target'
];

const FONT_PAIRINGS = [
  { id: 'default',   name: 'Editorial Luxury (Cormorant + DM Sans)', display: "'Cormorant Garamond', Georgia, serif", body: "'DM Sans', sans-serif" },
  { id: 'modern',    name: 'Modern Avant-Garde (Syne + Outfit)', display: "'Syne', sans-serif", body: "'Outfit', sans-serif" },
  { id: 'tech',      name: 'Futuristic Cyber (Inter + Space Grotesk)', display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
  { id: 'fashion',   name: 'High Elegance (Playfair + Plus Jakarta)', display: "'Playfair Display', Georgia, serif", body: "'Plus Jakarta Sans', sans-serif" },
  { id: 'clean',     name: 'Ultra Clean (Outfit + DM Sans)', display: "'Outfit', sans-serif", body: "'DM Sans', sans-serif" }
];

const DEFAULT_CONFIG = {
  theme: {
    preset: 'light', // light, dark, midnight, cyberpunk, emerald, sunset
    accentIdx: 0,
    customAccentHex: '#c9a84c',
    customSecondaryHex: '#00f0ff'
  },
  typography: {
    pairing: 'default',
    fontScale: 1
  },
  design: {
    cardRadius: 18,
    glassBlur: 16,
    cardOpacity: 85,
    borderOpacity: 15,
    tiltEnabled: true,
    particlesEnabled: true,
    particleCount: 45,
    particleSpeed: 1
  },
  media: {
    profileImg: 'assets/images/avatar.png',
    miniImg: 'assets/images/avatar.png',
    borderRadius: 24,
    showGlow: true,
    showOrbit: true
  },
  sections: {
    hero: true,
    about: true,
    skills: true,
    contact: true,
    footer: true,
    statusBadge: true,
    eduCard: true,
    highlights: true,
    floatingBadges: true
  },
  skills: [
    {
      id: 'skill-1',
      title: 'Graphic Design',
      category: 'design',
      desc: 'Visual identity, branding, promotional banners, vector illustrations, and high-impact social media creatives.',
      badge: 'Advanced',
      proficiency: 95,
      icon: 'layout',
      glow: 'glow-cyan',
      iconColor: 'icon-cyan',
      tags: ['Branding', 'Typography', 'Layouts']
    },
    {
      id: 'skill-2',
      title: 'UI/UX Design',
      category: 'design',
      desc: 'Wireframing, high-fidelity prototypes, interactive user journeys, and modern design systems in Figma.',
      badge: 'Expert',
      proficiency: 92,
      icon: 'smartphone',
      glow: 'glow-purple',
      iconColor: 'icon-purple',
      tags: ['Figma', 'Wireframing', 'Design Systems']
    },
    {
      id: 'skill-3',
      title: 'Web Design',
      category: 'design',
      desc: 'Responsive layouts, futuristic dark interfaces, micro-interactions, CSS animations, and clean semantic structures.',
      badge: 'Proficient',
      proficiency: 88,
      icon: 'globe',
      glow: 'glow-cyan',
      iconColor: 'icon-cyan',
      tags: ['Responsive UI', 'HTML/CSS', 'Modern Web']
    },
    {
      id: 'skill-4',
      title: 'Photoshop',
      category: 'tools',
      desc: 'Advanced photo manipulation, digital compositing, mockups, color grading, and creative poster designing.',
      badge: 'Mastery',
      proficiency: 96,
      icon: 'image',
      glow: 'glow-emerald',
      iconColor: 'icon-emerald',
      tags: ['Photo Manipulation', 'Retouching', 'Compositing']
    },
    {
      id: 'skill-5',
      title: 'Video Editing',
      category: 'tools',
      desc: 'Motion graphics, dynamic video cuts, sound sync, visual effects, and engaging short-form/long-form edits.',
      badge: 'Creative',
      proficiency: 85,
      icon: 'video',
      glow: 'glow-purple',
      iconColor: 'icon-purple',
      tags: ['Premiere Pro', 'After Effects', 'Motion Cuts']
    },
    {
      id: 'skill-6',
      title: 'AI Design Tools',
      category: 'ai',
      desc: 'Generative AI art, prompt engineering, AI-assisted rapid concepting, upscaling, and workflow automation.',
      badge: 'Innovator',
      proficiency: 90,
      icon: 'sparkle',
      glow: 'glow-cyan',
      iconColor: 'icon-cyan',
      tags: ['Generative AI', 'Prompting', 'AI Workflows']
    }
  ],
  categories: [
    { id: 'all', label: 'All Skills' },
    { id: 'design', label: 'Design & UI' },
    { id: 'tools', label: 'Software & Media' },
    { id: 'ai', label: 'AI & Future' }
  ],
  content: {},
  customCSS: ''
};

/* ==========================================================================
   2. APP STATE
   ========================================================================== */
let config = null;
let isAdmin = sessionStorage.getItem('admin_auth') === 'true';
let editMode = false;
let activePanelTab = 'skills';
let activeSkillCategory = 'all';
let editingSkillId = null;
let iconPickerCallback = null;

/* ==========================================================================
   3. BOOTSTRAP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  injectAdminUI();
  applyAllConfig();

  if (isAdmin) {
    showAdminToolbar();
  }

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      if (isAdmin) {
        e.preventDefault();
        saveConfig();
      }
    }
  });
});

/* ==========================================================================
   4. CONFIG STORAGE (LOAD & SAVE)
   ========================================================================== */
function loadConfig() {
  const saved = localStorage.getItem(STORAGE_KEY_MASTER);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      config = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), parsed);
    } catch (e) {
      console.warn('Failed to parse saved config, using default', e);
      config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  } else {
    // Migration: Check if legacy content existed
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    const legacyContent = localStorage.getItem('sinankp_content');
    if (legacyContent) {
      try { config.content = JSON.parse(legacyContent); } catch (e) {}
    }
    const legacyTheme = localStorage.getItem('sinankp_theme');
    if (legacyTheme) config.theme.preset = legacyTheme;
    const legacyColor = localStorage.getItem('sinankp_accent');
    if (legacyColor) config.theme.accentIdx = parseInt(legacyColor) || 0;
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

function saveConfig(showNotification = true) {
  // Capture any inline text changes from contenteditable
  captureInlineContent();

  localStorage.setItem(STORAGE_KEY_MASTER, JSON.stringify(config));

  // Also sync legacy keys for backwards safety
  localStorage.setItem('sinankp_theme', config.theme.preset);
  localStorage.setItem('sinankp_accent', config.theme.accentIdx.toString());

  if (showNotification) {
    showAdminToast('All portfolio customizations saved successfully!', 'success');
  }

  // Update save button state
  const saveBtn = document.getElementById('tb-save');
  if (saveBtn) {
    saveBtn.classList.remove('has-unsaved');
  }
}

function resetConfigToDefaults() {
  if (!confirm('Are you sure you want to RESET ALL custom designs, skills, proficiencies, images, and content to factory defaults?')) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY_MASTER);
  localStorage.removeItem('sinankp_content');
  localStorage.removeItem('sinankp_theme');
  localStorage.removeItem('sinankp_accent');
  location.reload();
}

/* ==========================================================================
   5. APPLY ALL CONFIG TO DOM & STYLES
   ========================================================================== */
function applyAllConfig() {
  applyTheme();
  applyAccent();
  applyTypography();
  applyDesignTokens();
  applyMedia();
  applySectionsVisibility();
  applyCustomCSS();
  applyInlineContent();
  renderSkillTabs();
  renderSkillsGrid();

  // Re-run icons & interactions
  if (window.reInitPortfolioModules) {
    window.reInitPortfolioModules();
  }
}

function applyTheme() {
  const body = document.body;
  // Remove all theme classes
  ['theme-dark', 'theme-midnight', 'theme-cyberpunk', 'theme-emerald', 'theme-sunset'].forEach(t => body.classList.remove(t));

  const p = config.theme.preset;
  if (p && p !== 'light') {
    body.classList.add(`theme-${p}`);
  }

  // Sync toolbar active theme indicator
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === p);
  });
}

function applyAccent() {
  const root = document.documentElement;
  let main, deep, light, pale, subtle, border;

  if (config.theme.accentIdx >= 0 && ACCENT_PRESETS[config.theme.accentIdx]) {
    const preset = ACCENT_PRESETS[config.theme.accentIdx];
    main = preset.main;
    deep = preset.deep;
    light = preset.light;
    pale = preset.pale;
    subtle = preset.subtle;
    border = preset.border;
  } else {
    main = config.theme.customAccentHex || '#c9a84c';
    deep = shiftLightness(main, -0.15);
    light = shiftLightness(main, +0.15);
    pale = hexToRGBA(main, 0.18);
    subtle = hexToRGBA(main, 0.1);
    border = hexToRGBA(main, 0.28);
  }

  root.style.setProperty('--gold', main);
  root.style.setProperty('--gold-light', light);
  root.style.setProperty('--gold-deep', deep);
  root.style.setProperty('--gold-pale', pale);
  root.style.setProperty('--gold-subtle', subtle);
  root.style.setProperty('--gold-border', border);

  // Secondary accent if custom
  if (config.theme.customSecondaryHex) {
    root.style.setProperty('--cyan', config.theme.customSecondaryHex);
  }
}

function applyTypography() {
  const root = document.documentElement;
  const pairing = FONT_PAIRINGS.find(p => p.id === config.typography.pairing) || FONT_PAIRINGS[0];
  root.style.setProperty('--font-display', pairing.display);
  root.style.setProperty('--font-body', pairing.body);

  if (config.typography.fontScale && config.typography.fontScale !== 1) {
    document.documentElement.style.fontSize = `${16 * config.typography.fontScale}px`;
  } else {
    document.documentElement.style.fontSize = '16px';
  }
}

function applyDesignTokens() {
  const root = document.documentElement;
  const d = config.design;

  root.style.setProperty('--radius-md', `${d.cardRadius}px`);
  root.style.setProperty('--radius-lg', `${Math.round(d.cardRadius * 1.5)}px`);
  root.style.setProperty('--radius-xl', `${Math.round(d.cardRadius * 2.2)}px`);

  // Card glassmorphism
  const opacity = (d.cardOpacity || 85) / 100;
  if (config.theme.preset === 'light') {
    root.style.setProperty('--bg-card', `rgba(255, 255, 255, ${opacity})`);
  } else {
    root.style.setProperty('--bg-card', `rgba(14, 20, 32, ${opacity})`);
  }

  // Tilt effect
  if (window.setTiltEnabled) {
    window.setTiltEnabled(d.tiltEnabled);
  }

  // Particle Canvas
  if (window.updateParticleSettings) {
    window.updateParticleSettings(d.particlesEnabled, d.particleCount, d.particleSpeed);
  }
}

function applyMedia() {
  const profileImg = document.getElementById('profile-img');
  if (profileImg && config.media.profileImg) {
    profileImg.src = config.media.profileImg;
  }

  const miniImg = document.getElementById('avatar-mini-img');
  if (miniImg && config.media.miniImg) {
    miniImg.src = config.media.miniImg;
  }

  // Radius on profile image container
  const imgContainer = document.querySelector('.profile-image-container');
  if (imgContainer) {
    imgContainer.style.borderRadius = `${config.media.borderRadius || 24}px`;
  }

  // Orbit rings
  document.querySelectorAll('.orbit-ring').forEach(ring => {
    ring.style.display = config.media.showOrbit ? 'block' : 'none';
  });

  // Glow overlay
  const glow = document.querySelector('.image-overlay-glow');
  if (glow) {
    glow.style.display = config.media.showGlow ? 'block' : 'none';
  }
}

function applySectionsVisibility() {
  const s = config.sections;
  const toggle = (selector, visible) => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = visible ? '' : 'none';
    });
  };

  toggle('#hero', s.hero !== false);
  toggle('#about', s.about !== false);
  toggle('#skills', s.skills !== false);
  toggle('#contact', s.contact !== false);
  toggle('.site-footer', s.footer !== false);
  toggle('.status-badge', s.statusBadge !== false);
  toggle('.hero-education-card', s.eduCard !== false);
  toggle('.hero-highlights', s.highlights !== false);
  toggle('.floating-badge', s.floatingBadges !== false);
}

function applyCustomCSS() {
  const el = document.getElementById('custom-admin-styles');
  if (el) {
    el.textContent = config.customCSS || '';
  }
}

/* ==========================================================================
   6. DYNAMIC SKILL ENGINE (FILTER TABS & GRID RENDERING)
   ========================================================================== */
function renderSkillTabs() {
  const tabsContainer = document.getElementById('skill-category-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = config.categories.map(cat => `
    <button class="skill-tab-btn ${cat.id === activeSkillCategory ? 'active' : ''}" data-category="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.skill-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSkillCategory = btn.dataset.category;
      tabsContainer.querySelectorAll('.skill-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkillsGrid();
    });
  });
}

function renderSkillsGrid() {
  const grid = document.getElementById('skills-grid-container');
  if (!grid) return;

  const filtered = activeSkillCategory === 'all'
    ? config.skills
    : config.skills.filter(s => s.category === activeSkillCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p>No skills found in this category.</p>
        ${isAdmin ? '<button class="btn btn-primary btn-sm" id="btn-add-skill-empty" style="margin-top: 12px;">+ Add Skill</button>' : ''}
      </div>
    `;
    document.getElementById('btn-add-skill-empty')?.addEventListener('click', () => {
      openSidePanel();
      document.querySelector('.ap-tab[data-pane="skills"]')?.click();
      document.getElementById('add-skill-form-box').style.display = 'block';
    });
    return;
  }

  grid.innerHTML = filtered.map((skill, index) => {
    const delay = (index + 1) * 100;
    const tagsHtml = (skill.tags || []).map(t => `<span class="skill-tag">${escapeHTML(t)}</span>`).join('');

    return `
      <div class="glass-card skill-card tilt-card" data-skill-id="${skill.id}" data-reveal="up" data-delay="${delay}">
        <div class="skill-glow ${skill.glow || 'glow-cyan'}"></div>

        <!-- Direct Actions in Edit Mode -->
        <div class="skill-card-edit-overlay">
          <button class="skill-card-edit-btn" title="Edit Skill" data-action="edit" data-id="${skill.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="skill-card-edit-btn" title="Delete Skill" data-action="delete" data-id="${skill.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>

        <div class="skill-header">
          <div class="skill-icon-wrap ${skill.iconColor || 'icon-cyan'}" data-icon-target="${skill.id}">
            <i data-lucide="${skill.icon || 'sparkles'}"></i>
          </div>
          <span class="skill-level-badge" ${editMode ? 'contenteditable="true"' : ''} data-field="badge" data-id="${skill.id}">${escapeHTML(skill.badge || 'Advanced')}</span>
        </div>

        <h3 class="skill-title" ${editMode ? 'contenteditable="true"' : ''} data-field="title" data-id="${skill.id}">${escapeHTML(skill.title)}</h3>
        <p class="skill-desc" ${editMode ? 'contenteditable="true"' : ''} data-field="desc" data-id="${skill.id}">${escapeHTML(skill.desc)}</p>

        <div class="skill-tags">
          ${tagsHtml}
        </div>

        <div class="skill-progress-wrap" data-skill-id="${skill.id}">
          <div class="progress-info">
            <span>Proficiency</span>
            <span class="progress-percent" ${editMode ? 'contenteditable="true"' : ''} data-field="proficiency" data-id="${skill.id}">${skill.proficiency}%</span>
          </div>
          <div class="progress-bar ${editMode ? 'progress-clickable' : ''}" title="${editMode ? 'Click or drag to adjust proficiency' : ''}">
            <div class="progress-fill" style="--target-width: ${skill.proficiency}%; width: ${skill.proficiency}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card edit button actions
  grid.querySelectorAll('.skill-card-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'edit') {
        openSkillEditDrawer(id);
      } else if (action === 'delete') {
        deleteSkill(id);
      }
    });
  });

  // Attach interactive click-to-edit on progress bars when in edit mode
  grid.querySelectorAll('.skill-progress-wrap').forEach(wrap => {
    const bar = wrap.querySelector('.progress-bar');
    const id = wrap.dataset.skillId;
    if (bar) {
      bar.addEventListener('click', (e) => {
        if (!editMode) return;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        let percent = Math.round((clickX / rect.width) * 100);
        percent = Math.max(5, Math.min(100, percent));
        updateSkillProficiency(id, percent);
      });
    }
  });

  // Re-run icons & tilt
  if (window.reInitPortfolioModules) {
    window.reInitPortfolioModules();
  }
}

function updateSkillProficiency(skillId, newProficiency) {
  const skill = config.skills.find(s => s.id === skillId);
  if (!skill) return;

  skill.proficiency = parseInt(newProficiency) || 0;

  // Update card in DOM directly for silky smooth response
  const card = document.querySelector(`.skill-card[data-skill-id="${skillId}"]`);
  if (card) {
    const percentEl = card.querySelector('.progress-percent');
    const fillEl = card.querySelector('.progress-fill');
    if (percentEl) percentEl.textContent = `${skill.proficiency}%`;
    if (fillEl) {
      fillEl.style.setProperty('--target-width', `${skill.proficiency}%`);
      fillEl.style.width = `${skill.proficiency}%`;
    }
  }

  // If edit drawer is open, sync slider
  const slider = document.getElementById(`skill-slider-${skillId}`);
  const sliderVal = document.getElementById(`skill-slider-val-${skillId}`);
  if (slider) slider.value = skill.proficiency;
  if (sliderVal) sliderVal.textContent = `${skill.proficiency}%`;

  markUnsavedChanges();
}

function deleteSkill(skillId) {
  const skill = config.skills.find(s => s.id === skillId);
  if (!skill) return;
  if (!confirm(`Are you sure you want to delete "${skill.title}"?`)) return;

  config.skills = config.skills.filter(s => s.id !== skillId);
  renderSkillsGrid();
  renderSkillEditorList();
  showAdminToast(`Deleted skill "${skill.title}"`, 'info');
  markUnsavedChanges();
}

function addSkill(newSkillData) {
  const id = `skill-${Date.now()}`;
  const skill = {
    id,
    title: newSkillData.title || 'New Skill',
    category: newSkillData.category || 'design',
    desc: newSkillData.desc || 'Skill description and capabilities.',
    badge: newSkillData.badge || 'Advanced',
    proficiency: parseInt(newSkillData.proficiency) || 85,
    icon: newSkillData.icon || 'sparkles',
    glow: newSkillData.glow || 'glow-cyan',
    iconColor: newSkillData.iconColor || 'icon-cyan',
    tags: newSkillData.tags || ['Design', 'Creative']
  };

  config.skills.push(skill);
  renderSkillsGrid();
  renderSkillEditorList();
  showAdminToast(`Added "${skill.title}" successfully!`, 'success');
  markUnsavedChanges();
}

/* ==========================================================================
   7. INLINE CONTENT EDITING & CAPTURE
   ========================================================================== */
const EDITABLE_SELECTORS = [
  '.hero-title',
  '.hero-subtitle',
  '.hero-intro',
  '.edu-value',
  '.highlight-num',
  '.highlight-desc',
  '.badge-micro-title',
  '.badge-micro-sub',
  '.badge-text',
  '.profile-name',
  '.profile-designation',
  '.section-title',
  '.section-subtitle',
  '.about-name',
  '.narrative-heading',
  '.narrative-text',
  '.pillar-title',
  '.pillar-desc',
  '.info-card-title',
  '.info-card-desc',
  '.channel-value',
  '.footer-bio',
  '.copyright-text'
];

function enableInlineEditing() {
  EDITABLE_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });
  });
  renderSkillsGrid(); // Re-render skills so skill cards get contenteditable
}

function disableInlineEditing() {
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute('contenteditable');
  });
  renderSkillsGrid();
}

function captureInlineContent() {
  if (!config.content) config.content = {};

  EDITABLE_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      const key = `${selector.replace(/[^a-z0-9]/gi, '_')}_${i}`;
      config.content[key] = el.innerHTML;
    });
  });

  // Capture skill card edits
  document.querySelectorAll('.skill-card').forEach(card => {
    const id = card.dataset.skillId;
    const skill = config.skills.find(s => s.id === id);
    if (!skill) return;

    const title = card.querySelector('.skill-title');
    const desc = card.querySelector('.skill-desc');
    const badge = card.querySelector('.skill-level-badge');
    const percent = card.querySelector('.progress-percent');

    if (title) skill.title = title.textContent.trim();
    if (desc) skill.desc = desc.textContent.trim();
    if (badge) skill.badge = badge.textContent.trim();
    if (percent) {
      const num = parseInt(percent.textContent.replace(/[^0-9]/g, ''));
      if (!isNaN(num)) skill.proficiency = Math.min(100, Math.max(0, num));
    }
  });
}

function applyInlineContent() {
  if (!config.content) return;

  EDITABLE_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      const key = `${selector.replace(/[^a-z0-9]/gi, '_')}_${i}`;
      if (config.content[key] !== undefined) {
        el.innerHTML = config.content[key];
      }
    });
  });
}

function markUnsavedChanges() {
  const saveBtn = document.getElementById('tb-save');
  if (saveBtn) {
    saveBtn.classList.add('has-unsaved');
  }
}

/* ==========================================================================
   8. ADMIN UI INJECTION (TOOLBAR, DRAWER PANEL, MODALS)
   ========================================================================== */
function injectAdminUI() {
  /* --- 1. Login Modal --- */
  const loginModalHTML = `
  <div id="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Admin Login">
    <div class="admin-modal">
      <button class="admin-modal-close" id="admin-modal-close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="admin-modal-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h2>Admin Customizer</h2>
      <p>Sign in to edit proficiencies, symbols, skill tabs, images, and rebuild designs in real-time.</p>
      <form id="admin-login-form" autocomplete="off">
        <div class="admin-form-group">
          <label class="admin-form-label" for="admin-user-input">Username</label>
          <input class="admin-form-input" type="text" id="admin-user-input" autocomplete="off" placeholder="Enter username" spellcheck="false" value="KSINANP">
        </div>
        <div class="admin-form-group">
          <label class="admin-form-label" for="admin-pass-input">Password</label>
          <input class="admin-form-input" type="password" id="admin-pass-input" autocomplete="off" placeholder="Enter password" value="3518">
        </div>
        <p class="admin-login-error" id="admin-login-error">Incorrect credentials. Please try again.</p>
        <button type="submit" class="admin-login-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Sign In & Customize
        </button>
      </form>
    </div>
  </div>`;

  /* --- 2. Top Admin Toolbar --- */
  const toolbarHTML = `
  <div id="admin-toolbar" role="navigation" aria-label="Admin Toolbar">
    <div class="tb-brand">
      <div class="tb-brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <span class="tb-brand-label">Admin Studio</span>
    </div>

    <!-- Toggle Side Customizer Panel -->
    <button class="tb-btn btn-open-panel active" id="tb-open-panel" title="Open Customization Studio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
      <span>Customizer</span>
    </button>

    <!-- Toggle Inline Text Editing -->
    <button class="tb-btn" id="tb-edit-mode" title="Click directly on text to edit">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      <span>Edit Texts</span>
    </button>

    <div class="tb-divider"></div>

    <!-- Quick Theme Switch -->
    <button class="tb-btn" id="tb-quick-theme" title="Cycle Themes">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <span>Theme</span>
    </button>

    <!-- Save Button -->
    <button class="tb-btn btn-save" id="tb-save" title="Save All Customizations (Ctrl+S)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      <span>Save Changes</span>
    </button>

    <!-- Reset Defaults -->
    <button class="tb-btn" id="tb-reset" title="Reset All Customizations to Defaults">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
      <span>Reset</span>
    </button>

    <div class="tb-spacer"></div>

    <div class="tb-user-chip">
      <div class="tb-avatar">SK</div>
      <span class="tb-username">KSINANP</span>
    </div>

    <!-- Logout -->
    <button class="tb-btn btn-danger" id="tb-logout" title="Exit Admin Mode">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <span>Exit</span>
    </button>
  </div>`;

  /* --- 3. Comprehensive Side Drawer Panel --- */
  const sidePanelHTML = `
  <div id="admin-panel" class="open" role="complementary" aria-label="Portfolio Studio Panel">
    <div class="ap-header">
      <span class="ap-title">Portfolio Studio & CMS</span>
      <button class="ap-close" id="ap-close-btn" title="Close Panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Panel Navigation Tabs -->
    <div class="ap-tabs">
      <button class="ap-tab active" data-pane="skills">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Skills
      </button>
      <button class="ap-tab" data-pane="media">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Media
      </button>
      <button class="ap-tab" data-pane="themes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
        Theme
      </button>
      <button class="ap-tab" data-pane="design">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Design & UI
      </button>
      <button class="ap-tab" data-pane="content">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Content
      </button>
      <button class="ap-tab" data-pane="backup">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Backup & CSS
      </button>
    </div>

    <!-- Panel Body / Content Panes -->
    <div class="ap-content">

      <!-- PANE 1: SKILLS & PROFICIENCIES -->
      <div class="ap-pane active" id="pane-skills">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div class="ap-section-title" style="margin:0;">Manage Skills & Proficiencies</div>
          <button class="ap-btn ap-btn-primary" id="btn-open-add-skill" style="padding: 4px 10px; font-size: 0.72rem;">+ Add Skill</button>
        </div>

        <p style="font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 14px;">
          Drag proficiency sliders to update cards and progress bars in real-time. Click symbols to change icons.
        </p>

        <!-- Dynamic list of skills with sliders and icon buttons -->
        <div id="skill-editor-list"></div>

        <!-- Add Skill Form (Hidden by default, toggled) -->
        <div id="add-skill-form-box" style="display: none; background: rgba(255,255,255,0.05); border: 1px dashed rgba(201,168,76,0.4); border-radius: 12px; padding: 14px; margin-top: 14px;">
          <h4 style="font-size: 0.8rem; color: var(--gold); margin-bottom: 10px;">Add New Skill</h4>
          <div class="ap-field">
            <label class="ap-label">Skill Title</label>
            <input type="text" class="ap-input" id="new-skill-title" placeholder="e.g. 3D Modeling">
          </div>
          <div class="skill-field-row">
            <div class="ap-field">
              <label class="ap-label">Category</label>
              <select class="ap-select" id="new-skill-cat">
                <option value="design">Design & UI</option>
                <option value="tools">Software & Media</option>
                <option value="ai">AI & Future</option>
              </select>
            </div>
            <div class="ap-field">
              <label class="ap-label">Level Badge</label>
              <input type="text" class="ap-input" id="new-skill-badge" value="Advanced">
            </div>
          </div>
          <div class="ap-field">
            <label class="ap-label">Proficiency (<span id="new-skill-val">85%</span>)</label>
            <div class="ap-range-row">
              <input type="range" class="ap-range" id="new-skill-slider" min="10" max="100" value="85">
            </div>
          </div>
          <div class="ap-field">
            <label class="ap-label">Description</label>
            <textarea class="ap-textarea" id="new-skill-desc" rows="2" placeholder="Brief summary of skills..."></textarea>
          </div>
          <div class="ap-field">
            <label class="ap-label">Tags (comma separated)</label>
            <input type="text" class="ap-input" id="new-skill-tags" placeholder="Blender, Spline, Three.js">
          </div>
          <div class="ap-field">
            <label class="ap-label">Icon / Symbol</label>
            <button type="button" class="icon-picker-trigger" id="new-skill-icon-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span id="new-skill-icon-name">sparkles</span>
            </button>
          </div>
          <div class="ap-btn-row" style="margin-top: 10px;">
            <button class="ap-btn ap-btn-primary" id="btn-save-new-skill">Create Skill</button>
            <button class="ap-btn" id="btn-cancel-new-skill">Cancel</button>
          </div>
        </div>
      </div>

      <!-- PANE 2: MEDIA & IMAGES -->
      <div class="ap-pane" id="pane-media">
        <div class="ap-section-title">Profile Avatar Photo</div>
        <p style="font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 12px;">
          Upload your portrait photo or enter an image URL. It will automatically fit beautifully into the 3D Hero card.
        </p>

        <!-- Current image preview -->
        <div class="image-preview-wrap">
          <img id="ap-preview-img" class="image-preview" src="assets/images/avatar.png" alt="Profile Preview">
        </div>

        <!-- Upload Dropzone -->
        <div class="image-upload-zone" id="image-drop-zone">
          <input type="file" class="image-upload-input" id="image-file-input" accept="image/*">
          <div class="image-upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div class="image-upload-text">
            <strong>Choose Image or Drag & Drop</strong>
            <span>Supports JPG, PNG, WebP</span>
          </div>
        </div>

        <!-- Direct URL input -->
        <div class="ap-field">
          <label class="ap-label">Or Image URL</label>
          <div style="display:flex; gap:6px;">
            <input type="text" class="ap-input" id="custom-image-url" placeholder="https://example.com/photo.png">
            <button class="ap-btn ap-btn-primary" id="btn-apply-image-url" style="flex:none; min-width:60px;">Apply</button>
          </div>
        </div>

        <!-- Preset Avatars -->
        <div class="ap-section-title">Preset Photos</div>
        <div class="ap-btn-row">
          <button class="ap-btn" id="btn-preset-avatar-orig">Original Avatar</button>
          <button class="ap-btn" id="btn-preset-avatar-alt">Designer Portrait</button>
        </div>

        <!-- Frame styling -->
        <div class="ap-section-title">Image Styling & Frame</div>
        <div class="ap-field">
          <label class="ap-label">Corner Radius: <span id="img-radius-val">24px</span></label>
          <input type="range" class="ap-range" id="img-radius-slider" min="0" max="80" value="24">
        </div>

        <div class="ap-toggle-row">
          <div>
            <div class="ap-toggle-label">Glow Aura Effect</div>
            <div class="ap-toggle-sub">Soft ambient light halo behind portrait</div>
          </div>
          <button class="ap-toggle on" id="toggle-media-glow"></button>
        </div>

        <div class="ap-toggle-row">
          <div>
            <div class="ap-toggle-label">Orbit Rings</div>
            <div class="ap-toggle-sub">Futuristic rotating rings around portrait</div>
          </div>
          <button class="ap-toggle on" id="toggle-media-orbit"></button>
        </div>
      </div>

      <!-- PANE 3: THEMES & ACCENT COLORS -->
      <div class="ap-pane" id="pane-themes">
        <div class="ap-section-title">Pre-Crafted Theme Styles</div>
        <div class="layout-option-grid" id="theme-presets-grid">
          <div class="layout-option active" data-theme="light">
            <div class="layout-option-icon">☀️</div>
            <div class="layout-option-name">Light Editorial Gold</div>
          </div>
          <div class="layout-option" data-theme="dark">
            <div class="layout-option-icon">🌙</div>
            <div class="layout-option-name">Dark Cyber Modern</div>
          </div>
          <div class="layout-option" data-theme="midnight">
            <div class="layout-option-icon">🌑</div>
            <div class="layout-option-name">Obsidian Pitch OLED</div>
          </div>
          <div class="layout-option" data-theme="cyberpunk">
            <div class="layout-option-icon">🔮</div>
            <div class="layout-option-name">Cyberpunk Electric</div>
          </div>
          <div class="layout-option" data-theme="emerald">
            <div class="layout-option-icon">🌲</div>
            <div class="layout-option-name">Emerald Luxury</div>
          </div>
          <div class="layout-option" data-theme="sunset">
            <div class="layout-option-icon">🍷</div>
            <div class="layout-option-name">Sunset Crimson</div>
          </div>
        </div>

        <div class="ap-section-title">Accent Color Palette</div>
        <div class="ap-swatches" id="ap-accent-swatches">
          ${ACCENT_PRESETS.map((p, i) => `
            <button class="ap-swatch ${i === 0 ? 'selected' : ''}" data-idx="${i}" style="background: ${p.main};" title="${p.name}"></button>
          `).join('')}
        </div>

        <div class="ap-color-row">
          <input type="color" class="ap-color-input" id="custom-accent-picker" value="#c9a84c">
          <div class="ap-color-label">Custom Primary Accent</div>
          <span class="ap-color-value" id="custom-accent-val">#c9a84c</span>
        </div>

        <div class="ap-color-row">
          <input type="color" class="ap-color-input" id="custom-secondary-picker" value="#00f0ff">
          <div class="ap-color-label">Custom Secondary Accent (Cyan / Neon)</div>
          <span class="ap-color-value" id="custom-secondary-val">#00f0ff</span>
        </div>
      </div>

      <!-- PANE 4: DESIGN, UI & TYPOGRAPHY -->
      <div class="ap-pane" id="pane-design">
        <div class="ap-section-title">Typography Engine</div>
        <div class="font-option-grid" id="font-pairings-list">
          ${FONT_PAIRINGS.map(p => `
            <div class="font-option ${p.id === 'default' ? 'selected' : ''}" data-pairing="${p.id}">
              <div>
                <div class="font-option-name">${p.name}</div>
                <div class="font-option-preview" style="font-family: ${p.display}">Aa Bb Gg 123</div>
              </div>
              <div class="font-option-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="ap-field">
          <label class="ap-label">Font Scale: <span id="font-scale-val">100%</span></label>
          <input type="range" class="ap-range" id="font-scale-slider" min="85" max="115" value="100">
        </div>

        <div class="ap-section-title">Cards & Glassmorphism</div>
        <div class="ap-field">
          <label class="ap-label">Corner Radius: <span id="card-radius-val">18px</span></label>
          <input type="range" class="ap-range" id="card-radius-slider" min="0" max="32" value="18">
        </div>
        <div class="ap-field">
          <label class="ap-label">Glass Blur: <span id="glass-blur-val">16px</span></label>
          <input type="range" class="ap-range" id="glass-blur-slider" min="0" max="30" value="16">
        </div>
        <div class="ap-field">
          <label class="ap-label">Card Opacity: <span id="card-opacity-val">85%</span></label>
          <input type="range" class="ap-range" id="card-opacity-slider" min="30" max="100" value="85">
        </div>

        <div class="ap-section-title">Interactive Effects</div>
        <div class="ap-toggle-row">
          <div>
            <div class="ap-toggle-label">3D Card Tilt Effect</div>
            <div class="ap-toggle-sub">Cards tilt towards cursor on hover</div>
          </div>
          <button class="ap-toggle on" id="toggle-tilt-effect"></button>
        </div>
        <div class="ap-toggle-row">
          <div>
            <div class="ap-toggle-label">Floating Dust Particles</div>
            <div class="ap-toggle-sub">Ambient interactive particles on background</div>
          </div>
          <button class="ap-toggle on" id="toggle-particles"></button>
        </div>

        <div class="ap-section-title">Section Visibility</div>
        <div class="ap-toggle-row">
          <div class="ap-toggle-label">Hero Section</div>
          <button class="ap-toggle on" id="toggle-sec-hero"></button>
        </div>
        <div class="ap-toggle-row">
          <div class="ap-toggle-label">About Me Section</div>
          <button class="ap-toggle on" id="toggle-sec-about"></button>
        </div>
        <div class="ap-toggle-row">
          <div class="ap-toggle-label">Skills & Proficiencies Section</div>
          <button class="ap-toggle on" id="toggle-sec-skills"></button>
        </div>
        <div class="ap-toggle-row">
          <div class="ap-toggle-label">Contact Section</div>
          <button class="ap-toggle on" id="toggle-sec-contact"></button>
        </div>
        <div class="ap-toggle-row">
          <div class="ap-toggle-label">Floating Hero Badges</div>
          <button class="ap-toggle on" id="toggle-sec-badges"></button>
        </div>
      </div>

      <!-- PANE 5: CONTENT EDITOR -->
      <div class="ap-pane" id="pane-content">
        <div class="ap-section-title">Hero Information</div>
        <div class="ap-field">
          <label class="ap-label">Main Heading</label>
          <input type="text" class="ap-input" id="cnt-hero-title" value="Hi, I'm Sinan KP">
        </div>
        <div class="ap-field">
          <label class="ap-label">Role Title</label>
          <input type="text" class="ap-input" id="cnt-hero-subtitle" value="Designer">
        </div>
        <div class="ap-field">
          <label class="ap-label">Introduction</label>
          <textarea class="ap-textarea" id="cnt-hero-intro">I'm Muhammed Sinan KP, a creative designer passionate about creating modern, attractive, and meaningful digital experiences.</textarea>
        </div>
        <div class="ap-field">
          <label class="ap-label">Education Status</label>
          <input type="text" class="ap-input" id="cnt-edu-status" value="Degree – 1st Year Student">
        </div>

        <div class="ap-section-title">Contact & Social Channels</div>
        <div class="ap-field">
          <label class="ap-label">Email Address</label>
          <input type="email" class="ap-input" id="cnt-email" value="sinankp3518@gmail.com">
        </div>
        <div class="ap-field">
          <label class="ap-label">Phone Number</label>
          <input type="text" class="ap-input" id="cnt-phone" value="+91 9526849035">
        </div>
        <div class="ap-field">
          <label class="ap-label">Instagram Handle</label>
          <input type="text" class="ap-input" id="cnt-instagram" value="@cinnaaann._">
        </div>
        <div class="ap-field">
          <label class="ap-label">Location</label>
          <input type="text" class="ap-input" id="cnt-location" value="Kerala, India">
        </div>

        <div class="ap-btn-row" style="margin-top: 14px;">
          <button class="ap-btn ap-btn-primary ap-btn-full" id="btn-save-content-fields">Apply Content Updates</button>
        </div>
      </div>

      <!-- PANE 6: BACKUP & CUSTOM CSS -->
      <div class="ap-pane" id="pane-backup">
        <div class="ap-section-title">Custom CSS Overrides</div>
        <p style="font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 8px;">
          Write custom CSS to completely style or customize any element on the page. Injected live!
        </p>
        <textarea class="ap-code-editor" id="custom-css-input" placeholder="/* Enter custom CSS rules here */
.skill-card {
  /* custom style */
}"></textarea>
        <button class="ap-btn ap-btn-primary" id="btn-apply-css" style="margin: 8px 0 16px 0; width: 100%;">Apply Custom CSS</button>

        <div class="ap-section-title">Export / Backup Configuration</div>
        <p style="font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 8px;">
          Download your complete customized portfolio as a JSON file or copy it to the clipboard.
        </p>
        <div class="ap-btn-row">
          <button class="ap-btn" id="btn-export-json">Download JSON</button>
          <button class="ap-btn" id="btn-copy-json">Copy JSON</button>
        </div>

        <div class="ap-section-title">Import Configuration</div>
        <p style="font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 8px;">
          Paste previously exported JSON configuration to restore your exact custom portfolio setup.
        </p>
        <textarea class="ap-code-editor" id="import-json-input" style="height: 70px;" placeholder="Paste JSON here..."></textarea>
        <button class="ap-btn ap-btn-primary" id="btn-import-json" style="margin-top: 8px; width: 100%;">Import & Rebuild</button>
      </div>

    </div>
  </div>`;

  /* --- 4. Searchable Lucide Icon Picker Popover --- */
  const iconPickerHTML = `
  <div id="icon-picker-popup">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <span style="font-size:0.75rem; font-weight:700; color:var(--gold);">Select Symbol / Icon</span>
      <button id="close-icon-picker" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer;">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <input type="text" class="icon-picker-search" id="icon-search-input" placeholder="Search 70+ icons (e.g. layout, pen, code)...">
    <div class="icon-picker-grid" id="icon-picker-grid">
      ${LUCIDE_ICONS_CATALOG.map(name => `
        <div class="icon-picker-item" data-icon="${name}" title="${name}">
          <i data-lucide="${name}"></i>
        </div>
      `).join('')}
    </div>
  </div>`;

  /* --- 5. Edit Mode Floating Banner --- */
  const bannerHTML = `
  <div class="edit-mode-banner" id="edit-banner">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    <span>Edit Mode Active — Click any text or progress bar to edit. Press Ctrl+S to save!</span>
  </div>`;

  /* --- 6. Toast Notification --- */
  const toastHTML = `
  <div class="toast-admin" id="admin-toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="admin-toast-text">Changes saved!</span>
  </div>`;

  document.body.insertAdjacentHTML('beforeend',
    loginModalHTML + toolbarHTML + sidePanelHTML + iconPickerHTML + bannerHTML + toastHTML
  );

  /* Footer login link */
  const footerBottom = document.querySelector('.footer-bottom-inner');
  if (footerBottom && !document.getElementById('admin-access-trigger')) {
    const trigger = document.createElement('button');
    trigger.className = 'admin-access-link';
    trigger.id = 'admin-access-trigger';
    trigger.setAttribute('aria-label', 'Admin Studio Login');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Admin Access`;
    footerBottom.appendChild(trigger);
  }

  bindAdminEvents();
  renderSkillEditorList();
}

/* ==========================================================================
   9. EVENT BINDINGS
   ========================================================================== */
function bindAdminEvents() {
  /* Login Modal */
  document.getElementById('admin-access-trigger')?.addEventListener('click', openLoginModal);
  document.getElementById('admin-modal-close')?.addEventListener('click', closeLoginModal);
  document.getElementById('admin-modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'admin-modal-overlay') closeLoginModal();
  });
  document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });

  /* Toolbar buttons */
  document.getElementById('tb-open-panel')?.addEventListener('click', toggleSidePanel);
  document.getElementById('tb-edit-mode')?.addEventListener('click', toggleEditMode);
  document.getElementById('tb-quick-theme')?.addEventListener('click', cycleThemes);
  document.getElementById('tb-save')?.addEventListener('click', () => saveConfig(true));
  document.getElementById('tb-reset')?.addEventListener('click', resetConfigToDefaults);
  document.getElementById('tb-logout')?.addEventListener('click', logout);
  document.getElementById('ap-close-btn')?.addEventListener('click', toggleSidePanel);

  /* Panel tabs switching */
  document.querySelectorAll('.ap-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const pane = tab.dataset.pane;
      document.querySelectorAll('.ap-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ap-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`pane-${pane}`)?.classList.add('active');
    });
  });

  /* PANE 1: Skills & Proficiencies events */
  document.getElementById('btn-open-add-skill')?.addEventListener('click', () => {
    const box = document.getElementById('add-skill-form-box');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('btn-cancel-new-skill')?.addEventListener('click', () => {
    document.getElementById('add-skill-form-box').style.display = 'none';
  });
  document.getElementById('new-skill-slider')?.addEventListener('input', (e) => {
    document.getElementById('new-skill-val').textContent = `${e.target.value}%`;
  });
  document.getElementById('new-skill-icon-btn')?.addEventListener('click', (e) => {
    openIconPicker(e.currentTarget, (iconName) => {
      document.getElementById('new-skill-icon-name').textContent = iconName;
      document.getElementById('new-skill-icon-btn').querySelector('svg')?.remove();
      document.getElementById('new-skill-icon-btn').insertAdjacentHTML('afterbegin', `<i data-lucide="${iconName}"></i>`);
      if (window.lucide) window.lucide.createIcons();
    });
  });
  document.getElementById('btn-save-new-skill')?.addEventListener('click', () => {
    const title = document.getElementById('new-skill-title').value.trim();
    if (!title) {
      alert('Please enter a skill title');
      return;
    }
    const cat = document.getElementById('new-skill-cat').value;
    const badge = document.getElementById('new-skill-badge').value.trim() || 'Advanced';
    const proficiency = parseInt(document.getElementById('new-skill-slider').value) || 85;
    const desc = document.getElementById('new-skill-desc').value.trim();
    const icon = document.getElementById('new-skill-icon-name').textContent.trim() || 'sparkles';
    const tagsStr = document.getElementById('new-skill-tags').value;
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ['Design'];

    addSkill({ title, category: cat, badge, proficiency, desc, icon, tags });
    document.getElementById('add-skill-form-box').style.display = 'none';
    document.getElementById('new-skill-title').value = '';
    document.getElementById('new-skill-desc').value = '';
    document.getElementById('new-skill-tags').value = '';
  });

  /* PANE 2: Media & Image events */
  const fileInput = document.getElementById('image-file-input');
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  });

  const dropZone = document.getElementById('image-drop-zone');
  dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
  });

  document.getElementById('btn-apply-image-url')?.addEventListener('click', () => {
    const url = document.getElementById('custom-image-url').value.trim();
    if (!url) return;
    config.media.profileImg = url;
    config.media.miniImg = url;
    applyMedia();
    document.getElementById('ap-preview-img').src = url;
    showAdminToast('Profile image updated!', 'success');
    markUnsavedChanges();
  });

  document.getElementById('btn-preset-avatar-orig')?.addEventListener('click', () => {
    config.media.profileImg = 'assets/images/avatar.png';
    config.media.miniImg = 'assets/images/avatar.png';
    applyMedia();
    document.getElementById('ap-preview-img').src = 'assets/images/avatar.png';
    showAdminToast('Reset to original avatar portrait', 'info');
    markUnsavedChanges();
  });

  document.getElementById('btn-preset-avatar-alt')?.addEventListener('click', () => {
    const altUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
    config.media.profileImg = altUrl;
    config.media.miniImg = altUrl;
    applyMedia();
    document.getElementById('ap-preview-img').src = altUrl;
    showAdminToast('Applied alternate designer portrait', 'info');
    markUnsavedChanges();
  });

  document.getElementById('img-radius-slider')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 24;
    config.media.borderRadius = val;
    document.getElementById('img-radius-val').textContent = `${val}px`;
    applyMedia();
    markUnsavedChanges();
  });

  setupToggle('toggle-media-glow', config.media.showGlow, (val) => {
    config.media.showGlow = val;
    applyMedia();
    markUnsavedChanges();
  });
  setupToggle('toggle-media-orbit', config.media.showOrbit, (val) => {
    config.media.showOrbit = val;
    applyMedia();
    markUnsavedChanges();
  });

  /* PANE 3: Themes & Accents */
  document.querySelectorAll('#theme-presets-grid .layout-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#theme-presets-grid .layout-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      config.theme.preset = opt.dataset.theme;
      applyTheme();
      markUnsavedChanges();
      showAdminToast(`Theme: ${opt.querySelector('.layout-option-name').textContent}`, 'info');
    });
  });

  document.querySelectorAll('#ap-accent-swatches .ap-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const idx = parseInt(swatch.dataset.idx);
      document.querySelectorAll('#ap-accent-swatches .ap-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      config.theme.accentIdx = idx;
      applyAccent();
      markUnsavedChanges();
    });
  });

  document.getElementById('custom-accent-picker')?.addEventListener('input', (e) => {
    config.theme.accentIdx = -1; // custom
    config.theme.customAccentHex = e.target.value;
    document.getElementById('custom-accent-val').textContent = e.target.value;
    document.querySelectorAll('#ap-accent-swatches .ap-swatch').forEach(s => s.classList.remove('selected'));
    applyAccent();
    markUnsavedChanges();
  });

  document.getElementById('custom-secondary-picker')?.addEventListener('input', (e) => {
    config.theme.customSecondaryHex = e.target.value;
    document.getElementById('custom-secondary-val').textContent = e.target.value;
    applyAccent();
    markUnsavedChanges();
  });

  /* PANE 4: Typography & Layout */
  document.querySelectorAll('#font-pairings-list .font-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#font-pairings-list .font-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      config.typography.pairing = opt.dataset.pairing;
      applyTypography();
      markUnsavedChanges();
      showAdminToast(`Applied ${opt.querySelector('.font-option-name').textContent}`, 'info');
    });
  });

  document.getElementById('font-scale-slider')?.addEventListener('input', (e) => {
    const scale = parseInt(e.target.value) / 100;
    config.typography.fontScale = scale;
    document.getElementById('font-scale-val').textContent = `${e.target.value}%`;
    applyTypography();
    markUnsavedChanges();
  });

  document.getElementById('card-radius-slider')?.addEventListener('input', (e) => {
    config.design.cardRadius = parseInt(e.target.value) || 18;
    document.getElementById('card-radius-val').textContent = `${config.design.cardRadius}px`;
    applyDesignTokens();
    markUnsavedChanges();
  });

  document.getElementById('glass-blur-slider')?.addEventListener('input', (e) => {
    config.design.glassBlur = parseInt(e.target.value) || 16;
    document.getElementById('glass-blur-val').textContent = `${config.design.glassBlur}px`;
    applyDesignTokens();
    markUnsavedChanges();
  });

  document.getElementById('card-opacity-slider')?.addEventListener('input', (e) => {
    config.design.cardOpacity = parseInt(e.target.value) || 85;
    document.getElementById('card-opacity-val').textContent = `${config.design.cardOpacity}%`;
    applyDesignTokens();
    markUnsavedChanges();
  });

  setupToggle('toggle-tilt-effect', config.design.tiltEnabled, (val) => {
    config.design.tiltEnabled = val;
    applyDesignTokens();
    markUnsavedChanges();
  });

  setupToggle('toggle-particles', config.design.particlesEnabled, (val) => {
    config.design.particlesEnabled = val;
    applyDesignTokens();
    markUnsavedChanges();
  });

  setupToggle('toggle-sec-hero', config.sections.hero !== false, (v) => { config.sections.hero = v; applySectionsVisibility(); markUnsavedChanges(); });
  setupToggle('toggle-sec-about', config.sections.about !== false, (v) => { config.sections.about = v; applySectionsVisibility(); markUnsavedChanges(); });
  setupToggle('toggle-sec-skills', config.sections.skills !== false, (v) => { config.sections.skills = v; applySectionsVisibility(); markUnsavedChanges(); });
  setupToggle('toggle-sec-contact', config.sections.contact !== false, (v) => { config.sections.contact = v; applySectionsVisibility(); markUnsavedChanges(); });
  setupToggle('toggle-sec-badges', config.sections.floatingBadges !== false, (v) => { config.sections.floatingBadges = v; applySectionsVisibility(); markUnsavedChanges(); });

  /* PANE 5: Content fields */
  document.getElementById('btn-save-content-fields')?.addEventListener('click', () => {
    const title = document.getElementById('cnt-hero-title')?.value;
    const sub = document.getElementById('cnt-hero-subtitle')?.value;
    const intro = document.getElementById('cnt-hero-intro')?.value;
    const edu = document.getElementById('cnt-edu-status')?.value;
    const email = document.getElementById('cnt-email')?.value;
    const phone = document.getElementById('cnt-phone')?.value;
    const insta = document.getElementById('cnt-instagram')?.value;
    const loc = document.getElementById('cnt-location')?.value;

    const heroTitleEl = document.querySelector('.hero-title');
    if (heroTitleEl && title) heroTitleEl.innerHTML = title;
    const subEl = document.querySelector('.hero-subtitle');
    if (subEl && sub) subEl.textContent = sub;
    const introEl = document.querySelector('.hero-intro');
    if (introEl && intro) introEl.textContent = intro;
    const eduEl = document.querySelector('.edu-value');
    if (eduEl && edu) eduEl.textContent = edu;

    document.querySelectorAll('a[href^="mailto:"]').forEach(a => { if (email) { a.href = `mailto:${email}`; a.textContent = email; } });
    document.querySelectorAll('a[href^="tel:"]').forEach(a => { if (phone) { a.href = `tel:${phone}`; a.textContent = phone; } });
    if (email) {
      config.contactEmail = email;
      const contactForm = document.getElementById('contact-form');
      if (contactForm) contactForm.action = `https://formsubmit.co/${email}`;
    }

    captureInlineContent();
    saveConfig(true);
    showAdminToast('Content updated successfully!', 'success');
  });

  /* PANE 6: Backup & Custom CSS */
  document.getElementById('btn-apply-css')?.addEventListener('click', () => {
    config.customCSS = document.getElementById('custom-css-input')?.value || '';
    applyCustomCSS();
    markUnsavedChanges();
    showAdminToast('Custom CSS injected live!', 'success');
  });

  document.getElementById('btn-export-json')?.addEventListener('click', exportConfigJSON);
  document.getElementById('btn-copy-json')?.addEventListener('click', () => {
    captureInlineContent();
    navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {
      showAdminToast('Configuration JSON copied to clipboard!', 'success');
    });
  });

  document.getElementById('btn-import-json')?.addEventListener('click', () => {
    const input = document.getElementById('import-json-input')?.value.trim();
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      config = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), parsed);
      applyAllConfig();
      saveConfig(true);
      showAdminToast('Configuration imported & website rebuilt!', 'success');
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  });

  /* Icon picker popover events */
  document.getElementById('close-icon-picker')?.addEventListener('click', closeIconPicker);
  document.getElementById('icon-search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.icon-picker-item').forEach(item => {
      const name = item.dataset.icon;
      item.style.display = name.includes(q) ? 'flex' : 'none';
    });
  });

  document.querySelectorAll('.icon-picker-item').forEach(item => {
    item.addEventListener('click', () => {
      const iconName = item.dataset.icon;
      if (iconPickerCallback) {
        iconPickerCallback(iconName);
      }
      closeIconPicker();
    });
  });
}

function setupToggle(elementId, initialValue, onChange) {
  const btn = document.getElementById(elementId);
  if (!btn) return;
  btn.classList.toggle('on', !!initialValue);
  btn.addEventListener('click', () => {
    const isOn = btn.classList.toggle('on');
    onChange(isOn);
  });
}

/* ==========================================================================
   10. SKILL LIST RENDER IN SIDE DRAWER (Proficiency Sliders, Icons, Reorder)
   ========================================================================== */
function renderSkillEditorList() {
  const list = document.getElementById('skill-editor-list');
  if (!list) return;

  list.innerHTML = config.skills.map((skill, idx) => `
    <div class="skill-editor-card" data-id="${skill.id}">
      <div class="skill-editor-header">
        <div class="skill-editor-title">
          <span style="display:inline-flex; width:20px; height:20px; align-items:center; justify-content:center; color:var(--gold);">
            <i data-lucide="${skill.icon || 'sparkles'}"></i>
          </span>
          <strong>${escapeHTML(skill.title)}</strong>
        </div>
        <div class="skill-editor-actions">
          <button class="skill-action-btn" title="Move Up" data-action="up" data-idx="${idx}">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button class="skill-action-btn" title="Move Down" data-action="down" data-idx="${idx}">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <button class="skill-action-btn delete" title="Delete Skill" data-action="delete" data-id="${skill.id}">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
      </div>

      <!-- Real-time Proficiency Slider -->
      <div class="ap-field" style="margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
          <label class="ap-label">Proficiency</label>
          <span class="ap-range-val" id="skill-slider-val-${skill.id}">${skill.proficiency}%</span>
        </div>
        <div class="ap-range-row">
          <input type="range" class="ap-range skill-live-slider"
                 id="skill-slider-${skill.id}"
                 data-skill-id="${skill.id}"
                 min="10" max="100" value="${skill.proficiency}">
        </div>
      </div>

      <!-- Change Icon & Level Badge Row -->
      <div class="skill-field-row" style="margin-top: 8px;">
        <div class="ap-field">
          <button type="button" class="icon-picker-trigger skill-icon-change-btn" data-id="${skill.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            <span>Symbol: ${skill.icon || 'sparkles'}</span>
          </button>
        </div>
        <div class="ap-field">
          <select class="ap-select skill-badge-select" data-id="${skill.id}">
            <option value="Advanced" ${skill.badge === 'Advanced' ? 'selected' : ''}>Advanced</option>
            <option value="Expert" ${skill.badge === 'Expert' ? 'selected' : ''}>Expert</option>
            <option value="Mastery" ${skill.badge === 'Mastery' ? 'selected' : ''}>Mastery</option>
            <option value="Proficient" ${skill.badge === 'Proficient' ? 'selected' : ''}>Proficient</option>
            <option value="Creative" ${skill.badge === 'Creative' ? 'selected' : ''}>Creative</option>
            <option value="Innovator" ${skill.badge === 'Innovator' ? 'selected' : ''}>Innovator</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');

  // Re-run icons inside the editor
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sliders input
  list.querySelectorAll('.skill-live-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const id = slider.dataset.skillId;
      const val = parseInt(e.target.value);
      updateSkillProficiency(id, val);
    });
  });

  // Badge dropdown change
  list.querySelectorAll('.skill-badge-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.dataset.id;
      const skill = config.skills.find(s => s.id === id);
      if (skill) {
        skill.badge = e.target.value;
        renderSkillsGrid();
        markUnsavedChanges();
      }
    });
  });

  // Change icon button
  list.querySelectorAll('.skill-icon-change-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.id;
      openIconPicker(e.currentTarget, (newIcon) => {
        const skill = config.skills.find(s => s.id === id);
        if (skill) {
          skill.icon = newIcon;
          renderSkillsGrid();
          renderSkillEditorList();
          markUnsavedChanges();
        }
      });
    });
  });

  // Up, Down, Delete buttons
  list.querySelectorAll('.skill-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const idx = parseInt(btn.dataset.idx);

      if (action === 'up' && idx > 0) {
        const temp = config.skills[idx];
        config.skills[idx] = config.skills[idx - 1];
        config.skills[idx - 1] = temp;
        renderSkillsGrid();
        renderSkillEditorList();
        markUnsavedChanges();
      } else if (action === 'down' && idx < config.skills.length - 1) {
        const temp = config.skills[idx];
        config.skills[idx] = config.skills[idx + 1];
        config.skills[idx + 1] = temp;
        renderSkillsGrid();
        renderSkillEditorList();
        markUnsavedChanges();
      } else if (action === 'delete') {
        const id = btn.dataset.id;
        deleteSkill(id);
      }
    });
  });
}

function openSkillEditDrawer(skillId) {
  // Open side panel & switch to skills pane
  openSidePanel();
  document.querySelectorAll('.ap-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ap-pane').forEach(p => p.classList.remove('active'));
  document.querySelector('.ap-tab[data-pane="skills"]')?.classList.add('active');
  document.getElementById('pane-skills')?.classList.add('active');

  // Highlight specific skill card in list
  const card = document.querySelector(`.skill-editor-card[data-id="${skillId}"]`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.outline = '2px solid var(--gold)';
    setTimeout(() => card.style.outline = '', 2000);
  }
}

/* ==========================================================================
   11. ICON PICKER POPOVER
   ========================================================================== */
function openIconPicker(targetEl, callback) {
  const popup = document.getElementById('icon-picker-popup');
  if (!popup) return;

  iconPickerCallback = callback;
  popup.classList.add('open');

  const rect = targetEl.getBoundingClientRect();
  let top = rect.bottom + 8;
  let left = rect.left - 100;

  // Keep within screen bounds
  if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
  if (left < 10) left = 10;
  if (top + 280 > window.innerHeight) top = rect.top - 285;

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;

  document.getElementById('icon-search-input').value = '';
  document.querySelectorAll('.icon-picker-item').forEach(i => i.style.display = 'flex');
  setTimeout(() => document.getElementById('icon-search-input')?.focus(), 100);
}

function closeIconPicker() {
  document.getElementById('icon-picker-popup')?.classList.remove('open');
  iconPickerCallback = null;
}

/* ==========================================================================
   12. IMAGE UPLOAD & DOWNSCALING
   ========================================================================== */
function handleImageUpload(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please choose a valid image file (PNG, JPG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Downscale to max 800x800 for optimal performance in localStorage
      const maxDim = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      config.media.profileImg = compressedDataUrl;
      config.media.miniImg = compressedDataUrl;

      applyMedia();
      document.getElementById('ap-preview-img').src = compressedDataUrl;
      showAdminToast('Profile portrait uploaded and updated!', 'success');
      markUnsavedChanges();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ==========================================================================
   13. EXPORT CONFIGURATION (JSON)
   ========================================================================== */
function exportConfigJSON() {
  captureInlineContent();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `sinan_portfolio_custom_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showAdminToast('Configuration JSON file downloaded!', 'success');
}

/* ==========================================================================
   14. THEME & ACCENT HELPERS
   ========================================================================== */
function cycleThemes() {
  const themes = ['light', 'dark', 'midnight', 'cyberpunk', 'emerald', 'sunset'];
  let currentIdx = themes.indexOf(config.theme.preset);
  currentIdx = (currentIdx + 1) % themes.length;
  config.theme.preset = themes[currentIdx];
  applyTheme();
  markUnsavedChanges();
  showAdminToast(`Theme: ${themes[currentIdx].toUpperCase()}`, 'info');
}

function hexToRGBA(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(201,168,76,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16) || 201;
  const g = parseInt(hex.slice(3, 5), 16) || 168;
  const b = parseInt(hex.slice(5, 7), 16) || 76;
  return `rgba(${r},${g},${b},${alpha})`;
}

function shiftLightness(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16) || 201;
  let g = parseInt(hex.slice(3, 5), 16) || 168;
  let b = parseInt(hex.slice(5, 7), 16) || 76;

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  l = Math.min(1, Math.max(0, l + amount));
  return hslToHex(h, s, l);
}

function hslToHex(h, s, l) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/* ==========================================================================
   15. MODAL, DRAWER & NOTIFICATIONS
   ========================================================================== */
function openLoginModal() {
  document.getElementById('admin-modal-overlay')?.classList.add('visible');
  setTimeout(() => document.getElementById('admin-user-input')?.focus(), 200);
}

function closeLoginModal() {
  document.getElementById('admin-modal-overlay')?.classList.remove('visible');
  document.getElementById('admin-login-error')?.classList.remove('show');
}

function handleLogin() {
  const user = document.getElementById('admin-user-input')?.value.trim();
  const pass = document.getElementById('admin-pass-input')?.value.trim();
  const error = document.getElementById('admin-login-error');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('admin_auth', 'true');
    isAdmin = true;
    closeLoginModal();
    showAdminToolbar();
    openSidePanel();
    showAdminToast('Welcome back, Admin! Customizer active.', 'success');
  } else {
    error?.classList.add('show');
  }
}

function logout() {
  sessionStorage.removeItem('admin_auth');
  isAdmin = false;
  if (editMode) toggleEditMode();
  document.getElementById('admin-toolbar')?.classList.remove('visible');
  document.getElementById('admin-panel')?.classList.remove('open');
  document.body.classList.remove('admin-active', 'edit-mode');
  showAdminToast('Logged out of Admin Studio', 'info');
}

function showAdminToolbar() {
  document.getElementById('admin-toolbar')?.classList.add('visible');
  document.body.classList.add('admin-active');
}

function toggleSidePanel() {
  const panel = document.getElementById('admin-panel');
  const btn = document.getElementById('tb-open-panel');
  const isOpen = panel?.classList.toggle('open');
  btn?.classList.toggle('active', isOpen);
}

function openSidePanel() {
  document.getElementById('admin-panel')?.classList.add('open');
  document.getElementById('tb-open-panel')?.classList.add('active');
}

function toggleEditMode() {
  editMode = !editMode;
  const btn = document.getElementById('tb-edit-mode');
  const banner = document.getElementById('edit-banner');

  if (editMode) {
    btn?.classList.add('active');
    banner?.classList.add('visible');
    document.body.classList.add('edit-mode');
    enableInlineEditing();
    showAdminToast('Inline editing active. Click any text to edit!', 'info');
  } else {
    btn?.classList.remove('active');
    banner?.classList.remove('visible');
    document.body.classList.remove('edit-mode');
    captureInlineContent();
    disableInlineEditing();
  }
}

function showAdminToast(message, type = 'success') {
  const toast = document.getElementById('admin-toast');
  const text = document.getElementById('admin-toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.className = `toast-admin show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
