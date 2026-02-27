// ═══════════════════════════════════════════════════════════════
// 🏁 DRIVER SOCIAL MEDIA ENGINE — Main App
// Orchestrator, routing, wizard, single post, and shared utils
// ═══════════════════════════════════════════════════════════════

import {
    PILLARS, FRAMEWORKS, CTAS, AUTHORITY_LINES, CAMPAIGN_ARC,
    getActiveCTAs, getRotatingCTA, resetCTARotation,
    getRotatingAuthority, resetAuthorityRotation,
    isRaceWeek, getRaceWeekContext,
    getWeeklyPillars, getWeeklyFrameworks,
    getRandomPillar, getRandomFramework
} from './content-engine.js';

import {
    generateTopics, generatePost, generatePosts, regeneratePost, generateImagePrompt
} from './ai-service.js';

import {
    getScheduleDates, exportCSV, downloadPostTxt, copyToClipboard
} from './scheduler.js';

import { loadSettings, renderSettingsPage } from './settings.js';

// ─── App State ────────────────────────────────────────────────
const state = {
    currentPage: 'wizard',
    wizardStep: 1,
    topics: [],
    posts: [],
    weeklyPillars: [],
    weeklyFrameworks: [],
    weeklyCTAs: [],
    weeklyAuthorities: [],
    raceContext: null,
    selectedPillar: null,
    selectedFramework: null,
    selectedCTA: 'auto'
};

// ─── Initialise ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWizard();
    initSinglePost();
    renderSettingsPage();
    checkRaceWeek();
    initToastListener();
});

// ─── Toast System ─────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initToastListener() {
    document.addEventListener('show-toast', (e) => {
        showToast(e.detail.message, e.detail.type);
    });
}

// ─── Navigation ───────────────────────────────────────────────
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const page = link.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(page) {
    state.currentPage = page;

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`)?.classList.add('active');
}

// ─── Status Indicator ─────────────────────────────────────────
function setStatus(text, busy = false) {
    const dot = document.getElementById('status-dot');
    const textEl = document.getElementById('status-text');
    dot.classList.toggle('busy', busy);
    textEl.textContent = text;
}

// ─── Race Week Check ──────────────────────────────────────────
function checkRaceWeek() {
    state.raceContext = getRaceWeekContext();
    const badgesEl = document.getElementById('wizard-badges');

    if (state.raceContext) {
        badgesEl.innerHTML = `
      <span class="badge badge-race">🏎️ Race Week: ${state.raceContext.name} — ${state.raceContext.circuit}</span>
    `;
    }

    // Show current season
    const activeCTAs = getActiveCTAs();
    const seasonNames = activeCTAs.map(c => c.season);
    const seasonLabel = seasonNames.includes('REVIEW') ? 'Race Season' : seasonNames.includes('SEASON') ? 'End of Season' : 'Off-Season';
    badgesEl.innerHTML += `<span class="badge badge-season">📅 ${seasonLabel} — ${activeCTAs.length} CTAs active</span>`;
}

// ═══════════════════════════════════════════════════════════════
// WEEKLY WIZARD
// ═══════════════════════════════════════════════════════════════

function initWizard() {
    // Render pillar preview
    renderPillarPreview();

    // Find Topics button
    document.getElementById('find-topics-btn')?.addEventListener('click', handleFindTopics);

    // Write Posts button
    document.getElementById('write-posts-btn')?.addEventListener('click', handleWritePosts);

    // Back buttons
    document.getElementById('back-to-step1')?.addEventListener('click', () => goToWizardStep(1));
    document.getElementById('back-to-step2')?.addEventListener('click', () => goToWizardStep(2));

    // Export button
    document.getElementById('export-csv-btn')?.addEventListener('click', handleExportCSV);
}

function renderPillarPreview() {
    const container = document.getElementById('pillar-preview');
    container.innerHTML = PILLARS.map(p => `
    <div class="pillar-card" style="border-left: 3px solid ${p.color};">
      <div class="pillar-icon">${p.icon}</div>
      <div class="pillar-name">${p.name}</div>
      <div class="pillar-desc">${p.description.split('—')[0].trim()}</div>
    </div>
  `).join('');
}

function goToWizardStep(step) {
    state.wizardStep = step;

    // Update step indicators
    document.querySelectorAll('.wizard-step').forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (s === step) el.classList.add('active');
        else if (s < step) el.classList.add('completed');
    });

    // Show/hide content
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`wizard-step-${i}`);
        if (el) el.classList.toggle('hidden', i !== step);
    }
}

// ─── Step 1: Find Topics ──────────────────────────────────────
async function handleFindTopics() {
    const settings = loadSettings();
    if (!settings.openaiApiKey) {
        showToast('Please add your OpenAI API key in Settings first.', 'error');
        return;
    }

    const btn = document.getElementById('find-topics-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Searching the web for articles...', true);

    try {
        // Generate weekly assignments
        state.weeklyPillars = getWeeklyPillars();
        state.weeklyFrameworks = getWeeklyFrameworks();

        // Reset rotations
        resetCTARotation();
        resetAuthorityRotation();

        // Assign CTAs and authority lines
        state.weeklyCTAs = state.weeklyPillars.map(() => getRotatingCTA());
        state.weeklyAuthorities = state.weeklyPillars.map(() => getRotatingAuthority());

        // Generate topics via AI with web search
        state.topics = await generateTopics(
            state.weeklyPillars,
            state.raceContext,
            settings.openaiApiKey,
            settings.aiModel || 'gpt-4o'
        );

        renderTopics();
        goToWizardStep(2);
        showToast('7 article-based topics found! Review and edit as needed.', 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}

function renderTopics() {
    const container = document.getElementById('topics-grid');
    container.innerHTML = state.topics.map((topic, i) => {
        const pillar = state.weeklyPillars[i];
        const framework = state.weeklyFrameworks[i];
        const campaignDay = i < CAMPAIGN_ARC.length ? CAMPAIGN_ARC[i] : null;

        return `
      <div class="topic-card" data-index="${i}">
        <div class="topic-card-header">
          <span class="pillar-badge" style="border: 1px solid ${pillar.color}30; color: ${pillar.color};">
            ${pillar.icon} ${pillar.name}
          </span>
          <span class="framework-badge">${framework.icon} ${framework.name}</span>
          ${campaignDay ? `<span class="framework-badge">${campaignDay.day}</span>` : ''}
        </div>
        <div class="topic-headline">${topic.headline || 'Topic ' + (i + 1)}</div>
        ${topic.sourceArticle ? `<div class="topic-source" style="font-size:0.72rem;color:var(--blue);margin-bottom:0.4rem;padding:0.3rem 0.5rem;background:rgba(68,136,255,0.06);border-radius:var(--r-xs);">📰 ${topic.sourceArticle}</div>` : ''}
        ${topic.talkingPoints ? `
          <ul class="topic-points">
            ${topic.talkingPoints.map(tp => `<li>${tp}</li>`).join('')}
          </ul>
        ` : ''}
        ${topic.emotionalHook ? `<div class="topic-emotion">🎯 ${topic.emotionalHook}</div>` : ''}
        <textarea class="topic-edit-area" data-index="${i}" placeholder="Edit this topic or paste a different headline...">${topic.headline || ''}</textarea>
      </div>
    `;
    }).join('');

    // Listen for edits
    container.querySelectorAll('.topic-edit-area').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.index);
            if (state.topics[idx]) {
                state.topics[idx].headline = e.target.value;
            }
        });
    });
}

// ─── Step 2: Write Posts ──────────────────────────────────────
async function handleWritePosts() {
    const settings = loadSettings();
    if (!settings.openaiApiKey) {
        showToast('Please add your OpenAI API key in Settings first.', 'error');
        return;
    }

    const btn = document.getElementById('write-posts-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Writing 7 posts in parallel...', true);

    try {
        const campaignDays = state.topics.map((_, i) => i < CAMPAIGN_ARC.length ? CAMPAIGN_ARC[i] : null);

        state.posts = await generatePosts(state.topics, {
            pillars: state.weeklyPillars,
            frameworks: state.weeklyFrameworks,
            ctas: state.weeklyCTAs,
            authorityLines: state.weeklyAuthorities,
            raceContext: state.raceContext,
            apiKey: settings.openaiApiKey,
            model: settings.aiModel || 'gpt-4o',
            campaignDays
        });

        renderPosts();
        goToWizardStep(3);
        showToast('All 7 posts generated! Review and export.', 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}

function renderPosts() {
    const container = document.getElementById('posts-grid');
    const dates = getScheduleDates(state.posts.length);

    container.innerHTML = state.posts.map((post, i) => {
        const date = dates[i];
        const wordCount = (post.content || '').split(/\s+/).filter(w => w).length;
        const campaignDay = post.campaignDay || (i < CAMPAIGN_ARC.length ? CAMPAIGN_ARC[i] : null);

        return `
      <div class="post-card ${post.imageUrl ? 'has-image' : ''}" id="post-card-${i}" data-index="${i}">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="post-number">${i + 1}</span>
            <span class="pillar-badge" style="border: 1px solid ${post.pillar.color}30; color: ${post.pillar.color};">
              ${post.pillar.icon} ${post.pillar.name}
            </span>
            <span class="framework-badge">${post.framework.icon} ${post.framework.name}</span>
            ${campaignDay ? `<span class="framework-badge">📅 ${campaignDay.day} — ${campaignDay.purpose}</span>` : ''}
          </div>
          <div class="post-card-header-right">
            ${post.imageUrl ? '<span class="post-status-badge complete" title="Image attached">✅ Image</span>' : '<span class="post-status-badge pending" title="No image yet">⬜ No image</span>'}
            <span class="schedule-info">${date.dayName} ${date.dateString} at ${date.timeString}</span>
          </div>
        </div>

        ${post.imageUrl ? `
        <div class="post-image-preview">
          <img src="${post.imageUrl}" alt="Post ${i + 1} image" onerror="this.parentElement.innerHTML='<div class=\\'post-image-error\\'>⚠️ Image failed to load — check URL</div>'" />
          <button class="post-image-remove" onclick="window.appActions.removeImage(${i})" title="Remove image">✕</button>
        </div>
        ` : ''}

        <div class="post-content" id="post-content-${i}">${escapeHtml(post.content || '')}</div>

        <div class="post-card-footer">
          <div class="post-meta">
            <span class="word-count">${wordCount} words</span>
            <span class="pillar-badge" style="font-size:0.65rem;">${post.cta.shortName}</span>
            ${post.status === 'rejected' ? '<span class="badge" style="background:rgba(255,68,68,0.1);color:var(--accent);font-size:0.65rem;">⚠️ Error</span>' : ''}
          </div>
          <div class="post-actions" style="position:relative;">
            <button class="post-action-btn" onclick="window.appActions.copyPost(${i})" title="Copy to clipboard">📋 Copy</button>
            <button class="post-action-btn" onclick="window.appActions.downloadPost(${i})" title="Download as .txt">💾 .txt</button>
            <button class="post-action-btn" onclick="window.appActions.toggleEdit(${i})" title="Edit post">✏️ Edit</button>
            <button class="post-action-btn" onclick="window.appActions.regenPost(${i})" title="Regenerate">🔄 Regen</button>
            <button class="post-action-btn" onclick="window.appActions.toggleCtaPicker(${i})" title="Change CTA">🎯 CTA</button>
            <button class="post-action-btn" onclick="window.appActions.toggleImageUrl(${i})" title="Add image URL">🖼️ Image</button>
            <button class="post-action-btn" onclick="window.appActions.openManus()" title="Generate image with Manus AI" style="color:var(--purple);">🎨 Manus</button>
            <button class="post-action-btn" onclick="window.appActions.openGHLMedia()" title="Upload image to GHL Media" style="color:var(--green);">📤 GHL Media</button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Update export info
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const imagesCount = state.posts.filter(p => p.imageUrl).length;
    document.getElementById('export-count').textContent = `${state.posts.length} posts ready — ${imagesCount}/${state.posts.length} with images`;
    document.getElementById('export-schedule').textContent = `${firstDate.dayName} ${firstDate.dateString} → ${lastDate.dayName} ${lastDate.dateString}`;
}

// ─── Post Actions (attached to window for onclick) ────────────
window.appActions = {
    copyPost(index) {
        const post = state.posts[index];
        if (post) {
            copyToClipboard(post.content);
            showToast('Post copied to clipboard!', 'success');
        }
    },

    downloadPost(index) {
        const post = state.posts[index];
        if (post) {
            downloadPostTxt(post, index);
            showToast('Post downloaded as .txt', 'success');
        }
    },

    toggleEdit(index) {
        const contentEl = document.getElementById(`post-content-${index}`);
        const post = state.posts[index];
        if (!post) return;

        if (contentEl.tagName === 'DIV') {
            // Switch to edit mode
            const textarea = document.createElement('textarea');
            textarea.className = 'post-content-editing';
            textarea.value = post.content;
            textarea.id = `post-content-${index}`;
            textarea.addEventListener('input', (e) => {
                post.content = e.target.value;
                post.edited = true;
            });
            contentEl.replaceWith(textarea);
            textarea.focus();
            showToast('Editing mode enabled. Changes save automatically.', 'info');
        } else {
            // Switch back to view mode
            const div = document.createElement('div');
            div.className = 'post-content';
            div.id = `post-content-${index}`;
            div.textContent = post.content;
            contentEl.replaceWith(div);
            // Update word count
            const card = document.getElementById(`post-card-${index}`);
            const wordCountEl = card?.querySelector('.word-count');
            if (wordCountEl) {
                wordCountEl.textContent = post.content.split(/\s+/).filter(w => w).length + ' words';
            }
        }
    },

    async regenPost(index) {
        const settings = loadSettings();
        if (!settings.openaiApiKey) {
            showToast('Please add your OpenAI API key in Settings.', 'error');
            return;
        }

        const contentEl = document.getElementById(`post-content-${index}`);
        const originalContent = contentEl.textContent || contentEl.value;
        contentEl.textContent = '⏳ Regenerating...';
        setStatus('Regenerating post...', true);

        try {
            const newPost = await regeneratePost(state.posts[index], settings.openaiApiKey, settings.aiModel, state.raceContext);
            state.posts[index] = newPost;
            renderPosts();
            showToast('Post regenerated!', 'success');
        } catch (err) {
            contentEl.textContent = originalContent;
            showToast(`Regen failed: ${err.message}`, 'error');
        } finally {
            setStatus('Ready');
        }
    },

    toggleCtaPicker(index) {
        const card = document.getElementById(`post-card-${index}`);
        let picker = card.querySelector('.cta-picker-dropdown');

        if (picker) {
            picker.remove();
            return;
        }

        const actionsDiv = card.querySelector('.post-actions');
        picker = document.createElement('div');
        picker.className = 'cta-picker-dropdown';
        picker.innerHTML = CTAS.map(cta => `
      <button class="cta-picker-option ${state.posts[index].cta.id === cta.id ? 'active' : ''}" data-cta-id="${cta.id}">
        ${cta.primary ? '⭐' : '📌'} ${cta.shortName}
      </button>
    `).join('');

        picker.querySelectorAll('.cta-picker-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const ctaId = btn.dataset.ctaId;
                const newCta = CTAS.find(c => c.id === ctaId);
                if (newCta && state.posts[index]) {
                    state.posts[index].cta = newCta;
                    // Replace CTA in post content
                    const content = state.posts[index].content;
                    const ctaMarker = content.indexOf('··');
                    if (ctaMarker !== -1) {
                        state.posts[index].content = content.substring(0, ctaMarker) + newCta.ctaTemplate;
                    }
                    renderPosts();
                    showToast(`CTA changed to ${newCta.shortName}`, 'success');
                }
                picker.remove();
            });
        });

        actionsDiv.appendChild(picker);

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closePicker(e) {
                if (!picker.contains(e.target)) {
                    picker.remove();
                    document.removeEventListener('click', closePicker);
                }
            });
        }, 10);
    },

    toggleImageUrl(index) {
        const card = document.getElementById(`post-card-${index}`);
        let input = card.querySelector('.image-url-input');

        if (input) {
            input.remove();
            return;
        }

        const footer = card.querySelector('.post-card-footer');
        input = document.createElement('div');
        input.className = 'image-url-input';
        input.innerHTML = `
      <input type="text" placeholder="Paste image URL..." value="${state.posts[index].imageUrl || ''}" />
      <button class="btn btn-sm btn-secondary" onclick="window.appActions.saveImageUrl(${index}, this)">Save</button>
    `;
        footer.after(input);
    },

    openManus() {
        window.open('https://manus.im/app/project/9nj8ezfHDDsjHV2jq4rDvG', '_blank');
    },

    openGHLMedia() {
        window.open('https://app.gohighlevel.com/v2/location/EwAyQ03cV2yxVYaxnY5S/media-storage', '_blank');
    },

    saveImageUrl(index, btn) {
        const input = btn.previousElementSibling;
        if (input && state.posts[index]) {
            state.posts[index].imageUrl = input.value.trim();
            renderPosts();
            showToast(state.posts[index].imageUrl ? 'Image URL saved — preview shown on card' : 'Image URL cleared', 'success');
        }
    },

    removeImage(index) {
        if (state.posts[index]) {
            state.posts[index].imageUrl = '';
            renderPosts();
            showToast('Image removed from post', 'info');
        }
    }
};

// ─── Export CSV ────────────────────────────────────────────────
function handleExportCSV() {
    if (state.posts.length === 0) {
        showToast('No posts to export.', 'error');
        return;
    }

    const dates = getScheduleDates(state.posts.length);
    const filename = exportCSV(state.posts, dates);
    showToast(`Exported ${state.posts.length} posts to ${filename}`, 'success');
}

// ═══════════════════════════════════════════════════════════════
// SINGLE POST
// ═══════════════════════════════════════════════════════════════

function initSinglePost() {
    renderPillarSelector();
    renderFrameworkSelector();
    renderCTASelector();

    document.getElementById('generate-single-btn')?.addEventListener('click', handleGenerateSingle);
}

function renderPillarSelector() {
    const container = document.getElementById('pillar-selector');
    container.innerHTML = PILLARS.map(p => `
    <button class="selector-btn" data-pillar="${p.id}" style="--sel-color: ${p.color};">
      ${p.icon} ${p.name}
    </button>
  `).join('');

    container.querySelectorAll('.selector-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedPillar = btn.dataset.pillar;
        });
    });

    // Select first by default
    const firstBtn = container.querySelector('.selector-btn');
    if (firstBtn) { firstBtn.click(); }
}

function renderFrameworkSelector() {
    const container = document.getElementById('framework-selector');
    container.innerHTML = FRAMEWORKS.map(f => `
    <button class="selector-btn" data-framework="${f.id}">
      ${f.icon} ${f.name} <span style="opacity:0.5;font-size:0.65rem;">(${f.prefix})</span>
    </button>
  `).join('');

    container.querySelectorAll('.selector-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedFramework = btn.dataset.framework;
        });
    });

    const firstBtn = container.querySelector('.selector-btn');
    if (firstBtn) { firstBtn.click(); }
}

function renderCTASelector() {
    const select = document.getElementById('cta-selector');
    CTAS.forEach(cta => {
        const opt = document.createElement('option');
        opt.value = cta.id;
        opt.textContent = `${cta.primary ? '⭐' : '📌'} ${cta.name}`;
        select.appendChild(opt);
    });

    select.addEventListener('change', () => {
        state.selectedCTA = select.value;
    });
}

async function handleGenerateSingle() {
    const settings = loadSettings();
    if (!settings.openaiApiKey) {
        showToast('Please add your OpenAI API key in Settings first.', 'error');
        return;
    }

    const pillar = PILLARS.find(p => p.id === state.selectedPillar) || getRandomPillar();
    const framework = FRAMEWORKS.find(f => f.id === state.selectedFramework) || getRandomFramework();
    const cta = state.selectedCTA === 'auto' ? getRotatingCTA() : CTAS.find(c => c.id === state.selectedCTA) || getRotatingCTA();
    const authorityLine = getRotatingAuthority();
    const topicInput = document.getElementById('single-topic')?.value.trim();
    const topic = topicInput || pillar.topics[Math.floor(Math.random() * pillar.topics.length)];

    const btn = document.getElementById('generate-single-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Generating post...', true);

    const resultContainer = document.getElementById('single-result');
    resultContainer.innerHTML = `
    <div class="empty-state">
      <span class="spinner" style="width:32px;height:32px;border-width:3px;"></span>
      <p style="margin-top:1rem;">Generating your post...</p>
    </div>
  `;

    try {
        const content = await generatePost({
            topic,
            pillar,
            framework,
            cta,
            authorityLine,
            raceContext: state.raceContext,
            apiKey: settings.openaiApiKey,
            model: settings.aiModel || 'gpt-4o'
        });

        const post = {
            id: `single-${Date.now()}`,
            content,
            pillar,
            framework,
            cta,
            authorityLine,
            topic: { headline: topic },
            imageUrl: '',
            edited: false
        };

        const wordCount = content.split(/\s+/).filter(w => w).length;

        resultContainer.innerHTML = `
      <div class="post-card">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="pillar-badge" style="border: 1px solid ${pillar.color}30; color: ${pillar.color};">
              ${pillar.icon} ${pillar.name}
            </span>
            <span class="framework-badge">${framework.icon} ${framework.name}</span>
            <span class="framework-badge">🎯 ${cta.shortName}</span>
          </div>
          <span class="word-count">${wordCount} words</span>
        </div>
        <div class="post-content" id="single-post-content">${escapeHtml(content)}</div>
        <div class="post-card-footer">
          <div class="post-meta">
            <span class="word-count">${wordCount} words</span>
          </div>
          <div class="post-actions">
            <button class="post-action-btn" id="single-copy-btn">📋 Copy</button>
            <button class="post-action-btn" id="single-download-btn">💾 .txt</button>
            <button class="post-action-btn" id="single-edit-btn">✏️ Edit</button>
            <button class="post-action-btn" id="single-regen-btn">🔄 Regen</button>
            <button class="post-action-btn" id="single-manus-btn" style="color:var(--purple);">🎨 Manus</button>
            <button class="post-action-btn" id="single-ghl-media-btn" style="color:var(--green);">📤 GHL Media</button>
          </div>
        </div>
      </div>
    `;

        // Attach single post actions
        document.getElementById('single-copy-btn')?.addEventListener('click', () => {
            copyToClipboard(post.content);
            showToast('Post copied!', 'success');
        });

        document.getElementById('single-download-btn')?.addEventListener('click', () => {
            downloadPostTxt(post, 0);
            showToast('Downloaded!', 'success');
        });

        document.getElementById('single-edit-btn')?.addEventListener('click', () => {
            const el = document.getElementById('single-post-content');
            if (el.tagName === 'DIV') {
                const textarea = document.createElement('textarea');
                textarea.className = 'post-content-editing';
                textarea.value = post.content;
                textarea.id = 'single-post-content';
                textarea.addEventListener('input', (e) => { post.content = e.target.value; });
                el.replaceWith(textarea);
                textarea.focus();
            } else {
                const div = document.createElement('div');
                div.className = 'post-content';
                div.id = 'single-post-content';
                div.textContent = post.content;
                el.replaceWith(div);
            }
        });

        document.getElementById('single-regen-btn')?.addEventListener('click', () => {
            handleGenerateSingle();
        });

        document.getElementById('single-manus-btn')?.addEventListener('click', () => {
            window.open('https://manus.im/app/project/9nj8ezfHDDsjHV2jq4rDvG', '_blank');
        });

        document.getElementById('single-ghl-media-btn')?.addEventListener('click', () => {
            window.open('https://app.gohighlevel.com/v2/location/EwAyQ03cV2yxVYaxnY5S/media-storage', '_blank');
        });

        showToast('Post generated!', 'success');
    } catch (err) {
        resultContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">❌</span>
        <p>Error: ${escapeHtml(err.message)}</p>
      </div>
    `;
        showToast(`Error: ${err.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}

// ─── Utility ──────────────────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
