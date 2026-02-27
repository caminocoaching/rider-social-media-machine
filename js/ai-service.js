// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — AI Service
// OpenAI API integration for Craig Muirhead / Camino Coaching
// Facebook & Instagram posts for Motorcycle Racers
// CTA: Free Winning Formula Audit + Podium Contenders Blueprint
// ═══════════════════════════════════════════════════════════════

import {
    PILLARS, FRAMEWORKS, CTAS, AUTHORITY_LINES, LEXICON, MECHANISMS,
    MOTORSPORT_BRIDGES, CASE_STUDIES, RIDER_INSIGHTS, HOOKS,
    WINNING_FORMULA_PILLARS, FUNNEL, WEEKLY_SCHEDULE, CAMPAIGN_ARC, VISUAL_FORMATS,
    getSeasonalContext
} from './content-engine.js';

import {
    formatContextForAI, getCalendarSearchTerms, getChampionshipContext
} from './championship-calendar.js';

// ─── Master System Prompt (Motorcycle Racers FB/IG) ──────────
// Source: AI_Content_Engine_Rider_Audience.docx — Data-Driven Operational Brief
const SYSTEM_PROMPT = `You are Craig Muirhead's Facebook & Instagram content strategist. You generate daily social media posts for motorcycle racers that deliver genuine value and include an unrelated CTA to one of the lead magnets.

# ABOUT CRAIG MUIRHEAD & CAMINO COACHING
- 59-year-old flow performance coach based in Mallorca, Spain
- 10 seasons inside elite racing paddocks (MotoGP, WorldSBK, BSB, Moto3, MotoE, F1, F4, GB3)
- 1,644 personal bests, 1,286 podiums, 1,063 race wins tracked
- Proprietary 'In The Zone' app: 1,800+ debriefs, 118+ riders, 142+ circuits worldwide
- 4.9 Trustpilot rating
- Works with motorcycle racers, car racing drivers, and business leaders
- Authority: pattern recognition and data analysis, NOT personal racing results
- Has worked directly with riders in MotoGP (Sam Lowes, Joel Kelso, Jaume Masia, John McPhee), BSB (Danny Buchanan, Josh Owens, Fin Arscott, Joe Talbot, Harry Cook), IOM TT (Adam McLean), and club racing across UK, Europe, NZ, South Africa, USA, India, Asia
- IMPORTANT: Rotate credibility claims. NEVER use the same stat in every post.

# TARGET AUDIENCE
Craig's Facebook and Instagram audience is motorcycle racers and track day riders:
- Club racers (Bemsee, No Limits, NG, Thundersport, EMRA)
- National championship riders (BSB support classes, Pirelli Super Series, British Superteen, British Supersport)
- Track day riders (novice to advanced, considering racing)
- Road racers (IOM TT, North West 200, Ulster GP)
- MiniGP / junior riders and their parents
- Semi-professional competitors moving up through classes
- UK and Europe primarily, also NZ, South Africa, Asia, USA
- They spend £1,500-£5,000+ per race weekend
- They are serious about improving, not casual Sunday riders
- Age range: 16-55, predominantly male
- They follow MotoGP, BSB, WorldSBK

# PLATFORM PERFORMANCE DATA (from 116 posts Nov 2025 - Feb 2026)
- Facebook: 6x the reach of Instagram. Avg 1,090 reach per post vs 188 on IG.
- Facebook winning format: Photo posts with long-form text (1,577 avg reach vs 380 for videos).
- Instagram winning format: Reels (261 avg reach vs 141 for static images). Carousels show 2.82% engagement.
- Monster post (19,217 reach, 109 link clicks): eye-tracking research, specific data, relatable scenario, neuroscience in plain language, "Oh by the way" CTA.
- 59% of Facebook posts got ZERO shares. The dead zone: promotional announcements, testimonial-only, neuroscience without track-specific anchor.

# THE 12 CONTENT PILLARS (12-Week Rotation)
1. CONFIDENCE — Pre-session doubt, impostor syndrome, 2x PB multiplier at 8.5+/10
2. VISUAL TARGETING — Eye-tracking research, 0.3-0.5s per corner, Brno University data
3. BRAKING ZONE PANIC — Cortisol flooding, amygdala hijack, reactive vs planned braking
4. RACE PRESSURE — Qualifying vs race drop-off, home track pressure, expectation management
5. FLOW STATE — 110 vs 4 billion bits, trying harder paradox, 81% box breathing data
6. THE 7 MISTAKES — Each mistake standalone, quiz-style, funnel bridge content
7. TYRE & GRIP MANAGEMENT — Grip loss panic, amygdala/cerebellum interaction, session-long flow
8. SLEEP & RECOVERY — HRV data, 50+ racer sleep study, Saturday night recovery
9. DUAL-TASK INTERFERENCE — Thinking vs riding, sector time obsession, UCL research
10. CLIENT TRANSFORMATIONS — Before/after stories, named riders, championship wins
11. THE MONEY LIE — Hardware vs headware, diminishing returns, Angela case study
12. MOTOGP/WSBK MOMENTS — Timely reactions, pro quotes, paddock insider observations

# THE WINNING POST FORMULA (5-Step Architecture — from top performers)
## Step 1: THE HOOK (First Line)
This is the ONLY line that matters for reach. Proven hook patterns:
- Research/Data Hook: "They put eye-tracking glasses on a motorcycle racer..." / "We analysed 1,000 race debriefs..."
- Celebrity Bridge Hook: "[Pro rider name] just said something most club racers will misunderstand..."
- Relatable Pain Hook: "You are P5 in practice. Then race day arrives..." / "Your first flying lap is your fastest. Then it all falls apart."
- Provocative Challenge Hook: "It is the most expensive lie in the paddock..." / "Your brain has a limit. You are pushing past it."

## Step 2: THE PROBLEM (Next 2-3 Sentences)
Ground it in a SPECIFIC racing scenario. Use turn numbers, session contexts (qualifying vs race), specific sensations (grip loss, braking hesitation). Never generic.

## Step 3: THE NEUROSCIENCE (Core Teaching)
Explain WHY this happens in the brain. Reference the mechanism (amygdala, cerebellum, cognitive load, dual-task interference). Use plain language. Cite data where possible ("After 1,800+ session debriefs..."). Follow the WOW not HOW principle: reveal the what and the why, NEVER the specific fix. That is what the paid programme delivers.

## Step 4: THE BRIDGE (Connection to Rider)
Show how this pattern appears at every level. Reference real results or anonymised client patterns. Make the reader feel seen.

## Step 5: THE CTA
Separated from value content by a line break and visual separator (··). Two proven formats:
- Direct Link CTA: "Oh, by the way. I built a free Rider Mindset Quiz with 12 real racing scenarios... [link]"
- Comment Keyword CTA: "Comment MINDSET and I will send you the free training that breaks down all 7 of these mistakes."
"With or without you" energy. Never needy. CTA is ALWAYS unrelated to the post topic.

# VOICE & TONE (Mandatory Rules — Non-Negotiable)
- UK English spelling throughout. No American spellings. (colour, analyse, programme, tyre, favourite)
- Warm, direct, confident. Like a trusted paddock insider talking to a mate.
- Never preachy. Never motivational-poster language. Never "you have got this" or "believe in yourself."
- Data-led and evidence-based. Every claim backed by numbers or named examples.
- Slightly provocative. Challenge assumptions. Make the reader question what they think they know.
- NEVER use em dashes, en dashes, or other GPT-style formatting in post body.
- NEVER use ** or any markdown formatting in post body.
- No emojis in the value section of the post. Occasional use in CTA is acceptable.
- No bullet point symbols in post body.
- Short paragraphs (1-2 sentences), mobile-first formatting.
- Post length: 200-400 words value content + CTA (Facebook). 100-200 words (Instagram).
- First line is the hook. Must stop the scroll with a SPECIFIC data point or dramatic scenario.
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, hanging off, throttle control, session, FP1, qualifying, grid, holding area, paddock, the bike, leathers, lid. NEVER use car racing language.

# CONTENT RULES
- WOW not HOW: Reveal what the problem is and why it happens (neuroscience). NEVER give the specific fix or methodology.
- Never use generic coaching language: "mindset shift", "unlock your potential", "be your best self", "level up".
- Every post must reference a specific racing scenario (turn number, session context, tyre condition, grid position).
- Use real data: 1,644 PBs, 1,286 podiums, 1,063 wins, 118 riders, 142 circuits, 1,800+ debriefs, 4.9 Trustpilot.
- Name real riders where appropriate (Sam Lowes, Joel Kelso, Cormac Buchanan, Joe Roberts, Lorenzo Baldassarri, Richard Knegt, Angela, Harrison Dessoy, Adam McLean, Fin Arscott).
- ROTATE credibility claims. Never use the same stat in consecutive posts.

# PLATFORM-SPECIFIC ADAPTATION
The AI must NOT cross-post identical content. Each platform needs its own version:
| Element | Facebook | Instagram |
| Format | Long-form text as Photo post | Reels (primary) + Carousels (2x/week) |
| Length | 200-400 words | 100-200 words caption / 15-60s Reel |
| Hook | Full opening line visible in feed | Text overlay on first frame of Reel |
| CTA | Direct link OR comment keyword | Comment keyword only (ManyChat) |
| Hashtags | 3-5 at very end, optional | 3-5 niche racing tags, always include |
| Shares | Optimise for shares (drives FB reach) | Optimise for saves (drives IG reach) |
| Tone | Analytical, data-driven insider | Slightly more direct, punchy, visual |

# THE 5 LEAD MAGNETS (Source: Motorcycle_Racer_Funnel_Complete_Reference.md)
Every lead magnet is a ScoreApp assessment. The rider answers questions, gets an instant personalised score, and is bridged into the Podium Contenders Blueprint.

## LM1: RIDER RACE WEEKEND REVIEW [PRIMARY WORKHORSE CTA - 3-4x/week]
- URL: improve-rider.scoreapp.com (CONFIRMED)
- Delivery: DM ONLY. Not posted publicly. Creates exclusivity.
- When rider comments "REVIEW" or DMs Craig, ManyChat sends the link.
- Trigger word: REVIEW

## LM2: END OF SEASON REVIEW [Off-season CTA]
- URL: riderseason.scoreapp.com (CONFIRMED)
- Delivery: Public link in post. Riders click directly.
- Trigger word: SEASON

## LM3: RIDER FLOW PROFILE [1x/week]
- URL: [URL NEEDED]
- Delivery: Public link. Riders click directly.
- Trigger word: FLOW

## LM4: RIDER MINDSET QUIZ [1x/week]
- URL: [URL NEEDED]
- Delivery: Public link. Riders click directly.
- Trigger word: MINDSET

## LM5: RIDER SLEEP TEST [1-2x/month - PATTERN INTERRUPT]
- URL: [URL NEEDED]
- Delivery: Public link. Riders click directly.
- Trigger word: SLEEP

# ALL TRIGGER WORDS & DELIVERY
- REVIEW > LM1: Race Weekend Review (DM delivery, improve-rider.scoreapp.com)
- SEASON > LM2: End of Season Review (public link, riderseason.scoreapp.com)
- FLOW > LM3: Rider Flow Profile (public link)
- MINDSET > LM4: Rider Mindset Quiz (public link)
- SLEEP > LM5: Rider Sleep Test (public link)
- BLUEPRINT > Podium Contenders Blueprint (direct link, academy.caminocoaching.co.uk/podium-contenders-blueprint/order/)

# MANYCHAT AUTOMATION FLOW
Rider comments trigger word > ManyChat auto-response > DM with assessment link > Email captured > ScoreApp assessment > Instant results > Results page bridges into Podium Contenders Blueprint > GHL automation sequence

# FUNNEL CONTEXT
FB/IG Post > Lead Magnet (5 doors: LM1-LM5) > Podium Contenders Blueprint (3-day free training, 3x/year: Jan, May, Sep) > Championship Strategy Call (free, 45 min, 1-on-1) > Flow Performance Programme (£4,000, 43% close rate)
TARGET: 10 people into the free training per month.

# PODIUM CONTENDERS BLUEPRINT (3-DAY FREE TRAINING)
URL: https://academy.caminocoaching.co.uk/podium-contenders-blueprint/order/
- Day 1: The 7 Biggest Mistakes Costing You Lap Times (WOW not HOW)
- Day 2: The 5-Pillar System for Accessing Flow State on Command
- Day 3: Your Race Weekend Mental Preparation Protocol
- After Day 3: CTA to book free Championship Strategy Call
- Released 3x/year during training windows. Between windows, landing page shows waitlist.

# CONTENT THE AI MUST NEVER CREATE (Dead Zone Rules)
These are the patterns that achieved ZERO shares in 59% of posts:
- Self-promotional announcements without value ("I am excited to announce...", "We have just launched...")
- Testimonial-only posts without a teaching hook
- Follow-up or sequence posts that assume the reader saw yesterday's content
- Generic motivational content that could apply to any sport or any coach
- Posts about the programme, pricing, or logistics (save for DMs and strategy calls)
- Pure neuroscience explainers without a track-specific anchor ("What is Flow State?", "110 bits vs 4 billion bits" without a riding scenario)
- Generic coaching announcements ("Free training dropped today", "The feedback is rolling in")

# FACEBOOK/INSTAGRAM 2026 BEST PRACTICES
## High-Value Signals
DWELL TIME: Write for 30+ seconds of reading. Deep insight, not surface advice.
SHARES: Content that riders share with their mates in the paddock WhatsApp group. Optimise for shares on FB.
COMMENTS: End with questions that require multi-sentence replies, not yes/no.
SAVES: Make content bookmarkable. Specific data, actionable takeaways. Optimise for saves on IG.
Short paragraphs, line breaks, mobile-optimised formatting.
First line is the hook. Must stop the scroll with a SPECIFIC data point.

## Low-Value Signals (avoid these)
NEVER: "Like if you agree" / "Share with someone" / "Tag a friend" / "Follow for more"
NEVER: External links in post body (trigger word CTA at end only)
NEVER: Generic motivation or "you can do it" energy
NEVER: Car racing language in the body

## Posting Windows
- Peak: 10:00 AM CET (proven sweet spot from 116 posts)
- Race weekend: Friday evening setup energy, Sunday post-race processing
- Monday: Post-race debrief energy
- Golden Hour: First 60 minutes determine distribution.`;


// ─── Generate Article Topics with Web Search (Weekly Wizard Step 1) ──
export async function generateTopics(pillars, seasonalContext, apiKey, model = 'gpt-4o') {
    const pillarList = pillars.map((p, i) => {
        const schedule = WEEKLY_SCHEDULE[i];
        return `${i + 1}. ${p.name} — ${p.description} \n   Search focus: ${schedule?.searchFocus || 'motorcycle racer mental performance'} \n   Sample topics: ${p.topics.slice(0, 3).join(', ')} `;
    }).join('\n');

    const seasonNote = seasonalContext
        ? `\n\nSEASONAL CONTEXT: We are in ${seasonalContext.season}. Look for articles relevant to: ${seasonalContext.context} `
        : '';

    // Get championship calendar context for timely content
    const calendarContext = formatContextForAI();
    const calendarSearchTerms = getCalendarSearchTerms();
    const champContext = getChampionshipContext();

    const calendarSearchNote = calendarSearchTerms.length > 0
        ? `\n\n2026 CHAMPIONSHIP SEARCH TERMS(use these to find race - specific news): \n${calendarSearchTerms.slice(0, 6).map(t => `- ${t}`).join('\n')} `
        : '';

    const prompt = `Search the web for recent articles about motorcycle racing performance, rider mental performance, neuroscience of high - speed decision making, flow state in motorsport, choking under pressure, eye tracking in racing, and sports psychology for motorcycle racers.Focus on content from the last 7 days where possible, going back up to 30 days if needed.

SEARCH PRIORITIES:
- MotoGP, WorldSBK, BSB, Moto2, Moto3 news with mental performance angles
    - Rider interviews about pressure, crashes and coming back, confidence, pre - race nerves
        - Peer - reviewed neuroscience studies on attention, flow, choking, reaction time
            - Sports psychology research applicable to motorsport
${champContext.hasLiveRacing ? '- PRIORITY: There is LIVE RACING this weekend — search for race weekend news, grid positions, and early results' : ''}
${champContext.hasRecentResults ? '- PRIORITY: Race results available from last 7 days — search for post-race reports, winner interviews, and key battles' : ''}
${champContext.hasUpcoming ? '- Search for upcoming race preview articles for events in the next 14 days' : ''}

2026 CHAMPIONSHIP CALENDARS IN SEASON: ${champContext.inSeason.join(', ') || 'Off-season for most championships'}
${calendarContext}
${calendarSearchNote}

SPECIFIC SEARCH AREAS(one per content pillar):

${pillarList}
${seasonNote}

For EACH topic, find a SPECIFIC article and provide:
1. A compelling Facebook headline / hook angle(MUST start with a specific data point or dramatic motorcycle racing scenario)
2. The source article that inspired it(title, publication, and key data point)
3. 2 - 3 key talking points connecting the article to the pillar
4. The emotional hook — what should the rider reading this feel ? (Recognition > Fear > Curiosity > Hope)
5. A suggested neuroscience mechanism to reference
6. Racing relevance — ONE sentence connecting the finding to what a club or amateur motorcycle racer actually experiences on a race weekend.Use MOTORCYCLE language: corner, apex, lean angle, braking zone, turn -in, body position, hanging off, throttle control, session, FP1, qualifying, grid, holding area, paddock, the bike, leathers, lid.NEVER use car racing language.
7. Championship tie -in (OPTIONAL) — If a specific championship event is relevant(BSB, MotoAmerica, ASBK, CSBK, NZSBK), reference it.

QUALITY FILTERS — PREFER these sources:
- Motorcycle racing publications: MCN, Crash.net, MotoMatters, BSB.com, MotoGP.com, WorldSBK.com, The Race, Motorsport.com, ASBK.com.au, MotoAmerica.com, CSBK.ca
    - Sports science journals: Frontiers in Psychology, BJSM, JSSM, Journal of Sports Sciences
        - Neuroscience: Nature, Scientific American, New Scientist
            - Credible news: BBC Sport, Sky Sports
                - AVOID: listicles, self - help blogs, Reddit, unverified claims, car - only content

Format as JSON array:
[
    {
        "pillarId": "visual-targeting",
        "headline": "Your brain makes decisions 200-300 milliseconds slower than you think. At 150mph, that's 20 metres of track.",
        "sourceArticle": "Title of article — Publication — key data point",
        "articleUrl": "URL if found",
        "talkingPoints": ["Point 1", "Point 2", "Point 3"],
        "emotionalHook": "Recognition: That is what happens to me in the braking zone",
        "mechanism": "Cognitive switching tax — 23 minutes to recover focus after each interruption",
        "racingRelevance": "This is exactly what happens when you look at the apex instead of through the exit. Your brain can't plan the next corner because your eyes haven't shown it the way yet."
    }
]

Return ONLY the JSON array with 7 items.`;

    return await callOpenAIWithSearch(prompt, apiKey, true);
}

// ─── Generate a Single Post ──────────────────────────────────
export async function generatePost({ topic, pillar, framework, cta, authorityLine, motorsportBridge, apiKey, model = 'gpt-4o', campaignDay = null, scheduleDay = null }) {

    const campaignNote = campaignDay
        ? `\nCAMPAIGN POSITION: This is ${campaignDay.day} — Purpose: ${campaignDay.purpose}. Target emotion: ${campaignDay.emotion}. Word count: ${campaignDay.wordCount}.`
        : '';

    // Inject championship context into post generation
    const champCtx = getChampionshipContext();
    let raceWeekendNote = '';
    if (champCtx.hasLiveRacing) {
        raceWeekendNote = `\nRACE WEEKEND CONTEXT: There is live racing this weekend — ${champCtx.currentWeekend.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}. You may naturally reference this if relevant to the topic, but do NOT force it.`;
    } else if (champCtx.hasRecentResults) {
        raceWeekendNote = `\nRECENT RACE CONTEXT: Recent results available from ${champCtx.recent.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}. Reference if naturally relevant.`;
    }

    // Platform-specific format guidance from schedule
    const vf = scheduleDay?.visualFormat ? VISUAL_FORMATS[scheduleDay.visualFormat] : null;
    const platformNote = scheduleDay
        ? `\nCONTENT TYPE: ${scheduleDay.contentType}
FACEBOOK FORMAT: ${scheduleDay.fbFormat}
INSTAGRAM FORMAT: ${scheduleDay.igFormat}
CTA DELIVERY: ${scheduleDay.ctaType === 'direct-link' ? 'Direct link in CTA (Facebook). Comment keyword only (Instagram).' : 'Comment keyword CTA for both platforms (ManyChat delivery).'}
${vf ? `VISUAL FORMAT: ${vf.name} — ${vf.description}\nIMAGE NOTE: ${scheduleDay.visualNote}` : ''}`
        : '';

    const prompt = `Write a Facebook post AND an Instagram caption for Craig Muirhead / Camino Coaching using these parameters:

CONTENT PILLAR: ${pillar.name} — ${pillar.description}
${pillar.dataPoints ? `DATA POINTS: ${pillar.dataPoints}` : ''}
${pillar.angles ? `ANGLES: ${pillar.angles.join(', ')}` : ''}
WINNING FORMULA PILLAR LINK: ${pillar.winningFormulaPillar}
FRAMEWORK: ${framework.name} — ${framework.hookStyle}
TOPIC / ANGLE: ${typeof topic === 'string' ? topic : topic.headline || topic}
${topic.talkingPoints ? `KEY POINTS: ${topic.talkingPoints.join(', ')}` : ''}
${topic.mechanism ? `MECHANISM TO REFERENCE: ${topic.mechanism}` : ''}
${topic.sourceArticle ? `SOURCE ARTICLE: ${topic.sourceArticle}` : ''}
${topic.racingRelevance ? `RACING RELEVANCE: ${topic.racingRelevance}` : ''}
${raceWeekendNote}
${platformNote}

AUTHORITY LINE TO WEAVE IN NATURALLY:
"${authorityLine}"

CTA TO APPEND (after ·· separator, completely unrelated to post body):
${cta.ctaTemplate}

CTA TRIGGER WORD: ${cta.triggerWord || 'REVIEW'}
${campaignNote}

THE 5-STEP WINNING FORMULA (follow this architecture):
1. HOOK (First Line): Start with a specific data point, research finding, or dramatic racing scenario. This is the ONLY line that matters for reach.
2. PROBLEM (Next 2-3 sentences): Ground it in a SPECIFIC racing scenario. Use turn numbers, session contexts (qualifying vs race), specific sensations (grip loss, braking hesitation). Never generic.
3. NEUROSCIENCE (Core Teaching): Explain WHY this happens in the brain. Reference the mechanism. Use plain language. Cite data. WOW not HOW: reveal what the problem is, NEVER the specific fix.
4. BRIDGE (Connection to Rider): Show how this pattern appears at every level. Reference real results or anonymised patterns. Make the reader feel seen.
5. CTA (Separated): After ·· separator. "Oh, by the way" or "Completely unrelated" or "PS". Trigger word included. "With or without you" energy.

RULES (motorcycle racer Facebook / Instagram format):
- Use MOTORCYCLE language throughout: rider, corner, apex, lean angle, braking zone, turn-in, body position, hanging off, throttle control, session, FP1, qualifying, grid, holding area, paddock, the bike, leathers, lid. NEVER use car racing language.
- UK English spelling throughout (colour, analyse, programme, tyre, favourite)
- WOW not HOW: Reveal the problem and why it happens. NEVER give the specific fix or methodology.
- Every post must reference a specific racing scenario (turn number, session context, tyre condition, grid position)
- Use real data: 1,644 PBs, 1,286 podiums, 1,063 wins, 118 riders, 142 circuits, 1,800+ debriefs, 4.9 Trustpilot
- NEVER use em dashes or en dashes. Use commas or full stops instead.
- NEVER use ** or bullet symbols in the post body
- No emojis in the value section. Occasional use in CTA is acceptable.
- NEVER use generic coaching language: "mindset shift", "unlock your potential", "be your best self", "level up"
- Short paragraphs (1-2 sentences), mobile-first formatting
- End with an engagement question that drives comments ("When was the last time this happened to you?")

FACEBOOK VERSION:
- 200-400 words value content + CTA
- Long-form text. Optimise for SHARES (drives FB reach).
- Direct link in CTA is fine on Facebook.

INSTAGRAM VERSION:
- 100-200 words caption. Shorter, punchier, more direct.
- Optimise for SAVES (drives IG reach).
- CTA uses comment keyword only (ManyChat delivery). No direct links.
- Include 3-5 niche hashtags at the end (#MotoGP #RiderMindset #RaceDay #MentalPerformance #FlowState)

DEAD ZONE RULES (never create these):
- No self-promotional announcements without value
- No testimonial-only posts without a teaching hook
- No sequence posts that assume the reader saw yesterday's content
- No generic motivational content that could apply to any sport
- No pure neuroscience explainers without a track-specific anchor

Format your response as:
=== FACEBOOK POST ===
[Facebook post text here]

=== INSTAGRAM CAPTION ===
[Instagram caption here]

=== IMAGE TEXT ===
[Suggest 1-2 lines of text for the image (max 12 words). This is for a bold text or data card visual. Use the hook data point or most powerful stat from the post.]`;

    return await callOpenAI(prompt, apiKey, model, false);
}

// ─── Generate Multiple Posts in Parallel ──────────────────────
export async function generatePosts(topics, config) {
    const { pillars, frameworks, ctas, authorityLines, motorsportBridges, apiKey, model, campaignDays } = config;

    const promises = topics.map((topic, i) => {
        return generatePost({
            topic,
            pillar: pillars[i],
            framework: frameworks[i],
            cta: ctas[i],
            authorityLine: authorityLines[i],
            motorsportBridge: motorsportBridges ? motorsportBridges[i] : null,
            apiKey,
            model,
            campaignDay: campaignDays ? campaignDays[i] : null,
            scheduleDay: WEEKLY_SCHEDULE[i] || null
        });
    });

    const results = await Promise.allSettled(promises);

    return results.map((result, i) => ({
        id: `post - ${Date.now()} -${i} `,
        content: result.status === 'fulfilled' ? result.value : `Error generating post: ${result.reason} `,
        pillar: pillars[i],
        framework: frameworks[i],
        cta: ctas[i],
        authorityLine: authorityLines[i],
        motorsportBridge: motorsportBridges ? motorsportBridges[i] : null,
        topic: topics[i],
        status: result.status,
        imageUrl: '',
        edited: false,
        campaignDay: campaignDays ? campaignDays[i] : null
    }));
}

// ─── Regenerate a Single Post ─────────────────────────────────
export async function regeneratePost(post, apiKey, model = 'gpt-4o') {
    const newContent = await generatePost({
        topic: post.topic,
        pillar: post.pillar,
        framework: post.framework,
        cta: post.cta,
        authorityLine: post.authorityLine,
        motorsportBridge: post.motorsportBridge,
        apiKey,
        model,
        campaignDay: post.campaignDay
    });
    return { ...post, content: newContent, edited: false };
}

// ─── OpenAI API Call ──────────────────────────────────────────
async function callOpenAI(prompt, apiKey, model = 'gpt-4o', parseJson = true) {
    if (!apiKey) {
        throw new Error('OpenAI API key not configured. Go to Settings to add your key.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey} `
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.85,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `OpenAI API error: ${response.status} `);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (parseJson) {
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
        } catch (e) {
            throw new Error('Failed to parse AI response as JSON. Please try again.');
        }
    }

    return content;
}

// ─── OpenAI Responses API Call with Web Search ────────────────
async function callOpenAIWithSearch(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('OpenAI API key not configured. Go to Settings to add your key.');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey} `
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                tools: [{ type: 'web_search_preview' }],
                instructions: SYSTEM_PROMPT,
                input: prompt
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.warn('Responses API failed, falling back to Chat Completions:', error.error?.message);
            return await callOpenAI(prompt, apiKey, 'gpt-4o', parseJson);
        }

        const data = await response.json();

        let content = '';
        if (data.output && Array.isArray(data.output)) {
            for (const item of data.output) {
                if (item.type === 'message' && item.content) {
                    for (const part of item.content) {
                        if (part.type === 'output_text') {
                            content += part.text;
                        }
                    }
                }
            }
        }

        content = content.trim();

        if (!content) {
            console.warn('No text content in Responses API output, falling back');
            return await callOpenAI(prompt, apiKey, 'gpt-4o', parseJson);
        }

        if (parseJson) {
            try {
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
            } catch (e) {
                console.warn('JSON parse failed from web search response, falling back');
                return await callOpenAI(prompt, apiKey, 'gpt-4o', parseJson);
            }
        }

        return content;
    } catch (err) {
        console.warn('Web search call failed, falling back to standard API:', err.message);
        return await callOpenAI(prompt, apiKey, 'gpt-4o', parseJson);
    }
}

// ─── Generate Image Prompt ───────────────────────────────────
export function generateImagePrompt(post) {
    return `Create a professional, editorial - quality motorcycle racing photograph for a Facebook / Instagram post about "${post.pillar.name}".
    Style: Photorealistic, shot on Canon EOS R5, 85mm f / 1.4 lens, shallow depth of field, natural lighting, 8K resolution.
        Setting: British racing circuit, paddock, pit lane, holding area — authentic motorsport environment.
            Theme: ${post.pillar.description}.
Mood: Intense, authentic, professional motorsport.The rider experience.
No text overlay.No watermark.No logos.No writing on image.No identifiable faces of real riders.No identifiable liveries or numbers.
Square format(1: 1) for social media.`;
}
