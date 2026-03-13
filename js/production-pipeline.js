// ═══════════════════════════════════════════════════════════════
// 🏍️ PRODUCTION PIPELINE — Manus + HeyGen + GHL Full Automation
// Research → Script → Slides → ⏸️ Review → Video → Schedule
// ═══════════════════════════════════════════════════════════════

import { loadSettings } from './settings.js';
import { addLogEntry } from './settings.js';
import { getScheduleDates } from './scheduler.js';

// ─── Pipeline Status Tracking ────────────────────────────────
const PIPELINE_KEY = 'rider-social-media-pipeline-jobs';

function getPipelineJobs() {
    try {
        return JSON.parse(localStorage.getItem(PIPELINE_KEY) || '[]');
    } catch { return []; }
}

function savePipelineJob(job) {
    const jobs = getPipelineJobs();
    const existing = jobs.findIndex(j => j.id === job.id);
    if (existing >= 0) {
        jobs[existing] = { ...jobs[existing], ...job };
    } else {
        jobs.push(job);
    }
    localStorage.setItem(PIPELINE_KEY, JSON.stringify(jobs.slice(-100)));
    return job;
}

function getPipelineJob(id) {
    return getPipelineJobs().find(j => j.id === id) || null;
}


// ═══════════════════════════════════════════════════════════════
// MANUS API — Slide Deck Generation
// Verified: POST /v1/tasks, GET /v1/tasks/{task_id}
// Files embedded in response output as output_file objects
// ═══════════════════════════════════════════════════════════════

const MANUS_API_BASE = 'https://api.manus.ai/v1';

/**
 * Send a slide deck brief to Manus AI to auto-generate the presentation.
 * Manus creates slides asynchronously — poll checkManusTaskStatus() for results.
 * 
 * API: POST /v1/tasks
 * Auth: API_KEY header
 * Response: { task_id, task_title, task_url }
 */
export async function createManusSlideTask(slideBrief, topic, sourceUrl = '') {
    const settings = loadSettings();
    const apiKey = settings.manusApiKey;

    if (!apiKey) {
        throw new Error('Manus API key not configured. Go to Settings to add your key.');
    }

    const prompt = `Create a professional slide deck presentation for a short-form video about motorcycle racing mental performance.

BRAND GUIDELINES:
- Background: #0A1628 (deep navy/dark)
- Accent colour: #00BFA5 (teal)  
- Secondary accent: #4488FF (blue)
- Warning/highlight: #DAA520 (gold)
- Font: Montserrat (headings), Inter (body)
- Style: Clean, dark, premium — think Apple Keynote meets motorsport
- Images: RACE BIKES ONLY (no road bikes, no street bikes, no touring bikes)
- NO clipart. NO stock photos with text. Minimal text per slide.
- Each slide should be 1080x1920 pixels (9:16 vertical for Reels)
- CRITICAL: Keep bottom-right quadrant clear — AI avatar will overlay there

TOPIC: ${topic}
${sourceUrl ? `SOURCE ARTICLE: ${sourceUrl}` : ''}

SLIDE DECK BRIEF:
${slideBrief}

REQUIREMENTS:
1. Create each slide as described in the brief above
2. Use the exact text content specified for each slide
3. Apply the brand colours and fonts consistently
4. Export as individual PNG images (1080x1920 each)
5. Make the data/stat slides visually impactful — large numbers, bold typography
6. The hook slide should grab attention immediately
7. Keep all text large and readable on mobile screens
8. Bottom-right 25% of each slide must be clear (avatar overlay zone)`;

    addLogEntry('api', `Manus: Creating slide task for "${topic}"`, `Brief length: ${slideBrief.length} chars`);

    const response = await fetch(`${MANUS_API_BASE}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': apiKey
        },
        body: JSON.stringify({
            prompt: prompt,
            taskMode: 'agent',
            agentProfile: 'manus-1.6'
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || error.error || `Manus API error: ${response.status}`;
        addLogEntry('error', `Manus task creation failed: ${msg}`);
        throw new Error(msg);
    }

    const data = await response.json();
    const taskId = data.task_id || data.taskId || data.data?.taskId || data.id;
    const taskUrl = data.task_url || data.taskUrl || '';

    addLogEntry('success', `Manus task created: ${taskId}`, taskUrl);

    // Save job for tracking
    const job = savePipelineJob({
        id: `manus-${taskId}`,
        type: 'manus-slides',
        taskId,
        taskUrl,
        topic,
        status: 'processing',
        createdAt: new Date().toISOString()
    });

    return { taskId, taskUrl, job };
}

/**
 * Check the status of a Manus task and retrieve output files.
 * Files are embedded in the response output array as output_file objects
 * with fileUrl and fileName properties.
 * 
 * API: GET /v1/tasks/{task_id}
 * Optional: ?convert=pptx (converts PowerPoint files)
 */
export async function checkManusTaskStatus(taskId) {
    const settings = loadSettings();
    const apiKey = settings.manusApiKey;

    if (!apiKey) throw new Error('Manus API key not configured.');

    const response = await fetch(`${MANUS_API_BASE}/tasks/${taskId}`, {
        headers: { 'API_KEY': apiKey }
    });

    if (!response.ok) {
        throw new Error(`Manus status check failed: ${response.status}`);
    }

    const data = await response.json();
    const status = data.status || data.data?.status || 'unknown';

    // Extract files from output messages (Manus embeds files as output_file objects)
    let files = [];
    if (status === 'completed' || status === 'done') {
        const output = data.output || data.data?.output || [];
        files = output
            .filter(msg => msg.type === 'output_file' || msg.fileUrl)
            .map(msg => ({
                url: msg.fileUrl || msg.file_url || msg.url,
                name: msg.fileName || msg.file_name || msg.name || 'slide',
                type: msg.fileType || msg.file_type || 'image/png'
            }));

        // Fallback: try the separate files endpoint if output doesn't have files
        if (files.length === 0) {
            try {
                const filesResponse = await fetch(`${MANUS_API_BASE}/tasks/${taskId}/files`, {
                    headers: { 'API_KEY': apiKey }
                });
                if (filesResponse.ok) {
                    const filesData = await filesResponse.json();
                    files = (filesData.files || filesData.data?.files || []).map(f => ({
                        url: f.url || f.fileUrl,
                        name: f.name || f.fileName || 'slide',
                        type: f.type || f.fileType || 'image/png'
                    }));
                }
            } catch (e) {
                console.warn('Could not fetch Manus files endpoint:', e.message);
            }
        }

        addLogEntry('success', `Manus task ${taskId} completed — ${files.length} files`, 
            files.map(f => f.name).join(', '));
    }

    // Update pipeline job
    savePipelineJob({
        id: `manus-${taskId}`,
        type: 'manus-slides',
        taskId,
        status: (status === 'completed' || status === 'done') ? 'completed' : status,
        files,
        updatedAt: new Date().toISOString()
    });

    return { status, files };
}


// ═══════════════════════════════════════════════════════════════
// HEYGEN API — Video Generation
// Two modes: Direct (v2/video/generate) and Template (v2/template/{id}/generate)
// Status check: GET v1/video_status.get?video_id={id}
// ═══════════════════════════════════════════════════════════════

const HEYGEN_API_BASE = 'https://api.heygen.com';

/**
 * List available avatars from HeyGen account
 * API: GET /v2/avatars
 */
export async function listHeyGenAvatars() {
    const settings = loadSettings();
    const apiKey = settings.heygenApiKey;
    if (!apiKey) throw new Error('HeyGen API key not configured.');

    const response = await fetch(`${HEYGEN_API_BASE}/v2/avatars`, {
        headers: { 'x-api-key': apiKey }
    });
    if (!response.ok) throw new Error(`HeyGen avatars error: ${response.status}`);

    const data = await response.json();
    return data.data?.avatars || [];
}

/**
 * List available voices from HeyGen account
 * API: GET /v2/voices
 */
export async function listHeyGenVoices() {
    const settings = loadSettings();
    const apiKey = settings.heygenApiKey;
    if (!apiKey) throw new Error('HeyGen API key not configured.');

    const response = await fetch(`${HEYGEN_API_BASE}/v2/voices`, {
        headers: { 'x-api-key': apiKey }
    });
    if (!response.ok) throw new Error(`HeyGen voices error: ${response.status}`);

    const data = await response.json();
    return data.data?.voices || [];
}

/**
 * Generate a video from a script with avatar overlay on slides.
 * Uses direct V2 video generation with multi-scene inputs.
 * 
 * API: POST /v2/video/generate
 * Auth: x-api-key header
 * Max 50 scenes per video
 */
export async function createHeyGenVideo({ script, avatarId, voiceId, slideImageUrls = [] }) {
    const settings = loadSettings();
    const apiKey = settings.heygenApiKey;

    if (!apiKey) throw new Error('HeyGen API key not configured.');
    if (!avatarId) throw new Error('Please select an avatar from your HeyGen account.');

    // Parse script into scene narration blocks
    const scriptMatch = script.match(/=== VIDEO SCRIPT ===([\s\S]*?)(?:=== SLIDE DECK|$)/);
    const scriptText = scriptMatch ? scriptMatch[1].trim() : script;

    // Split by section markers (HOOK, SCENARIO, THE SCIENCE, etc.)
    const sectionPattern = /(?:HOOK|SCENARIO|THE SCIENCE|THE COST|THE BRIDGE|CTA)[^:]*:\s*/gi;
    const parts = scriptText.split(sectionPattern).filter(p => p.trim());

    // Build voice config
    const voiceConfig = voiceId
        ? { type: 'text', voice_id: voiceId, input_text: '' }
        : { type: 'text', input_text: '' };

    // Build scenes — each scene pairs narration with a slide background
    const scenes = parts.map((narration, i) => {
        const scene = {
            character: {
                type: 'avatar',
                avatar_id: avatarId,
                avatar_style: 'normal',
                voice: { ...voiceConfig, input_text: narration.trim() }
            }
        };

        // If we have slide images, use them as backgrounds
        if (slideImageUrls[i]) {
            scene.background = {
                type: 'image',
                url: slideImageUrls[i]
            };
        } else {
            scene.background = {
                type: 'color',
                value: '#0A1628'
            };
        }

        return scene;
    });

    addLogEntry('api', `HeyGen: Creating video with ${scenes.length} scenes`, 
        `Avatar: ${avatarId}, Voice: ${voiceId || 'default'}, Slides: ${slideImageUrls.length}`);

    const response = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({
            video_inputs: scenes,
            dimension: { width: 1080, height: 1920 }
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || error.error?.message || `HeyGen API error: ${response.status}`;
        addLogEntry('error', `HeyGen video creation failed: ${msg}`);
        throw new Error(msg);
    }

    const data = await response.json();
    const videoId = data.data?.video_id || data.video_id;

    addLogEntry('success', `HeyGen video queued: ${videoId}`);

    savePipelineJob({
        id: `heygen-${videoId}`,
        type: 'heygen-video',
        videoId,
        status: 'processing',
        createdAt: new Date().toISOString()
    });

    return { videoId };
}

/**
 * Generate a video from a pre-built HeyGen template.
 * Template should have variables for script text and slide backgrounds.
 * 
 * API: POST /v2/template/{template_id}/generate
 * Variables use double curly bracket placeholders defined in the template
 */
export async function createHeyGenFromTemplate({ templateId, scriptText, slideImageUrl, title }) {
    const settings = loadSettings();
    const apiKey = settings.heygenApiKey;

    if (!apiKey) throw new Error('HeyGen API key not configured.');
    if (!templateId) throw new Error('HeyGen Template ID not configured. Create a template in HeyGen first.');

    addLogEntry('api', `HeyGen Template: Generating from template ${templateId}`, title);

    const variables = {};

    // Map script text to template variable (assumes template has a {{script}} variable)
    if (scriptText) {
        variables.script = { type: 'text', value: scriptText };
    }

    // Map slide background (assumes template has a {{background}} variable)
    if (slideImageUrl) {
        variables.background = { type: 'image', value: slideImageUrl };
    }

    const response = await fetch(`${HEYGEN_API_BASE}/v2/template/${templateId}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({
            title: title || 'Camino Coaching Video',
            variables,
            dimension: { width: 1080, height: 1920 }
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || error.error?.message || `HeyGen Template API error: ${response.status}`;
        addLogEntry('error', `HeyGen template generation failed: ${msg}`);
        throw new Error(msg);
    }

    const data = await response.json();
    const videoId = data.data?.video_id || data.video_id;

    addLogEntry('success', `HeyGen template video queued: ${videoId}`);

    savePipelineJob({
        id: `heygen-${videoId}`,
        type: 'heygen-video',
        videoId,
        templateId,
        status: 'processing',
        createdAt: new Date().toISOString()
    });

    return { videoId };
}

/**
 * Check HeyGen video rendering status
 * 
 * API: GET /v1/video_status.get?video_id={video_id}
 * Auth: x-api-key header
 * Returns: status, video_url, thumbnail_url, duration
 */
export async function checkHeyGenStatus(videoId) {
    const settings = loadSettings();
    const apiKey = settings.heygenApiKey;
    if (!apiKey) throw new Error('HeyGen API key not configured.');

    const response = await fetch(`${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`, {
        headers: { 'x-api-key': apiKey }
    });

    if (!response.ok) throw new Error(`HeyGen status check failed: ${response.status}`);

    const data = await response.json();
    const status = data.data?.status || 'unknown';

    savePipelineJob({
        id: `heygen-${videoId}`,
        type: 'heygen-video',
        videoId,
        status: status === 'completed' ? 'completed' : status,
        videoUrl: data.data?.video_url || null,
        thumbnailUrl: data.data?.thumbnail_url || null,
        duration: data.data?.duration || null,
        updatedAt: new Date().toISOString()
    });

    return {
        status,
        videoUrl: data.data?.video_url || null,
        thumbnailUrl: data.data?.thumbnail_url || null,
        duration: data.data?.duration || null
    };
}


// ═══════════════════════════════════════════════════════════════
// GHL SOCIAL PLANNER API — Video Upload + Multi-Platform Scheduling
// Step 1: Upload video to GHL Media Library
// Step 2: Create scheduled post with video + caption
// ═══════════════════════════════════════════════════════════════

const GHL_API_BASE = 'https://services.leadconnectorhq.com';

/**
 * Upload a video from URL to GHL Media Library.
 * Required before scheduling a video post.
 * 
 * API: POST /medias/upload-file
 * Auth: Bearer token, scope: medias.write
 * Max video size: 500MB
 * Supported formats: mp4, mpeg, 3gp
 */
export async function uploadVideoToGHL(videoUrl, fileName = 'camino-video.mp4') {
    const settings = loadSettings();
    const token = settings.ghlToken;

    if (!token) throw new Error('GHL token not configured.');

    addLogEntry('api', `GHL: Uploading video to media library`, fileName);

    const response = await fetch(`${GHL_API_BASE}/medias/upload-file`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify({
            fileUrl: videoUrl,
            hosted: true,
            name: fileName
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || error.error?.message || `GHL media upload error: ${response.status}`;
        addLogEntry('error', `GHL media upload failed: ${msg}`);
        throw new Error(msg);
    }

    const data = await response.json();
    const mediaUrl = data.url || data.data?.url;
    const fileId = data.fileId || data.data?.fileId;

    addLogEntry('success', `GHL media uploaded: ${fileId}`, mediaUrl);

    return { mediaUrl, fileId };
}

/**
 * Get connected social media accounts from GHL.
 * Returns account IDs needed for scheduling posts.
 * 
 * API: GET /social-media-posting/:locationId/accounts
 */
export async function getGHLSocialAccounts() {
    const settings = loadSettings();
    const token = settings.ghlToken;
    const locationId = settings.ghlLocationId;

    if (!token) throw new Error('GHL token not configured.');
    if (!locationId) throw new Error('GHL Location ID not configured.');

    const response = await fetch(`${GHL_API_BASE}/social-media-posting/${locationId}/accounts`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Version': '2021-07-28'
        }
    });

    if (!response.ok) throw new Error(`GHL accounts fetch failed: ${response.status}`);

    const data = await response.json();
    return data.accounts || data.data?.accounts || [];
}

/**
 * Schedule a post with video to GHL Social Planner.
 * Supports Facebook, Instagram (Reels), and YouTube.
 * 
 * API: POST /social-media-posting/:locationId/posts
 * Auth: Bearer token, scope: social-media-posting.write
 * 
 * @param {Object} options
 * @param {string} options.caption - Post caption text
 * @param {string} options.mediaUrl - GHL media library URL (from uploadVideoToGHL)
 * @param {string[]} options.accountIds - Connected account IDs (from getGHLSocialAccounts)
 * @param {Date} options.scheduleDate - When to publish
 * @param {string} options.postType - 'post', 'reel', or 'story'
 */
export async function scheduleGHLPost({ caption, mediaUrl, accountIds, scheduleDate, postType = 'reel' }) {
    const settings = loadSettings();
    const token = settings.ghlToken;
    const locationId = settings.ghlLocationId;

    if (!token) throw new Error('GHL token not configured.');
    if (!locationId) throw new Error('GHL Location ID not configured.');
    if (!accountIds || accountIds.length === 0) throw new Error('No social media accounts selected.');

    const scheduledAt = scheduleDate instanceof Date
        ? scheduleDate.toISOString()
        : scheduleDate;

    addLogEntry('api', `GHL: Scheduling ${postType} for ${scheduledAt}`, 
        `Accounts: ${accountIds.length}, Caption: ${caption.substring(0, 80)}...`);

    const body = {
        accountIds,
        summary: caption,
        status: 'scheduled',
        scheduleDate: scheduledAt,
        mediaUrls: mediaUrl ? [mediaUrl] : []
    };

    // Platform-specific post type configuration
    if (postType === 'reel') {
        body.instagramPostDetails = { type: 'reel' };
        body.facebookPostDetails = { type: 'reel' };
    }

    const response = await fetch(`${GHL_API_BASE}/social-media-posting/${locationId}/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || error.error?.message || `GHL scheduling error: ${response.status}`;
        addLogEntry('error', `GHL scheduling failed: ${msg}`);
        throw new Error(msg);
    }

    const data = await response.json();
    addLogEntry('success', `GHL post scheduled for ${scheduledAt}`, `Post ID: ${data.id || data.postId || 'unknown'}`);

    return {
        postId: data.id || data.postId,
        status: 'scheduled',
        scheduledAt
    };
}


// ═══════════════════════════════════════════════════════════════
// REVIEW GATE — Human Approval Before Video Render
// Shows slide thumbnails, allows approve/reject/rebuild
// ═══════════════════════════════════════════════════════════════

// Pending reviews stored in localStorage
const REVIEW_KEY = 'rider-social-media-pending-reviews';

function getPendingReviews() {
    try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]'); }
    catch { return []; }
}

function savePendingReview(review) {
    const reviews = getPendingReviews();
    const existing = reviews.findIndex(r => r.pipelineId === review.pipelineId);
    if (existing >= 0) {
        reviews[existing] = review;
    } else {
        reviews.push(review);
    }
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews.slice(-20)));
    return review;
}

function removePendingReview(pipelineId) {
    const reviews = getPendingReviews().filter(r => r.pipelineId !== pipelineId);
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
}

/**
 * Queue slides for human review before sending to HeyGen.
 * Returns a Promise that resolves when the user approves or rejects.
 */
export function queueForReview(pipelineId, slideFiles, topic) {
    const review = {
        pipelineId,
        topic,
        slideFiles,
        status: 'pending', // pending | approved | rejected | rebuilding
        createdAt: new Date().toISOString()
    };
    savePendingReview(review);

    addLogEntry('info', `Review gate: "${topic}" slides ready for approval`, 
        `${slideFiles.length} slides queued`);

    // Dispatch UI event so app.js can show the review modal
    document.dispatchEvent(new CustomEvent('pipeline-review-needed', {
        detail: review
    }));

    return review;
}

/**
 * Approve slides — pipeline continues to HeyGen
 */
export function approveReview(pipelineId) {
    const reviews = getPendingReviews();
    const review = reviews.find(r => r.pipelineId === pipelineId);
    if (review) {
        review.status = 'approved';
        review.approvedAt = new Date().toISOString();
        savePendingReview(review);
        addLogEntry('success', `Review approved: continuing to HeyGen`, review.topic);
        document.dispatchEvent(new CustomEvent('pipeline-review-approved', {
            detail: review
        }));
    }
    return review;
}

/**
 * Reject slides — pipeline stops, user rebuilds manually
 */
export function rejectReview(pipelineId, reason = '') {
    const reviews = getPendingReviews();
    const review = reviews.find(r => r.pipelineId === pipelineId);
    if (review) {
        review.status = 'rejected';
        review.rejectedAt = new Date().toISOString();
        review.rejectionReason = reason;
        savePendingReview(review);
        addLogEntry('warn', `Review rejected: ${reason || 'Manual rebuild needed'}`, review.topic);
        document.dispatchEvent(new CustomEvent('pipeline-review-rejected', {
            detail: review
        }));
    }
    return review;
}

/**
 * Get all pending reviews for the UI
 */
export { getPendingReviews };


// ═══════════════════════════════════════════════════════════════
// FULL PIPELINE ORCHESTRATOR — Single Video
// Script → Manus → [poll] → ⏸️ Review → HeyGen → [poll] → GHL → Done
// ═══════════════════════════════════════════════════════════════

/**
 * Run the full production pipeline for a single video:
 * 1. Extract slide brief → send to Manus
 * 2. Poll Manus for slide deck completion (up to 15 minutes)
 * 3. ⏸️ Queue for human review (pause pipeline)
 * 4. On approval → send to HeyGen
 * 5. Poll HeyGen for video render completion (up to 10 minutes)
 * 6. Upload video to GHL media → schedule post
 * 
 * @param {Object} options
 * @param {string} options.script - Full video script with slide brief
 * @param {string} options.caption - Facebook/Instagram caption text
 * @param {string} options.topic - Topic name for display
 * @param {string} options.sourceUrl - Source article URL
 * @param {Date} options.scheduleDate - When to publish
 * @param {string[]} options.ghlAccountIds - GHL social account IDs
 * @param {boolean} options.skipReview - Skip the human review gate (use with caution)
 * @param {Function} options.onProgress - Callback: ({ step, total, message, warning? })
 */
export async function runFullPipeline({
    script,
    caption = '',
    topic,
    sourceUrl = '',
    scheduleDate,
    ghlAccountIds = [],
    skipReview = false,
    onProgress
}) {
    const settings = loadSettings();
    const pipelineId = `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const TOTAL_STEPS = 5;

    addLogEntry('info', `Pipeline started: "${topic}"`, pipelineId);

    savePipelineJob({
        id: pipelineId,
        type: 'full-pipeline',
        topic,
        status: 'running',
        currentStep: 1,
        createdAt: new Date().toISOString()
    });

    // ── Step 1: Send slide brief to Manus ────────────────────
    onProgress?.({ step: 1, total: TOTAL_STEPS, message: '🎨 Sending slide brief to Manus...' });

    const slideBriefMatch = script.match(/=== SLIDE DECK BRIEF.*?===([\s\S]*?)(?:=== HEYGEN|=== AVATAR|$)/);
    const slideBrief = slideBriefMatch ? slideBriefMatch[1].trim() : '';

    let manusTaskId = null;
    let slideFiles = [];

    if (slideBrief && settings.manusApiKey) {
        try {
            const manusResult = await createManusSlideTask(slideBrief, topic, sourceUrl);
            manusTaskId = manusResult.taskId;
            onProgress?.({ step: 1, total: TOTAL_STEPS, message: `🎨 Manus task created (ID: ${manusTaskId}). Building slides...` });
        } catch (err) {
            onProgress?.({ step: 1, total: TOTAL_STEPS, message: `⚠️ Manus skipped: ${err.message}`, warning: true });
            addLogEntry('warn', `Pipeline ${pipelineId}: Manus skipped`, err.message);
        }
    } else {
        onProgress?.({ step: 1, total: TOTAL_STEPS, message: '⚠️ Manus skipped — no API key or no slide brief', warning: true });
    }

    // ── Step 2: Poll Manus for completion (max 15 minutes) ───
    if (manusTaskId) {
        onProgress?.({ step: 2, total: TOTAL_STEPS, message: '⏳ Waiting for Manus to finish slides...' });

        const maxAttempts = 90; // 90 x 10s = 15 minutes
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 10000));

            try {
                const status = await checkManusTaskStatus(manusTaskId);
                if (status.status === 'completed' || status.status === 'done') {
                    slideFiles = status.files;
                    onProgress?.({ step: 2, total: TOTAL_STEPS, message: `✅ Slide deck ready! ${slideFiles.length} slides generated.` });
                    break;
                } else if (status.status === 'failed' || status.status === 'error') {
                    onProgress?.({ step: 2, total: TOTAL_STEPS, message: '❌ Manus task failed — proceed manually.', warning: true });
                    addLogEntry('error', `Pipeline ${pipelineId}: Manus task failed`);
                    break;
                }
                onProgress?.({ step: 2, total: TOTAL_STEPS, message: `⏳ Manus building slides... (${Math.round((attempt + 1) * 10 / 60)}min)` });
            } catch (err) {
                console.warn('Manus poll error:', err.message);
            }
        }
    } else {
        onProgress?.({ step: 2, total: TOTAL_STEPS, message: '⏭️ Skipping slide poll — no Manus task', warning: true });
    }

    // ── Step 3: Review Gate ──────────────────────────────────
    if (slideFiles.length > 0 && !skipReview) {
        onProgress?.({ step: 3, total: TOTAL_STEPS, message: '⏸️ Slides ready — waiting for your approval...' });

        savePipelineJob({
            id: pipelineId,
            currentStep: 3,
            status: 'awaiting-review',
            manusTaskId,
            slideFiles
        });

        const review = queueForReview(pipelineId, slideFiles, topic);

        // Wait for approval (this pauses the pipeline until user acts)
        const approved = await waitForReviewApproval(pipelineId);

        if (!approved) {
            onProgress?.({ step: 3, total: TOTAL_STEPS, message: '❌ Slides rejected — pipeline stopped.', warning: true });
            savePipelineJob({ id: pipelineId, status: 'rejected' });
            addLogEntry('warn', `Pipeline ${pipelineId}: Slides rejected`, topic);
            return { pipelineId, manusTaskId, slideFiles, status: 'rejected' };
        }

        onProgress?.({ step: 3, total: TOTAL_STEPS, message: '✅ Slides approved — sending to HeyGen...' });
    } else if (slideFiles.length === 0) {
        onProgress?.({ step: 3, total: TOTAL_STEPS, message: '⏭️ No slides to review — continuing...', warning: true });
    } else {
        onProgress?.({ step: 3, total: TOTAL_STEPS, message: '⏭️ Review skipped — continuing to HeyGen...' });
    }

    // ── Step 4: Send to HeyGen ───────────────────────────────
    let heygenVideoId = null;
    let videoUrl = null;

    if (settings.heygenApiKey) {
        onProgress?.({ step: 4, total: TOTAL_STEPS, message: '🎬 Sending to HeyGen for video rendering...' });

        try {
            const slideImageUrls = slideFiles
                .filter(f => f.url && (f.name?.match(/\.(png|jpg|jpeg|webp)$/i) || f.type?.startsWith('image/')))
                .map(f => f.url);

            // Use Template API if template ID is configured, otherwise direct generation
            const templateId = settings.heygenTemplateId;
            let heygenResult;

            if (templateId) {
                // Extract clean narration text for the template
                const scriptMatch2 = script.match(/=== VIDEO SCRIPT ===([\s\S]*?)(?:=== SLIDE DECK|$)/);
                const cleanScript = scriptMatch2 ? scriptMatch2[1].trim() : script;

                heygenResult = await createHeyGenFromTemplate({
                    templateId,
                    scriptText: cleanScript,
                    slideImageUrl: slideImageUrls[0] || null,
                    title: `${topic} — Camino Coaching`
                });
            } else {
                heygenResult = await createHeyGenVideo({
                    script,
                    avatarId: settings.heygenAvatarId || 'default',
                    voiceId: settings.heygenVoiceId || '',
                    slideImageUrls
                });
            }

            heygenVideoId = heygenResult.videoId;

            onProgress?.({ step: 4, total: TOTAL_STEPS, message: `🎬 HeyGen rendering video (ID: ${heygenVideoId})...` });

            // Poll HeyGen for completion (max 10 minutes)
            const maxHeyGenAttempts = 60; // 60 x 10s = 10 minutes
            for (let attempt = 0; attempt < maxHeyGenAttempts; attempt++) {
                await new Promise(resolve => setTimeout(resolve, 10000));

                try {
                    const status = await checkHeyGenStatus(heygenVideoId);
                    if (status.status === 'completed') {
                        videoUrl = status.videoUrl;
                        onProgress?.({ step: 4, total: TOTAL_STEPS, message: `✅ Video rendered! Duration: ${status.duration || '?'}s` });
                        break;
                    } else if (status.status === 'failed' || status.status === 'error') {
                        onProgress?.({ step: 4, total: TOTAL_STEPS, message: '❌ HeyGen rendering failed.', warning: true });
                        addLogEntry('error', `Pipeline ${pipelineId}: HeyGen render failed`);
                        break;
                    }
                    onProgress?.({ step: 4, total: TOTAL_STEPS, message: `🎬 HeyGen rendering... (${Math.round((attempt + 1) * 10 / 60)}min)` });
                } catch (err) {
                    console.warn('HeyGen poll error:', err.message);
                }
            }
        } catch (err) {
            onProgress?.({ step: 4, total: TOTAL_STEPS, message: `⚠️ HeyGen error: ${err.message}`, warning: true });
            addLogEntry('error', `Pipeline ${pipelineId}: HeyGen error`, err.message);
        }
    } else {
        onProgress?.({ step: 4, total: TOTAL_STEPS, message: '⚠️ HeyGen skipped — no API key configured.', warning: true });
    }

    // ── Step 5: Upload video + Schedule to GHL ───────────────
    let ghlPostId = null;

    if (videoUrl && settings.ghlToken && settings.ghlLocationId) {
        onProgress?.({ step: 5, total: TOTAL_STEPS, message: '📡 Uploading video to GHL and scheduling...' });

        try {
            // Step 5a: Upload video to GHL media library
            const safeFileName = `camino-${topic.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 40)}.mp4`;
            const mediaResult = await uploadVideoToGHL(videoUrl, safeFileName);

            // Step 5b: Get social account IDs if not provided
            let accountIds = ghlAccountIds;
            if (accountIds.length === 0) {
                try {
                    const accounts = await getGHLSocialAccounts();
                    accountIds = accounts
                        .filter(a => ['facebook', 'instagram', 'youtube'].includes(a.platform?.toLowerCase()))
                        .map(a => a.id || a.accountId);
                    addLogEntry('info', `GHL: Found ${accountIds.length} social accounts`, 
                        accounts.map(a => `${a.platform}: ${a.name || a.id}`).join(', '));
                } catch (err) {
                    addLogEntry('warn', `Could not auto-discover GHL accounts: ${err.message}`);
                }
            }

            if (accountIds.length > 0 && mediaResult.mediaUrl) {
                // Step 5c: Schedule the post
                const postResult = await scheduleGHLPost({
                    caption: caption || `${topic} — Camino Coaching`,
                    mediaUrl: mediaResult.mediaUrl,
                    accountIds,
                    scheduleDate: scheduleDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
                    postType: 'reel'
                });

                ghlPostId = postResult.postId;
                onProgress?.({ step: 5, total: TOTAL_STEPS, message: `✅ Scheduled for ${postResult.scheduledAt}!` });
            } else {
                onProgress?.({ step: 5, total: TOTAL_STEPS, message: '⚠️ Video uploaded but no social accounts found for scheduling.', warning: true });
            }
        } catch (err) {
            onProgress?.({ step: 5, total: TOTAL_STEPS, message: `⚠️ GHL error: ${err.message}`, warning: true });
            addLogEntry('error', `Pipeline ${pipelineId}: GHL error`, err.message);
        }
    } else if (videoUrl) {
        onProgress?.({ step: 5, total: TOTAL_STEPS, message: '⚠️ GHL skipped — no token/location configured. Video URL saved.', warning: true });
    } else {
        onProgress?.({ step: 5, total: TOTAL_STEPS, message: '⚠️ No video to schedule — pipeline completed partially.', warning: true });
    }

    // ── Pipeline Complete ────────────────────────────────────
    const finalStatus = videoUrl && ghlPostId ? 'completed' : (videoUrl ? 'video-ready' : 'partial');

    savePipelineJob({
        id: pipelineId,
        type: 'full-pipeline',
        topic,
        manusTaskId,
        heygenVideoId,
        videoUrl,
        ghlPostId,
        status: finalStatus,
        completedAt: new Date().toISOString()
    });

    addLogEntry('success', `Pipeline ${finalStatus}: "${topic}"`, 
        `Manus: ${manusTaskId || 'skipped'} | HeyGen: ${heygenVideoId || 'skipped'} | GHL: ${ghlPostId || 'skipped'}`);

    return {
        pipelineId,
        manusTaskId,
        heygenVideoId,
        videoUrl,
        ghlPostId,
        slideFiles,
        status: finalStatus
    };
}

/**
 * Wait for human approval of slides.
 * Resolves true (approved) or false (rejected).
 * Times out after 30 minutes.
 */
function waitForReviewApproval(pipelineId) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            cleanup();
            addLogEntry('warn', `Review timed out for pipeline ${pipelineId}`);
            resolve(false);
        }, 30 * 60 * 1000); // 30 minute timeout

        const onApproved = (e) => {
            if (e.detail?.pipelineId === pipelineId) {
                cleanup();
                resolve(true);
            }
        };

        const onRejected = (e) => {
            if (e.detail?.pipelineId === pipelineId) {
                cleanup();
                resolve(false);
            }
        };

        const cleanup = () => {
            clearTimeout(timeout);
            document.removeEventListener('pipeline-review-approved', onApproved);
            document.removeEventListener('pipeline-review-rejected', onRejected);
        };

        document.addEventListener('pipeline-review-approved', onApproved);
        document.addEventListener('pipeline-review-rejected', onRejected);
    });
}


// ═══════════════════════════════════════════════════════════════
// BATCH PIPELINE — "Write All 7" Sunday Morning Mode
// Runs multiple pipelines in parallel with shared progress tracking
// ═══════════════════════════════════════════════════════════════

const BATCH_KEY = 'rider-social-media-batch-jobs';

function getBatchJobs() {
    try { return JSON.parse(localStorage.getItem(BATCH_KEY) || '[]'); }
    catch { return []; }
}

function saveBatchJob(batch) {
    const batches = getBatchJobs();
    const existing = batches.findIndex(b => b.id === batch.id);
    if (existing >= 0) {
        batches[existing] = { ...batches[existing], ...batch };
    } else {
        batches.push(batch);
    }
    localStorage.setItem(BATCH_KEY, JSON.stringify(batches.slice(-10)));
    return batch;
}

/**
 * Run the full pipeline for multiple videos in parallel.
 * The "Write All 7" workflow.
 * 
 * @param {Object[]} items - Array of { script, caption, topic, sourceUrl }
 * @param {Object} options
 * @param {boolean} options.skipReview - Skip slide review (not recommended)
 * @param {string[]} options.ghlAccountIds - GHL social account IDs
 * @param {Function} options.onBatchProgress - Callback: ({ batchId, completed, total, items })
 */
export async function runBatchPipeline(items, {
    skipReview = false,
    ghlAccountIds = [],
    onBatchProgress
} = {}) {
    const batchId = `batch-${Date.now()}`;
    const scheduleDates = getScheduleDates(items.length);

    addLogEntry('info', `Batch pipeline started: ${items.length} videos`, batchId);

    const batchState = {
        id: batchId,
        totalItems: items.length,
        completedItems: 0,
        status: 'running',
        items: items.map((item, i) => ({
            index: i,
            topic: item.topic,
            status: 'queued',
            pipelineId: null,
            scheduleDate: scheduleDates[i]?.date?.toISOString()
        })),
        createdAt: new Date().toISOString()
    };

    saveBatchJob(batchState);

    // Dispatch initial batch progress
    onBatchProgress?.({
        batchId,
        completed: 0,
        total: items.length,
        items: batchState.items
    });

    // Run all pipelines in parallel (with concurrency limit of 3)
    const CONCURRENCY = 3;
    const results = [];

    for (let i = 0; i < items.length; i += CONCURRENCY) {
        const chunk = items.slice(i, i + CONCURRENCY);
        const chunkPromises = chunk.map((item, chunkIdx) => {
            const globalIdx = i + chunkIdx;
            const scheduleDate = scheduleDates[globalIdx]?.date || new Date(Date.now() + (globalIdx + 1) * 24 * 60 * 60 * 1000);

            return runFullPipeline({
                script: item.script,
                caption: item.caption || '',
                topic: item.topic,
                sourceUrl: item.sourceUrl || '',
                scheduleDate,
                ghlAccountIds,
                skipReview,
                onProgress: (progress) => {
                    // Update individual item in batch state
                    batchState.items[globalIdx].status = progress.warning ? 'warning' : 'running';
                    batchState.items[globalIdx].currentStep = progress.step;
                    batchState.items[globalIdx].message = progress.message;
                    saveBatchJob(batchState);

                    onBatchProgress?.({
                        batchId,
                        completed: batchState.completedItems,
                        total: items.length,
                        items: batchState.items,
                        currentItem: { index: globalIdx, ...progress }
                    });
                }
            }).then((result) => {
                batchState.completedItems++;
                batchState.items[globalIdx].status = result.status;
                batchState.items[globalIdx].pipelineId = result.pipelineId;
                batchState.items[globalIdx].videoUrl = result.videoUrl;
                saveBatchJob(batchState);

                onBatchProgress?.({
                    batchId,
                    completed: batchState.completedItems,
                    total: items.length,
                    items: batchState.items
                });

                return result;
            }).catch((err) => {
                batchState.completedItems++;
                batchState.items[globalIdx].status = 'error';
                batchState.items[globalIdx].error = err.message;
                saveBatchJob(batchState);

                addLogEntry('error', `Batch item ${globalIdx + 1} failed: ${item.topic}`, err.message);
                return { status: 'error', error: err.message };
            });
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
    }

    // Final batch status
    const successCount = results.filter(r => r.status === 'completed' || r.status === 'video-ready').length;
    batchState.status = successCount === items.length ? 'completed' : 'partial';
    batchState.completedAt = new Date().toISOString();
    saveBatchJob(batchState);

    addLogEntry('success', `Batch pipeline finished: ${successCount}/${items.length} successful`, batchId);

    onBatchProgress?.({
        batchId,
        completed: items.length,
        total: items.length,
        items: batchState.items,
        finished: true
    });

    return {
        batchId,
        results,
        successCount,
        totalCount: items.length
    };
}


// ═══════════════════════════════════════════════════════════════
// PIPELINE DASHBOARD — Status Queries
// ═══════════════════════════════════════════════════════════════

/**
 * Get all recent pipeline jobs for the dashboard
 */
export function getRecentPipelineJobs() {
    return getPipelineJobs()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 30);
}

/**
 * Get all batch jobs
 */
export function getRecentBatchJobs() {
    return getBatchJobs()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
}

/**
 * Get a specific pipeline job by ID
 */
export { getPipelineJob };
