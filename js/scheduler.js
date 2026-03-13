// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — Scheduler
// CSV export and GHL Social Planner integration
// Facebook/Instagram optimised posting times for motorcycle racers
// ═══════════════════════════════════════════════════════════════

// ─── Generate Schedule Dates ──────────────────────────────────
// FB/IG optimal: Weekday evenings 19:00-21:00, mornings 07:30
// Race weekends: Friday evening, Sunday post-race
export function getScheduleDates(count = 7, startDate = null) {
    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();

    if (!startDate) {
        start.setDate(start.getDate() + 1);
    }

    start.setHours(0, 0, 0, 0);

    let current = new Date(start);

    while (dates.length < count) {
        const day = current.getDay(); // 0=Sun, 6=Sat
        const isWeekend = day === 0 || day === 6;
        const isFriday = day === 5;
        const isMonday = day === 1;

        const scheduled = new Date(current);
        if (isWeekend) {
            // Race weekends: Saturday 08:00, Sunday 18:00
            scheduled.setHours(day === 6 ? 8 : 18, 0, 0, 0);
        } else if (isFriday) {
            // Friday: Pre-race energy, evening
            scheduled.setHours(19, 0, 0, 0);
        } else if (isMonday) {
            // Monday: Post-race debrief
            scheduled.setHours(7, 30, 0, 0);
        } else {
            // Tue-Thu: Evening posting
            scheduled.setHours(19, 30, 0, 0);
        }

        dates.push({
            date: new Date(scheduled),
            dayName: scheduled.toLocaleDateString('en-GB', { weekday: 'long' }),
            dateString: scheduled.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeString: isWeekend
                ? (day === 6 ? '08:00' : '18:00')
                : (isFriday ? '19:00' : (isMonday ? '07:30' : '19:30')),
            isWeekend
        });

        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// ─── Format Date for GHL ──────────────────────────────────────
function formatGHLDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// ─── Format Date Display ─────────────────────────────────────
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ─── Export CSV for GHL Social Planner ────────────────────────
export function exportCSV(posts, dates) {
    const headers = ['postAtSpecificTime (YYYY-MM-DD HH:mm:ss)', 'content', 'link (OGmetaUrl)', 'imageUrls', 'gifUrl', 'videoUrls'];

    const rows = posts.map((post, i) => {
        const date = dates[i]?.date || new Date();
        // Extract Facebook content from dual-platform posts
        let content = post.content || '';
        if (content.includes('=== FACEBOOK POST ===')) {
            const fbMatch = content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
            content = (fbMatch?.[1] || content).trim();
        }
        return [
            formatGHLDate(date),
            `"${content.replace(/"/g, '""')}"`,
            '',
            post.imageUrl || '',
            '',
            ''
        ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    const now = new Date();
    const filename = `rider-social-posts-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

    try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);
    } catch (e) {
        console.warn('Blob download failed, using data URI fallback:', e);
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        window.open(dataUri, '_blank');
    }

    return filename;
}

// ─── Build CSV String (for clipboard copy) ────────────────────
export function buildCSVString(posts, dates) {
    const headers = ['postAtSpecificTime (YYYY-MM-DD HH:mm:ss)', 'content', 'link (OGmetaUrl)', 'imageUrls', 'gifUrl', 'videoUrls'];

    const rows = posts.map((post, i) => {
        const date = dates[i]?.date || new Date();
        // Extract Facebook content from dual-platform posts
        let content = post.content || '';
        if (content.includes('=== FACEBOOK POST ===')) {
            const fbMatch = content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
            content = (fbMatch?.[1] || content).trim();
        }
        return [
            formatGHLDate(date),
            `"${content.replace(/"/g, '""')}"`,
            '',
            post.imageUrl || '',
            '',
            ''
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

// ─── Download Single Post as .txt ─────────────────────────────
export function downloadPostTxt(post, index = 0) {
    const content = post.content || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const pillarSlug = (post.pillar?.id || 'post').replace(/\s+/g, '-');
    link.href = url;
    link.download = `rider-post-${pillarSlug}-${index + 1}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 1000);
}

// ─── Copy Post to Clipboard ──────────────────────────────────
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

// ─── GHL API Scheduling ───────────────────────────────────────
// Verified endpoint: POST /social-media-posting/:locationId/posts
// Supports text posts, image posts, video reels, and stories
export async function scheduleToGHL(posts, dates, ghlToken, locationId, accountIds = []) {
    if (!ghlToken) {
        throw new Error('GHL Private Integration token not configured. Go to Settings.');
    }
    if (!locationId) {
        throw new Error('GHL Location ID not configured. Go to Settings.');
    }

    // Auto-discover account IDs if not provided
    if (accountIds.length === 0) {
        try {
            const accountsResp = await fetch(
                `https://services.leadconnectorhq.com/social-media-posting/${locationId}/accounts`,
                {
                    headers: {
                        'Authorization': `Bearer ${ghlToken}`,
                        'Version': '2021-07-28'
                    }
                }
            );
            if (accountsResp.ok) {
                const accountsData = await accountsResp.json();
                const accounts = accountsData.accounts || accountsData.data?.accounts || [];
                accountIds = accounts
                    .filter(a => ['facebook', 'instagram', 'youtube'].includes(a.platform?.toLowerCase()))
                    .map(a => a.id || a.accountId);
            }
        } catch (e) {
            console.warn('Could not auto-discover GHL accounts:', e.message);
        }
    }

    const results = [];

    for (let i = 0; i < posts.length; i++) {
        try {
            // Extract Facebook content from dual-platform posts
            let content = posts[i].content || '';
            if (content.includes('=== FACEBOOK POST ===')) {
                const fbMatch = content.match(/=== FACEBOOK POST ===([\s\S]*?)(?:=== INSTAGRAM CAPTION ===|$)/);
                content = (fbMatch?.[1] || content).trim();
            }

            const body = {
                accountIds: accountIds.length > 0 ? accountIds : undefined,
                summary: content,
                status: 'scheduled',
                scheduleDate: dates[i]?.date ? dates[i].date.toISOString() : new Date().toISOString()
            };

            // Include media if available (video or image)
            if (posts[i].videoUrl) {
                body.mediaUrls = [posts[i].videoUrl];
                body.instagramPostDetails = { type: 'reel' };
                body.facebookPostDetails = { type: 'reel' };
            } else if (posts[i].imageUrl) {
                body.mediaUrls = [posts[i].imageUrl];
            }

            const response = await fetch(
                `https://services.leadconnectorhq.com/social-media-posting/${locationId}/posts`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${ghlToken}`,
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || error.error?.message || `GHL API error: ${response.status}`);
            }

            results.push({ index: i, success: true });
        } catch (err) {
            results.push({ index: i, success: false, error: err.message });
        }
    }

    return results;
}
