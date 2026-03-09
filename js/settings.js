// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — Settings Manager
// LocalStorage persistence for API keys, preferences + Activity Log
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'rider-social-media-machine-settings';
const LOG_KEY = 'rider-social-media-machine-log';
const MAX_LOG_ENTRIES = 200;

// ─── Activity Log System ──────────────────────────────────────
const LOG_LEVELS = {
  info: { icon: 'ℹ️', color: '#58A6FF', bg: 'rgba(88,166,255,0.08)' },
  success: { icon: '✅', color: '#2EA043', bg: 'rgba(46,160,67,0.08)' },
  warn: { icon: '⚠️', color: '#DAA520', bg: 'rgba(218,165,32,0.08)' },
  error: { icon: '❌', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
  api: { icon: '🔌', color: '#00BFA5', bg: 'rgba(0,191,165,0.08)' }
};

function getLogEntries() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
  catch { return []; }
}

function saveLogEntries(entries) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-MAX_LOG_ENTRIES))); }
  catch { /* storage full — silently fail */ }
}

export function addLogEntry(level, message, details = null) {
  const entries = getLogEntries();
  entries.push({
    ts: new Date().toISOString(),
    level,
    message: String(message).substring(0, 500),
    details: details ? String(details).substring(0, 2000) : null
  });
  saveLogEntries(entries);
  // Live-update the log panel if visible
  const logList = document.getElementById('activity-log-list');
  if (logList) renderLogEntries(logList);
}

export function clearLog() {
  localStorage.removeItem(LOG_KEY);
  const logList = document.getElementById('activity-log-list');
  if (logList) renderLogEntries(logList);
}

function renderLogEntries(container) {
  const entries = getLogEntries();
  if (entries.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.8rem;">No log entries yet. Activity will appear here as you use the app.</div>`;
    return;
  }
  // Show newest first
  container.innerHTML = entries.slice().reverse().map((entry, i) => {
    const lvl = LOG_LEVELS[entry.level] || LOG_LEVELS.info;
    const time = new Date(entry.ts);
    const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return `<div style="padding:0.45rem 0.65rem;background:${lvl.bg};border-left:3px solid ${lvl.color};border-radius:0 4px 4px 0;display:flex;gap:0.5rem;align-items:flex-start;font-size:0.72rem;${i > 0 ? 'margin-top:0.3rem;' : ''}">
      <span style="flex-shrink:0;">${lvl.icon}</span>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;gap:0.5rem;">
          <span style="color:${lvl.color};font-weight:600;text-transform:uppercase;font-size:0.6rem;letter-spacing:0.5px;">${entry.level}</span>
          <span style="color:var(--text-muted);font-size:0.6rem;white-space:nowrap;">${dateStr} ${timeStr}</span>
        </div>
        <div style="color:var(--text-primary);margin-top:0.15rem;word-break:break-word;">${escapeLogHtml(entry.message)}</div>
        ${entry.details ? `<details style="margin-top:0.25rem;"><summary style="cursor:pointer;color:var(--text-muted);font-size:0.65rem;">Details</summary><pre style="margin-top:0.25rem;padding:0.4rem;background:rgba(0,0,0,0.3);border-radius:4px;font-size:0.65rem;color:var(--text-secondary);white-space:pre-wrap;word-break:break-all;max-height:150px;overflow-y:auto;">${escapeLogHtml(entry.details)}</pre></details>` : ''}
      </div>
    </div>`;
  }).join('');
}

function escapeLogHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Global Error Interceptors ────────────────────────────────
// Capture console.error and console.warn
const _originalError = console.error;
const _originalWarn = console.warn;

console.error = function (...args) {
  _originalError.apply(console, args);
  const message = args.map(a => (a instanceof Error) ? a.message : String(a)).join(' ');
  const details = args.find(a => a instanceof Error)?.stack || null;
  addLogEntry('error', message, details);
};

console.warn = function (...args) {
  _originalWarn.apply(console, args);
  const message = args.map(a => String(a)).join(' ');
  addLogEntry('warn', message);
};

// Capture unhandled errors
window.addEventListener('error', (event) => {
  addLogEntry('error', `Unhandled: ${event.message}`, `${event.filename}:${event.lineno}:${event.colno}\n${event.error?.stack || ''}`);
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  const details = reason instanceof Error ? reason.stack : null;
  addLogEntry('error', `Promise rejection: ${message}`, details);
});

// Log app startup
addLogEntry('info', 'App loaded — Rider Social Media Machine');


const DEFAULT_SETTINGS = {
  geminiApiKey: '',
  claudeApiKey: '',
  heygenApiKey: '',
  heygenAvatarId: '',
  heygenVoiceId: '',
  manusApiKey: '',
  canvaApiToken: '',
  canvaPostTemplateId: '',
  ghlToken: '',
  ghlLocationId: '',
  ghlEmailFrom: '',
  publishMethod: 'csv',
  facebookGroups: [
    { name: 'Motorcycle Racers & Track Day Riders', url: '', enabled: true },
    { name: 'BSB Fans & Club Racing Community', url: '', enabled: true },
    { name: 'MotoGP Discussion Group', url: '', enabled: true }
  ],
  postLength: 'medium',
  brandName: 'Camino Coaching',
  reviewUrl: 'improve-rider.scoreapp.com',
  seasonReviewUrl: 'riderseason.scoreapp.com',
  flowProfileUrl: '',
  mindsetQuizUrl: '',
  sleepTestUrl: '',
  blueprintUrl: 'https://academy.caminocoaching.co.uk/podium-contenders-blueprint/order/'
};

// ─── Load Settings ────────────────────────────────────────────
export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

// ─── Save Settings ────────────────────────────────────────────
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
}

// ─── Get Single Setting ──────────────────────────────────────
export function getSetting(key) {
  const settings = loadSettings();
  return settings[key];
}

// ─── Update Single Setting ───────────────────────────────────
export function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  return saveSettings(settings);
}

// ─── Render Settings Page ────────────────────────────────────
export function renderSettingsPage() {
  const settings = loadSettings();
  const container = document.getElementById('settings-page');

  container.innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
      <div>
        <h1>⚙️ Settings</h1>
        <p class="page-subtitle">Configure your API keys, lead magnet links, and publishing preferences</p>
      </div>
      <button onclick="window.appActions.clearSession()" style="background:none;border:1px solid rgba(255,107,107,0.4);color:#FF6B6B;cursor:pointer;padding:0.5rem 1rem;border-radius:8px;font-size:0.8rem;font-weight:600;white-space:nowrap;">
        🗑️ Clear Session
      </button>
    </div>

    <div class="settings-grid">
      <!-- API Keys -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🔑</span>
          <h2>API Keys</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="gemini-key">🔍 Gemini API Key <span style="font-size:0.7rem;color:var(--neuro-teal);">(Research — Google Search Grounding)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="gemini-key" class="form-input" 
                     value="${settings.geminiApiKey}" 
                     placeholder="AIza..." />
              <button class="btn-icon toggle-visibility" data-target="gemini-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Searches live Google for fresh articles every week. Get yours at aistudio.google.com</span>
          </div>

          <div class="form-group">
            <label for="claude-key">✍️ Claude API Key <span style="font-size:0.7rem;color:var(--purple);">(Writing — Craig's Voice)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="claude-key" class="form-input" 
                     value="${settings.claudeApiKey}" 
                     placeholder="sk-ant-..." />
              <button class="btn-icon toggle-visibility" data-target="claude-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Writes all posts and video scripts in Craig's voice. Get yours at console.anthropic.com</span>
          </div>

          <div class="form-group">
            <label for="heygen-key">🎬 HeyGen API Key <span style="font-size:0.7rem;color:var(--gold);">(Video Production — AI Avatar)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="heygen-key" class="form-input" 
                     value="${settings.heygenApiKey}" 
                     placeholder="Enter HeyGen API key..." />
              <button class="btn-icon toggle-visibility" data-target="heygen-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">For automated video generation with your AI avatar. Get yours at app.heygen.com/settings</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label for="heygen-avatar">HeyGen Avatar ID</label>
              <input type="text" id="heygen-avatar" class="form-input"
                     value="${settings.heygenAvatarId}" placeholder="e.g. josh_lite3_20230714" />
              <span class="form-hint">Your avatar's ID from HeyGen dashboard</span>
            </div>
            <div class="form-group">
              <label for="heygen-voice">HeyGen Voice ID</label>
              <input type="text" id="heygen-voice" class="form-input"
                     value="${settings.heygenVoiceId}" placeholder="e.g. 1bd001e7e50f421d891986aed6e1" />
              <span class="form-hint">Your voice clone or selected voice ID</span>
            </div>
          </div>

          <div class="form-group">
            <label for="manus-key">🎨 Manus API Key <span style="font-size:0.7rem;color:var(--purple);">(Slide Deck Generation)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="manus-key" class="form-input"
                     value="${settings.manusApiKey}"
                     placeholder="Enter Manus API key..." />
              <button class="btn-icon toggle-visibility" data-target="manus-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Auto-generates slide decks from video script briefs. Get yours at manus.im/settings</span>
          </div>

          <div class="form-group">
            <label for="canva-token">🖼️ Canva API Token <span style="font-size:0.7rem;color:var(--blue);">(Post Image Autofill)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="canva-token" class="form-input"
                     value="${settings.canvaApiToken}"
                     placeholder="Enter Canva API token..." />
              <button class="btn-icon toggle-visibility" data-target="canva-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Auto-fills brand templates with post content. Set up at canva.dev</span>
          </div>
          <div class="form-group">
            <label for="canva-template">Canva Post Template ID</label>
            <input type="text" id="canva-template" class="form-input"
                   value="${settings.canvaPostTemplateId}" placeholder="DAGx..." />
            <span class="form-hint">ID of your Canva brand template for post images (found in Canva template URL)</span>
          </div>
        </div>
      </div>

      <!-- Lead Magnet Links (from Motorcycle_Racer_Funnel_Complete_Reference.md) -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🎯</span>
          <h2>Lead Magnet URLs (5 ScoreApp Assessments)</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="review-url">LM1: Rider Race Weekend Review (PRIMARY)</label>
            <input type="text" id="review-url" class="form-input"
                   value="${settings.reviewUrl}"
                   placeholder="improve-rider.scoreapp.com" />
            <span class="form-hint">✅ CONFIRMED — Trigger: REVIEW — DM delivery only — 3-4x/week</span>
          </div>
          <div class="form-group">
            <label for="season-review-url">LM2: End of Season Review</label>
            <input type="text" id="season-review-url" class="form-input"
                   value="${settings.seasonReviewUrl}"
                   placeholder="riderseason.scoreapp.com" />
            <span class="form-hint">✅ CONFIRMED — Trigger: SEASON — Public link — Off-season (Oct-Feb)</span>
          </div>
          <div class="form-group">
            <label for="flow-profile-url">LM3: Rider Flow Profile</label>
            <input type="text" id="flow-profile-url" class="form-input"
                   value="${settings.flowProfileUrl}"
                   placeholder="https://flow-profile-url.com" />
            <span class="form-hint">⏳ URL NEEDED — Trigger: FLOW — Public link — 1x/week</span>
          </div>
          <div class="form-group">
            <label for="mindset-quiz-url">LM4: Rider Mindset Quiz</label>
            <input type="text" id="mindset-quiz-url" class="form-input"
                   value="${settings.mindsetQuizUrl}"
                   placeholder="https://mindset-quiz-url.com" />
            <span class="form-hint">⏳ URL NEEDED — Trigger: MINDSET — Public link — 1x/week</span>
          </div>
          <div class="form-group">
            <label for="sleep-test-url">LM5: Rider Sleep Test</label>
            <input type="text" id="sleep-test-url" class="form-input"
                   value="${settings.sleepTestUrl || ''}"
                   placeholder="https://sleep-test-url.com" />
            <span class="form-hint">⏳ URL NEEDED — Trigger: SLEEP — Public link — 1-2x/month (pattern interrupt)</span>
          </div>
          <div class="form-group">
            <label for="blueprint-url">Podium Contenders Blueprint (Free Training)</label>
            <input type="text" id="blueprint-url" class="form-input"
                   value="${settings.blueprintUrl}"
                   placeholder="https://academy.caminocoaching.co.uk/podium-contenders-blueprint/order/" />
            <span class="form-hint">✅ CONFIRMED — Trigger: BLUEPRINT — Direct link — 3x/year training windows (Jan, May, Sep)</span>
          </div>
        </div>
      </div>

      <!-- GHL Integration -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">📡</span>
          <h2>GHL Integration</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="ghl-token">🔑 GHL Private Integration Token <span style="font-size:0.7rem;color:var(--green);">(API v2 — Bearer Auth)</span></label>
            <div class="input-with-toggle">
              <input type="password" id="ghl-token" class="form-input"
                     value="${settings.ghlToken}"
                     placeholder="Enter your GHL Private Integration token..." />
              <button class="btn-icon toggle-visibility" data-target="ghl-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Required for direct email dispatch. Agency Settings → Private Integrations → ensure conversations/message.write + contacts.write scopes</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label for="ghl-location">Location ID</label>
              <input type="text" id="ghl-location" class="form-input"
                     value="${settings.ghlLocationId}"
                     placeholder="e.g. vdgR8teGuIgHPMPzbQkK" />
              <span class="form-hint">Sub-account ID for contact upsert</span>
            </div>
            <div class="form-group">
              <label for="ghl-email-from">Verified Sender Email</label>
              <input type="email" id="ghl-email-from" class="form-input"
                     value="${settings.ghlEmailFrom}"
                     placeholder="e.g. craig@caminocoaching.co.uk" />
              <span class="form-hint">Must be from your LC Email dedicated domain</span>
            </div>
          </div>

          <div class="form-group">
            <label for="publish-method">Publishing Method</label>
            <div class="radio-group">
              <label class="radio-option ${settings.publishMethod === 'csv' ? 'active' : ''}">
                <input type="radio" name="publish-method" value="csv" 
                       ${settings.publishMethod === 'csv' ? 'checked' : ''} />
                <span class="radio-label">
                  <span class="radio-title">📄 CSV Export</span>
                  <span class="radio-desc">Download CSV for manual upload to GHL Social Planner</span>
                </span>
              </label>
              <label class="radio-option ${settings.publishMethod === 'ghl-api' ? 'active' : ''}">
                <input type="radio" name="publish-method" value="ghl-api"
                       ${settings.publishMethod === 'ghl-api' ? 'checked' : ''} />
                <span class="radio-label">
                  <span class="radio-title">🚀 GHL API Direct</span>
                  <span class="radio-desc">Schedule directly via GHL API (requires token above)</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Facebook/Instagram Groups -->
      <div class="settings-card full-width">
        <div class="settings-card-header">
          <span class="settings-icon">📱</span>
          <h2>Facebook & Instagram Audience Groups</h2>
          <button class="btn-sm btn-accent" id="add-group-btn">+ Add Group</button>
        </div>
        <div class="settings-card-body">
          <div id="groups-list" class="groups-list">
            ${settings.facebookGroups.map((group, i) => `
              <div class="group-item" data-index="${i}">
                <label class="toggle-switch">
                  <input type="checkbox" ${group.enabled ? 'checked' : ''} class="group-toggle" data-index="${i}" />
                  <span class="toggle-slider"></span>
                </label>
                <input type="text" class="form-input group-name" value="${group.name}" 
                       placeholder="Group name" data-index="${i}" />
                <input type="text" class="form-input group-url" value="${group.url}" 
                       placeholder="Group URL" data-index="${i}" />
                <button class="btn-icon btn-danger remove-group" data-index="${i}" title="Remove">✕</button>
              </div>
            `).join('')}
          </div>
          <p class="form-hint">Target Facebook groups for cross-posting</p>
        </div>
      </div>

      <!-- Brand -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span class="settings-icon">🎨</span>
          <h2>Brand Settings</h2>
        </div>
        <div class="settings-card-body">
          <div class="form-group">
            <label for="brand-name">Brand Name</label>
            <input type="text" id="brand-name" class="form-input"
                   value="${settings.brandName}" placeholder="Your brand name" />
          </div>
          <div class="form-group">
            <label for="post-length">Default Post Length</label>
            <select id="post-length" class="form-select">
              <option value="short" ${settings.postLength === 'short' ? 'selected' : ''}>Short (100-200 words)</option>
              <option value="medium" ${settings.postLength === 'medium' ? 'selected' : ''}>Medium (200-350 words)</option>
              <option value="long" ${settings.postLength === 'long' ? 'selected' : ''}>Long (350-500 words)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Log Panel -->
    <div class="settings-card full-width" style="margin-top:1.5rem;">
      <div class="settings-card-header" style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="settings-icon">📋</span>
          <h2>Activity Log</h2>
          <span id="log-count" style="font-size:0.65rem;padding:0.15rem 0.5rem;background:rgba(88,166,255,0.1);color:#58A6FF;border-radius:10px;font-weight:600;"></span>
        </div>
        <div style="display:flex;gap:0.35rem;">
          <button class="btn-sm" id="log-copy-btn" style="font-size:0.68rem;cursor:pointer;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text-secondary);padding:0.3rem 0.6rem;border-radius:5px;">📋 Copy</button>
          <button class="btn-sm" id="log-export-btn" style="font-size:0.68rem;cursor:pointer;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text-secondary);padding:0.3rem 0.6rem;border-radius:5px;">💾 Export</button>
          <button class="btn-sm" id="log-clear-btn" style="font-size:0.68rem;cursor:pointer;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.2);color:#FF6B6B;padding:0.3rem 0.6rem;border-radius:5px;">🗑️ Clear</button>
        </div>
      </div>
      <div class="settings-card-body">
        <div style="display:flex;gap:0.35rem;margin-bottom:0.5rem;flex-wrap:wrap;">
          <button class="log-filter-btn active" data-filter="all" style="font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:var(--text-secondary);">All</button>
          <button class="log-filter-btn" data-filter="error" style="font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.2);color:#FF6B6B;">❌ Errors</button>
          <button class="log-filter-btn" data-filter="warn" style="font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;background:rgba(218,165,32,0.08);border:1px solid rgba(218,165,32,0.2);color:#DAA520;">⚠️ Warnings</button>
          <button class="log-filter-btn" data-filter="api" style="font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;background:rgba(0,191,165,0.08);border:1px solid rgba(0,191,165,0.2);color:#00BFA5;">🔌 API</button>
          <button class="log-filter-btn" data-filter="success" style="font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;background:rgba(46,160,67,0.08);border:1px solid rgba(46,160,67,0.2);color:#2EA043;">✅ Success</button>
        </div>
        <div id="activity-log-list" style="max-height:400px;overflow-y:auto;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:0.5rem;background:#0D1117;"></div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="btn btn-primary btn-lg" id="save-settings-btn">
        <span class="btn-icon-left">💾</span> Save Settings
      </button>
      <span class="save-status" id="save-status"></span>
    </div>
  `;

  attachSettingsListeners(settings);
}

// ─── Attach Settings Event Listeners ─────────────────────────
function attachSettingsListeners(settings) {
  document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    const updated = gatherSettingsFromForm();
    if (saveSettings(updated)) {
      const status = document.getElementById('save-status');
      status.textContent = '✅ Settings saved!';
      status.classList.add('visible');
      setTimeout(() => status.classList.remove('visible'), 2000);
      showToast('Settings saved successfully', 'success');
    }
  });

  document.getElementById('clear-session-btn')?.addEventListener('click', () => {
    if (!confirm('Clear all stories, posts, and generated content?\n\nYour API keys and settings will be kept.')) return;
    // Keep settings, clear everything else
    const settingsBackup = localStorage.getItem('smm_settings');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'smm_settings') keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    showToast('Session cleared! Reloading...', 'success');
    setTimeout(() => location.reload(), 500);
  });

  document.querySelectorAll('.toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.querySelector('.eye-icon').textContent = input.type === 'password' ? '👁️' : '🙈';
      }
    });
  });

  document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('active'));
      radio.closest('.radio-option').classList.add('active');
    });
  });

  document.getElementById('add-group-btn')?.addEventListener('click', () => {
    const list = document.getElementById('groups-list');
    const index = list.children.length;
    const html = `
      <div class="group-item" data-index="${index}">
        <label class="toggle-switch">
          <input type="checkbox" checked class="group-toggle" data-index="${index}" />
          <span class="toggle-slider"></span>
        </label>
        <input type="text" class="form-input group-name" value="" 
               placeholder="Group name" data-index="${index}" />
        <input type="text" class="form-input group-url" value="" 
               placeholder="Group URL" data-index="${index}" />
        <button class="btn-icon btn-danger remove-group" data-index="${index}" title="Remove">✕</button>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', html);

    list.lastElementChild.querySelector('.remove-group').addEventListener('click', (e) => {
      e.target.closest('.group-item').remove();
    });
  });

  document.querySelectorAll('.remove-group').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.group-item').remove();
    });
  });

  // ─── Activity Log Listeners ───────────────────────────────────
  const logList = document.getElementById('activity-log-list');
  if (logList) {
    renderLogEntries(logList);
    const entries = getLogEntries();
    const countEl = document.getElementById('log-count');
    if (countEl) {
      const errorCount = entries.filter(e => e.level === 'error').length;
      countEl.textContent = errorCount > 0 ? `${entries.length} entries · ${errorCount} errors` : `${entries.length} entries`;
      if (errorCount > 0) { countEl.style.background = 'rgba(255,107,107,0.15)'; countEl.style.color = '#FF6B6B'; }
    }
  }

  document.getElementById('log-clear-btn')?.addEventListener('click', () => {
    if (!confirm('Clear all log entries?')) return;
    clearLog();
    const countEl = document.getElementById('log-count');
    if (countEl) { countEl.textContent = '0 entries'; countEl.style.background = 'rgba(88,166,255,0.1)'; countEl.style.color = '#58A6FF'; }
    showToast('Activity log cleared', 'success');
  });

  document.getElementById('log-copy-btn')?.addEventListener('click', () => {
    const entries = getLogEntries();
    const text = entries.map(e => {
      const t = new Date(e.ts).toLocaleString('en-GB');
      return `[${t}] [${e.level.toUpperCase()}] ${e.message}${e.details ? '\n  → ' + e.details.split('\n')[0] : ''}`;
    }).join('\n');
    navigator.clipboard.writeText(text).then(() => showToast('Log copied to clipboard', 'success'));
  });

  document.getElementById('log-export-btn')?.addEventListener('click', () => {
    const entries = getLogEntries();
    const text = entries.map(e => {
      const t = new Date(e.ts).toLocaleString('en-GB');
      return `[${t}] [${e.level.toUpperCase()}] ${e.message}${e.details ? '\n  Details: ' + e.details : ''}`;
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rider-smm-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    showToast('Log exported as .txt file', 'success');
  });

  // Filter buttons
  document.querySelectorAll('.log-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const logList = document.getElementById('activity-log-list');
      if (!logList) return;
      const entries = getLogEntries();
      const filtered = filter === 'all' ? entries : entries.filter(e => e.level === filter);
      if (filtered.length === 0) {
        logList.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.8rem;">No ${filter} entries found.</div>`;
        return;
      }
      logList.innerHTML = filtered.slice().reverse().map((entry, i) => {
        const lvl = LOG_LEVELS[entry.level] || LOG_LEVELS.info;
        const time = new Date(entry.ts);
        const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        return `<div style="padding:0.45rem 0.65rem;background:${lvl.bg};border-left:3px solid ${lvl.color};border-radius:0 4px 4px 0;display:flex;gap:0.5rem;align-items:flex-start;font-size:0.72rem;${i > 0 ? 'margin-top:0.3rem;' : ''}">
          <span style="flex-shrink:0;">${lvl.icon}</span>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;gap:0.5rem;">
              <span style="color:${lvl.color};font-weight:600;text-transform:uppercase;font-size:0.6rem;letter-spacing:0.5px;">${entry.level}</span>
              <span style="color:var(--text-muted);font-size:0.6rem;white-space:nowrap;">${dateStr} ${timeStr}</span>
            </div>
            <div style="color:var(--text-primary);margin-top:0.15rem;word-break:break-word;">${escapeLogHtml(entry.message)}</div>
            ${entry.details ? `<details style="margin-top:0.25rem;"><summary style="cursor:pointer;color:var(--text-muted);font-size:0.65rem;">Details</summary><pre style="margin-top:0.25rem;padding:0.4rem;background:rgba(0,0,0,0.3);border-radius:4px;font-size:0.65rem;color:var(--text-secondary);white-space:pre-wrap;word-break:break-all;max-height:150px;overflow-y:auto;">${escapeLogHtml(entry.details)}</pre></details>` : ''}
          </div>
        </div>`;
      }).join('');
    });
  });
}

// ─── Gather Settings From Form ───────────────────────────────
function gatherSettingsFromForm() {
  const groups = [];
  document.querySelectorAll('.group-item').forEach(item => {
    groups.push({
      name: item.querySelector('.group-name')?.value || '',
      url: item.querySelector('.group-url')?.value || '',
      enabled: item.querySelector('.group-toggle')?.checked || false
    });
  });

  return {
    geminiApiKey: document.getElementById('gemini-key')?.value || '',
    claudeApiKey: document.getElementById('claude-key')?.value || '',
    heygenApiKey: document.getElementById('heygen-key')?.value || '',
    heygenAvatarId: document.getElementById('heygen-avatar')?.value || '',
    heygenVoiceId: document.getElementById('heygen-voice')?.value || '',
    manusApiKey: document.getElementById('manus-key')?.value || '',
    canvaApiToken: document.getElementById('canva-token')?.value || '',
    canvaPostTemplateId: document.getElementById('canva-template')?.value || '',
    ghlToken: document.getElementById('ghl-token')?.value || '',
    ghlLocationId: document.getElementById('ghl-location')?.value || '',
    ghlEmailFrom: document.getElementById('ghl-email-from')?.value || '',
    publishMethod: document.querySelector('input[name="publish-method"]:checked')?.value || 'csv',
    facebookGroups: groups,
    brandName: document.getElementById('brand-name')?.value || 'Camino Coaching',
    postLength: document.getElementById('post-length')?.value || 'medium',
    reviewUrl: document.getElementById('review-url')?.value || '',
    seasonReviewUrl: document.getElementById('season-review-url')?.value || '',
    flowProfileUrl: document.getElementById('flow-profile-url')?.value || '',
    mindsetQuizUrl: document.getElementById('mindset-quiz-url')?.value || '',
    sleepTestUrl: document.getElementById('sleep-test-url')?.value || '',
    blueprintUrl: document.getElementById('blueprint-url')?.value || ''
  };
}

// ─── Toast Helper ────────────────────────────────────────────
function showToast(message, type = 'info') {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  document.dispatchEvent(event);
}
