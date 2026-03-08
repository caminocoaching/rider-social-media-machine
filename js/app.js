// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — Main App
// Apple-style "Remote Control" interface
// 2 modes, 1 button. The complexity is in the engine.
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
    currentPage: 'weekly',
    stories: [],    // Raw story cards from AI research
    topics: [],     // Structured topics with pillars/frameworks assigned
    posts: [],      // Generated posts
    weeklyPillars: [],
    weeklyFrameworks: [],
    weeklyCTAs: [],
    weeklyAuthorities: [],
    weeklyMotorsportBridges: [],
    seasonalContext: null
};

const STORAGE_KEY = 'riderSocialMedia_session';

// ─── Auto-Save / Restore ──────────────────────────────────────
function saveSession() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            stories: state.stories,
            topics: state.topics,
            posts: state.posts,
            weeklyPillars: state.weeklyPillars,
            weeklyFrameworks: state.weeklyFrameworks,
            weeklyCTAs: state.weeklyCTAs,
            weeklyAuthorities: state.weeklyAuthorities,
            weeklyMotorsportBridges: state.weeklyMotorsportBridges,
            seasonalContext: state.seasonalContext,
            timestamp: Date.now()
        }));
    } catch (e) { console.warn('Save failed:', e); }
}

function restoreSession() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!saved) return;

        // Expire sessions older than 3 days
        if (saved.timestamp && Date.now() - saved.timestamp > 3 * 86400000) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        Object.assign(state, {
            stories: saved.stories || [],
            topics: saved.topics || [],
            posts: saved.posts || [],
            weeklyPillars: saved.weeklyPillars || [],
            weeklyFrameworks: saved.weeklyFrameworks || [],
            weeklyCTAs: saved.weeklyCTAs || [],
            weeklyAuthorities: saved.weeklyAuthorities || [],
            weeklyMotorsportBridges: saved.weeklyMotorsportBridges || [],
            seasonalContext: saved.seasonalContext || null
        });

        // Restore UI state
        if (state.posts.length > 0) {
            renderStoryCards();
            renderPosts();
            showContainer('posts-container');
        } else if (state.stories.length > 0) {
            renderStoryCards();
            showContainer('stories-container');
        }
    } catch (e) { console.warn('Restore failed:', e); }
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    state.stories = [];
    state.topics = [];
    state.posts = [];
    state.weeklyPillars = [];
    state.weeklyFrameworks = [];
    state.weeklyCTAs = [];
    state.weeklyAuthorities = [];
    state.weeklyMotorsportBridges = [];

    // Reset UI
    document.getElementById('stories-container')?.classList.add('hidden');
    document.getElementById('posts-container')?.classList.add('hidden');
    showToast('Session cleared — ready for a fresh week!', 'success');
}


// ─── Initialise ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWeeklyMode();
    initSinglePost();
    renderSettingsPage();
    checkSeasonalContext();
    restoreSession();
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
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


// ─── Navigation (2 modes + settings) ──────────────────────────
function initNavigation() {
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', () => switchPage(link.dataset.page));
    });
}

function switchPage(page) {
    state.currentPage = page;
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`)?.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const pageMap = { weekly: 'weekly-page', single: 'single-page', settings: 'settings-page' };
    document.getElementById(pageMap[page])?.classList.add('active');
}


// ─── Status Indicator ─────────────────────────────────────────
function setStatus(text, busy = false) {
    const dot = document.getElementById('status-dot');
    const label = document.getElementById('status-text');
    if (label) label.textContent = text;
    if (dot) dot.className = `status-dot ${busy ? 'busy' : ''}`;
}


// ─── UI Helpers ───────────────────────────────────────────────
function showContainer(id) {
    ['stories-container', 'posts-container'].forEach(cid => {
        document.getElementById(cid)?.classList.add('hidden');
    });
    document.getElementById(id)?.classList.remove('hidden');
}


// ─── Seasonal Context Check ──────────────────────────────────
function checkSeasonalContext() {
    state.seasonalContext = getSeasonalContext();
    const champCtx = getChampionshipContext();
    if (champCtx) renderCalendarSection(champCtx);
}

function renderCalendarSection(champCtx) {
    const el = document.getElementById('calendar-context');
    if (!el) return;

    let html = '';
    if (champCtx.liveThisWeekend?.length > 0) {
        const events = champCtx.liveThisWeekend.map(e => `${e.flag} ${e.champName} at ${e.venue}`).join(' · ');
        html += `<div class="calendar-badge live">🏁 LIVE: ${events}</div>`;
    }
    if (champCtx.nextEvent) {
        const ne = champCtx.nextEvent;
        const daysText = ne.daysUntil <= 7 ? `<span class="days-count">IN ${ne.daysUntil} DAYS</span>` : '';
        html += `<div class="calendar-badge next">📅 Next: ${ne.flag} ${ne.champName} — ${ne.eventName} at ${ne.venue} ${daysText}</div>`;
    }
    el.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════════
// MODE 1: THIS WEEK'S 7
// ═══════════════════════════════════════════════════════════════

function initWeeklyMode() {
    document.getElementById('find-stories-btn')?.addEventListener('click', handleFindStories);
    document.getElementById('write-all-btn')?.addEventListener('click', handleWriteAll);
    document.getElementById('export-csv-btn')?.addEventListener('click', handleExportCSV);
    document.getElementById('copy-csv-btn')?.addEventListener('click', handleCopyCSV);
    document.getElementById('generate-emails-btn')?.addEventListener('click', handleGenerateAllEmails);
    document.getElementById('clear-session-btn')?.addEventListener('click', clearSession);

    // Delegated click handler for article preview popups
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.article-preview-link');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
            const url = link.dataset.url || '';
            const title = link.dataset.title || '';
            if (url) {
                openArticleModal(url, title);
            } else {
                showToast('No article URL available for this story.', 'info');
            }
        }
    });
}


// ─── Step 1: Find Stories ─────────────────────────────────────
async function handleFindStories() {
    const settings = loadSettings();
    if (!settings.geminiApiKey) {
        showToast('Please add your Gemini API key in Settings ⚙️ first.', 'error');
        return;
    }

    const btn = document.getElementById('find-stories-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('🔍 Searching the web for interesting stories...', true);

    try {
        // AI decides all the assignments
        state.weeklyPillars = getWeeklyPillars();
        state.weeklyFrameworks = getWeeklyFrameworks();
        resetCTARotation();
        resetAuthorityRotation();
        resetMotorsportBridgeRotation();
        state.weeklyCTAs = getWeeklyCTAs();
        state.weeklyAuthorities = state.weeklyPillars.map(() => getRotatingAuthority());
        state.weeklyMotorsportBridges = state.weeklyPillars.map(() => getRotatingMotorsportBridge());

        // Generate topics via Gemini web search
        state.topics = await generateTopics(
            state.weeklyPillars,
            state.seasonalContext,
            settings.geminiApiKey
        );

        // Store articles for deduplication
        storeUsedArticles(state.topics);

        // Build story cards from topics + auto-assigned metadata
        state.stories = state.topics.map((topic, i) => ({
            ...topic,
            pillar: state.weeklyPillars[i],
            framework: state.weeklyFrameworks[i],
            cta: state.weeklyCTAs[i],
            chemical: assignChemical(topic, state.weeklyPillars[i]),
            postType: state.weeklyFrameworks[i]?.name || 'Familiar'
        }));

        renderStoryCards();
        showContainer('stories-container');
        saveSession();
        showToast('7 stories found! Tap any to generate, or Write All 7.', 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}


// ─── Assign neurochemical to a story based on pillar/topic ────
const CHEM_DATA = {
    'confidence': { name: 'Serotonin', icon: '🧘', color: '#FFD700', id: 'serotonin' },
    'visual-targeting': { name: 'Dopamine', icon: '🎯', color: '#FF6B35', id: 'dopamine' },
    'braking-zone-panic': { name: 'Norepinephrine', icon: '⚡', color: '#4488FF', id: 'flow-cocktail' },
    'race-pressure': { name: 'Cortisol', icon: '🔥', color: '#FF4444', id: 'cortisol' },
    'flow-state': { name: 'Endorphins', icon: '🌊', color: '#00BFA5', id: 'endorphins' },
    '7-mistakes': { name: 'Cortisol', icon: '🔥', color: '#FF4444', id: 'cortisol' },
    'tyre-grip': { name: 'Norepinephrine', icon: '⚡', color: '#4488FF', id: 'flow-cocktail' },
    'sleep-recovery': { name: 'Serotonin', icon: '🧘', color: '#FFD700', id: 'serotonin' },
    'dual-task-interference': { name: 'Acetylcholine', icon: '🧠', color: '#9B59B6', id: 'dopamine' },
    'client-transformation': { name: 'Oxytocin', icon: '🤝', color: '#E91E8C', id: 'oxytocin' },
    'race-weekend-review': { name: 'Dopamine', icon: '🎯', color: '#FF6B35', id: 'dopamine' },
    'end-of-season': { name: 'Serotonin', icon: '🧘', color: '#FFD700', id: 'serotonin' },
    'the-process': { name: 'Dopamine', icon: '🎯', color: '#FF6B35', id: 'dopamine' }
};

function assignChemical(topic, pillar) {
    return CHEM_DATA[pillar?.id] || { name: 'Dopamine', icon: '🎯', color: '#FF6B35', id: 'dopamine' };
}


// ─── Render Story Cards ──────────────────────────────────────
function renderStoryCards() {
    const container = document.getElementById('stories-list');
    const meta = document.getElementById('stories-meta');
    if (!container) return;

    const chemicals = [...new Set(state.stories.map(s => s.chemical?.name))].filter(Boolean);
    if (meta) {
        meta.textContent = `${state.stories.length} stories found · ${chemicals.length} neurochemicals`;
    }

    container.innerHTML = state.stories.map((story, i) => {
        const chem = story.chemical || {};
        const articleTitle = story.sourceArticle || story.source || '';
        const articleUrl = story.articleUrl || story.sourceUrl || '';
        const sourceDomain = articleUrl ? (() => { try { return new URL(articleUrl).hostname.replace('www.', ''); } catch { return ''; } })() : '';

        return `
      <div class="story-card" data-index="${i}">
        <div class="story-card-tags">
          <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
            ${chem.icon || '🧪'} ${chem.name || 'Dopamine'}
          </span>
          <span class="story-tag post-type">
            ${story.framework?.icon || '📌'} ${story.postType || 'Familiar'}
          </span>
          <span class="story-tag pillar" style="color:${story.pillar?.color || '#888'};">
            ${story.pillar?.icon || ''} ${story.pillar?.name || ''}
          </span>
        </div>
        <div class="story-card-body">
          <h3 class="story-headline">${escapeHtml(story.headline || story.topic || '')}</h3>
          ${articleTitle ? `
          <div class="article-preview-link" data-url="${encodeURIComponent(articleUrl)}" data-title="${encodeURIComponent(articleTitle)}" style="margin:0.4rem 0;padding:0.4rem 0.6rem;background:rgba(0,191,165,0.06);border-radius:4px;border-left:2px solid var(--neuro-teal, #00BFA5);cursor:pointer;">
            <span style="font-size:0.72rem;color:var(--neuro-teal);font-weight:600;">📰 </span>
            <span style="font-size:0.72rem;color:var(--text-secondary);">${escapeHtml(articleTitle)}</span>
            <span style="font-size:0.68rem;color:var(--neuro-teal);margin-left:0.4rem;">👁️ Read</span>
          </div>
          ` : ''}
          ${story.angle ? `<p class="story-angle">${escapeHtml(story.angle)}</p>` : ''}
        </div>
        <div class="story-card-actions">
          <button class="story-generate-btn" onclick="window.appActions.generateStory(${i})">
            Generate →
          </button>
        </div>
      </div>
    `;
    }).join('');
}

// ─── Article Preview Popup ───────────────────────────────────────
function openArticleModal(url, title) {
    const existing = document.getElementById('article-modal');
    if (existing) existing.remove();

    const decodedUrl = decodeURIComponent(url);
    const decodedTitle = decodeURIComponent(title);

    const modal = document.createElement('div');
    modal.id = 'article-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;';

    modal.innerHTML = `
        <div style="width:100%;max-width:900px;height:90vh;display:flex;flex-direction:column;background:var(--card, #0A1628);border-radius:12px;overflow:hidden;border:1px solid var(--border, #1E293B);">
            <!-- Header -->
            <div style="padding:0.75rem 1.25rem;background:rgba(0,191,165,0.08);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:0.75rem;flex-shrink:0;">
                <span style="font-size:0.82rem;font-weight:700;color:var(--neuro-teal, #00BFA5);">📰 Source Article</span>
                <span style="font-size:0.78rem;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(decodedTitle)}</span>
                <a href="${escapeHtml(decodedUrl)}" target="_blank" rel="noopener" style="font-size:0.72rem;color:var(--neuro-teal);text-decoration:none;white-space:nowrap;padding:0.3rem 0.6rem;background:rgba(0,191,165,0.1);border-radius:4px;border:1px solid rgba(0,191,165,0.2);">Open in new tab ↗</a>
                <button onclick="document.getElementById('article-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;padding:0.2rem 0.5rem;">✕</button>
            </div>
            <!-- Article iframe -->
            <iframe src="${escapeHtml(decodedUrl)}" style="flex:1;width:100%;border:none;background:#fff;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
}


// ─── Write All 7 ──────────────────────────────────────────────
async function handleWriteAll() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings ⚙️ first.', 'error');
        return;
    }

    const btn = document.getElementById('write-all-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('✍️ Writing all 7 posts with Claude...', true);

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

        storeUsedHooks(state.posts);
        renderPosts();
        showContainer('posts-container');
        saveSession();
        showToast('All 7 posts ready! Review and export below.', 'success');
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        console.error(err);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        setStatus('Ready');
    }
}


// ─── Render Posts ─────────────────────────────────────────────
function renderPosts() {
    const container = document.getElementById('posts-grid');
    if (!container) return;

    const dates = getScheduleDates(state.posts.length);

    container.innerHTML = state.posts.map((post, i) => {
        const date = dates[i];
        const wordCount = (post.content || '').split(/\s+/).filter(w => w).length;

        // Parse FB/IG content
        const hasDualPlatform = (post.content || '').includes('=== FACEBOOK POST ===');
        let fbContent = post.content || '';
        let igContent = '';
        if (hasDualPlatform) {
            const fbMatch = post.content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
            const igMatch = post.content.match(/=== INSTAGRAM CAPTION ===([\s\S]*?)(?:=== IMAGE TEXT ===|$)/);
            fbContent = (fbMatch?.[1] || '').trim();
            igContent = (igMatch?.[1] || '').trim();
        }

        const chem = state.stories[i]?.chemical || {};
        const story = state.stories[i] || {};
        const articleTitle = story.sourceArticle || story.source || '';
        const articleLink = story.articleUrl || story.sourceUrl || '';

        return `
      <div class="post-card" id="post-card-${i}" data-index="${i}">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="post-number">${i + 1}</span>
            <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
              ${chem.icon || '🧪'} ${chem.name || ''}
            </span>
            <span class="pillar-badge" style="border: 1px solid ${post.pillar.color}30; color: ${post.pillar.color};">
              ${post.pillar.icon} ${post.pillar.name}
            </span>
            <span class="framework-badge">${post.framework.icon} ${post.framework.name}</span>
          </div>
          <div class="post-card-header-right">
            <span class="schedule-info">${date.dayName} ${date.dateString}</span>
            <span id="post-status-${i}" style="font-size:0.72rem;font-weight:600;margin-left:0.5rem;"></span>
          </div>
        </div>

        <!-- Source Article -->
        ${articleTitle ? `
        <div class="article-preview-link" data-url="${encodeURIComponent(articleLink)}" data-title="${encodeURIComponent(articleTitle)}" style="padding:0.5rem 1.25rem;background:rgba(0,191,165,0.05);border-top:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;cursor:pointer;">
          <span style="font-size:0.72rem;font-weight:600;color:var(--neuro-teal, #00BFA5);">📰 Source:</span>
          <span style="font-size:0.75rem;color:var(--text-secondary);flex:1;">${escapeHtml(articleTitle)}</span>
          <span style="font-size:0.7rem;color:var(--neuro-teal);white-space:nowrap;">👁️ Read Article</span>
        </div>
        ` : ''}

        <!-- Platform Tabs (always show both FB + IG) -->
        <div class="platform-tabs" id="platform-tabs-${i}">
          <button class="platform-tab active" data-platform="fb" onclick="window.appActions.switchPlatform(${i}, 'fb')">📘 Facebook</button>
          <button class="platform-tab" data-platform="ig" onclick="window.appActions.switchPlatform(${i}, 'ig')">📷 Instagram</button>
        </div>

        <!-- Read-only view (visible by default) -->
        <div class="post-content" id="post-content-${i}" data-fb="${encodeURIComponent(fbContent || post.content || '')}" data-ig="${encodeURIComponent(igContent || '')}" data-platform="fb">${escapeHtml(fbContent || post.content || '')}</div>

        <!-- Editable textareas (hidden until Edit clicked) -->
        <div id="edit-area-${i}" style="display:none;padding:0;">
          <div id="edit-fb-wrap-${i}" style="padding:0.5rem 1rem;">
            <label style="font-size:0.7rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:0.25rem;">📘 Facebook</label>
            <textarea id="edit-fb-${i}" style="width:100%;min-height:220px;background:var(--card);color:var(--text-primary);border:1px solid var(--border);border-radius:6px;padding:0.75rem;font-size:0.82rem;line-height:1.6;font-family:var(--font);resize:vertical;">${escapeHtml(fbContent || post.content || '')}</textarea>
          </div>
          <div id="edit-ig-wrap-${i}" style="padding:0.5rem 1rem;border-top:1px solid var(--border);">
            <label style="font-size:0.7rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:0.25rem;">📷 Instagram</label>
            <textarea id="edit-ig-${i}" style="width:100%;min-height:160px;background:var(--card);color:var(--text-primary);border:1px solid var(--border);border-radius:6px;padding:0.75rem;font-size:0.82rem;line-height:1.6;font-family:var(--font);resize:vertical;">${escapeHtml(igContent || '')}</textarea>
          </div>
        </div>

        <!-- Confirmed Panels (hidden until Confirm clicked) -->
        <div id="done-panels-${i}" style="display:none;">

          <!-- 📧 EMAIL HTML PANEL -->
          <div style="padding:1rem 1.25rem;border-top:1px solid var(--border);background:rgba(218,165,32,0.04);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
              <span style="font-weight:700;font-size:0.82rem;color:var(--gold, #DAA520);">📧 Email HTML</span>
              <div style="display:flex;gap:0.3rem;">
                <button class="post-action-btn" onclick="window.appActions.copyEmailHTML(${i})" style="font-size:0.72rem;color:var(--gold);">📋 Copy HTML</button>
                <button class="post-action-btn" onclick="window.appActions.previewEmail(${i})" style="font-size:0.72rem;color:var(--gold);">👁️ Preview</button>
              </div>
            </div>
            <div style="background:#0D1117;border:1px solid rgba(218,165,32,0.15);border-radius:6px;padding:0.5rem;max-height:150px;overflow-y:auto;">
              <pre id="email-html-code-${i}" style="white-space:pre-wrap;font-size:0.68rem;line-height:1.4;color:var(--text-muted);font-family:monospace;margin:0;">Generating email...</pre>
            </div>
          </div>

          <!-- 🎬 CLEAN VIDEO SCRIPT PANEL -->
          <div style="padding:1rem 1.25rem;border-top:1px solid var(--border);background:rgba(0,191,165,0.04);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
              <span style="font-weight:700;font-size:0.82rem;color:var(--neuro-teal, #00BFA5);">🎬 Video Script (clean TXT)</span>
              <button class="post-action-btn" onclick="window.appActions.copyVideoTXT(${i})" style="font-size:0.72rem;color:var(--neuro-teal);">📋 Copy Script</button>
            </div>
            <div style="background:rgba(0,191,165,0.06);border:1px solid rgba(0,191,165,0.15);border-radius:6px;padding:0.75rem;max-height:200px;overflow-y:auto;">
              <pre id="video-txt-${i}" style="white-space:pre-wrap;font-size:0.78rem;line-height:1.6;color:var(--text-primary);font-family:var(--font);margin:0;">Generating video script...</pre>
            </div>
          </div>
        </div>

        <div class="post-card-footer">
          <div class="post-meta">
            <span class="word-count">${wordCount} words</span>
          </div>
          <div class="post-actions">
            <button class="post-action-btn" onclick="window.appActions.copyPost(${i})">📋 Copy</button>
            <button class="post-action-btn" onclick="window.appActions.downloadPost(${i})">💾 .txt</button>
            <button class="post-action-btn" onclick="window.appActions.regenPost(${i})">🔄 Regen</button>
            <button class="post-action-btn" id="edit-btn-${i}" onclick="window.appActions.editPost(${i})" style="color:var(--gold);">✏️ Edit</button>
            <button class="post-action-btn" id="confirm-btn-${i}" onclick="window.appActions.confirmPost(${i})" style="color:var(--green, #2EA043);font-weight:700;display:none;">✅ Confirm</button>
          </div>
        </div>
      </div>
    `;
    }).join('');
}


// ─── Post Actions ─────────────────────────────────────────────
window.appActions = {

    // ─── OPEN ARTICLE POPUP ──────────────────────────────────────
    openArticle(encodedUrl, encodedTitle) {
        if (!encodedUrl) { showToast('No article URL available.', 'info'); return; }
        openArticleModal(encodedUrl, encodedTitle);
    },

    // ─── EDIT: Show textareas for FB + IG editing ─────────────────
    editPost(index) {
        const readOnly = document.getElementById(`post-content-${index}`);
        const editArea = document.getElementById(`edit-area-${index}`);
        const editBtn = document.getElementById(`edit-btn-${index}`);
        const confirmBtn = document.getElementById(`confirm-btn-${index}`);
        const postStatus = document.getElementById(`post-status-${index}`);
        const postCard = document.getElementById(`post-card-${index}`);

        if (readOnly) readOnly.style.display = 'none';
        if (editArea) editArea.style.display = 'block';
        if (editBtn) editBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'inline-flex';
        if (postStatus) { postStatus.textContent = '✏️ Editing'; postStatus.style.color = 'var(--gold)'; }
        if (postCard) postCard.style.borderLeft = '3px solid var(--gold, #DAA520)';

        showToast('Edit both Facebook and Instagram versions, then click ✅ Confirm', 'info');
    },

    // ─── CONFIRM: Save edits → generate Email HTML + Video Script ──
    async confirmPost(index) {
        const editFB = document.getElementById(`edit-fb-${index}`);
        const editIG = document.getElementById(`edit-ig-${index}`);
        const readOnly = document.getElementById(`post-content-${index}`);
        const editArea = document.getElementById(`edit-area-${index}`);
        const editBtn = document.getElementById(`edit-btn-${index}`);
        const confirmBtn = document.getElementById(`confirm-btn-${index}`);
        const postStatus = document.getElementById(`post-status-${index}`);
        const postCard = document.getElementById(`post-card-${index}`);
        const donePanels = document.getElementById(`done-panels-${index}`);

        // 1. Save edited content
        const fbText = editFB?.value || '';
        const igText = editIG?.value || '';

        // Rebuild the combined content with markers
        const combinedContent = `=== FACEBOOK POST ===\n\n${fbText}\n\n=== INSTAGRAM CAPTION ===\n\n${igText}`;
        state.posts[index].content = combinedContent;

        // Update the read-only view with FB content (default)
        if (readOnly) {
            readOnly.textContent = fbText;
            readOnly.dataset.fb = encodeURIComponent(fbText);
            readOnly.dataset.ig = encodeURIComponent(igText);
            readOnly.dataset.platform = 'fb';
            readOnly.style.display = 'block';
        }

        // Hide edit area, swap buttons
        if (editArea) editArea.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'none';
        if (postStatus) { postStatus.textContent = '⏳ Generating...'; postStatus.style.color = 'var(--neuro-teal)'; }
        if (postCard) postCard.style.borderLeft = '3px solid var(--neuro-teal, #00BFA5)';
        if (donePanels) donePanels.style.display = 'block';

        saveSession();
        showToast(`Post ${index + 1} confirmed — generating email + video...`, 'info');

        // 2. Generate Email HTML + Video Script in parallel
        const post = state.posts[index];
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine', icon: '🧪', name: 'Dopamine' };
        const story = state.stories[index] || state.topics[index] || {};
        const topic = post.topic?.headline || post.topic || state.topics[index]?.headline || 'Rider mental performance';

        setStatus(`⏳ Generating email + video for post ${index + 1}...`, true);

        const [emailResult, videoResult] = await Promise.allSettled([
            // Email HTML
            (async () => {
                const emailData = await generateEmail({
                    postContent: fbText,
                    topic: post.topic || state.topics[index],
                    pillar: post.pillar,
                    cta: post.cta,
                    apiKey: settings.claudeApiKey
                });
                return { emailData, emailHTML: renderEmailHTML(emailData, post.pillar) };
            })(),
            // Video Script
            (async () => {
                const script = await generateVideoScript({
                    topic,
                    chemicalId: chemData.id,
                    videoLength: '45-60s',
                    platform: 'FB Reel + IG Reel',
                    outputFormat: '9:16',
                    apiKey: settings.claudeApiKey,
                    sourceArticle: story.sourceArticle || story.source || '',
                    articleUrl: story.articleUrl || story.sourceUrl || '',
                    talkingPoints: story.talkingPoints || [],
                    emotionalHook: story.emotionalHook || '',
                    mechanism: story.mechanism || '',
                    racingRelevance: story.racingRelevance || '',
                    postContent: fbText
                });
                return script;
            })()
        ]);

        // Handle Email
        const emailCodeEl = document.getElementById(`email-html-code-${index}`);
        if (emailResult.status === 'fulfilled') {
            const { emailData, emailHTML } = emailResult.value;
            if (!state.doneData) state.doneData = {};
            if (!state.doneData[index]) state.doneData[index] = {};
            state.doneData[index].emailHTML = emailHTML;
            state.doneData[index].emailData = emailData;
            if (emailCodeEl) emailCodeEl.textContent = emailHTML;
        } else {
            if (emailCodeEl) emailCodeEl.textContent = `Error: ${emailResult.reason?.message || 'Failed'}`;
        }

        // Handle Video
        const videoTxtEl = document.getElementById(`video-txt-${index}`);
        if (videoResult.status === 'fulfilled') {
            const fullScript = videoResult.value;
            const scriptMatch = fullScript.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK|$)/i);
            const rawNarration = (scriptMatch?.[1] || fullScript).trim();
            const cleanTXT = rawNarration
                .replace(/^(?:HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA)\s*(?:\([^)]*\))?\s*:\s*/gim, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            if (!state.doneData) state.doneData = {};
            if (!state.doneData[index]) state.doneData[index] = {};
            state.doneData[index].videoScript = fullScript;
            state.doneData[index].cleanVideoTXT = cleanTXT;
            if (videoTxtEl) videoTxtEl.textContent = cleanTXT;
        } else {
            if (videoTxtEl) videoTxtEl.textContent = `Error: ${videoResult.reason?.message || 'Failed'}`;
        }

        // Final state
        if (postStatus) { postStatus.textContent = '✅ Confirmed'; postStatus.style.color = 'var(--green, #2EA043)'; }
        setStatus('Ready');
        showToast(`✅ Post ${index + 1} confirmed — email + video ready!`, 'success');
    },

    // Copy email HTML
    copyEmailHTML(index) {
        const html = state.doneData?.[index]?.emailHTML;
        if (html) { copyToClipboard(html); showToast('Email HTML copied — paste into GHL!', 'success'); }
        else { showToast('Confirm the post first to generate the email.', 'info'); }
    },

    // Preview email in new window
    previewEmail(index) {
        const html = state.doneData?.[index]?.emailHTML;
        if (html) { const w = window.open('', '_blank', 'width=640,height=800'); w.document.write(html); w.document.close(); }
        else { showToast('Confirm the post first to generate the email.', 'info'); }
    },

    // Copy clean video narration TXT
    copyVideoTXT(index) {
        const txt = state.doneData?.[index]?.cleanVideoTXT;
        if (txt) { copyToClipboard(txt); showToast('Clean video script copied — paste into HeyGen!', 'success'); }
        else { showToast('Confirm the post first to generate the video script.', 'info'); }
    },

    switchPlatform(index, platform) {
        const container = document.getElementById(`post-content-${index}`);
        if (!container) return;
        const content = platform === 'ig' ? decodeURIComponent(container.dataset.ig) : decodeURIComponent(container.dataset.fb);
        container.textContent = content;

        const tabs = document.getElementById(`platform-tabs-${index}`)?.querySelectorAll('.platform-tab');
        tabs?.forEach(t => t.classList.toggle('active', t.dataset.platform === platform));
    },

    copyPost(index) {
        const post = state.posts[index];
        if (post) { copyToClipboard(post.content); showToast('Post copied!', 'success'); }
    },

    downloadPost(index) {
        const post = state.posts[index];
        if (post) { downloadPostTxt(post, index); showToast('Downloaded!', 'success'); }
    },

    async regenPost(index) {
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        setStatus(`Regenerating post ${index + 1}...`, true);
        try {
            const topic = state.topics[index];
            const content = await regeneratePost({
                topic,
                pillar: state.weeklyPillars[index],
                framework: state.weeklyFrameworks[index],
                cta: state.weeklyCTAs[index],
                authorityLine: state.weeklyAuthorities[index],
                motorsportBridge: state.weeklyMotorsportBridges[index],
                apiKey: settings.claudeApiKey
            });
            state.posts[index].content = content;
            renderPosts();
            saveSession();
            showToast(`Post ${index + 1} regenerated!`, 'success');
        } catch (err) {
            showToast(`Regen error: ${err.message}`, 'error');
        } finally { setStatus('Ready'); }
    },

    async generateEmailForPost(index) {
        const post = state.posts[index];
        if (!post) return;
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed for emails.', 'error'); return; }

        setStatus('Generating email...', true);
        try {
            const emailData = await generateEmail({
                postContent: post.content,
                topic: post.topic || state.topics[index],
                pillar: post.pillar,
                cta: post.cta,
                apiKey: settings.claudeApiKey
            });
            const emailHTML = renderEmailHTML(emailData);
            showEmailModal(emailData, emailHTML, index);
            showToast(`Email generated for post ${index + 1}!`, 'success');
        } catch (err) {
            showToast(`Email error: ${err.message}`, 'error');
        } finally { setStatus('Ready'); }
    },

    async generateStory(index) {
        const story = state.stories[index];
        if (!story) return;
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        // Update button to show loading
        const card = document.querySelector(`.story-card[data-index="${index}"]`);
        if (card) {
            card.querySelector('.story-card-actions').innerHTML = `
                <span style="color:var(--neuro-teal);font-size:0.75rem;font-weight:600;">⏳ Writing...</span>
            `;
        }

        setStatus(`Writing post for story ${index + 1}...`, true);
        try {
            const content = await generatePost({
                topic: story.headline || story.topic,
                pillar: story.pillar,
                framework: story.framework,
                cta: story.cta,
                authorityLine: state.weeklyAuthorities[index] || getRotatingAuthority(),
                motorsportBridge: state.weeklyMotorsportBridges[index] || getRotatingMotorsportBridge(),
                apiKey: settings.claudeApiKey
            });

            // Add to posts array at this index
            if (!state.posts[index]) {
                state.posts[index] = {
                    id: `post-${Date.now()}-${index}`,
                    content,
                    pillar: story.pillar,
                    framework: story.framework,
                    cta: story.cta,
                    topic: state.topics[index],
                    imageUrl: '',
                    edited: false
                };
            } else {
                state.posts[index].content = content;
            }

            saveSession();
            showToast(`Post ${index + 1} generated!`, 'success');

            // If all posts are generated, show full posts view
            if (state.posts.filter(Boolean).length === state.stories.length) {
                renderPosts();
                showContainer('posts-container');
            } else {
                // Show the generated post inline below the story card
                if (card) {
                    card.querySelector('.story-card-actions').innerHTML = `
                        <span style="color:var(--green);font-size:0.75rem;font-weight:600;">✅ Generated</span>
                        <button class="story-generate-btn" onclick="window.appActions.toggleInlinePost(${index})" style="font-size:0.72rem;padding:0.3rem 0.75rem;">👁️ View Post</button>
                    `;
                    card.style.borderColor = 'rgba(46,160,67,0.3)';

                    // Render the inline post preview below the story card
                    this.renderInlinePost(index, card);
                }
            }
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            if (card) {
                card.querySelector('.story-card-actions').innerHTML = `
                    <button class="story-generate-btn" onclick="window.appActions.generateStory(${index})">🔄 Retry</button>
                `;
            }
        } finally { setStatus('Ready'); }
    },

    // Render single post inline below story card
    renderInlinePost(index, card) {
        const post = state.posts[index];
        if (!post) return;

        // Remove existing inline preview
        const existingPreview = document.getElementById(`inline-post-${index}`);
        if (existingPreview) existingPreview.remove();

        // Parse FB/IG
        const hasDual = (post.content || '').includes('=== FACEBOOK POST ===');
        let fbContent = post.content || '';
        let igContent = '';
        if (hasDual) {
            const fbMatch = post.content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
            const igMatch = post.content.match(/=== INSTAGRAM CAPTION ===([\s\S]*?)(?:=== IMAGE TEXT ===|$)/);
            fbContent = (fbMatch?.[1] || '').trim();
            igContent = (igMatch?.[1] || '').trim();
        }

        const chem = state.stories[index]?.chemical || {};
        const story = state.stories[index] || {};
        const articleTitle = story.sourceArticle || story.source || '';
        const articleLink = story.articleUrl || story.sourceUrl || '';
        const wordCount = (fbContent || post.content || '').split(/\s+/).filter(Boolean).length;

        const inlineDiv = document.createElement('div');
        inlineDiv.id = `inline-post-${index}`;
        inlineDiv.style.cssText = 'margin:0.5rem 0 1rem;border:1px solid rgba(0,191,165,0.2);border-radius:8px;background:var(--card);overflow:hidden;';

        inlineDiv.innerHTML = `
            <!-- Source Article -->
            ${articleTitle ? `
            <div style="padding:0.5rem 1rem;background:rgba(0,191,165,0.05);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:0.5rem;cursor:pointer;" onclick="window.appActions.openArticle('${encodeURIComponent(articleLink)}', '${encodeURIComponent(articleTitle)}')">
                <span style="font-size:0.72rem;font-weight:600;color:var(--neuro-teal);">📰</span>
                <span style="font-size:0.72rem;color:var(--text-secondary);flex:1;">${escapeHtml(articleTitle)}</span>
                <span style="font-size:0.68rem;color:var(--neuro-teal);">👁️ Read</span>
            </div>` : ''}

            <!-- Platform Tabs -->
            <div style="display:flex;gap:0;border-bottom:1px solid var(--border);">
                <button class="platform-tab active" data-platform="fb" onclick="window.appActions.switchInlinePlatform(${index}, 'fb')" style="flex:1;padding:0.4rem;font-size:0.72rem;background:none;border:none;border-bottom:2px solid var(--neuro-teal);color:var(--text-primary);cursor:pointer;">📘 Facebook</button>
                <button class="platform-tab" data-platform="ig" onclick="window.appActions.switchInlinePlatform(${index}, 'ig')" style="flex:1;padding:0.4rem;font-size:0.72rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-muted);cursor:pointer;">📷 Instagram</button>
            </div>

            <!-- Content -->
            <div id="inline-post-content-${index}" data-fb="${encodeURIComponent(fbContent)}" data-ig="${encodeURIComponent(igContent)}" style="padding:0.75rem 1rem;font-size:0.82rem;line-height:1.6;color:var(--text-primary);white-space:pre-wrap;max-height:300px;overflow-y:auto;">${escapeHtml(fbContent || post.content || '')}</div>

            <!-- Actions -->
            <div style="padding:0.5rem 1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:0.7rem;color:var(--text-muted);">${wordCount} words</span>
                <div style="display:flex;gap:0.3rem;">
                    <button class="post-action-btn" onclick="window.appActions.copyInlinePost(${index})" style="font-size:0.72rem;">📋 Copy</button>
                    <button class="post-action-btn" onclick="window.appActions.editInlinePost(${index})" style="font-size:0.72rem;color:var(--gold);">✏️ Edit</button>
                </div>
            </div>
        `;

        card.after(inlineDiv);
    },

    toggleInlinePost(index) {
        const existing = document.getElementById(`inline-post-${index}`);
        if (existing) { existing.remove(); return; }
        const card = document.querySelector(`.story-card[data-index="${index}"]`);
        if (card) this.renderInlinePost(index, card);
    },

    switchInlinePlatform(index, platform) {
        const container = document.getElementById(`inline-post-content-${index}`);
        if (!container) return;
        const content = platform === 'ig' ? decodeURIComponent(container.dataset.ig) : decodeURIComponent(container.dataset.fb);
        container.textContent = content;

        // Update tab styles
        const parent = container.parentElement;
        parent.querySelectorAll('.platform-tab').forEach(t => {
            const isActive = t.dataset.platform === platform;
            t.style.borderBottomColor = isActive ? 'var(--neuro-teal)' : 'transparent';
            t.style.color = isActive ? 'var(--text-primary)' : 'var(--text-muted)';
        });
    },

    copyInlinePost(index) {
        const post = state.posts[index];
        if (post) { copyToClipboard(post.content); showToast('Post copied!', 'success'); }
    },

    editInlinePost(index) {
        // Jump to full posts view with this post ready to edit
        renderPosts();
        showContainer('posts-container');
        setTimeout(() => {
            const postCard = document.getElementById(`post-card-${index}`);
            if (postCard) postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.editPost(index);
        }, 200);
    },

    async generateVideoForPost(index) {
        const post = state.posts[index];
        if (!post) { showToast('Generate the post first.', 'error'); return; }
        const settings = loadSettings();
        if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }

        setStatus('🎬 Generating video script...', true);
        showToast('Creating video script...', 'info');

        try {
            // Get chemicalId from the post's pillar
            const chemData = CHEM_DATA[post.pillar?.id] || { id: 'dopamine' };
            const topic = post.topic?.headline || post.topic || state.topics[index]?.headline || 'Rider mental performance';

            // Pass the full story data + post content so the video is grounded in the same article
            const story = state.stories[index] || state.topics[index] || {};

            const script = await generateVideoScript({
                topic,
                chemicalId: chemData.id,
                videoLength: '45-60s',
                platform: 'FB Reel + IG Reel',
                outputFormat: '9:16',
                apiKey: settings.claudeApiKey,
                // Source article context for the video to reference
                sourceArticle: story.sourceArticle || story.source || '',
                articleUrl: story.articleUrl || story.sourceUrl || '',
                talkingPoints: story.talkingPoints || [],
                emotionalHook: story.emotionalHook || '',
                mechanism: story.mechanism || '',
                racingRelevance: story.racingRelevance || '',
                // The actual generated post content
                postContent: post.content || ''
            });

            showVideoModal(script, index, chemData, settings);
            showToast(`Video script generated for post ${index + 1}!`, 'success');
        } catch (err) {
            showToast(`Video error: ${err.message}`, 'error');
            console.error(err);
        } finally { setStatus('Ready'); }
    },

    clearSession() { clearSession(); }
};


// ─── Video Script Modal (Manual Workflow) ────────────────────────
function showVideoModal(script, postIndex, chemData, settings) {
    const existing = document.getElementById('video-modal');
    if (existing) existing.remove();

    // ─── Parse the script into clean sections ────────────────────
    // Extract Manus slide brief
    const manusBriefMatch = script.match(/=== SLIDE DECK BRIEF.*?===\s*([\s\S]*?)(?:=== HEYGEN|=== SOCIAL|$)/i);
    const manusBriefRaw = (manusBriefMatch?.[1] || '').trim();

    // Build a clean Manus prompt with context
    // Include source article info from the story
    const story = state.stories[postIndex] || {};
    const articleTitle = story.sourceArticle || story.source || '';
    const articleLink = story.articleUrl || story.sourceUrl || '';

    const manusPrompt = `CREATE A SLIDE DECK FOR A 45-60 SECOND VIDEO

BRAND: Camino Coaching — Motorcycle Racer Mental Performance
PRESENTER: Craig Muirhead (AI avatar will narrate over these slides)
STYLE: Dark background (#0A1628), teal accents (#00BFA5), bold sans-serif headings, clean and minimal
FORMAT: 16:9 landscape, 7-8 slides
FONT: Inter or similar modern sans-serif
EXPORT: PowerPoint (.pptx)

${articleTitle ? `SOURCE ARTICLE: ${articleTitle}` : ''}
${articleLink ? `ARTICLE URL: ${articleLink}` : ''}
${articleTitle ? `\nIMPORTANT: The video is based on this article. Slide 1 (Hook) should reference the article's subject or finding. Include the source name on Slide 2 or as a subtitle on Slide 1 for third-party authority.\n` : ''}
NEUROCHEMISTRY FOCUS: ${chemData.icon} ${chemData.name}

SLIDE CONTENT:
${manusBriefRaw}

DESIGN NOTES:
- Slide 1 (Hook): Large bold text, dark background, teal accent. This is the scroll-stopper.${articleTitle ? ` Reference the source article.` : ''}
- Slide 3 (The Chemical): Show the chemical name in teal (#00BFA5) with a simple icon or molecule graphic.
- Slide 5 (The Data): One BIG number (e.g. "0.3-0.5s") centred, with a short label below.
- Slide 7 (CTA): Include "Comment MINDSET" or "Free Rider Mindset Quiz" with the Camino Coaching logo.
- Slide 8 (End Card): Camino Coaching logo, "4.9/5 Trustpilot · 85 five-star reviews", website URL.
- Keep text minimal on each slide — the avatar narrates the detail.
- No stock photos of cars or generic business imagery. Motorcycle racing imagery only if needed.`;

    // Extract pure HeyGen narration script (strip all section headers, timecodes, labels)
    const videoScriptMatch = script.match(/=== VIDEO SCRIPT ===\s*([\s\S]*?)(?:=== SLIDE DECK|$)/i);
    const videoScriptRaw = (videoScriptMatch?.[1] || script).trim();

    // Strip section labels like "HOOK (0-5s):", "THE SCIENCE (15-35s):", etc.
    const heygenScript = videoScriptRaw
        .replace(/^(?:HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA)\s*(?:\([^)]*\))?\s*:\s*/gim, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Extract social caption
    const captionMatch = script.match(/=== SOCIAL CAPTION ===\s*([\s\S]*?)$/i);
    const socialCaption = (captionMatch?.[1] || '').trim();

    // Extract HeyGen notes
    const heygenNotesMatch = script.match(/=== HEYGEN NOTES ===\s*([\s\S]*?)(?:=== SOCIAL|$)/i);
    const heygenNotes = (heygenNotesMatch?.[1] || '').trim();

    const modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:820px;">
        <div class="modal-header">
          <div>
            <h3 style="margin:0;font-size:1.1rem;">🎬 Video Production Workflow</h3>
            <span style="font-size:0.75rem;color:var(--text-muted);">Post ${postIndex + 1} · ${chemData.icon} ${chemData.name}</span>
          </div>
          <button class="modal-close" onclick="document.getElementById('video-modal').remove()">&times;</button>
        </div>
        <div class="modal-body" style="max-height:70vh;overflow-y:auto;padding:0;">

          <!-- ═══ STEP 1: MANUS SLIDE DECK ═══ -->
          <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
              <span style="background:var(--neuro-teal, #00BFA5);color:#0A1628;font-weight:800;font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:4px;">STEP 1</span>
              <span style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">🎨 Create Slide Deck in Manus</span>
            </div>
            <div id="manus-brief-preview" style="background:rgba(0,191,165,0.06);border:1px solid rgba(0,191,165,0.15);border-radius:8px;padding:0.75rem 1rem;max-height:200px;overflow-y:auto;margin-bottom:0.75rem;">
              <pre style="white-space:pre-wrap;font-size:0.78rem;line-height:1.5;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(manusPrompt)}</pre>
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
              <button class="btn btn-primary" id="copy-manus-brief" style="font-size:0.8rem;padding:0.45rem 1rem;">
                📋 Copy Manus Brief
              </button>
              <a href="https://manus.im" target="_blank" class="btn btn-secondary" style="font-size:0.8rem;padding:0.45rem 1rem;text-decoration:none;">
                🚀 Open Manus
              </a>
              <span id="manus-copy-status" style="font-size:0.7rem;color:var(--green);margin-left:0.5rem;"></span>
            </div>
            <p style="font-size:0.7rem;color:var(--text-muted);margin:0.5rem 0 0;">Paste this into Manus → Download the .pptx slide deck when ready</p>
          </div>

          <!-- ═══ STEP 2: HEYGEN NARRATION SCRIPT ═══ -->
          <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
              <span style="background:var(--gold, #DAA520);color:#0A1628;font-weight:800;font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:4px;">STEP 2</span>
              <span style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">🎬 Upload Slides + Script to HeyGen</span>
            </div>
            <div style="background:rgba(218,165,32,0.06);border:1px solid rgba(218,165,32,0.15);border-radius:8px;padding:0.75rem 1rem;max-height:250px;overflow-y:auto;margin-bottom:0.75rem;">
              <pre style="white-space:pre-wrap;font-size:0.82rem;line-height:1.7;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(heygenScript)}</pre>
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
              <button class="btn btn-primary" id="copy-heygen-script" style="font-size:0.8rem;padding:0.45rem 1rem;background:var(--gold, #DAA520);color:#0A1628;">
                📋 Copy HeyGen Script
              </button>
              <a href="https://app.heygen.com/avatar/ppt-to-video" target="_blank" class="btn btn-secondary" style="font-size:0.8rem;padding:0.45rem 1rem;text-decoration:none;">
                🚀 Open HeyGen PPT-to-Video
              </a>
              <span id="heygen-copy-status" style="font-size:0.7rem;color:var(--green);margin-left:0.5rem;"></span>
            </div>
            <p style="font-size:0.7rem;color:var(--text-muted);margin:0.5rem 0 0;">Upload the .pptx from Step 1 → Paste this script as the narration → Generate video</p>
            ${heygenNotes ? `<details style="margin-top:0.5rem;"><summary style="font-size:0.7rem;color:var(--text-muted);cursor:pointer;">📝 HeyGen avatar notes</summary><p style="font-size:0.75rem;color:var(--text-muted);margin:0.4rem 0 0;padding-left:1rem;">${escapeHtml(heygenNotes)}</p></details>` : ''}
          </div>

          <!-- ═══ STEP 3: SOCIAL CAPTION + GHL ═══ -->
          <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
              <span style="background:var(--green, #2EA043);color:#FFF;font-weight:800;font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:4px;">STEP 3</span>
              <span style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">📱 Upload Video + Caption to GHL</span>
            </div>
            ${socialCaption ? `
            <div style="background:rgba(46,160,67,0.06);border:1px solid rgba(46,160,67,0.15);border-radius:8px;padding:0.75rem 1rem;margin-bottom:0.75rem;">
              <pre style="white-space:pre-wrap;font-size:0.82rem;line-height:1.6;color:var(--text-primary);font-family:var(--font);margin:0;">${escapeHtml(socialCaption)}</pre>
            </div>
            ` : '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.75rem;">No social caption generated — use the post content as the caption.</p>'}
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
              <button class="btn btn-primary" id="copy-social-caption" style="font-size:0.8rem;padding:0.45rem 1rem;background:var(--green, #2EA043);">
                📋 Copy Caption
              </button>
              <a href="https://app.gohighlevel.com/v2/location/vdgR8teGuIgHPMPzbQkK/marketing/social-planner" target="_blank" class="btn btn-secondary" style="font-size:0.8rem;padding:0.45rem 1rem;text-decoration:none;">
                🚀 Open GHL Planner
              </a>
              <span id="caption-copy-status" style="font-size:0.7rem;color:var(--green);margin-left:0.5rem;"></span>
            </div>
            <p style="font-size:0.7rem;color:var(--text-muted);margin:0.5rem 0 0;">Upload the finished video from HeyGen → Paste the caption → Schedule in GHL Social Planner</p>
          </div>

          <!-- ═══ FULL RAW SCRIPT (collapsible) ═══ -->
          <details style="padding:0.75rem 1.5rem;">
            <summary style="font-size:0.8rem;font-weight:600;color:var(--text-muted);cursor:pointer;">📄 View Full Raw Script</summary>
            <pre style="white-space:pre-wrap;font-size:0.75rem;line-height:1.5;color:var(--text-muted);font-family:var(--font);margin:0.5rem 0 0;padding:0.75rem;background:rgba(255,255,255,0.03);border-radius:6px;">${escapeHtml(script)}</pre>
            <button class="btn btn-secondary" id="copy-full-script" style="font-size:0.75rem;padding:0.35rem 0.8rem;margin-top:0.5rem;">📋 Copy Full Script</button>
          </details>

        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // ─── Copy button handlers ────────────────────────────────────
    document.getElementById('copy-manus-brief').addEventListener('click', () => {
        copyToClipboard(manusPrompt);
        const status = document.getElementById('manus-copy-status');
        if (status) status.textContent = '✅ Copied!';
        showToast('Manus slide brief copied — paste into Manus to create your deck!', 'success');
    });

    document.getElementById('copy-heygen-script').addEventListener('click', () => {
        copyToClipboard(heygenScript);
        const status = document.getElementById('heygen-copy-status');
        if (status) status.textContent = '✅ Copied!';
        showToast('Clean narration script copied — paste into HeyGen!', 'success');
    });

    document.getElementById('copy-social-caption').addEventListener('click', () => {
        copyToClipboard(socialCaption || '');
        const status = document.getElementById('caption-copy-status');
        if (status) status.textContent = '✅ Copied!';
        showToast('Social caption copied — paste into GHL planner!', 'success');
    });

    document.getElementById('copy-full-script')?.addEventListener('click', () => {
        copyToClipboard(script);
        showToast('Full raw script copied!', 'success');
    });
}


// ═══════════════════════════════════════════════════════════════
// MODE 2: SINGLE POST
// ═══════════════════════════════════════════════════════════════

function initSinglePost() {
    document.getElementById('generate-single-btn')?.addEventListener('click', handleGenerateSingle);
}

async function handleGenerateSingle() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) {
        showToast('Please add your Claude API key in Settings ⚙️ first.', 'error');
        return;
    }

    const input = document.getElementById('single-input')?.value.trim();
    if (!input) {
        showToast('Type or paste something — a link, a quote, or describe what happened.', 'error');
        return;
    }

    // AI decides everything
    const pillar = getRandomPillar();
    const framework = getRandomFramework();
    const cta = getRotatingCTA();
    const authorityLine = getRotatingAuthority();
    const motorsportBridge = getRotatingMotorsportBridge();

    const btn = document.getElementById('generate-single-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('⚡ Generating post...', true);

    const resultContainer = document.getElementById('single-result');
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <div class="empty-state">
            <span class="spinner" style="width:32px;height:32px;border-width:3px;"></span>
            <p style="margin-top:1rem;">Generating your post...</p>
        </div>
    `;

    try {
        const content = await generatePost({
            topic: input,
            pillar,
            framework,
            cta,
            authorityLine,
            motorsportBridge,
            apiKey: settings.claudeApiKey,
        });

        const post = { id: `single-${Date.now()}`, content, pillar, framework, cta, topic: { headline: input }, imageUrl: '', edited: false };
        const wordCount = content.split(/\s+/).filter(w => w).length;
        const chem = assignChemical(null, pillar);

        resultContainer.innerHTML = `
      <div class="post-card">
        <div class="post-card-header">
          <div class="post-card-header-left">
            <span class="story-tag chemical" style="background:${chem.color}15;color:${chem.color};border:1px solid ${chem.color}30;">
              ${chem.icon} ${chem.name}
            </span>
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
          <div class="post-meta"><span class="word-count">${wordCount} words</span></div>
          <div class="post-actions">
            <button class="post-action-btn" id="single-copy-btn">📋 Copy</button>
            <button class="post-action-btn" id="single-download-btn">💾 .txt</button>
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
// EMAIL GENERATION
// ═══════════════════════════════════════════════════════════════

function showEmailModal(emailData, emailHTML, postIndex) {
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
                    <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary,#F0F6FC);">📧 Email — Post ${postIndex + 1}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#8B949E);margin-top:2px;">Subject: <strong style="color:var(--gold,#DAA520);">${escapeHtml(emailData.subject)}</strong></div>
                </div>
                <button onclick="document.getElementById('email-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            <div style="flex:1;overflow-y:auto;padding:1rem 1.25rem;">
                <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
                    <button id="email-copy-html-btn" style="padding:0.5rem 1rem;background:var(--neuro-teal,#00BFA5);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">📋 Copy HTML</button>
                    <button id="email-download-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">💾 Download</button>
                    <button id="email-copy-subject-btn" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.08);color:var(--text-primary);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:0.8rem;cursor:pointer;">📝 Subject</button>
                    <button id="email-send-ghl-btn" style="padding:0.5rem 1rem;background:var(--gold,#DAA520);color:#0A1628;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">🚀 Send via GHL</button>
                </div>

                <div id="ghl-send-form" style="display:none;margin-bottom:1rem;padding:0.75rem;background:rgba(218,165,32,0.06);border:1px solid rgba(218,165,32,0.15);border-radius:8px;">
                    <label style="font-size:0.75rem;font-weight:600;color:var(--gold);display:block;margin-bottom:0.4rem;">Recipient Email</label>
                    <div style="display:flex;gap:0.5rem;">
                        <input type="email" id="ghl-recipient-email" class="form-input" placeholder="rider@example.com" style="flex:1;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <input type="text" id="ghl-recipient-name" class="form-input" placeholder="Name (optional)" style="width:140px;font-size:0.8rem;padding:0.4rem 0.6rem;" />
                        <button id="ghl-send-confirm-btn" style="padding:0.4rem 1rem;background:var(--green,#2EA043);color:white;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;white-space:nowrap;">✉️ Send</button>
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

    const iframe = document.getElementById('email-preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(emailHTML);
    iframeDoc.close();

    // Button handlers
    document.getElementById('email-copy-html-btn').addEventListener('click', () => {
        copyToClipboard(emailHTML);
        showToast('HTML copied!', 'success');
    });

    document.getElementById('email-download-btn').addEventListener('click', () => {
        const blob = new Blob([emailHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-post-${postIndex + 1}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Email downloaded!', 'success');
    });

    document.getElementById('email-copy-subject-btn').addEventListener('click', () => {
        copyToClipboard(emailData.subject);
        showToast('Subject copied!', 'success');
    });

    document.getElementById('email-send-ghl-btn').addEventListener('click', () => {
        const form = document.getElementById('ghl-send-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') document.getElementById('ghl-recipient-email')?.focus();
    });

    document.getElementById('ghl-send-confirm-btn').addEventListener('click', async () => {
        const recipientEmail = document.getElementById('ghl-recipient-email')?.value?.trim();
        const recipientName = document.getElementById('ghl-recipient-name')?.value?.trim();
        const statusEl = document.getElementById('ghl-send-status');

        if (!recipientEmail || !recipientEmail.includes('@')) {
            statusEl.innerHTML = '<span style="color:var(--accent);">Enter a valid email address.</span>';
            return;
        }

        const settings = loadSettings();
        if (!settings.ghlToken) {
            statusEl.innerHTML = '<span style="color:var(--accent);">GHL token not configured. Go to Settings.</span>';
            return;
        }

        statusEl.innerHTML = '<span style="color:var(--gold);">⏳ Sending...</span>';
        document.getElementById('ghl-send-confirm-btn').disabled = true;

        try {
            const result = await dispatchEmail({
                recipientEmail,
                recipientName: recipientName || '',
                subject: emailData.subject,
                html: emailHTML,
                tags: ['nurture-email', 'rider-social-media-machine']
            });
            statusEl.innerHTML = `<span style="color:var(--green);">✅ Sent! Contact: ${result.contactId} ${result.isNewContact ? '(new)' : '(existing)'}</span>`;
            showToast(`Email sent to ${recipientEmail}!`, 'success');
        } catch (err) {
            statusEl.innerHTML = `<span style="color:var(--accent);">❌ ${err.message}</span>`;
        } finally {
            document.getElementById('ghl-send-confirm-btn').disabled = false;
        }
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}


// ─── Bulk Email Generation ────────────────────────────────────
async function handleGenerateAllEmails() {
    const settings = loadSettings();
    if (!settings.claudeApiKey) { showToast('Claude API key needed.', 'error'); return; }
    if (state.posts.length === 0) { showToast('No posts to email.', 'error'); return; }

    setStatus('📧 Generating emails for all posts...', true);
    const results = [];

    for (let i = 0; i < state.posts.length; i++) {
        try {
            setStatus(`📧 Generating email ${i + 1}/${state.posts.length}...`, true);
            const emailData = await generateEmail({
                postContent: state.posts[i].content,
                topic: state.posts[i].topic || state.topics[i],
                pillar: state.posts[i].pillar,
                cta: state.posts[i].cta,
                apiKey: settings.claudeApiKey
            });
            const emailHTML = renderEmailHTML(emailData);

            const blob = new Blob([emailHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `email-post-${i + 1}.html`;
            a.click();
            URL.revokeObjectURL(url);
            results.push({ index: i, success: true });
        } catch (err) {
            results.push({ index: i, success: false, error: err.message });
        }
    }

    const successCount = results.filter(r => r.success).length;
    showToast(`${successCount}/${state.posts.length} emails generated and downloaded!`, 'success');
    setStatus('Ready');
}


// ─── Export CSV ────────────────────────────────────────────────
function handleExportCSV() {
    if (state.posts.length === 0) { showToast('No posts to export.', 'error'); return; }
    const dates = getScheduleDates(state.posts.length);
    const filename = exportCSV(state.posts, dates);
    showToast(`Exported ${state.posts.length} posts to ${filename}`, 'success');
}

function handleCopyCSV() {
    if (state.posts.length === 0) { showToast('No posts to copy.', 'error'); return; }
    const dates = getScheduleDates(state.posts.length);
    const csvString = buildCSVString(state.posts, dates);
    copyToClipboard(csvString);
    showToast(`CSV for ${state.posts.length} posts copied!`, 'success');
}
