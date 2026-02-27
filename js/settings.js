// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — Settings Manager
// LocalStorage persistence for API keys, preferences
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'rider-social-media-machine-settings';

const DEFAULT_SETTINGS = {
  openaiApiKey: '',
  ghlToken: '',
  ghlLocationId: '',
  publishMethod: 'csv',
  aiModel: 'gpt-4o',
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
    <div class="page-header">
      <h1>⚙️ Settings</h1>
      <p class="page-subtitle">Configure your API keys, lead magnet links, and publishing preferences</p>
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
            <label for="openai-key">OpenAI API Key</label>
            <div class="input-with-toggle">
              <input type="password" id="openai-key" class="form-input" 
                     value="${settings.openaiApiKey}" 
                     placeholder="sk-..." />
              <button class="btn-icon toggle-visibility" data-target="openai-key" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Required for content generation. Get yours at platform.openai.com</span>
          </div>

          <div class="form-group">
            <label for="ai-model">AI Model</label>
            <select id="ai-model" class="form-select">
              <option value="gpt-4o" ${settings.aiModel === 'gpt-4o' ? 'selected' : ''}>GPT-4o (Recommended)</option>
              <option value="gpt-4o-mini" ${settings.aiModel === 'gpt-4o-mini' ? 'selected' : ''}>GPT-4o Mini (Faster/Cheaper)</option>
              <option value="gpt-4-turbo" ${settings.aiModel === 'gpt-4-turbo' ? 'selected' : ''}>GPT-4 Turbo</option>
            </select>
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
            <label for="ghl-token">GHL Private Integration Token</label>
            <div class="input-with-toggle">
              <input type="password" id="ghl-token" class="form-input"
                     value="${settings.ghlToken}"
                     placeholder="Enter your GHL token..." />
              <button class="btn-icon toggle-visibility" data-target="ghl-token" title="Show/Hide">
                <span class="eye-icon">👁️</span>
              </button>
            </div>
            <span class="form-hint">Optional — needed for direct GHL API scheduling</span>
          </div>

          <div class="form-group">
            <label for="ghl-location">GHL Location ID</label>
            <input type="text" id="ghl-location" class="form-input"
                   value="${settings.ghlLocationId}"
                   placeholder="Enter your location ID..." />
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
    openaiApiKey: document.getElementById('openai-key')?.value || '',
    ghlToken: document.getElementById('ghl-token')?.value || '',
    ghlLocationId: document.getElementById('ghl-location')?.value || '',
    publishMethod: document.querySelector('input[name="publish-method"]:checked')?.value || 'csv',
    aiModel: document.getElementById('ai-model')?.value || 'gpt-4o',
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
