// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — Main App
// Orchestrator, routing, wizard, single post, and shared utils
// ═══════════════════════════════════════════════════════════════

import {
    PILLARS, FRAMEWORKS, CTAS, AUTHORITY_LINES, CAMPAIGN_ARC,
    WEEKLY_SCHEDULE, MOTORSPORT_BRIDGES, VISUAL_FORMATS,
    getActiveCTAs, getRotatingCTA, resetCTARotation,
    getRotatingAuthority, resetAuthorityRotation,
    getRotatingMotorsportBridge, resetMotorsportBridgeRotation,
    getWeeklyPillars, getWeeklyFrameworks, getWeeklyCTAs,
    getRandomPillar, getRandomFramework,
    getSeasonalContext
} from './content-engine.js';

import {
    generateTopics, generatePost, generatePosts, regeneratePost, generateImagePrompt,
    generateVideoScript, storeUsedArticles, storeUsedHooks,
    generateEmail, renderEmailHTML
} from './ai-service.js';

import {
    createManusSlideTask, checkManusTaskStatus,
    createHeyGenVideo, checkHeyGenStatus,
    createCanvaPostImage, runFullPipeline, getRecentPipelineJobs
} from './production-pipeline.js';

import { dispatchEmail } from './ghl-email.js';

import {
    NEUROCHEMICALS, FLOW_COCKTAIL, WEEKLY_VIDEO_SCHEDULE, VIDEO_TOPICS,
    getChemical, getTopicsForChemical
} from './neurochemistry.js';

import {
    getScheduleDates, exportCSV, buildCSVString, downloadPostTxt, copyToClipboard
} from './scheduler.js';

import { loadSettings, renderSettingsPage } from './settings.js';

import {
    REVIEW_STATS, QUOTED_HOOKS, OBJECTION_KILLERS, CAROUSEL_CONCEPTS,
    REVIEW_AUTHORITY_LINES, TRUSTPILOT_REVIEWS, GOOGLE_REVIEWS,
    getReviewRequestTemplate
} from './review-bank.js';

import {
    getChampionshipContext, getUpcomingEvents, getRecentEvents
} from './championship-calendar.js';

import {
    runReviewScan, getScannerStatus, getScanHistory,
    getPendingReviews, approveNewReview, dismissNewReview,
    autoScanIfDue, updateScannerSettings
} from './review-scanner.js';

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
    weeklyMotorsportBridges: [],
    seasonalContext: null,
    selectedPillar: null,
    selectedFramework: null,
    selectedCTA: 'auto'
};

const STORAGE_KEY = 'riderSocialMedia_session';

// ─── Auto-Save / Restore ──────────────────────────────────────
function saveSession() {
    try {
        const data = {
            wizardStep: state.wizardStep,
            topics: state.topics,
            posts: state.posts,
            weeklyPillars: state.weeklyPillars,
            weeklyFrameworks: state.weeklyFrameworks,
            weeklyCTAs: state.weeklyCTAs,
            weeklyAuthorities: state.weeklyAuthorities,
            weeklyMotorsportBridges: state.weeklyMotorsportBridges,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save session:', e);
    }
}

function restoreSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;

        const data = JSON.parse(raw);
        if ((!data.posts || data.posts.length === 0) && (!data.topics || data.topics.length === 0)) {
            return false;
        }

        state.topics = data.topics || [];
        state.posts = data.posts || [];
        state.weeklyPillars = data.weeklyPillars || [];
        state.weeklyFrameworks = data.weeklyFrameworks || [];
        state.weeklyCTAs = data.weeklyCTAs || [];
        state.weeklyAuthorities = data.weeklyAuthorities || [];
        state.weeklyMotorsportBridges = data.weeklyMotorsportBridges || [];

        if (state.posts.length > 0) {
            goToWizardStep(3);
            renderPosts();
            const savedDate = data.savedAt ? new Date(data.savedAt).toLocaleString() : 'previously';
            showToast(`Restored ${state.posts.length} saved posts from ${savedDate}`, 'success');
        } else if (state.topics.length > 0) {
            goToWizardStep(2);
            renderTopics();
            showToast(`Restored ${state.topics.length} saved topics`, 'success');
        }
        return true;
    } catch (e) {
        console.warn('Failed to restore session:', e);
        return false;
    }
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    state.topics = [];
    state.posts = [];
    state.weeklyPillars = [];
    state.weeklyFrameworks = [];
    state.weeklyCTAs = [];
    state.weeklyAuthorities = [];
    state.weeklyMotorsportBridges = [];
    goToWizardStep(1);
    showToast('Session cleared. Ready for a fresh week!', 'info');
}

// ─── Initialise ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWizard();
    initSinglePost();
    initVideoFactory();
    renderSettingsPage();
    renderReviewsPage();
    checkSeasonalContext();
    initToastListener();
    restoreSession();

    // Auto-scan for new reviews if due
    setTimeout(() => autoScanIfDue().then(result => {
        if (result && result.totalNewReviews > 0) {
            renderReviewsPage();
        }
    }), 2000);
});

// ─── Utility: Escape HTML ─────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

    if (page === 'reviews') renderReviewsPage();
    if (page === 'video') renderVideoCalendar();
}

// ─── Status Indicator ─────────────────────────────────────────
function setStatus(text, busy = false) {
    const dot = document.getElementById('status-dot');
    const textEl = document.getElementById('status-text');
    dot.classList.toggle('busy', busy);
    textEl.textContent = text;
}

// ─── Seasonal Context Check ──────────────────────────────────
function checkSeasonalContext() {
    state.seasonalContext = getSeasonalContext();
    const badgesEl = document.getElementById('wizard-badges');
    badgesEl.innerHTML = '';

    if (state.seasonalContext) {
        badgesEl.innerHTML += `<span class="badge badge-season">🏁 ${state.seasonalContext.season}</span>`;
    }

    const activeCTAs = getActiveCTAs();
    badgesEl.innerHTML += `<span class="badge badge-cta">🎯 ${activeCTAs.length} CTAs active — Race Weekend Review primary</span>`;

    // Championship calendar context
    const champCtx = getChampionshipContext();
    if (champCtx.inSeason.length > 0) {
        badgesEl.innerHTML += `<span class="badge badge-calendar">🏆 ${champCtx.inSeason.join(', ')} in season</span>`;
    }

    // Render calendar section
    renderCalendarSection(champCtx);
}

// ─── Championship Calendar UI (compact notification) ──────────
function renderCalendarSection(champCtx) {
    const container = document.getElementById('calendar-context');
    if (!container) return;

    let html = '';

    if (champCtx.hasLiveRacing) {
        const events = champCtx.currentWeekend.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(' · ');
        html = `<div class="calendar-notification calendar-live">🏁 <strong>LIVE:</strong> ${events}</div>`;
    } else if (champCtx.hasRecentResults) {
        const events = champCtx.recent.map(e => `${e.flag} ${e.championship} — ${e.name}`).join(' · ');
        html = `<div class="calendar-notification calendar-recent">📰 <strong>Results in:</strong> ${events}</div>`;
    }

    if (champCtx.hasUpcoming) {
        const next = champCtx.upcoming[0];
        const d = new Date(next.date);
        const daysUntil = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
        const dayLabel = daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`;
        html += `<div class="calendar-notification calendar-upcoming">📅 <strong>Next:</strong> ${next.flag} ${next.championship} — ${next.name} at ${next.venue} <span class="calendar-countdown">${dayLabel}</span></div>`;
    }

    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
// WEEKLY WIZARD
// ═══════════════════════════════════════════════════════════════

function initWizard() {
    renderPillarPreview();

    document.getElementById('find-topics-btn')?.addEventListener('click', handleFindTopics);
    document.getElementById('write-posts-btn')?.addEventListener('click', handleWritePosts);
    document.getElementById('back-to-step1')?.addEventListener('click', () => goToWizardStep(1));
    document.getElementById('back-to-step2')?.addEventListener('click', () => goToWizardStep(2));
    document.getElementById('export-csv-btn')?.addEventListener('click', handleExportCSV);
    document.getElementById('copy-csv-btn')?.addEventListener('click', handleCopyCSV);
    document.getElementById('generate-emails-btn')?.addEventListener('click', handleGenerateAllEmails);
}

function renderPillarPreview() {
    const container = document.getElementById('pillar-preview');
    container.innerHTML = PILLARS.map(p => `
    <div class="pillar-card" style="border-left: 3px solid ${p.color};">
      <div class="pillar-icon">${p.icon}</div>
      <div class="pillar-name">${p.name}</div>
      <div class="pillar-desc">${p.description.split('.')[0].trim()}</div>
    </div>
  `).join('');
}

function goToWizardStep(step) {
    state.wizardStep = step;

    document.querySelectorAll('.wizard-step').forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (s === step) el.classList.add('active');
        else if (s < step) el.classList.add('completed');
    });

    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`wizard-step-${i}`);
        if (el) el.classList.toggle('hidden', i !== step);
    }
}

// ─── Step 1: Find Topics ──────────────────────────────────────
async function handleFindTopics() {
    const settings = loadSettings();
    if (!settings.geminiApiKey) {
        showToast('Please add your Gemini API key in Settings first.', 'error');
        return;
    }

    const btn = document.getElementById('find-topics-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Searching web for motorcycle racing articles...', true);

    try {
        // Use the defined weekly schedule
        state.weeklyPillars = getWeeklyPillars();
        state.weeklyFrameworks = getWeeklyFrameworks();

        // Reset rotations
        resetCTARotation();
        resetAuthorityRotation();
        resetMotorsportBridgeRotation();

        // Assign CTAs from the weekly schedule
        state.weeklyCTAs = getWeeklyCTAs();
        state.weeklyAuthorities = state.weeklyPillars.map(() => getRotatingAuthority());
        state.weeklyMotorsportBridges = state.weeklyPillars.map(() => getRotatingMotorsportBridge());

        // Generate topics via AI with web search
        state.topics = await generateTopics(
            state.weeklyPillars,
            state.seasonalContext,
            settings.geminiApiKey
        );

        // Store articles for deduplication
        storeUsedArticles(state.topics);

        renderTopics();
        goToWizardStep(2);
        saveSession();
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
        const schedule = WEEKLY_SCHEDULE[i];

        return `
      <div class="topic-card" data-index="${i}">
        <div class="topic-card-header">
          <span class="pillar-badge" style="border: 1px solid ${pillar.color}30; color: ${pillar.color};">
            ${pillar.icon} ${pillar.name}
          </span>
          <span class="framework-badge">${framework.icon} ${framework.name}</span>
          ${schedule?.contentType ? `<span class="framework-badge" style="background:rgba(68,136,255,0.1);color:var(--blue);">📋 ${schedule.contentType}</span>` : ''}
          ${campaignDay ? `<span class="framework-badge">📅 ${campaignDay.day}</span>` : ''}
        </div>
        ${schedule?.fbFormat ? `<div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:0.3rem;">FB: ${schedule.fbFormat} · IG: ${schedule.igFormat}</div>` : ''}
        <div class="topic-headline">${topic.headline || 'Topic ' + (i + 1)}</div>
        ${topic.sourceArticle ? `<div class="topic-source" style="font-size:0.72rem;color:var(--blue);margin-bottom:0.4rem;padding:0.3rem 0.5rem;background:rgba(68,136,255,0.06);border-radius:var(--r-xs);">📰 ${topic.sourceArticle}</div>` : ''}
        ${topic.talkingPoints ? `
          <ul class="topic-points">
            ${topic.talkingPoints.map(tp => `<li>${tp}</li>`).join('')}
          </ul>
        ` : ''}
        ${topic.emotionalHook ? `<div class="topic-emotion">🎯 ${topic.emotionalHook}</div>` : ''}
        ${topic.racingRelevance ? `<div class="topic-motorsport" style="font-size:0.72rem;color:var(--gold);margin-top:0.3rem;padding:0.3rem 0.5rem;background:rgba(218,165,32,0.06);border-radius:var(--r-xs);">🏍️ ${topic.racingRelevance}</div>` : ''}
        ${topic.motorsportBridge ? `<div class="topic-motorsport" style="font-size:0.72rem;color:var(--gold);margin-top:0.3rem;padding:0.3rem 0.5rem;background:rgba(218,165,32,0.06);border-radius:var(--r-xs);">🏍️ ${topic.motorsportBridge}</div>` : ''}
        <textarea class="topic-edit-area" data-index="${i}" placeholder="Edit this topic or paste a different headline...">${topic.headline || ''}</textarea>
      </div>
    `;
    }).join('');

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
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings first.', 'error');
        return;
    }

    const btn = document.getElementById('write-posts-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Writing 7 Facebook/Instagram posts in parallel...', true);

    try {
        const campaignDays = state.topics.map((_, i) => i < CAMPAIGN_ARC.length ? CAMPAIGN_ARC[i] : null);

        state.posts = await generatePosts(state.topics, {
            pillars: state.weeklyPillars,
            frameworks: state.weeklyFrameworks,
            ctas: state.weeklyCTAs,
            authorityLines: state.weeklyAuthorities,
            motorsportBridges: state.weeklyMotorsportBridges,
            apiKey: settings.claudeApiKey,
            campaignDays
        });

        // Store hooks for deduplication
        storeUsedHooks(state.posts);

        renderPosts();
        goToWizardStep(3);
        saveSession();
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

        // Parse FB/IG/Image text content if present
        const hasDualPlatform = (post.content || '').includes('=== FACEBOOK POST ===');
        let fbContent = post.content || '';
        let igContent = '';
        let imageText = '';
        if (hasDualPlatform) {
            const fbMatch = post.content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
            const igMatch = post.content.match(/=== INSTAGRAM CAPTION ===([\s\S]*?)(?:=== IMAGE TEXT ===|$)/);
            const imgMatch = post.content.match(/=== IMAGE TEXT ===([\s\S]*?)$/);
            fbContent = (fbMatch?.[1] || '').trim();
            igContent = (igMatch?.[1] || '').trim();
            imageText = (imgMatch?.[1] || '').trim();
        }
        const schedule = WEEKLY_SCHEDULE[i];

        return `
      <div class="post-card ${post.imageUrl ? 'has-image' : ''}" id="post-card-${i}" data-index="${i}">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="post-number">${i + 1}</span>
            <span class="pillar-badge" style="border: 1px solid ${post.pillar.color}30; color: ${post.pillar.color};">
              ${post.pillar.icon} ${post.pillar.name}
            </span>
            <span class="framework-badge">${post.framework.icon} ${post.framework.name}</span>
            ${schedule?.contentType ? `<span class="framework-badge" style="background:rgba(68,136,255,0.1);color:var(--blue);">📋 ${schedule.contentType}</span>` : ''}
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

        ${hasDualPlatform ? `
        <div class="platform-tabs" id="platform-tabs-${i}">
          <button class="platform-tab active" data-platform="fb" onclick="window.appActions.switchPlatform(${i}, 'fb')">📘 Facebook</button>
          <button class="platform-tab" data-platform="ig" onclick="window.appActions.switchPlatform(${i}, 'ig')">📷 Instagram</button>
        </div>
        <div class="post-content platform-fb" id="post-content-${i}" data-fb="${encodeURIComponent(fbContent)}" data-ig="${encodeURIComponent(igContent)}">${escapeHtml(fbContent)}</div>
        ` : `
        <div class="post-content" id="post-content-${i}">${escapeHtml(post.content || '')}</div>
        `}

        ${(() => {
                const vf = schedule?.visualFormat ? VISUAL_FORMATS[schedule.visualFormat] : null;
                const vfAlt = schedule?.visualAlt ? VISUAL_FORMATS[schedule.visualAlt] : null;
                if (!vf) return '';
                return `
          <div class="visual-format-strip">
            <div class="visual-format-main">
              <span class="visual-format-icon">${vf.icon}</span>
              <div class="visual-format-info">
                <span class="visual-format-name">${vf.name}</span>
                <span class="visual-format-note">${schedule.visualNote}</span>
              </div>
            </div>
            ${vfAlt ? `<span class="visual-format-alt" title="${vfAlt.description}">or ${vfAlt.icon} ${vfAlt.name}</span>` : ''}
          </div>
          ${imageText ? `
          <div class="image-text-strip">
            <span class="image-text-label">📐 Image Text:</span>
            <span class="image-text-content">${escapeHtml(imageText)}</span>
            <button class="image-text-copy" onclick="navigator.clipboard.writeText('${imageText.replace(/'/g, "\\'")}');this.textContent='✓';setTimeout(()=>this.textContent='📋',1000)" title="Copy image text">📋</button>
          </div>` : ''}`;
            })()}

        <div class="post-card-footer">
          <div class="post-meta">
            <span class="word-count">${wordCount} words</span>
            <span class="pillar-badge" style="font-size:0.65rem;">${post.cta.shortName}</span>
            <span class="pillar-badge" style="font-size:0.65rem;color:var(--green);">💬 ${post.cta.triggerWord || 'REVIEW'}</span>
            ${hasDualPlatform ? '<span class="pillar-badge" style="font-size:0.65rem;color:var(--blue);">📘📷 Dual</span>' : ''}
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
            <button class="post-action-btn" onclick="window.appActions.generateEmailForPost(${i})" title="Generate HTML email on this topic" style="color:var(--gold);">📧 Email</button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const imagesCount = state.posts.filter(p => p.imageUrl).length;
    document.getElementById('export-count').textContent = `${state.posts.length} posts ready — ${imagesCount}/${state.posts.length} with images`;
    document.getElementById('export-schedule').textContent = `${firstDate.dayName} ${firstDate.dateString} → ${lastDate.dayName} ${lastDate.dateString}`;
}

// ─── Post Actions (attached to window for onclick) ────────────
window.appActions = {
    switchPlatform(index, platform) {
        const contentEl = document.getElementById(`post-content-${index}`);
        const tabsEl = document.getElementById(`platform-tabs-${index}`);
        if (!contentEl || !tabsEl) return;

        const fbContent = decodeURIComponent(contentEl.dataset.fb || '');
        const igContent = decodeURIComponent(contentEl.dataset.ig || '');

        tabsEl.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
        tabsEl.querySelector(`[data-platform="${platform}"]`)?.classList.add('active');

        contentEl.textContent = platform === 'ig' ? igContent : fbContent;
        contentEl.className = `post-content platform-${platform}`;
    },

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
            const div = document.createElement('div');
            div.className = 'post-content';
            div.id = `post-content-${index}`;
            div.textContent = post.content;
            contentEl.replaceWith(div);
            const card = document.getElementById(`post-card-${index}`);
            const wordCountEl = card?.querySelector('.word-count');
            if (wordCountEl) {
                wordCountEl.textContent = post.content.split(/\s+/).filter(w => w).length + ' words';
            }
            saveSession();
        }
    },

    async regenPost(index) {
        const settings = loadSettings();
        if (!settings.claudeApiKey) {
            showToast('Please add your Claude API key in Settings.', 'error');
            return;
        }

        const contentEl = document.getElementById(`post-content-${index}`);
        const originalContent = contentEl.textContent || contentEl.value;
        contentEl.textContent = '⏳ Regenerating...';
        setStatus('Regenerating post...', true);

        try {
            const newPost = await regeneratePost(state.posts[index], settings.claudeApiKey);
            state.posts[index] = newPost;
            renderPosts();
            saveSession();
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
        ${cta.primary ? '⭐' : '📌'} ${cta.shortName} — 💬 ${cta.triggerWord}
      </button>
    `).join('');

        picker.querySelectorAll('.cta-picker-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const ctaId = btn.dataset.ctaId;
                const newCta = CTAS.find(c => c.id === ctaId);
                if (newCta && state.posts[index]) {
                    state.posts[index].cta = newCta;
                    const content = state.posts[index].content;
                    const ctaMarker = content.indexOf('··');
                    if (ctaMarker !== -1) {
                        state.posts[index].content = content.substring(0, ctaMarker) + newCta.ctaTemplate;
                    }
                    renderPosts();
                    saveSession();
                    showToast(`CTA changed to ${newCta.shortName} — trigger: ${newCta.triggerWord}`, 'success');
                }
                picker.remove();
            });
        });

        actionsDiv.appendChild(picker);

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
        window.open('https://app.gohighlevel.com/v2/location/vdgR8teGuIgHPMPzbQkK/media-storage', '_blank');
    },

    saveImageUrl(index, btn) {
        const input = btn.previousElementSibling;
        if (input && state.posts[index]) {
            state.posts[index].imageUrl = input.value.trim();
            renderPosts();
            saveSession();
            showToast(state.posts[index].imageUrl ? 'Image URL saved — preview shown on card' : 'Image URL cleared', 'success');
        }
    },

    removeImage(index) {
        if (state.posts[index]) {
            state.posts[index].imageUrl = '';
            renderPosts();
            saveSession();
            showToast('Image removed from post', 'info');
        }
    },

    async generateEmailForPost(index) {
        const post = state.posts[index];
        if (!post) return;

        const settings = loadSettings();
        if (!settings.claudeApiKey) {
            showToast('Please add your Claude API key in Settings first.', 'error');
            return;
        }

        showToast('Generating HTML email...', 'info');
        setStatus('Generating branded email...', true);

        try {
            const emailData = await generateEmail({
                topic: post.topic,
                pillar: post.pillar,
                cta: post.cta,
                postContent: post.content,
                apiKey: settings.claudeApiKey
            });

            const emailHTML = renderEmailHTML(emailData, post.pillar);

            // Store on the post object
            post.emailData = emailData;
            post.emailHTML = emailHTML;

            showEmailModal(emailData, emailHTML, index);
            showToast('Email generated! Copy HTML and paste into GHL.', 'success');
        } catch (err) {
            showToast(`Email error: ${err.message}`, 'error');
        } finally {
            setStatus('Ready');
        }
    },

    clearSession() {
        clearSession();
    }
};

// ─── Email Preview Modal ──────────────────────────────────────
function showEmailModal(emailData, emailHTML, postIndex) {
    // Remove existing modal
    document.getElementById('email-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'email-modal';
    modal.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;
        background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;
        padding:1rem;backdrop-filter:blur(4px);
    `;

    modal.innerHTML = `
        <div style="background:var(--bg-secondary,#161B22);border:1px solid rgba(255,255,255,0.08);border-radius:12px;max-width:720px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06);">
                <div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary,#F0F6FC);">📧 Email Generated — Post ${postIndex + 1}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#8B949E);margin-top:2px;">Subject: <strong style="color:var(--gold,#DAA520);">${escapeHtml(emailData.subject)}</strong></div>
                </div>
                <button onclick="document.getElementById('email-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;padding:0.25rem;">✕</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:1rem 1.25rem;">
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
                    <button id="email-copy-html-btn" style="padding:0.5rem 1rem;background:var(--neuro-teal,#00BFA5);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">📋 Copy HTML for GHL</button>
                    <button id="email-download-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">💾 Download .html</button>
                    <button id="email-copy-subject-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">📝 Copy Subject Line</button>
                    <button id="email-send-ghl-btn" style="padding:0.5rem 1rem;background:var(--gold,#DAA520);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">🚀 Send via GHL</button>
                </div>

                <div id="ghl-send-form" style="display:none;margin-bottom:1rem;padding:0.75rem;background:rgba(218,165,32,0.06);border:1px solid rgba(218,165,32,0.15);border-radius:8px;">
                    <label style="font-size:0.75rem;font-weight:600;color:var(--gold,#DAA520);display:block;margin-bottom:0.4rem;">Recipient Email Address</label>
                    <div style="display:flex;gap:0.5rem;">
                        <input type="email" id="ghl-recipient-email" class="form-input" placeholder="rider@example.com" style="flex:1;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <input type="text" id="ghl-recipient-name" class="form-input" placeholder="Name (optional)" style="width:160px;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <button id="ghl-send-confirm-btn" style="padding:0.4rem 1rem;background:var(--green,#2EA043);color:white;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;white-space:nowrap;">✉️ Send Now</button>
                    </div>
                    <div id="ghl-send-status" style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem;"></div>
                </div>

                <div style="border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;background:#0D1117;">
                    <iframe id="email-preview-frame" style="width:100%;height:500px;border:none;"></iframe>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Load email HTML into iframe for preview
    const iframe = document.getElementById('email-preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(emailHTML);
    iframeDoc.close();

    // Button actions
    document.getElementById('email-copy-html-btn').addEventListener('click', () => {
        copyToClipboard(emailHTML);
        showToast('HTML copied! Paste into GHL Email Builder → Source Code view.', 'success');
    });

    document.getElementById('email-download-btn').addEventListener('click', () => {
        const blob = new Blob([emailHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camino-email-post-${postIndex + 1}-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Email HTML downloaded!', 'success');
    });

    document.getElementById('email-copy-subject-btn').addEventListener('click', () => {
        copyToClipboard(emailData.subject);
        showToast('Subject line copied!', 'success');
    });

    // GHL Send button — toggle the send form
    document.getElementById('email-send-ghl-btn').addEventListener('click', () => {
        const form = document.getElementById('ghl-send-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') {
            document.getElementById('ghl-recipient-email')?.focus();
        }
    });

    // GHL Send confirmation
    document.getElementById('ghl-send-confirm-btn').addEventListener('click', async () => {
        const recipientEmail = document.getElementById('ghl-recipient-email')?.value?.trim();
        const recipientName = document.getElementById('ghl-recipient-name')?.value?.trim();
        const statusEl = document.getElementById('ghl-send-status');

        if (!recipientEmail || !recipientEmail.includes('@')) {
            statusEl.innerHTML = '<span style="color:var(--accent);">Please enter a valid email address.</span>';
            return;
        }

        const settings = loadSettings();
        if (!settings.ghlToken) {
            statusEl.innerHTML = '<span style="color:var(--accent);">GHL token not configured. Go to Settings → GHL Integration.</span>';
            return;
        }

        statusEl.innerHTML = '<span style="color:var(--gold);">⏳ Upserting contact and sending email...</span>';
        document.getElementById('ghl-send-confirm-btn').disabled = true;

        try {
            const result = await dispatchEmail({
                recipientEmail,
                recipientName: recipientName || '',
                subject: emailData.subject,
                html: emailHTML,
                tags: ['nurture-email', 'rider-social-media-machine']
            });

            statusEl.innerHTML = `<span style="color:var(--green);">✅ Email sent! Contact: ${result.contactId} ${result.isNewContact ? '(new)' : '(existing)'} · Message: ${result.messageId || 'queued'}</span>`;
            showToast(`Email sent to ${recipientEmail} via GHL!`, 'success');
        } catch (err) {
            statusEl.innerHTML = `<span style="color:var(--accent);">❌ ${err.message}</span>`;
            showToast(`GHL send failed: ${err.message}`, 'error');
        } finally {
            document.getElementById('ghl-send-confirm-btn').disabled = false;
        }
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ─── Bulk Email Generation ────────────────────────────────────
async function handleGenerateAllEmails() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings first.', 'error');
        return;
    }

    if (state.posts.length === 0) {
        showToast('Generate posts first before creating emails.', 'error');
        return;
    }

    setStatus('Generating emails for all posts...', true);
    showToast('Generating emails for all posts — this may take a minute...', 'info');

    let successCount = 0;
    const emailPromises = state.posts.map(async (post, i) => {
        try {
            const emailData = await generateEmail({
                topic: post.topic,
                pillar: post.pillar,
                cta: post.cta,
                postContent: post.content,
                apiKey: settings.claudeApiKey
            });

            post.emailData = emailData;
            post.emailHTML = renderEmailHTML(emailData, post.pillar);
            successCount++;
        } catch (err) {
            console.warn(`Email generation failed for post ${i + 1}:`, err.message);
        }
    });

    await Promise.all(emailPromises);

    if (successCount > 0) {
        // Combine all emails for download
        const allEmailsHTML = state.posts
            .filter(p => p.emailHTML)
            .map((p, i) => `<!-- ═══ EMAIL ${i + 1}: ${p.emailData?.subject || 'Untitled'} ═══ -->\n\n${p.emailHTML}`)
            .join('\n\n<!-- ═══════════════════════════════════════════════ -->\n\n');

        const blob = new Blob([allEmailsHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camino-weekly-emails-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);

        showToast(`${successCount} emails generated and downloaded!`, 'success');
    } else {
        showToast('Email generation failed for all posts.', 'error');
    }

    setStatus('Ready');
}

// ─── Export CSV ────────────────────────────────────────────────
function handleExportCSV() {
    if (state.posts.length === 0) {
        showToast('No posts to export.', 'error');
        return;
    }

    const dates = getScheduleDates(state.posts.length);
    const filename = exportCSV(state.posts, dates);
    localStorage.removeItem(STORAGE_KEY);
    showToast(`Exported ${state.posts.length} posts to ${filename} — session cleared`, 'success');
}

function handleCopyCSV() {
    if (state.posts.length === 0) {
        showToast('No posts to copy.', 'error');
        return;
    }

    const dates = getScheduleDates(state.posts.length);
    const csvString = buildCSVString(state.posts, dates);
    copyToClipboard(csvString);
    showToast(`CSV data for ${state.posts.length} posts copied to clipboard! Paste into a .csv file.`, 'success');
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
        opt.textContent = `${cta.primary ? '⭐' : '📌'} ${cta.name} — 💬 ${cta.triggerWord}`;
        select.appendChild(opt);
    });

    select.addEventListener('change', () => {
        state.selectedCTA = select.value;
    });
}

async function handleGenerateSingle() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings first.', 'error');
        return;
    }

    const pillar = PILLARS.find(p => p.id === state.selectedPillar) || getRandomPillar();
    const framework = FRAMEWORKS.find(f => f.id === state.selectedFramework) || getRandomFramework();
    const cta = state.selectedCTA === 'auto' ? getRotatingCTA() : CTAS.find(c => c.id === state.selectedCTA) || getRotatingCTA();
    const authorityLine = getRotatingAuthority();
    const motorsportBridge = getRotatingMotorsportBridge();
    const topicInput = document.getElementById('single-topic')?.value.trim();
    const topic = topicInput || pillar.topics[Math.floor(Math.random() * pillar.topics.length)];

    const btn = document.getElementById('generate-single-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Generating Facebook/Instagram post...', true);

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
            motorsportBridge,
            apiKey: settings.claudeApiKey,
        });

        const post = {
            id: `single-${Date.now()}`,
            content,
            pillar,
            framework,
            cta,
            authorityLine,
            motorsportBridge,
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
            <span class="framework-badge" style="color:var(--green);">💬 ${cta.triggerWord}</span>
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

        document.getElementById('single-copy-btn')?.addEventListener('click', () => {
            copyToClipboard(post.content);
            showToast('Post copied!', 'success');
        });

        document.getElementById('single-download-btn')?.addEventListener('click', () => {
            downloadPostTxt(post, 0);
            showToast('Downloaded!', 'success');
        });

        document.getElementById('single-manus-btn')?.addEventListener('click', () => {
            window.open('https://manus.im/app/project/9nj8ezfHDDsjHV2jq4rDvG', '_blank');
        });

        document.getElementById('single-ghl-media-btn')?.addEventListener('click', () => {
            window.open('https://app.gohighlevel.com/v2/location/vdgR8teGuIgHPMPzbQkK/media-storage', '_blank');
        });

        showToast('Post generated!', 'success');
    } catch (err) {
        resultContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p>Failed to generate: ${err.message}</p>
      </div>
    `;
        showToast(`Error: ${err.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}

// ═══════════════════════════════════════════════════════════════
// VIDEO FACTORY
// ═══════════════════════════════════════════════════════════════

const videoState = {
    selectedChemical: null,
    selectedTopic: null,
    generatedScript: null
};

function initVideoFactory() {
    renderChemicalSelector();
    renderVideoTopics();
    renderVideoCalendar();

    document.getElementById('generate-video-btn')?.addEventListener('click', handleGenerateVideoScript);
}

function renderChemicalSelector() {
    const container = document.getElementById('chemical-selector');
    if (!container) return;

    let html = NEUROCHEMICALS.map(chem => `
        <div class="chemical-card ${videoState.selectedChemical === chem.id ? 'selected' : ''}"
             data-chemical="${chem.id}" style="--chem-color: ${chem.color};">
            <div class="chemical-card-icon">${chem.icon}</div>
            <div class="chemical-card-name">${chem.name}</div>
            <div class="chemical-card-nick">${chem.nickname}</div>
        </div>
    `).join('');

    // Flow Cocktail card
    html += `
        <div class="chemical-card flow-cocktail ${videoState.selectedChemical === 'flow-cocktail' ? 'selected' : ''}"
             data-chemical="flow-cocktail">
            <div class="chemical-card-icon">${FLOW_COCKTAIL.icon}</div>
            <div>
                <div class="chemical-card-name">${FLOW_COCKTAIL.name}</div>
                <div class="chemical-card-nick">5 chemicals × 4 billion bits/sec — Your signature concept</div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.chemical-card').forEach(card => {
        card.addEventListener('click', () => {
            videoState.selectedChemical = card.dataset.chemical;
            container.querySelectorAll('.chemical-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            renderVideoTopics();
        });
    });
}

function renderVideoTopics() {
    const container = document.getElementById('video-topic-list');
    if (!container) return;

    // Filter topics by selected chemical, or show all
    const topics = videoState.selectedChemical
        ? VIDEO_TOPICS.filter(t => t.chemical === videoState.selectedChemical)
        : VIDEO_TOPICS;

    if (topics.length === 0 && videoState.selectedChemical) {
        container.innerHTML = '<p style="font-size:0.72rem;color:var(--text-muted);padding:0.5rem;">No pre-made topics for this chemical. Use the custom field below.</p>';
        return;
    }

    container.innerHTML = topics.map((t, i) => {
        const chem = getChemical(t.chemical);
        const chemLabel = t.chemical === 'flow-cocktail' ? '⚡ Flow' : (chem ? `${chem.icon} ${chem.name}` : t.chemical);
        return `
            <button class="topic-pill ${videoState.selectedTopic === t.topic ? 'selected' : ''}"
                    data-topic-index="${i}" data-topic="${encodeURIComponent(t.topic)}" data-chemical="${t.chemical}">
                <span class="topic-chem-tag">${chemLabel}</span>
                ${t.topic}
            </button>
        `;
    }).join('');

    container.querySelectorAll('.topic-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            videoState.selectedTopic = decodeURIComponent(pill.dataset.topic);
            if (!videoState.selectedChemical) {
                videoState.selectedChemical = pill.dataset.chemical;
                renderChemicalSelector();
            }
            container.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            document.getElementById('custom-video-topic').value = '';
        });
    });
}

function renderVideoCalendar() {
    const container = document.getElementById('video-calendar');
    if (!container) return;

    container.innerHTML = WEEKLY_VIDEO_SCHEDULE.map(day => {
        const chemLabels = day.chemicalFocus.map(c => {
            if (c === 'flow-cocktail') return '⚡ Flow Cocktail';
            if (c === 'any') return '🎯 Any';
            const chem = getChemical(c);
            return chem ? `${chem.icon} ${chem.name}` : c;
        }).join(', ');

        return `
            <div class="video-cal-day" data-day="${day.day}">
                <div class="video-cal-day-name">${day.day}</div>
                <div class="video-cal-day-type">${day.contentType}</div>
                <div class="video-cal-day-chem">${chemLabels}</div>
                <div class="video-cal-day-length">${day.videoLength}</div>
                <div class="video-cal-day-platform">${day.platform}</div>
            </div>
        `;
    }).join('');

    // Click a calendar day to pre-fill settings
    container.querySelectorAll('.video-cal-day').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const dayName = dayEl.dataset.day;
            const schedule = WEEKLY_VIDEO_SCHEDULE.find(d => d.day === dayName);
            if (!schedule) return;

            // Set video settings
            const lengthEl = document.getElementById('video-length');
            const platformEl = document.getElementById('video-platform');
            const formatEl = document.getElementById('video-format');

            if (lengthEl) lengthEl.value = schedule.videoLength;
            if (platformEl) platformEl.value = schedule.platform;
            if (formatEl) formatEl.value = schedule.outputFormat;

            // Set chemical if specific
            const firstChem = schedule.chemicalFocus[0];
            if (firstChem && firstChem !== 'any') {
                videoState.selectedChemical = firstChem;
                renderChemicalSelector();
                renderVideoTopics();
            }

            showToast(`${dayName} settings loaded: ${schedule.contentType}`, 'info');
        });
    });
}

async function handleGenerateVideoScript() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings first.', 'error');
        return;
    }

    // Get topic from custom field or selected topic
    const customTopic = document.getElementById('custom-video-topic')?.value?.trim();
    const topic = customTopic || videoState.selectedTopic;

    if (!topic) {
        showToast('Please select or type a video topic.', 'error');
        return;
    }

    if (!videoState.selectedChemical) {
        showToast('Please select a neurochemical focus.', 'error');
        return;
    }

    const btn = document.getElementById('generate-video-btn');
    const output = document.getElementById('video-output');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Generating video script with neurochemistry layer...', true);

    output.innerHTML = `
        <div class="video-script-card">
            <div class="video-script-body" style="text-align:center;padding:3rem;">
                <div style="font-size:2rem;margin-bottom:1rem;">🧪</div>
                <div style="color:var(--neuro-teal);font-weight:600;">Generating video script...</div>
                <div style="color:var(--text-muted);font-size:0.75rem;margin-top:0.5rem;">Building neurochemistry layer + slide deck brief + HeyGen notes</div>
            </div>
        </div>
    `;

    try {
        const videoLength = document.getElementById('video-length')?.value || '45-60s';
        const platform = document.getElementById('video-platform')?.value || 'FB Reel + IG Reel';
        const outputFormat = document.getElementById('video-format')?.value || '9:16';

        const scriptContent = await generateVideoScript({
            topic,
            chemicalId: videoState.selectedChemical,
            videoLength,
            platform,
            outputFormat,
            apiKey: settings.claudeApiKey,
        });

        videoState.generatedScript = scriptContent;
        renderVideoOutput(scriptContent, topic);
        showToast('Video script generated! Copy the script and slide deck brief.', 'success');
    } catch (err) {
        output.innerHTML = `
            <div class="video-script-card" style="border-color: rgba(232,68,68,0.3);">
                <div class="video-script-body" style="text-align:center;padding:2rem;">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">⚠️</div>
                    <div style="color:var(--racing-red);">${escapeHtml(err.message)}</div>
                </div>
            </div>
        `;
        showToast(`Error: ${err.message}`, 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}

function renderVideoOutput(scriptContent, topic) {
    const output = document.getElementById('video-output');
    const isFlowCocktail = videoState.selectedChemical === 'flow-cocktail';
    const chem = isFlowCocktail ? null : getChemical(videoState.selectedChemical);
    const chemIcon = isFlowCocktail ? FLOW_COCKTAIL.icon : (chem?.icon || '🧪');
    const chemName = isFlowCocktail ? FLOW_COCKTAIL.name : (chem?.name || 'Unknown');
    const chemNick = isFlowCocktail ? '5 chemicals firing together' : (chem?.nickname || '');

    // Parse sections from the script content
    const sections = [];
    const sectionPatterns = [
        { id: 'script', label: '🎬 Video Script', pattern: /=== VIDEO SCRIPT ===([\s\S]*?)(?:=== SLIDE DECK|$)/ },
        { id: 'slides', label: '📊 Slide Deck Brief (Manus)', pattern: /=== SLIDE DECK BRIEF.*?===([\s\S]*?)(?:=== HEYGEN|$)/ },
        { id: 'heygen', label: '🎥 HeyGen Notes', pattern: /=== HEYGEN NOTES ===([\s\S]*?)(?:=== SOCIAL|$)/ },
        { id: 'caption', label: '📱 Social Caption', pattern: /=== SOCIAL CAPTION ===([\s\S]*?)$/ }
    ];

    for (const sp of sectionPatterns) {
        const match = scriptContent.match(sp.pattern);
        if (match && match[1]?.trim()) {
            sections.push({ id: sp.id, label: sp.label, content: match[1].trim() });
        }
    }

    // If no sections parsed, show raw content
    if (sections.length === 0) {
        sections.push({ id: 'raw', label: '🎬 Full Script', content: scriptContent });
    }

    const sectionsHtml = sections.map(s => `
        <div class="video-script-section">
            <div class="video-script-section-label">${s.label}</div>
            <div class="video-script-section-content">${escapeHtml(s.content)}</div>
        </div>
    `).join('');

    output.innerHTML = `
        <div class="video-script-card">
            <div class="video-script-header">
                <div class="video-script-header-left">
                    <span class="video-script-chem-icon">${chemIcon}</span>
                    <div>
                        <div class="video-script-title">${chemName}</div>
                        <div class="video-script-subtitle">${chemNick}</div>
                    </div>
                </div>
                <div class="video-script-header-right">
                    <button class="post-action-btn" onclick="window.videoActions.copyScript()" title="Copy full script">📋 Copy Script</button>
                    <button class="post-action-btn" onclick="window.videoActions.copySlides()" title="Copy slide deck brief">📊 Copy Slides</button>
                    <button class="post-action-btn" onclick="window.videoActions.copyCaption()" title="Copy social caption">📱 Copy Caption</button>
                    <button class="post-action-btn" onclick="window.videoActions.openManus()" title="Open Manus to build slides" style="color:var(--purple);">🎨 Open Manus</button>
                    <button class="post-action-btn" onclick="window.videoActions.sendToManus()" title="Auto-generate slides via Manus API" style="color:var(--neuro-teal);">📊 Send to Manus</button>
                    <button class="post-action-btn" onclick="window.videoActions.runPipeline()" title="Auto-produce: Manus slides → HeyGen video" style="color:var(--gold);font-weight:600;">🚀 Auto-Produce</button>
                </div>
            </div>
            <div class="video-script-body">
                ${sectionsHtml}

                <div class="production-steps">
                    <div class="production-step">
                        <div class="production-step-number">1</div>
                        <div class="production-step-tool">Claude</div>
                        <div class="production-step-desc">Script + slide brief ✅</div>
                    </div>
                    <div class="production-step-connector">→</div>
                    <div class="production-step">
                        <div class="production-step-number">2</div>
                        <div class="production-step-tool">Manus</div>
                        <div class="production-step-desc">Build 5-8 slide deck</div>
                    </div>
                    <div class="production-step-connector">→</div>
                    <div class="production-step">
                        <div class="production-step-number">3</div>
                        <div class="production-step-tool">HeyGen</div>
                        <div class="production-step-desc">Avatar + voice overlay</div>
                    </div>
                </div>
                <div id="pipeline-live-status"></div>
            </div>
        </div>
    `;
}

// Video Factory actions
window.videoActions = {
    copyScript() {
        if (videoState.generatedScript) {
            const match = videoState.generatedScript.match(/=== VIDEO SCRIPT ===([\s\S]*?)(?:=== SLIDE DECK|$)/);
            const text = match ? match[1].trim() : videoState.generatedScript;
            copyToClipboard(text);
            showToast('Video script copied!', 'success');
        }
    },
    copySlides() {
        if (videoState.generatedScript) {
            const match = videoState.generatedScript.match(/=== SLIDE DECK BRIEF.*?===([\s\S]*?)(?:=== HEYGEN|$)/);
            if (match) {
                copyToClipboard(match[1].trim());
                showToast('Slide deck brief copied — paste into Manus!', 'success');
            }
        }
    },
    copyCaption() {
        if (videoState.generatedScript) {
            const match = videoState.generatedScript.match(/=== SOCIAL CAPTION ===([\s\S]*?)$/);
            if (match) {
                copyToClipboard(match[1].trim());
                showToast('Social caption copied!', 'success');
            }
        }
    },
    openManus() {
        window.open('https://manus.im/app/project/9nj8ezfHDDsjHV2jq4rDvG', '_blank');
    },

    async sendToManus() {
        if (!videoState.generatedScript) {
            showToast('Generate a video script first.', 'error');
            return;
        }

        const slideBriefMatch = videoState.generatedScript.match(/=== SLIDE DECK BRIEF.*?===([\s\S]*?)(?:=== HEYGEN|$)/);
        if (!slideBriefMatch) {
            showToast('No slide deck brief found in the script.', 'error');
            return;
        }

        setStatus('Sending slide brief to Manus AI...', true);
        try {
            const result = await createManusSlideTask(
                slideBriefMatch[1].trim(),
                videoState.selectedTopic || 'Video Slide Deck'
            );
            showToast(`Manus task created (ID: ${result.taskId}). Slides being built — check Manus dashboard.`, 'success');
            renderPipelineStatus();
        } catch (err) {
            showToast(`Manus error: ${err.message}`, 'error');
        } finally {
            setStatus('Ready');
        }
    },

    async runPipeline() {
        if (!videoState.generatedScript) {
            showToast('Generate a video script first.', 'error');
            return;
        }

        const settings = loadSettings();
        if (!settings.manusApiKey && !settings.heygenApiKey) {
            showToast('Configure Manus and/or HeyGen API keys in Settings first.', 'error');
            return;
        }

        setStatus('Running full production pipeline...', true);
        const statusEl = document.getElementById('pipeline-live-status');

        try {
            const result = await runFullPipeline({
                script: videoState.generatedScript,
                topic: videoState.selectedTopic || 'Video',
                onProgress: ({ step, total, message, warning }) => {
                    setStatus(`Pipeline step ${step}/${total}: ${message}`, true);
                    if (statusEl) {
                        statusEl.innerHTML = `
                            <div class="pipeline-progress" style="margin-top:1rem;padding:0.75rem;background:rgba(${warning ? '218,165,32' : '0,191,165'},0.08);border:1px solid rgba(${warning ? '218,165,32' : '0,191,165'},0.2);border-radius:var(--r-sm);">
                                <div style="color:var(--${warning ? 'gold' : 'neuro-teal'});font-size:0.8rem;font-weight:600;">Step ${step}/${total}</div>
                                <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.25rem;">${message}</div>
                            </div>
                        `;
                    }
                }
            });

            const parts = [];
            if (result.manusTaskId) parts.push(`Manus: ${result.manusTaskId}`);
            if (result.heygenVideoId) parts.push(`HeyGen: ${result.heygenVideoId}`);
            showToast(`Pipeline complete! ${parts.join(' · ')}`, 'success');
            renderPipelineStatus();
        } catch (err) {
            showToast(`Pipeline error: ${err.message}`, 'error');
        } finally {
            setStatus('Ready');
        }
    }
};

// Pipeline status renderer
function renderPipelineStatus() {
    const jobs = getRecentPipelineJobs();
    if (jobs.length === 0) return;

    let container = document.getElementById('pipeline-jobs');
    if (!container) {
        const output = document.getElementById('video-output');
        if (!output) return;
        container = document.createElement('div');
        container.id = 'pipeline-jobs';
        container.style.cssText = 'margin-top:1.5rem;';
        output.after(container);
    }

    const statusIcons = {
        processing: '⏳',
        rendering: '🎬',
        completed: '✅',
        done: '✅',
        failed: '❌',
        error: '❌'
    };

    container.innerHTML = `
        <div style="font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:0.75rem;">🏭 Production Pipeline Jobs</div>
        ${jobs.slice(0, 5).map(job => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.75rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--r-sm);margin-bottom:0.4rem;">
                <span style="font-size:1.1rem;">${statusIcons[job.status] || '⏳'}</span>
                <div style="flex:1;">
                    <div style="font-size:0.75rem;font-weight:500;color:var(--text-primary);">${job.type === 'manus-slides' ? '📊 Manus Slides' : job.type === 'heygen-video' ? '🎬 HeyGen Video' : job.type === 'canva-image' ? '🖼️ Canva Image' : '🚀 Pipeline'}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);">${job.topic || ''} · ${new Date(job.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span style="font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:var(--r-xs);background:rgba(${job.status === 'completed' || job.status === 'done' ? '0,191,165' : job.status === 'failed' || job.status === 'error' ? '232,68,68' : '218,165,32'},0.12);color:var(--${job.status === 'completed' || job.status === 'done' ? 'green' : job.status === 'failed' || job.status === 'error' ? 'accent' : 'gold'});">${job.status}</span>
                ${job.videoUrl ? `<a href="${job.videoUrl}" target="_blank" style="font-size:0.7rem;color:var(--blue);text-decoration:none;">▶ Watch</a>` : ''}
            </div>
        `).join('')}
    `;
}

// ═══════════════════════════════════════════════════════════════
// REVIEWS PLAYBOOK PAGE
// ═══════════════════════════════════════════════════════════════

function renderReviewsPage() {
    const container = document.getElementById('reviews-content');
    if (!container) return;

    const stats = REVIEW_STATS;
    const scannerStatus = getScannerStatus();
    const pendingReviews = getPendingReviews();
    const scanHistory = getScanHistory();

    // Build scanner dashboard HTML
    const lastScanLabel = scannerStatus.lastScanDate
        ? `${scannerStatus.daysSinceLastScan === 0 ? 'Today' : scannerStatus.daysSinceLastScan + ' days ago'} (${new Date(scannerStatus.lastScanDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`
        : 'Never';

    const scanStatusColor = scannerStatus.isDue ? 'var(--accent)' : 'var(--green)';
    const scanStatusText = scannerStatus.isDue ? '⚠️ Scan overdue' : '✅ Up to date';

    const pendingHTML = pendingReviews.length > 0 ? pendingReviews.map(r => {
        const cats = (r.categories || []).map(c => `<span class="pillar-badge" style="font-size:0.6rem;background:rgba(68,136,255,0.1);color:var(--blue);">${escapeHtml(c)}</span>`).join('');
        return `<div class="topic-card" style="cursor:default;border-left:3px solid var(--gold);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.3rem;">
                <div>
                    <span style="font-weight:600;font-size:0.8rem;">${escapeHtml(r.name)}</span>
                    <span style="font-size:0.65rem;color:var(--text-muted);margin-left:0.5rem;">${r.source === 'trustpilot' ? '⭐ Trustpilot' : '🔍 Google'} · ${r.date ? new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown date'}</span>
                </div>
                <span class="badge badge-accent" style="font-size:0.6rem;">🆕 NEW</span>
            </div>
            ${r.title ? `<div style="font-size:0.75rem;font-weight:600;margin-bottom:0.25rem;">${escapeHtml(r.title)}</div>` : ''}
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.4rem;">${escapeHtml(r.text)}</div>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-bottom:0.4rem;">${cats}</div>
            <div style="display:flex;gap:0.5rem;">
                <button class="btn btn-sm btn-primary review-approve-btn" data-fp="${escapeHtml(r.fingerprint)}">✅ Approve & Add to Bank</button>
                <button class="btn btn-sm btn-secondary review-dismiss-btn" data-fp="${escapeHtml(r.fingerprint)}">✕ Dismiss</button>
            </div>
        </div>`;
    }).join('') : '<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.8rem;">No new reviews found. Click Scan Now to check.</div>';

    const historyHTML = scanHistory.slice(0, 5).map(h => {
        const d = new Date(h.date);
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.72rem;">
            <span style="color:var(--text-muted);">${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            <span>TP: ${h.trustpilotCount || '?'} · Google: ${h.googleCount || '?'}</span>
            <span style="color:${h.newFound > 0 ? 'var(--gold)' : 'var(--text-muted)'};">${h.newFound > 0 ? '🆕 ' + h.newFound + ' new' : 'No new'}</span>
            ${h.errors > 0 ? '<span style="color:var(--accent);font-size:0.65rem;">⚠️</span>' : ''}
        </div>`;
    }).join('') || '<div style="padding:0.5rem;text-align:center;color:var(--text-muted);font-size:0.75rem;">No scan history yet</div>';

    const scannerDashboardHTML = `
    <div class="control-card" style="margin-bottom:1.5rem;border:1px solid ${scannerStatus.isDue ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.15)'};">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <h3 style="margin:0;">🔍 Weekly Review Scanner</h3>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span style="font-size:0.75rem;color:${scanStatusColor};font-weight:600;">${scanStatusText}</span>
          <button class="btn btn-primary" id="scan-now-btn" style="padding:0.4rem 1rem;font-size:0.8rem;">
            🔍 Scan Now
          </button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.75rem;margin-bottom:1rem;">
        <div style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);">
          <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Last Scan</div>
          <div style="font-size:0.8rem;font-weight:600;margin-top:0.2rem;">${lastScanLabel}</div>
        </div>
        <div style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);">
          <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Scan Interval</div>
          <div style="font-size:0.8rem;font-weight:600;margin-top:0.2rem;">Every ${scannerStatus.scanIntervalDays} days</div>
        </div>
        <div style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);">
          <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Pending</div>
          <div style="font-size:0.8rem;font-weight:600;margin-top:0.2rem;color:${pendingReviews.length > 0 ? 'var(--gold)' : 'var(--text-muted)'};">${pendingReviews.length} review${pendingReviews.length !== 1 ? 's' : ''}</div>
        </div>
        <div style="text-align:center;padding:0.5rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);">
          <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Auto-Scan</div>
          <div style="font-size:0.8rem;font-weight:600;margin-top:0.2rem;">
            <label class="toggle-switch" style="display:inline-flex;">
              <input type="checkbox" id="auto-scan-toggle" ${scannerStatus.autoScanEnabled ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div id="scan-progress" style="display:none;padding:0.5rem 0.75rem;background:rgba(68,136,255,0.08);border-radius:var(--r-xs);margin-bottom:0.75rem;font-size:0.75rem;color:var(--blue);">
        <span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.4rem;"></span>
        <span id="scan-progress-text">Scanning...</span>
      </div>
      ${pendingReviews.length > 0 ? `
      <div style="margin-bottom:1rem;">
        <h4 style="font-size:0.8rem;color:var(--gold);margin-bottom:0.5rem;">🆕 New Reviews Found (${pendingReviews.length})</h4>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">${pendingHTML}</div>
      </div>` : ''}
      <details>
        <summary style="cursor:pointer;font-size:0.75rem;color:var(--blue);font-weight:600;">Scan History (${scanHistory.length} scans)</summary>
        <div style="margin-top:0.5rem;">${historyHTML}</div>
      </details>
    </div>`;

    // Build authority lines HTML
    const authorityHTML = REVIEW_AUTHORITY_LINES.map(line => {
        const safeLine = escapeHtml(line);
        return `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.75rem;background:rgba(218,165,32,0.06);border-radius:var(--r-xs);border-left:3px solid var(--gold);">
            <span style="flex:1;font-size:0.8rem;">${safeLine}</span>
            <button class="post-action-btn review-copy-btn" data-copy="${safeLine}" style="padding:0.25rem 0.5rem;" title="Copy">📋</button>
        </div>`;
    }).join('');

    // Build quoted hooks HTML
    const hooksHTML = QUOTED_HOOKS.map(hook => {
        const pillarBadges = hook.pillars.map(p => {
            const pillar = PILLARS.find(pl => pl.id === p);
            if (!pillar) return '';
            return `<span class="pillar-badge" style="font-size:0.6rem;border:1px solid ${pillar.color}30;color:${pillar.color};">${pillar.icon} ${pillar.name}</span>`;
        }).join('');

        return `<div class="topic-card" style="cursor:default;">
            <div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:0.35rem;">
                ${escapeHtml(hook.reviewer)} · ${hook.country} · ${hook.date} · ${hook.source === 'trustpilot' ? '⭐ Trustpilot' : '🔍 Google'}
            </div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:0.4rem;font-style:italic;">"${escapeHtml(hook.quote)}"</div>
            <div style="font-size:0.72rem;color:var(--gold);margin-bottom:0.3rem;">🎯 ${escapeHtml(hook.hookAngle)}</div>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;">${pillarBadges}</div>
            <button class="post-action-btn review-copy-btn" style="margin-top:0.4rem;" data-copy="&quot;${escapeHtml(hook.quote)}&quot; - ${escapeHtml(hook.reviewer)}">📋 Copy Hook</button>
        </div>`;
    }).join('');

    // Build objection killers HTML
    const objectionHTML = Object.entries(OBJECTION_KILLERS).map(([type, killers]) => {
        const label = type === 'triedEverything' ? '"Tried Everything"' : type === 'worthTheMoney' ? '"Worth the Money"' : '"Sceptical"';
        const items = killers.map(k => `<div style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0.75rem;margin-bottom:0.4rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);border-left:2px solid var(--green);">
            <div style="flex:1;">
                <div style="font-size:0.8rem;font-style:italic;">"${escapeHtml(k.quote)}"</div>
                <div style="font-size:0.65rem;color:var(--text-muted);margin-top:0.2rem;">${escapeHtml(k.reviewer)} — ${escapeHtml(k.context)}</div>
            </div>
        </div>`).join('');
        return `<div style="margin-bottom:1rem;">
            <h4 style="font-size:0.8rem;color:var(--gold);margin-bottom:0.5rem;">${label}</h4>
            ${items}
        </div>`;
    }).join('');

    // Build carousel concepts HTML
    const carouselHTML = CAROUSEL_CONCEPTS.map(c => {
        const slides = c.slides.map(s => {
            const label = s.type === 'hook' ? '📌 Hook' : s.type === 'review' ? '💬 ' + escapeHtml(s.reviewer || '') : s.type === 'data' ? '📊 Data' : '🎯 CTA';
            return `<div style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0.5rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);font-size:0.72rem;">
                <span style="font-weight:600;color:var(--gold);min-width:5rem;">${label}</span>
                <span>${escapeHtml(s.text)}</span>
            </div>`;
        }).join('');
        return `<div class="topic-card" style="cursor:default;">
            <div style="font-size:0.9rem;font-weight:700;margin-bottom:0.5rem;">${escapeHtml(c.title)}</div>
            <div style="display:flex;flex-direction:column;gap:0.3rem;">${slides}</div>
        </div>`;
    }).join('');

    // Build Trustpilot reviews HTML
    const tpReviewsHTML = TRUSTPILOT_REVIEWS.map(r => `<div style="padding:0.5rem 0.75rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);border-left:2px solid var(--gold);">
        <div style="font-size:0.65rem;color:var(--text-muted);">${escapeHtml(r.name)} · ${r.country} · ${r.date}</div>
        <div style="font-size:0.75rem;font-weight:600;margin:0.15rem 0;">${escapeHtml(r.title)}</div>
        <div style="font-size:0.72rem;color:var(--text-secondary);">${escapeHtml(r.text)}</div>
    </div>`).join('');

    // Build Google reviews HTML
    const googleReviewsHTML = GOOGLE_REVIEWS.filter(r => r.text).map(r => `<div style="padding:0.5rem 0.75rem;background:rgba(255,255,255,0.03);border-radius:var(--r-xs);border-left:2px solid var(--blue);">
        <div style="font-size:0.65rem;color:var(--text-muted);">${escapeHtml(r.name)} · ${r.date}</div>
        <div style="font-size:0.72rem;color:var(--text-secondary);">${escapeHtml(r.text)}</div>
    </div>`).join('');

    container.innerHTML = `
    ${scannerDashboardHTML}
    <div class="review-stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem;">
      <div class="control-card" style="text-align:center;">
        <div style="font-size:2.5rem;font-weight:800;color:var(--gold);">${stats.trustpilot.rating}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);">Trustpilot Rating</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">${stats.trustpilot.count} reviews</div>
      </div>
      <div class="control-card" style="text-align:center;">
        <div style="font-size:2.5rem;font-weight:800;color:var(--blue);">${stats.google.rating}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);">Google Rating</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">${stats.google.count} reviews</div>
      </div>
      <div class="control-card" style="text-align:center;">
        <div style="font-size:2.5rem;font-weight:800;color:var(--green);">${stats.combined.totalReviews}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);">Total Reviews</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">100% five-star</div>
      </div>
      <div class="control-card" style="text-align:center;">
        <div style="font-size:2.5rem;font-weight:800;color:var(--accent);">12</div>
        <div style="font-size:0.8rem;color:var(--text-muted);">Countries</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">UK, US, NZ, AU, NL, IT, IE, MY +4</div>
      </div>
    </div>

    <div class="control-card" style="margin-bottom:1.5rem;">
      <h3 style="margin-bottom:0.75rem;">🎯 Authority Anchor Lines</h3>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">${authorityHTML}</div>
    </div>

    <div class="control-card" style="margin-bottom:1.5rem;">
      <h3 style="margin-bottom:0.75rem;">💬 Pre-Approved Quoted Hooks</h3>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;">Use as opening hook in quotation marks. Build teaching content around the theme. Use ~1 in 4 posts.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:0.75rem;">${hooksHTML}</div>
    </div>

    <div class="control-card" style="margin-bottom:1.5rem;">
      <h3 style="margin-bottom:0.75rem;">🛡️ Objection Killers</h3>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;">Embed in CTA bridge section when addressing scepticism, cost, or "tried everything" objections.</p>
      ${objectionHTML}
    </div>

    <div class="control-card" style="margin-bottom:1.5rem;">
      <h3 style="margin-bottom:0.75rem;">📱 Review-Driven Carousel Concepts</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0.75rem;">${carouselHTML}</div>
    </div>

    <div class="control-card" style="margin-bottom:1.5rem;">
      <h3 style="margin-bottom:0.75rem;">📤 Trustpilot Links</h3>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
        <a href="${stats.trustpilot.url}" target="_blank" class="btn btn-secondary" style="text-decoration:none;">⭐ View Reviews Page</a>
        <a href="${stats.trustpilot.evaluateUrl}" target="_blank" class="btn btn-secondary" style="text-decoration:none;">✏️ Leave a Review</a>
        <button class="btn btn-secondary" id="review-request-btn">📋 Copy Review Request</button>
      </div>
    </div>

    <div class="control-card">
      <h3 style="margin-bottom:0.75rem;">📚 All Reviews (${stats.trustpilot.count} Trustpilot + ${stats.google.count} Google)</h3>
      <details style="margin-bottom:0.75rem;">
        <summary style="cursor:pointer;font-size:0.8rem;color:var(--blue);font-weight:600;">Show All Trustpilot Reviews (${stats.trustpilot.count})</summary>
        <div style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.5rem;max-height:500px;overflow-y:auto;">${tpReviewsHTML}</div>
      </details>
      <details>
        <summary style="cursor:pointer;font-size:0.8rem;color:var(--blue);font-weight:600;">Show All Google Reviews (${stats.google.count})</summary>
        <div style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.5rem;max-height:500px;overflow-y:auto;">${googleReviewsHTML}</div>
      </details>
    </div>`;

    // Attach copy handlers
    container.querySelectorAll('.review-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = '✓ Copied';
                setTimeout(() => btn.textContent = orig, 1000);
            });
        });
    });

    // Review request button
    document.getElementById('review-request-btn')?.addEventListener('click', () => {
        const name = window.prompt('Rider name:');
        if (name) {
            const msg = getReviewRequestTemplate(name);
            navigator.clipboard.writeText(msg).then(() => {
                showToast('Review request copied!', 'success');
            });
        }
    });

    // Scan Now button
    document.getElementById('scan-now-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('scan-now-btn');
        const progress = document.getElementById('scan-progress');
        const progressText = document.getElementById('scan-progress-text');

        btn.disabled = true;
        btn.textContent = '⏳ Scanning...';
        if (progress) progress.style.display = 'block';

        try {
            const result = await runReviewScan((msg) => {
                if (progressText) progressText.textContent = msg;
            });

            if (result.totalNewReviews > 0) {
                showToast(`🆕 ${result.totalNewReviews} new review(s) found!`, 'success');
            } else if (result.errors.length > 0) {
                showToast(`Scan completed with ${result.errors.length} error(s). ${result.errors[0]}`, 'error');
            } else {
                showToast('✅ Scan complete — no new reviews found.', 'info');
            }
        } catch (err) {
            showToast(`Scan failed: ${err.message}`, 'error');
        }

        // Re-render the page to show updated state
        renderReviewsPage();
    });

    // Auto-scan toggle
    document.getElementById('auto-scan-toggle')?.addEventListener('change', (e) => {
        updateScannerSettings({ autoScanEnabled: e.target.checked });
        showToast(e.target.checked ? 'Auto-scan enabled (weekly)' : 'Auto-scan disabled', 'info');
    });

    // Approve / Dismiss buttons
    container.querySelectorAll('.review-approve-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fp = btn.dataset.fp;
            const review = approveNewReview(fp);
            if (review) {
                showToast(`✅ Review by ${review.name} approved and added to known bank!`, 'success');
                renderReviewsPage();
            }
        });
    });

    container.querySelectorAll('.review-dismiss-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fp = btn.dataset.fp;
            if (dismissNewReview(fp)) {
                showToast('Review dismissed.', 'info');
                renderReviewsPage();
            }
        });
    });
}
