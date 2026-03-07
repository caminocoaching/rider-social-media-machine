// ═══════════════════════════════════════════════════════════════
// 🏍️ REVIEW SCANNER — Weekly Trustpilot & Google Review Monitor
// Fetches new reviews, compares against stored bank, flags new ones
// for approval and content mining
// ═══════════════════════════════════════════════════════════════

import { TRUSTPILOT_REVIEWS, GOOGLE_REVIEWS, REVIEW_STATS, mineReview } from './review-bank.js';

const SCANNER_STORAGE_KEY = 'rider-review-scanner';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// ─── Scanner State (persisted to localStorage) ───────────────
function loadScannerState() {
    try {
        const stored = localStorage.getItem(SCANNER_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn('Failed to load scanner state:', e);
    }
    return {
        lastScanDate: null,
        lastScanSource: null,
        knownReviewCount: {
            trustpilot: TRUSTPILOT_REVIEWS.length,
            google: GOOGLE_REVIEWS.length
        },
        knownReviewIds: buildKnownIds(),
        newReviews: [],
        approvedNewReviews: [],
        scanHistory: [],
        autoScanEnabled: true,
        scanIntervalDays: 7
    };
}

function saveScannerState(state) {
    try {
        localStorage.setItem(SCANNER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save scanner state:', e);
    }
}

// ─── Build Known Review IDs (fingerprints for dedup) ─────────
function buildKnownIds() {
    const ids = new Set();
    TRUSTPILOT_REVIEWS.forEach(r => {
        ids.add(reviewFingerprint(r.name, r.text));
    });
    GOOGLE_REVIEWS.forEach(r => {
        if (r.text) ids.add(reviewFingerprint(r.name, r.text));
    });
    return [...ids];
}

function reviewFingerprint(name, text) {
    // Create a simple fingerprint from name + first 80 chars of review
    const snippet = (text || '').substring(0, 80).toLowerCase().replace(/\s+/g, ' ').trim();
    return `${(name || '').toLowerCase().trim()}::${snippet}`;
}

// ─── Check If Scan Is Due ────────────────────────────────────
export function isScanDue() {
    const state = loadScannerState();
    if (!state.autoScanEnabled) return false;
    if (!state.lastScanDate) return true;

    const lastScan = new Date(state.lastScanDate);
    const now = new Date();
    const daysSince = Math.floor((now - lastScan) / (1000 * 60 * 60 * 24));
    return daysSince >= state.scanIntervalDays;
}

// ─── Get Days Since Last Scan ────────────────────────────────
export function getDaysSinceLastScan() {
    const state = loadScannerState();
    if (!state.lastScanDate) return null;
    const lastScan = new Date(state.lastScanDate);
    return Math.floor((new Date() - lastScan) / (1000 * 60 * 60 * 24));
}

// ─── Scan Trustpilot for New Reviews ─────────────────────────
async function scanTrustpilot() {
    const url = REVIEW_STATS.trustpilot.url;
    const results = { newReviews: [], totalFound: 0, error: null };

    try {
        // Fetch page 1 through CORS proxy
        const proxyUrl = CORS_PROXY + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract review count from the page
        const countEl = doc.querySelector('[data-reviews-count-typography]');
        const countText = countEl?.textContent?.trim() || '';
        const countMatch = countText.match(/(\d+)/);
        const totalReviews = countMatch ? parseInt(countMatch[1]) : 0;
        results.totalFound = totalReviews;

        // Extract rating
        const ratingEl = doc.querySelector('[data-rating-typography]');
        const ratingText = ratingEl?.textContent?.trim() || '';

        // Extract individual reviews from page 1
        const reviewCards = doc.querySelectorAll('[data-service-review-card-paper]');
        const state = loadScannerState();

        reviewCards.forEach(card => {
            const nameEl = card.querySelector('[data-consumer-name-typography]');
            const textEl = card.querySelector('[data-service-review-text-typography]');
            const titleEl = card.querySelector('[data-service-review-title-typography]');
            const dateEl = card.querySelector('time');

            const name = nameEl?.textContent?.trim() || '';
            const text = textEl?.textContent?.trim() || '';
            const title = titleEl?.textContent?.trim() || '';
            const date = dateEl?.getAttribute('datetime') || '';

            if (name && text) {
                const fp = reviewFingerprint(name, text);
                if (!state.knownReviewIds.includes(fp)) {
                    const categories = mineReview(text);
                    results.newReviews.push({
                        source: 'trustpilot',
                        name,
                        text,
                        title,
                        date,
                        fingerprint: fp,
                        categories,
                        scannedAt: new Date().toISOString()
                    });
                }
            }
        });

        // Check if there are MORE reviews than we know about
        if (totalReviews > state.knownReviewCount.trustpilot) {
            results.countDelta = totalReviews - state.knownReviewCount.trustpilot;
        }

    } catch (err) {
        results.error = `Trustpilot scan failed: ${err.message}`;
        console.warn('Trustpilot scan error:', err);
    }

    return results;
}

// ─── Scan Google for New Reviews ─────────────────────────────
async function scanGoogle() {
    // Google reviews are harder to scrape directly due to dynamic loading
    // We'll check what we can from the basic search results page
    const results = { newReviews: [], totalFound: 0, error: null };

    try {
        const searchUrl = 'https://www.google.com/search?q=Camino+Coaching+reviews';
        const proxyUrl = CORS_PROXY + encodeURIComponent(searchUrl);
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();

        // Try to extract review count from Google search results
        const countMatch = html.match(/(\d+)\s*reviews?/i);
        if (countMatch) {
            results.totalFound = parseInt(countMatch[1]);
        }

        // Google reviews require dynamic rendering, so we mainly track the count delta
        const state = loadScannerState();
        if (results.totalFound > state.knownReviewCount.google) {
            results.countDelta = results.totalFound - state.knownReviewCount.google;
        }

    } catch (err) {
        results.error = `Google scan failed: ${err.message}. Google reviews require manual checking.`;
        console.warn('Google scan error:', err);
    }

    return results;
}

// ─── Run Full Scan ───────────────────────────────────────────
export async function runReviewScan(onProgress = null) {
    const state = loadScannerState();
    const scanResult = {
        startedAt: new Date().toISOString(),
        trustpilot: null,
        google: null,
        totalNewReviews: 0,
        errors: []
    };

    // Scan Trustpilot
    if (onProgress) onProgress('Scanning Trustpilot...');
    scanResult.trustpilot = await scanTrustpilot();
    if (scanResult.trustpilot.error) {
        scanResult.errors.push(scanResult.trustpilot.error);
    }

    // Scan Google
    if (onProgress) onProgress('Scanning Google...');
    scanResult.google = await scanGoogle();
    if (scanResult.google.error) {
        scanResult.errors.push(scanResult.google.error);
    }

    // Merge new reviews into state
    const allNew = [
        ...(scanResult.trustpilot.newReviews || []),
        ...(scanResult.google.newReviews || [])
    ];

    scanResult.totalNewReviews = allNew.length;

    // Add new reviews to pending list (avoid duplicates)
    allNew.forEach(review => {
        const exists = state.newReviews.some(r => r.fingerprint === review.fingerprint);
        if (!exists) {
            state.newReviews.push(review);
        }
    });

    // Update scan state
    state.lastScanDate = new Date().toISOString();
    state.lastScanSource = 'manual';

    // Update known counts if we got valid data
    if (scanResult.trustpilot.totalFound > 0) {
        state.knownReviewCount.trustpilot = Math.max(
            state.knownReviewCount.trustpilot,
            scanResult.trustpilot.totalFound
        );
    }
    if (scanResult.google.totalFound > 0) {
        state.knownReviewCount.google = Math.max(
            state.knownReviewCount.google,
            scanResult.google.totalFound
        );
    }

    // Add to history
    state.scanHistory.unshift({
        date: scanResult.startedAt,
        trustpilotCount: scanResult.trustpilot.totalFound,
        googleCount: scanResult.google.totalFound,
        newFound: scanResult.totalNewReviews,
        errors: scanResult.errors.length,
        countDeltas: {
            trustpilot: scanResult.trustpilot.countDelta || 0,
            google: scanResult.google.countDelta || 0
        }
    });

    // Keep only last 20 scan records
    if (state.scanHistory.length > 20) {
        state.scanHistory = state.scanHistory.slice(0, 20);
    }

    saveScannerState(state);

    return scanResult;
}

// ─── Approve a New Review (move to approved list) ────────────
export function approveNewReview(fingerprint) {
    const state = loadScannerState();
    const idx = state.newReviews.findIndex(r => r.fingerprint === fingerprint);
    if (idx === -1) return false;

    const review = state.newReviews.splice(idx, 1)[0];
    review.approvedAt = new Date().toISOString();
    state.approvedNewReviews.push(review);
    state.knownReviewIds.push(fingerprint);
    saveScannerState(state);
    return review;
}

// ─── Dismiss a New Review ────────────────────────────────────
export function dismissNewReview(fingerprint) {
    const state = loadScannerState();
    const idx = state.newReviews.findIndex(r => r.fingerprint === fingerprint);
    if (idx === -1) return false;

    state.newReviews.splice(idx, 1);
    state.knownReviewIds.push(fingerprint);
    saveScannerState(state);
    return true;
}

// ─── Get Pending (New) Reviews ───────────────────────────────
export function getPendingReviews() {
    const state = loadScannerState();
    return state.newReviews || [];
}

// ─── Get Approved New Reviews ────────────────────────────────
export function getApprovedNewReviews() {
    const state = loadScannerState();
    return state.approvedNewReviews || [];
}

// ─── Get Scan History ────────────────────────────────────────
export function getScanHistory() {
    const state = loadScannerState();
    return state.scanHistory || [];
}

// ─── Get Scanner Status ──────────────────────────────────────
export function getScannerStatus() {
    const state = loadScannerState();
    const daysSince = getDaysSinceLastScan();

    return {
        lastScanDate: state.lastScanDate,
        daysSinceLastScan: daysSince,
        isDue: isScanDue(),
        autoScanEnabled: state.autoScanEnabled,
        scanIntervalDays: state.scanIntervalDays,
        pendingCount: (state.newReviews || []).length,
        approvedCount: (state.approvedNewReviews || []).length,
        knownCounts: state.knownReviewCount,
        historyCount: (state.scanHistory || []).length
    };
}

// ─── Update Scanner Settings ─────────────────────────────────
export function updateScannerSettings({ autoScanEnabled, scanIntervalDays }) {
    const state = loadScannerState();
    if (autoScanEnabled !== undefined) state.autoScanEnabled = autoScanEnabled;
    if (scanIntervalDays !== undefined) state.scanIntervalDays = scanIntervalDays;
    saveScannerState(state);
}

// ─── Auto-Scan Check (call on app init) ──────────────────────
export async function autoScanIfDue() {
    if (!isScanDue()) return null;

    console.log('🔍 Review scan is due — running automatic scan...');
    const result = await runReviewScan();

    if (result.totalNewReviews > 0) {
        showToast(`🆕 ${result.totalNewReviews} new review(s) found! Check the Reviews page.`, 'success');
    }

    return result;
}

function showToast(message, type = 'info') {
    const event = new CustomEvent('show-toast', { detail: { message, type } });
    document.dispatchEvent(event);
}
