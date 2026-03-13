// ═══════════════════════════════════════════════════════════════
// 🏍️ MOTORCYCLE RACER SOCIAL MEDIA MACHINE — AI Service
// Gemini (Research) + Claude (Writing) + HeyGen (Video)
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
    REVIEW_STATS, QUOTED_HOOKS, OBJECTION_KILLERS, REVIEW_AUTHORITY_LINES,
    getHookForPillar, formatQuotedHook, getReviewAuthorityLine
} from './review-bank.js';

import {
    formatContextForAI, getCalendarSearchTerms, getChampionshipContext
} from './championship-calendar.js';

import {
    NEUROCHEMICALS, FLOW_COCKTAIL, VIDEO_SCRIPT_TEMPLATE, SLIDE_DECK_SPECS,
    HEYGEN_SPECS, WEEKLY_VIDEO_SCHEDULE, VIDEO_TOPICS,
    getChemical, buildVideoScriptContext, buildWowHowInstruction
} from './neurochemistry.js';

import { addLogEntry } from './settings.js';

// ═══════════════════════════════════════════════════════════════
// CRAIG'S STATS — UPDATE THESE AS NUMBERS GROW
// Every prompt in the app reads from this single config.
// ═══════════════════════════════════════════════════════════════
const CRAIG_STATS = {
    debriefs: '2,358',
    personalBests: '808',
    podiums: '438',
    raceWins: '159',
    circuits: '100+',
    months: '60',
    trustpilotScore: '4.9',
    trustpilotReviews: '85',
    trustpilotPercent: '100%',
    drivers: '118',       // total drivers/riders coached
};

// ─── Master System Prompt (Motorcycle Racers FB/IG) ──────────
// Source: AI_Content_Engine_Rider_Audience.docx — Data-Driven Operational Brief
const SYSTEM_PROMPT = `You are Craig Muirhead's Facebook & Instagram content strategist. You generate daily social media posts for motorcycle racers that deliver genuine value and include an unrelated CTA to one of the lead magnets.

# ABOUT CRAIG MUIRHEAD & CAMINO COACHING
- 59-year-old flow performance coach based in Mallorca, Spain
- 60 months inside elite racing paddocks (MotoGP, WorldSBK, BSB, Moto3, MotoE, F1, F4, GB3)
- ${CRAIG_STATS.personalBests} personal bests, ${CRAIG_STATS.podiums} podiums, ${CRAIG_STATS.raceWins} race wins tracked
- Proprietary 'In The Zone' app: ${CRAIG_STATS.debriefs} debriefs, ${CRAIG_STATS.circuits} circuits worldwide
- ${CRAIG_STATS.trustpilotScore}/5 across ${CRAIG_STATS.trustpilotReviews} reviews on Trustpilot (${CRAIG_STATS.trustpilotPercent} five-star)
- REVIEW AUTHORITY: Use these in rotation: "Rated ${CRAIG_STATS.trustpilotScore} out of 5 on Trustpilot from ${CRAIG_STATS.trustpilotReviews} unprompted rider reviews" / "${CRAIG_STATS.trustpilotReviews} five-star reviews on Trustpilot. ${CRAIG_STATS.trustpilotPercent} satisfaction rate" / "${CRAIG_STATS.trustpilotScore} out of 5 across ${CRAIG_STATS.trustpilotReviews} reviews. Every single one is five stars."
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

# THE 13 CONTENT PILLARS (12-Week Rotation + Outside the Paddock)
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
13. OUTSIDE THE PADDOCK — Stories from other sports, technology, science, and achievements that connect back to mental performance. 5 search categories: elite athletes using mental tools, performance technology, breakthrough results, brain science discoveries, comebacks and underdog wins.

# THE WINNING POST FORMULA (5-Step Architecture — from top performers)
## Step 1: THE HOOK (First Line)
This is the ONLY line that matters for reach. Proven hook patterns:
- Research/Data Hook: "They put eye-tracking glasses on a motorcycle racer..." / "We analysed 1,000 race debriefs..."
- Celebrity Bridge Hook: "[Pro rider name] just said something most club racers will misunderstand..."
- Relatable Pain Hook: "You are P5 in practice. Then race day arrives..." / "Your first flying lap is your fastest. Then it all falls apart."
- Provocative Challenge Hook: "It is the most expensive lie in the paddock..." / "Your brain has a limit. You are pushing past it."
- QUOTED REVIEW HOOK: Use a single sentence from a real Trustpilot review as the opening hook in quotation marks with the reviewer's first name. Then build the teaching content around the theme. Example: '"I felt new levels of both fierceness and joy on the track which I had never before experienced during the past 10 years of racing." - Angela, February 2026'. Use this format approximately 1 in 4 posts.

## Step 2: THE PROBLEM (Next 2-3 Sentences)
Ground it in a SPECIFIC racing scenario. Use turn numbers, session contexts (qualifying vs race), specific sensations (grip loss, braking hesitation). Never generic.

## Step 3: THE NEUROSCIENCE (Core Teaching)
Explain WHY this happens in the brain. Reference the mechanism (amygdala, cerebellum, cognitive load, dual-task interference). Use plain language. Cite data where possible ("After ${CRAIG_STATS.debriefs} session debriefs..."). Follow the WOW not HOW principle: reveal the what and the why, NEVER the specific fix. That is what the paid programme delivers.

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

# WEEKLY CONTENT BALANCE (The Weekly Education, Not Weekly Diagnosis)
The weekly mix is rebalanced to feel energising. Riders follow because they learn something fascinating every day, not because they are being reminded what is wrong with them.
- Monday: OUTSIDE THE PADDOCK (Familiar) — Story from another sport or technology. Most shareable post. Interesting to anyone.
- Tuesday: CLIENT TRANSFORMATION (Sexy) — Named athlete. Lead with the result, not the struggle. Aspiration, not rescue.
- Wednesday: NEUROSCIENCE TEACH (Strange/Free Value) — Science-backed insight with racing application. AI finds supporting study.
- Thursday: PROVOCATIVE HOOK (Scary) — The ONE pain-forward post per week. Money Lie, 7 Mistakes, or paddock challenge.
- Friday: TIMELY RACE REACTION (Familiar) — React to real race results. Add mental performance analysis layer.
- Saturday: ACHIEVEMENT/TECH SPOTLIGHT (Strange) — Second Outside the Paddock. Tech, research, or achievement. Positive weekend.
- Sunday: PROOF & CELEBRATION (Sexy) — Client wins, debrief stats, review quotes. End the week on the highest note.
Balance: 2 pain/challenge (Thu + partially Wed), 2 outside-the-paddock inspiration (Mon + Sat), 2 proof/aspiration (Tue + Sun), 1 timely reaction (Fri).

# CONTENT RULES
- WOW not HOW: Reveal what the problem is and why it happens (neuroscience). NEVER give the specific fix or methodology.
- Never use generic coaching language: "mindset shift", "unlock your potential", "be your best self", "level up".
- Every post must reference a specific racing scenario (turn number, session context, tyre condition, grid position).
- Use real data: ${CRAIG_STATS.personalBests} PBs, ${CRAIG_STATS.podiums} podiums, ${CRAIG_STATS.raceWins} wins, ${CRAIG_STATS.circuits} circuits, ${CRAIG_STATS.debriefs} debriefs, ${CRAIG_STATS.trustpilotScore} Trustpilot (${CRAIG_STATS.trustpilotReviews} reviews).
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

# THE 4 LEAD MAGNETS + BLUEPRINT (Source: Motorcycle_Racer_Funnel_Complete_Reference.md)
Every lead magnet is a ScoreApp assessment. The rider answers questions, gets an instant personalised score, and is bridged into the Podium Contenders Blueprint.
NOTE: LM1 (Race Weekend Review) has been REMOVED from CTA rotation. Do NOT use REVIEW as a CTA trigger word.

## LM2: END OF SEASON REVIEW [Off-season CTA]
- URL: riderseason.scoreapp.com (CONFIRMED)
- Delivery: Public link in post. Riders click directly.
- Trigger word: SEASON

## LM3: RIDER FLOW PROFILE [2x/week]
- URL: [URL NEEDED]
- Delivery: ManyChat DM. Rider comments FLOW.
- Trigger word: FLOW

## LM4: RIDER MINDSET QUIZ [2-3x/week — PRIMARY WORKHORSE CTA]
- URL: [URL NEEDED]
- Delivery: ManyChat DM. Rider comments MINDSET.
- Trigger word: MINDSET

## LM5: RIDER SLEEP TEST [1-2x/week]
- URL: [URL NEEDED]
- Delivery: ManyChat DM. Rider comments SLEEP.
- Trigger word: SLEEP

# ALL TRIGGER WORDS & DELIVERY
- SEASON > LM2: End of Season Review (public link, riderseason.scoreapp.com)
- FLOW > LM3: Rider Flow Profile (ManyChat DM)
- MINDSET > LM4: Rider Mindset Quiz (ManyChat DM) — PRIMARY CTA
- SLEEP > LM5: Rider Sleep Test (ManyChat DM)
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

# REVIEW CONTENT PLAYBOOK RULES
- NEVER post a review as the entire content of a post. Reviews without a teaching hook get buried.
- NEVER fabricate, paraphrase, or embellish a review. Use exact quotes or do not quote at all.
- NEVER use more than one review quote per post. One real voice is powerful. Three feels like a sales page.
- NEVER use reviews defensively. They are proof points, not arguments.
- Use review quotes in the CTA bridge section to pre-handle objections naturally.
- For objection-killing: embed real rider words when addressing scepticism about cost or effectiveness.
- The Trustpilot link (https://uk.trustpilot.com/review/caminocoaching.co.uk) can be included on Facebook posts for credibility.
- On Instagram, reference "84 five-star reviews on Trustpilot" but do not link (IG does not support caption links).

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
export async function generateTopics(pillars, seasonalContext, apiKey) {
    const champContext = getChampionshipContext();

    const daySlots = [
        'Monday: Outside the Paddock — a fascinating story from tennis, rugby, cycling, Olympic sport, combat sport, neuroscience, or tech. NOT car racing. It MUST bridge back to motorcycle racing mental performance. The rider should think "that is cool" first, then "that connects to my riding."',
        'Tuesday: Client Transformation — a motorcycle racer comeback or breakthrough story. Lead with the result, not the struggle.',
        'Wednesday: Neuroscience Teach — brain science (flow state, cortisol, dopamine, attention) applied specifically to riding a motorcycle on track. Reference corners, braking zones, lean angle, throttle control.',
        'Thursday: Provocative Hook — ONE uncomfortable truth about racing psychology that motorcycle racers avoid admitting. Pain-forward.',
        'Friday: Timely Race Reaction — react to REAL recent MotoGP, WorldSBK, BSB, or MotoAmerica results. Name specific riders and races.',
        'Saturday: Achievement/Tech Spotlight — performance technology, wearable tech innovations (Garmin, WHOOP, Oura Ring, Apple Watch, GoPro), brain-training devices, biometric studies, or breakthrough results connected to motorcycle racing. Examples: how riders use WHOOP strain scores to peak for race day, Garmin HRV data in recovery protocols, Oura Ring sleep staging studies, Apple Watch heart rate zone analysis during track sessions, GoPro telemetry overlays revealing rider patterns.',
        'Sunday: Proof & Celebration — inspiring motorcycle racer wins, championship stats, or mental performance breakthroughs on the bike.'
    ];

    const liveRacing = champContext.hasLiveRacing
        ? `LIVE RACING THIS WEEKEND — prioritise current race results and reactions from MotoGP, WorldSBK, BSB, or MotoAmerica.`
        : '';

    const seasonNote = seasonalContext
        ? `Season context: ${seasonalContext.season} — ${seasonalContext.context}`
        : '';

    const prompt = `Search the web for 7 stories from the last 7-30 days for a motorcycle racing mental performance coach's social media. The audience is club racers, amateur racers, and aspiring professionals who race motorcycles on track.

TARGET CHAMPIONSHIPS: MotoGP, World Superbikes (WorldSBK), British Superbikes (BSB), MotoAmerica, Moto2, Moto3, ASBK.

PREFERRED SOURCES (search these first):
- Motorcycle racing: MotoGP.com, WorldSBK.com, Crash.net, MCN, The Race, Motorsport.com, BSB.com, MotoAmerica.com, Autosport, MotoMatters, Paddock Magazine
- Sports science: Frontiers in Psychology, BJSM, JSSM, Journal of Sports Sciences
- News: BBC Sport, Sky Sports, ESPN
- Neuroscience: Nature, Scientific American, New Scientist
- Wearable tech: DC Rainmaker, Wareable, WHOOP blog, Oura blog, Garmin blog
- Motorcycle-specific: Bike magazine, Visor Down, Bennetts

AVOID: listicles, affiliate content, generic self-help blogs, Reddit/forums, unverified claims without data, car-only content.

${liveRacing}
${seasonNote}

Find one story for each slot:
${daySlots.map((d, i) => `${i + 1}. ${d}`).join('\n')}

ARTICLE QUALITY STANDARD — what makes a 10/10 article:
- Has a SPECIFIC data point (a percentage, a measurement, a time, a direct quote from a researcher or rider)
- From a credible, citable source
- Directly connects to something a motorcycle racer experiences on track
- Makes a rider think: "That explains what happens to me" or "I never thought about it that way"
- Current (last 7 days ideal, up to 30 days acceptable)

═══ CRITICAL ACCURACY RULE (NON-NEGOTIABLE) ═══

You have Google Search access. You MUST only reference articles that ACTUALLY appeared in your search results.

DO NOT:
- Invent article titles that sound plausible but do not exist
- Fabricate publication names or dates
- Create hypothetical articles about topics you expect to exist
- Guess at URLs

DO:
- Use the EXACT title from the search result snippet
- Use the EXACT URL from the search result
- If you cannot find a real article for a slot, use a DIFFERENT real article that fits
- If a slot has no good match, adapt a real article you DID find to fit that slot's theme

The system will cross-check your article titles and URLs against the Google Search grounding metadata. Fabricated articles will be flagged. It is far better to adapt a real article to a different slot than to invent a fake one.

If you genuinely cannot find 7 distinct articles, return fewer items. 5 real articles is better than 7 where 2 are fabricated.

═══ END ACCURACY RULE ═══

RULES:
- Every headline must connect to the MENTAL PERFORMANCE side of motorcycle racing
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, throttle control, the bike, leathers, lid, paddock, grid, qualifying
- NO CAR RACING — do NOT use F1, NASCAR, IndyCar, or any car racing stories. This is a motorcycle-only audience.
- Related topics are welcome: neuroscience, peak performance, wearable tech (Garmin, WHOOP, Oura Ring, Apple Watch, GoPro), biometrics (HRV, EEG, heart rate variability, sleep tracking, strain scores, readiness scores), other sports (tennis, rugby, cycling, combat sports), technology, brain science
- WEARABLE TECH STORIES ARE HIGHLY VALUED: any study, innovation, or use case involving Garmin, GoPro, WHOOP, Oura Ring, or Apple Watch in peak performance, athletic recovery, sleep optimisation, or race-day preparation is excellent content.
- At least 2 stories should reference SPECIFIC real motorcycle riders or real race results
- "Outside the paddock" stories must still bridge back to what a motorcycle racer experiences on track
- NO YOUTUBE — only written articles from news sites, blogs, and publications
- BANNED HEADLINE WORDS: Never use "unlock", "unleash", "inner genius", "secrets", "transform", "level up", "game-changer", "supercharge", "master your mindset", "hidden power"
- No em dashes or en dashes in headlines. Use commas or colons instead.

Return a JSON array with 7 objects:
[
  {
    "pillarId": "${pillars[0]?.id || 'outside-the-paddock'}",
    "headline": "Your compelling headline connecting the story to rider mental performance",
    "sourceArticle": "Copy the EXACT article title from the search result. Do not rewrite it.",
    "articleUrl": "Copy the EXACT URL from your search results. Leave empty string if unavailable.",
    "source": "Publication name | Date published",
    "summary": "3 sentences describing the key finding of the article",
    "talkingPoints": ["Point 1", "Point 2", "Point 3"],
    "killerDataPoint": "The specific number, percentage, measurement, or direct quote that makes this article valuable. Must be concrete and from the actual article.",
    "emotionalHook": "What should the motorcycle racer feel?",
    "mechanism": "Neuroscience mechanism referenced",
    "racingRelevance": "One sentence connecting to motorcycle racing on track, using motorcycle language (corner, apex, braking zone, throttle, lean angle, the bike, lid, leathers, paddock)",
    "contentBrief": "Type of post"
  }
]

Return ONLY the JSON array with exactly 7 items.`;

    return await callGeminiWithSearch(prompt, apiKey, true);
}


// ─── Generate a Single Post ──────────────────────────────────
export async function generatePost({ topic, pillar, framework, cta, authorityLine, motorsportBridge, apiKey, campaignDay = null, scheduleDay = null }) {

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

    const prompt = `Write a single VIDEO CAPTION for Craig Muirhead / Camino Coaching. This caption accompanies a short-form video (45-60s reel) posted to BOTH Facebook and Instagram. The VIDEO does the teaching. The CAPTION hooks attention, adds context, and drives the CTA trigger word.

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

${(() => {
            const reviewHook = getHookForPillar(pillar.id);
            if (reviewHook) {
                return `OPTIONAL REVIEW HOOK (use if it fits naturally, approximately 1 in 4 posts):
Reviewer: ${reviewHook.reviewer} (${reviewHook.country}, ${reviewHook.date})
Quote: "${reviewHook.quote}"
Hook angle: ${reviewHook.hookAngle}
Format: Use as opening line in quotation marks with reviewer's first name. Then build the teaching content around this theme.
`;
            }
            return '';
        })()}
OBJECTION-KILLING REVIEW OPTION (use naturally in CTA bridge section if relevant):
"${OBJECTION_KILLERS.triedEverything[Math.floor(Math.random() * OBJECTION_KILLERS.triedEverything.length)].quote}" - ${OBJECTION_KILLERS.triedEverything[Math.floor(Math.random() * OBJECTION_KILLERS.triedEverything.length)].reviewer}

REVIEW AUTHORITY ANCHOR (can be added to CTA section for reinforcement):
${getReviewAuthorityLine()}

CTA TO APPEND (after ·· separator, completely unrelated to video topic):
${cta.ctaTemplate}

CTA TRIGGER WORD: ${cta.triggerWord || 'MINDSET'}
${campaignNote}

VIDEO CAPTION STRUCTURE:
1. HOOK LINE: One punchy line that makes a rider stop scrolling. Reference the source article or a dramatic stat.
2. CONTEXT (1-2 sentences): What the video covers. Tease the revelation without giving it away.
3. ENGAGEMENT QUESTION: One question that drives comments ("Has this happened to you?")
4. CTA (after ·· separator): "Oh, by the way" or "Completely unrelated" or "PS". Comment trigger word "${cta.triggerWord || 'MINDSET'}" included. "With or without you" energy.
5. HASHTAGS: 3-5 niche hashtags on a new line at the very end.

RULES:
- This is a VIDEO CAPTION, not a standalone post. Keep it concise (100-200 words). The video does the heavy lifting.
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, throttle control, session, qualifying, grid, paddock, the bike, leathers, lid.
- UK English spelling throughout (colour, analyse, programme, tyre, favourite)
- WOW not HOW: Tease the revelation. NEVER give the specific fix.
- Use real data: ${CRAIG_STATS.personalBests} PBs, ${CRAIG_STATS.podiums} podiums, ${CRAIG_STATS.raceWins} wins, ${CRAIG_STATS.circuits} circuits, ${CRAIG_STATS.debriefs} debriefs, ${CRAIG_STATS.trustpilotScore} Trustpilot (${CRAIG_STATS.trustpilotReviews} reviews)
- NEVER use em dashes or en dashes. Use commas or full stops instead.
- NEVER use ** or bullet symbols
- No emojis in value content. Occasional use in CTA is acceptable.
- NEVER use generic coaching language: "mindset shift", "unlock your potential", "be your best self"
- CTA uses comment keyword (ManyChat delivery).

Return ONLY the caption text. No headers, no labels, no "=== CAPTION ===". Just the raw caption text ready to paste.`;

    return await callClaude(prompt, apiKey, false);
}

// ─── Generate Multiple Posts in Parallel ──────────────────────
export async function generatePosts(topics, config) {
    const { pillars, frameworks, ctas, authorityLines, motorsportBridges, apiKey, campaignDays } = config;

    const promises = topics.map((topic, i) => {
        return generatePost({
            topic,
            pillar: pillars[i],
            framework: frameworks[i],
            cta: ctas[i],
            authorityLine: authorityLines[i],
            motorsportBridge: motorsportBridges ? motorsportBridges[i] : null,
            apiKey,
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
export async function regeneratePost(post, apiKey) {
    const newContent = await generatePost({
        topic: post.topic,
        pillar: post.pillar,
        framework: post.framework,
        cta: post.cta,
        authorityLine: post.authorityLine,
        motorsportBridge: post.motorsportBridge,
        apiKey,
        campaignDay: post.campaignDay
    });
    return { ...post, content: newContent, edited: false };
}

// ─── Generate Video Script with Neurochemistry Layer ──────────
export async function generateVideoScript({ topic, chemicalId, videoLength = '45-60s', platform = 'FB Reel + IG Reel', outputFormat = '9:16', apiKey, sourceArticle = '', articleUrl = '', talkingPoints = [], emotionalHook = '', mechanism = '', racingRelevance = '', postContent = '' }) {

    const chemContext = buildVideoScriptContext(chemicalId, topic);

    // Get championship context for timely references
    const champCtx = getChampionshipContext();
    let raceNote = '';
    if (champCtx.hasLiveRacing) {
        raceNote = `\nRACE WEEKEND CONTEXT: Live racing this weekend — ${champCtx.currentWeekend.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}. Reference if naturally relevant.`;
    } else if (champCtx.hasRecentResults) {
        raceNote = `\nRECENT RACE CONTEXT: Recent results from ${champCtx.recent.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}.`;
    }

    // Build article context block — this is the backbone of the video
    let articleContext = '';
    if (sourceArticle || postContent) {
        articleContext = `
SOURCE ARTICLE (THIS IS THE BACKBONE OF THE VIDEO — NOT OPTIONAL):
${sourceArticle ? `Article: ${sourceArticle}` : ''}
${articleUrl ? `URL: ${articleUrl}` : ''}
${talkingPoints.length > 0 ? `Key Points: ${talkingPoints.join(', ')}` : ''}
${emotionalHook ? `Emotional Hook: ${emotionalHook}` : ''}
${mechanism ? `Mechanism: ${mechanism}` : ''}
${racingRelevance ? `Racing Relevance: ${racingRelevance}` : ''}

THE TEXT POST WRITTEN FROM THIS ARTICLE (for reference — the video must tell the same story):
${postContent.substring(0, 800)}
`;
    }

    const prompt = `You are Craig Muirhead's video content strategist. Write a complete video script for a ${videoLength} HeyGen avatar video.

PRODUCTION CONTEXT:
- This video uses AI avatar (Craig's likeness) narrating over a Manus slide deck
- Platform: ${platform}
- Output format: ${outputFormat}
- Target length: ${videoLength}
${raceNote}

${articleContext}

${chemContext}

═══ THE GOLDEN RULE: ARTICLE IS THE BACKBONE ═══
The video script MUST reference the same source article as the text post. The article provides the hook and at least one named example in the first 15 seconds. The neurochemical layer explains the science behind the article's story. The bridge connects it to the rider's experience and Camino Coaching data. The article is not optional background. It is the opening frame of the video.

This is the pattern that gets 19,000+ reach:
1. HOOK — Open with the article's most compelling fact, person, or finding. Third-party authority first.
2. SCENARIO — Use the article's named examples to paint a picture the viewer recognises. Then pivot to the rider's experience.
3. THE SCIENCE — This is where the neurochemistry layer comes in. Name the chemical that explains WHY the article's story works. Plain language. One clear mechanism.
4. THE COST — Quantify the impact for motorcycle racers. Use Craig's debrief data (${CRAIG_STATS.debriefs} debriefs, ${CRAIG_STATS.circuits} circuits, ${CRAIG_STATS.months} months).
5. THE BRIDGE — Connect the article's lesson to what Craig has seen across ${CRAIG_STATS.months} months in elite paddocks. Tease the solution but never give the fix.
6. CTA — Casual, low-pressure. Comment keyword or quiz link.

THE STRUCTURE IS: Third-party authority → Your brain chemistry → Your riding → Craig's data → CTA.

RULES:
- Use UK English spelling throughout (colour, analyse, programme, tyre, favourite)
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, throttle control, session, FP1, qualifying, grid, paddock, the bike
- NEVER use car racing language
- Write numbers out in full text for voice narration (e.g., "two thousand two hundred and forty nine" not "2,249")
- WOW not HOW: Reveal the chemical and what it does. NEVER give the specific fix or programme methodology
- Warm, direct, confident tone. Like a trusted paddock insider talking to a mate.
- Every section must reference a specific racing scenario (corner, session type, grid position)
- Keep each section tight. This is a ${videoLength} video, not an essay.
- The HOOK MUST open with the article, not with a generic neurochemistry statement.
- At least one named person from the article must appear in the first 15 seconds of the script.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

=== VIDEO SCRIPT ===
HOOK (0-5s):
[Open with the article's most compelling fact or person. One sentence. This becomes the text overlay on Slide 1.]

SCENARIO (5-15s):
[Use the article's named examples. Paint their achievement. Then pivot: "Now think about your last race weekend." Make the rider feel the connection.]

THE SCIENCE (15-35s):
[Name the chemical. Explain how it connects to what the article's subject did. Plain language. One clear mechanism. This is the "here's why their approach works" moment.]

THE COST (35-45s):
[Quantify the impact for riders. Lap time, corner time, race position. Use Craig's data from ${CRAIG_STATS.debriefs} debriefs.]

THE BRIDGE (45-55s):
[Connect the article to Craig's 60 months in elite paddocks. The pattern is the same. Tease the solution. Never give the fix.]

CTA (55-60s):
[Casual, low-pressure. Rider Mindset Quiz or comment keyword.]

=== SLIDE DECK BRIEF (FOR MANUS) ===
Slide 1 — Hook: [The article's most powerful fact. Bold text. Max 15 words.]
Slide 2 — Scenario: [The named person/example from the article. Max 15 words.]
Slide 3 — The Chemical: [Chemical name in teal. One-line description.]
Slide 4 — The Mechanism: [2-3 short bullet points of how it connects to the article's story.]
Slide 5 — The Data: [One big stat from Craig's data. Large number + short label.]
Slide 6 — The Bridge: [Teaser line connecting the article to the rider's experience.]
Slide 7 — CTA: [Free Rider Mindset Quiz + URL or comment keyword.]
Slide 8 — End Card (Optional): [Camino Coaching logo. Review count.]

=== HEYGEN NOTES ===
[Avatar position, gesture suggestions, pace notes for this specific video.]

=== SOCIAL CAPTION ===
[A short Facebook/Instagram caption to post alongside the video. 50-100 words. Reference the article. Include CTA and 3-5 hashtags.]`;

    return await callClaude(prompt, apiKey, false);
}


// ─── Generate 30-Second Shorts Script (Playbook-Compliant) ────────
// Follows the Camino Coaching 30-Second Shorts Playbook exactly:
// 4 slides, 75-85 words, 1.5s hook window, loop-engineered, one idea only.
export async function generateShortsScript({ topic, chemicalId, sourceArticle = '', articleUrl = '', mechanism = '', racingRelevance = '', killerDataPoint = '', talkingPoints = [], postContent = '', apiKey }) {

    const chemContext = buildVideoScriptContext(chemicalId, topic);

    const prompt = `You are Craig Muirhead's SHORT-FORM video strategist. Write a 30-SECOND Shorts script for YouTube Shorts + Instagram Reels + Facebook Reels.

=== THE 30-SECOND SHORTS PLAYBOOK (FOLLOW EXACTLY) ===

RULE 1 — YOU HAVE 1.5 SECONDS, NOT 3:
The first frame and first spoken word must create a reason to stay before the viewer's thumb finishes its scroll motion. Voice starts at 0.0 seconds. No intro. No greeting. No "in this video." The hook text (Slide 1) must be readable in under 1 second: 5-7 words maximum.

RULE 2 — TEXT ON SCREEN IS MANDATORY:
Over 60% watch sound-off. Every word spoken must appear as burned-in captions. Two layers: the slide content (key point/data) + captions of narration.

RULE 3 — ONE IDEA PER VIDEO:
A 30-second Short holds exactly ONE idea. Not two. Not "one idea with a bonus tip." One. Compress to 4 slides and 3 sections.

RULE 4 — SLIDE CHANGES EVERY 3-5 SECONDS:
4 slides in 30 seconds. Each on screen 5-8 seconds. Add visual micro-changes within slides where possible.

RULE 5 — DESIGN FOR THE LOOP:
End with a statement that connects back to the opening. The viewer's brain loops back. This is the most powerful algorithm signal.

RULE 6 — CTA MUST BE EFFORTLESS:
"Comment MINDSET for the free quiz." Six words. That is the entire CTA. No explaining the quiz. No sales pitch.

=== SOURCE MATERIAL ===
TOPIC: ${typeof topic === 'string' ? topic : topic?.headline || topic}
${sourceArticle ? `ARTICLE: ${sourceArticle}` : ''}
${articleUrl ? `URL: ${articleUrl}` : ''}
${mechanism ? `BRAIN CHEMICAL: ${mechanism}` : ''}
${killerDataPoint ? `KILLER DATA POINT: "${killerDataPoint}"` : ''}
${racingRelevance ? `RACING RELEVANCE: ${racingRelevance}` : ''}
${talkingPoints.length > 0 ? `KEY POINTS: ${talkingPoints.join(' | ')}` : ''}
${postContent ? `RELATED POST (for angle — do NOT copy):\n${postContent.substring(0, 400)}` : ''}

${chemContext}

=== HOOK FORMULAS (pick ONE) ===
- The Shock Stat: "63% of crashes happen within 3 laps of a personal best."
- The Impossible Claim: "Your brain makes you brake 5 metres earlier and you don't even know it."
- The Named Authority: "Simone Biles said her therapist was as crucial as her coach."
- The Direct Challenge: "You've never trained the 75% of performance that happens in your head."
- The Specific Question: "Where are your eyes 0.3 seconds before you hit the braking marker?"

=== WHAT KILLS THE HOOK (NEVER DO THESE) ===
- Any introduction or greeting
- "In this video I'm going to talk about..."
- Logo animations or brand intros
- Starting with context instead of the payoff
- Generic statements like "Mental performance matters"

=== OUTPUT FORMAT ===
Generate TWO things: the clean narration script AND the 4-slide Manus brief.

=== SHORTS SCRIPT (30 SECONDS) ===
HOOK (0-5s) | Slide 1:
[One sentence. Maximum 12 words spoken. 5-7 words on screen. Voice starts at 0.0 seconds. No pause. No intro.]

THE INSIGHT (5-18s) | Slide 2:
[The article reference + the chemical explanation. 3-4 sentences maximum. Approximately 35-40 words. Name the source. Name the chemical. One sentence explaining why it matters to the rider.]

THE PROOF (18-25s) | Slide 3:
[One data point from Craig's debrief data OR from the article. 1-2 sentences. Approximately 15-20 words. Big number on screen.]

CTA (25-30s) | Slide 4:
[One sentence. 6-8 words maximum. "Comment MINDSET for the free quiz."]

=== SHORTS SLIDE BRIEF (FOR MANUS — 4 SLIDES ONLY) ===
Slide 1 — Hook: [5-7 words. Bold. Text already visible on first frame. No fade-in.]
Slide 2 — The Insight: [Chemical name in teal/amber. One line describing the finding. Background: dark with racing imagery.]
Slide 3 — The Proof: [One big number or stat. Large text. Teal accent.]
Slide 4 — CTA: ["Comment MINDSET" in teal. Small: "Free Rider Mindset Quiz." Dark background for smooth loop.]

=== LOOP ENGINEERING ===
[One sentence explaining how the ending connects back to the opening to trigger replay.]

RULES:
- TOTAL WORD COUNT: 75-85 words for the narration. No more. Read it aloud and time it.
- UK English spelling (colour, analyse, programme, tyre, favourite)
- Motorcycle language: rider, corner, apex, lean angle, braking zone, turn-in, throttle, session, FP1, qualifying, grid, paddock, the bike
- NEVER use car racing language
- Numbers written in full text for voice (e.g., "six hundred and ninety nine" not "699")
- WOW not HOW: reveal the chemical and what it does, NEVER the fix
- Warm, direct, confident tone — paddock insider talking to a mate
- Audio pacing: FAST for hook (0-5s), SLOWER for insight (5-18s), DIRECT for CTA (25-30s)

Return the full formatted output with both sections.`;

    return await callClaude(prompt, apiKey, false);
}

// ─── Content Deduplication Storage ────────────────────────────────────────
const DEDUP_ARTICLES_KEY = 'rider-social-media-used-articles';
const DEDUP_HOOKS_KEY = 'rider-social-media-used-hooks';

function getUsedArticleUrls() {
    try {
        return JSON.parse(localStorage.getItem(DEDUP_ARTICLES_KEY) || '[]');
    } catch { return []; }
}

export function storeUsedArticles(topics) {
    const existing = getUsedArticleUrls();
    const newUrls = topics
        .filter(t => t.articleUrl)
        .map(t => ({ url: t.articleUrl, headline: t.headline, date: new Date().toISOString() }));
    const combined = [...existing, ...newUrls].slice(-60);
    localStorage.setItem(DEDUP_ARTICLES_KEY, JSON.stringify(combined));
}

function getUsedHooks() {
    try {
        return JSON.parse(localStorage.getItem(DEDUP_HOOKS_KEY) || '[]');
    } catch { return []; }
}

export function storeUsedHooks(posts) {
    const existing = getUsedHooks();
    const newHooks = posts
        .filter(p => p.content)
        .map(p => (p.content || '').split('\n')[0]);
    const combined = [...existing, ...newHooks].slice(-30);
    localStorage.setItem(DEDUP_HOOKS_KEY, JSON.stringify(combined));
}

function buildDeduplicationContext() {
    const usedUrls = getUsedArticleUrls();
    const usedHooks = getUsedHooks();
    let ctx = '';
    if (usedUrls.length > 0) {
        ctx += `\n\nDEDUPLICATION — DO NOT return any article from these previously used URLs:\n${usedUrls.map(a => a.url).join('\n')}\n`;
    }
    if (usedHooks.length > 0) {
        ctx += `\n\nDEDUPLICATION — DO NOT repeat or closely paraphrase these previously used hooks:\n${usedHooks.join('\n')}\n`;
    }
    return ctx;
}

// ─── Claude API Call (Anthropic) — Content Writing ──────────────────
export async function callClaude(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Claude API key not configured. Go to Settings to add your key.');
    }

    const cleanKey = apiKey.trim();
    const promptPreview = prompt.substring(0, 120).replace(/\n/g, ' ');
    addLogEntry('api', `Claude → ${parseJson ? 'JSON' : 'text'} | ${promptPreview}...`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': cleanKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.85
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errMsg = error.error?.message || `Claude API error: ${response.status}`;
        addLogEntry('error', `Claude API ${response.status}: ${errMsg}`);
        throw new Error(errMsg);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim();
    const tokensIn = data.usage?.input_tokens || '?';
    const tokensOut = data.usage?.output_tokens || '?';

    addLogEntry('success', `Claude ✓ ${tokensIn}→${tokensOut} tokens | model: claude-sonnet-4`);

    if (!content) {
        addLogEntry('error', 'Claude returned empty content');
        throw new Error('No content returned from Claude API.');
    }

    if (parseJson) {
        try {
            // Try to extract JSON array first (for topics, posts)
            const arrayMatch = content.match(/\[[\s\S]*\]/);
            if (arrayMatch) return JSON.parse(arrayMatch[0]);

            // Try to extract JSON object (for emails, single responses)
            const objectMatch = content.match(/\{[\s\S]*\}/);
            if (objectMatch) return JSON.parse(objectMatch[0]);

            // Try raw parse
            return JSON.parse(content);
        } catch (e) {
            addLogEntry('error', 'Claude JSON parse failed', content.substring(0, 500));
            throw new Error('Failed to parse Claude response as JSON. Please try again.');
        }
    }

    return content;
}

// ─── Resolve Google Grounding API Redirect URLs to Real URLs ────
// Uses Vercel serverless function (/api/resolve-url) to bypass CORS.
// Browser-side fetch CANNOT follow cross-origin redirects from Google's
// grounding-api-redirect URLs because the target sites don't set CORS headers.
async function resolveRedirectUrl(redirectUrl, timeoutMs = 8000) {
    if (!redirectUrl || !redirectUrl.includes('grounding-api-redirect')) {
        return redirectUrl;
    }

    // Strategy 1: Server-side resolution via Vercel Edge Function (no CORS issues)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const apiUrl = `/api/resolve-url?url=${encodeURIComponent(redirectUrl)}`;
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
            const data = await response.json();
            if (data.resolvedUrl && data.resolvedUrl !== redirectUrl && !data.resolvedUrl.includes('grounding-api-redirect')) {
                console.log(`[URL Resolve] ✅ Server-side → ${data.resolvedUrl}`);
                return data.resolvedUrl;
            }
        }
    } catch (e) {
        console.warn(`[URL Resolve] Server-side failed: ${e.message} — trying direct...`);
    }

    // Strategy 2: Direct browser fetch (usually fails due to CORS, but works locally sometimes)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(redirectUrl, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.url && response.url !== redirectUrl && !response.url.includes('grounding-api-redirect')) {
            console.log(`[URL Resolve] ✅ Direct HEAD → ${response.url}`);
            return response.url;
        }
    } catch (e) {
        // Expected to fail (CORS) — this is why the server-side API exists
    }

    console.warn(`[URL Resolve] ❌ Could not resolve: ${redirectUrl.substring(0, 80)}...`);
    return redirectUrl;
}

async function resolveAllRedirectUrls(chunks) {
    if (!chunks || chunks.length === 0) return chunks;
    const redirectChunks = chunks.filter(c => c.uri?.includes('grounding-api-redirect'));
    if (redirectChunks.length === 0) return chunks;

    console.log(`[URL Resolve] Resolving ${redirectChunks.length} redirect URLs...`);
    const resolvedResults = await Promise.allSettled(
        chunks.map(async (chunk) => {
            const resolvedUri = await resolveRedirectUrl(chunk.uri);
            return { ...chunk, uri: resolvedUri, originalUri: chunk.uri };
        })
    );
    const resolved = resolvedResults.map((result, i) =>
        result.status === 'fulfilled' ? result.value : chunks[i]
    );
    const successCount = resolved.filter(c => !c.uri?.includes('grounding-api-redirect')).length;
    console.log(`[URL Resolve] Done: ${successCount} resolved, ${resolved.length - successCount} still redirect URLs`);
    return resolved;
}

// ─── Gemini API Call with Google Search Grounding — Research ────
export async function callGeminiWithSearch(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Gemini API key not configured. Go to Settings to add your key.');
    }

    const dedupPrompt = prompt + buildDeduplicationContext();

    const promptPreview = prompt.substring(0, 120).replace(/\n/g, ' ');
    addLogEntry('api', `Gemini → search grounding | ${promptPreview}...`);

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: dedupPrompt }] }],
                tools: [{ google_search: {} }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 16384
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errMsg = error.error?.message || `Gemini API error: ${response.status}`;
        addLogEntry('error', `Gemini API ${response.status}: ${errMsg}`);
        throw new Error(errMsg);
    }

    const data = await response.json();
    console.log('[Gemini] Raw response:', JSON.stringify(data).substring(0, 500));

    let content = '';
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part.text) content += part.text;
        }
    }

    // Extract URLs from Gemini's grounding metadata
    let groundingChunks = [];
    try {
        const gm = data.candidates?.[0]?.groundingMetadata;
        console.log('[Gemini] groundingMetadata keys:', gm ? Object.keys(gm) : 'NONE');
        if (gm?.groundingChunks) {
            for (const chunk of gm.groundingChunks) {
                if (chunk.web?.uri) {
                    groundingChunks.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                }
            }
        }
        if (gm?.groundingSupports) {
            for (const support of gm.groundingSupports) {
                if (support.groundingChunkIndices) {
                    console.log(`[Gemini] Support: "${(support.segment?.text || '').substring(0, 80)}" → chunks: [${support.groundingChunkIndices.join(', ')}]`);
                }
            }
        }
    } catch (e) {
        console.warn('[Gemini] Error extracting grounding metadata:', e);
    }

    console.log(`[Gemini] Found ${groundingChunks.length} grounding chunks (pre-resolve):`, groundingChunks.map(c => c.uri.substring(0, 80)));

    // Resolve redirect URLs to real URLs
    groundingChunks = await resolveAllRedirectUrls(groundingChunks);

    const realCount = groundingChunks.filter(c => !c.uri.includes('grounding-api-redirect') && !c.uri.includes('googleapis.com')).length;
    const redirectCount = groundingChunks.length - realCount;
    console.log(`[Gemini] After resolve: ${realCount} real URLs, ${redirectCount} still redirect`);
    addLogEntry('success', `Gemini ✓ ${groundingChunks.length} sources (${realCount} real URLs${redirectCount > 0 ? `, ${redirectCount} unresolved` : ''})`);
    groundingChunks.forEach((c, i) => console.log(`  [${i}] ${c.uri.substring(0, 80)}${c.uri.length > 80 ? '...' : ''} — "${c.title}"`));

    // Strip markdown code fences if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    if (!content) {
        const blockReason = data.candidates?.[0]?.finishReason;
        const safetyRatings = data.candidates?.[0]?.safetyRatings;
        console.error('[Gemini] No content. Finish reason:', blockReason, 'Safety:', safetyRatings);

        // Auto-retry on RECITATION block (Gemini thinks response is too close to copyrighted text)
        if (blockReason === 'RECITATION' && !prompt.includes('[RETRY]')) {
            console.warn('[Gemini] RECITATION block — retrying with softer prompt...');
            const retryPrompt = prompt.replace(/copy.*?word.for.word/gi, 'use the accurate title')
                .replace(/EXACT/g, 'accurate')
                .replace(/never fabricat/gi, 'do not fabricat') + '\n\n[RETRY] Summarise your findings in your own words. Do not quote large blocks of text from articles.';
            return callGeminiWithSearch(retryPrompt, apiKey, parseJson);
        }

        throw new Error(`No content from Gemini (reason: ${blockReason || 'unknown'}). Try again.`);
    }

    // Log finishReason for debugging truncation
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        console.warn(`[Gemini] ⚠️ finishReason: ${finishReason} (response may be truncated)`);
        addLogEntry('warn', `Gemini finishReason: ${finishReason} — response may be incomplete`);
    }

    if (parseJson) {
        try {
            // Pre-clean: strip grounding-api-redirect URLs from raw JSON text before parsing
            // Phase 1: Complete redirect URLs (with closing quote)
            content = content.replace(/"articleUrl"\s*:\s*"https?:\/\/vertexaisearch\.cloud\.google\.com\/grounding-api-redirect\/[^"]*"/g,
                '"articleUrl": ""');
            content = content.replace(/"articleUrl"\s*:\s*"https?:\/\/[^"]*googleapis\.com[^"]*"/g,
                '"articleUrl": ""');

            // Phase 2: TRUNCATED redirect URLs (no closing quote — response was cut off mid-URL)
            // This catches the exact bug: Gemini's response ends mid-URL, no closing ", regex fails
            content = content.replace(/"articleUrl"\s*:\s*"https?:\/\/vertexaisearch\.cloud\.google\.com\/grounding-api-redirect\/[^"]*$/gm,
                '"articleUrl": ""');
            content = content.replace(/"articleUrl"\s*:\s*"https?:\/\/[^"]*googleapis\.com[^"]*$/gm,
                '"articleUrl": ""');

            let parsed;

            // Approach 1: Direct parse (cleanest)
            try { parsed = JSON.parse(content); } catch { }

            // Approach 2: Find JSON array with balanced brackets (from Driver app)
            if (!parsed) {
                const arrStart = content.indexOf('[');
                if (arrStart !== -1) {
                    let depth = 0;
                    let arrEnd = -1;
                    for (let i = arrStart; i < content.length; i++) {
                        if (content[i] === '[') depth++;
                        else if (content[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
                    }
                    if (arrEnd > arrStart) {
                        try { parsed = JSON.parse(content.substring(arrStart, arrEnd + 1)); } catch { }
                    }
                }
            }

            // Approach 3: Greedy regex fallback
            if (!parsed) {
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    try { parsed = JSON.parse(jsonMatch[0]); } catch { }
                }
            }

            // Approach 4: Repair truncated JSON array
            if (!parsed) {
                const arrayStart = content.indexOf('[');
                if (arrayStart !== -1) {
                    let truncated = content.substring(arrayStart);
                    const lastBrace = truncated.lastIndexOf('}');
                    if (lastBrace !== -1) {
                        truncated = truncated.substring(0, lastBrace + 1) + ']';
                        try {
                            parsed = JSON.parse(truncated);
                            console.warn(`[Gemini] Repaired truncated JSON — recovered ${parsed.length} items`);
                            addLogEntry('warn', `Gemini response was truncated — recovered ${parsed.length} of 7 stories`);
                        } catch {
                            const lastComma = truncated.lastIndexOf('},');
                            if (lastComma !== -1) {
                                truncated = truncated.substring(0, lastComma + 1) + ']';
                                try {
                                    parsed = JSON.parse(truncated);
                                    console.warn(`[Gemini] Deep-repaired truncated JSON — recovered ${parsed.length} items`);
                                    addLogEntry('warn', `Gemini response truncated — recovered ${parsed.length} of 7 stories`);
                                } catch { }
                            }
                        }
                    }
                }
            }

            // Approach 5: Nuclear option — strip ALL redirect URLs from content, then retry
            if (!parsed) {
                console.warn('[Gemini] All parse approaches failed — trying nuclear URL strip...');
                let nuclear = content;
                // Strip ANY vertexaisearch/googleapis URL anywhere in the content
                nuclear = nuclear.replace(/https?:\/\/vertexaisearch[^\s"',\]}]*/g, '');
                nuclear = nuclear.replace(/https?:\/\/[^\s"',\]]*googleapis\.com[^\s"',\]}]*/g, '');
                // Fix empty string values that might have been left dangling
                nuclear = nuclear.replace(/"articleUrl"\s*:\s*"?\s*$/gm, '"articleUrl": ""');
                nuclear = nuclear.replace(/"articleUrl"\s*:\s*(?=")/g, '"articleUrl": ');

                // Try all approaches again on nuclear-cleaned content
                try { parsed = JSON.parse(nuclear); } catch { }
                if (!parsed) {
                    const arrStart = nuclear.indexOf('[');
                    if (arrStart !== -1) {
                        let depth = 0, arrEnd = -1;
                        for (let i = arrStart; i < nuclear.length; i++) {
                            if (nuclear[i] === '[') depth++;
                            else if (nuclear[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
                        }
                        if (arrEnd > arrStart) {
                            try { parsed = JSON.parse(nuclear.substring(arrStart, arrEnd + 1)); } catch { }
                        }
                    }
                }
                if (!parsed) {
                    const arrStart = nuclear.indexOf('[');
                    if (arrStart !== -1) {
                        let truncated = nuclear.substring(arrStart);
                        const lastBrace = truncated.lastIndexOf('}');
                        if (lastBrace !== -1) {
                            truncated = truncated.substring(0, lastBrace + 1) + ']';
                            try { parsed = JSON.parse(truncated); } catch { }
                        }
                        if (!parsed) {
                            const lastComma = truncated?.lastIndexOf('},') ?? -1;
                            if (lastComma !== -1) {
                                truncated = truncated.substring(0, lastComma + 1) + ']';
                                try { parsed = JSON.parse(truncated); } catch { }
                            }
                        }
                    }
                }
                if (parsed) {
                    console.warn(`[Gemini] Nuclear strip recovered ${Array.isArray(parsed) ? parsed.length : 1} items`);
                    addLogEntry('warn', `Recovered ${Array.isArray(parsed) ? parsed.length : 1} stories after aggressive URL cleanup`);
                }
            }

            if (!parsed) {
                throw new Error('Could not extract JSON from Gemini response');
            }

            if (Array.isArray(parsed)) {
                // Helper: check if a URL is still an unresolved Gemini redirect
                const isRedirectUrl = (u) => u.includes('grounding-api-redirect') || u.includes('googleapis.com') || u.includes('vertexaisearch');

                // Filter out YouTube only — keep redirect URLs as clickable fallbacks
                // (matches Driver app approach: redirect URLs work when clicked even if ugly)
                const cleanChunks = groundingChunks.filter(gc =>
                    !gc.uri.includes('youtube.com') && !gc.uri.includes('youtu.be')
                );
                const usedChunkIdxs = new Set();

                // Sort: resolved real URLs first, redirect URLs last
                cleanChunks.sort((a, b) => {
                    const aIsRedirect = isRedirectUrl(a.uri) ? 1 : 0;
                    const bIsRedirect = isRedirectUrl(b.uri) ? 1 : 0;
                    return aIsRedirect - bIsRedirect;
                });

                const resolvedCount = cleanChunks.filter(c => !isRedirectUrl(c.uri)).length;
                const redirectCount = cleanChunks.filter(c => isRedirectUrl(c.uri)).length;
                console.log(`[URL] ${cleanChunks.length} grounding chunks: ${resolvedCount} resolved, ${redirectCount} redirect fallbacks`);
                cleanChunks.forEach((c, i) => console.log(`  [${i}] ${isRedirectUrl(c.uri) ? '🔄' : '✅'} ${c.uri.substring(0, 80)} — "${c.title}"`));

                if (cleanChunks.length === 0) {
                    console.warn('[URL] ⚠️ NO grounding chunks available');
                    addLogEntry('warn', 'No URLs in grounding chunks — URL rescue will find them');
                }

                // Helper: compute word similarity score between two strings
                const wordSimilarity = (textA, textB) => {
                    const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'was', 'are', 'has', 'have', 'its', 'been', 'were', 'will', 'their', 'what', 'when', 'how', 'not', 'but', 'they', 'about', 'more', 'than', 'into', 'over', 'also', 'after', 'just', 'most', 'only', 'some', 'very', 'could', 'would', 'should', 'which', 'where', 'other', 'each', 'both', 'does', 'here', 'there', 'even', 'your', 'said', 'like', 'made', 'back', 'much']);
                    const wordsA = textA.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
                    const wordsB = textB.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
                    if (wordsA.length === 0 || wordsB.length === 0) return 0;
                    const overlap = wordsA.filter(w => wordsB.includes(w)).length;
                    return overlap / Math.max(Math.min(wordsA.length, wordsB.length), 1);
                };

                // Score ALL stories against ALL chunks, then assign best matches
                const storyScores = parsed.map((item, idx) => {
                    const url = item.articleUrl || '';
                    // Strip bad URLs (YouTube, Gemini redirects)
                    if (url.includes('youtube.com') || url.includes('youtu.be') || isRedirectUrl(url)) {
                        if (isRedirectUrl(url)) console.warn(`[URL] Story ${idx + 1}: 🚫 Stripped Gemini redirect URL`);
                        item.articleUrl = '';
                    }

                    if (item.articleUrl &&
                        (item.articleUrl.startsWith('http://') || item.articleUrl.startsWith('https://'))) {
                        item.urlMatchMethod = 'gemini-direct';
                        console.log(`[URL] Story ${idx + 1}: ✅ Gemini-provided URL → ${item.articleUrl}`);
                        // Check if this URL matches a grounding chunk and mark it used
                        for (let ci = 0; ci < cleanChunks.length; ci++) {
                            if (cleanChunks[ci].uri === item.articleUrl) {
                                usedChunkIdxs.add(ci);
                                item.groundingTitle = cleanChunks[ci].title || '';
                                break;
                            }
                        }
                        return null; // Already resolved
                    }

                    // Build combined text for matching
                    const storyText = `${item.headline || ''} ${item.sourceArticle || ''} ${item.emotionalHook || ''} ${item.racingRelevance || ''}`;

                    // Score each chunk
                    const chunkScores = cleanChunks.map((chunk, ci) => {
                        const chunkText = `${chunk.title || ''}`;
                        const chunkUri = chunk.uri || '';

                        let score = 0;
                        let method = '';

                        // Domain match (high value)
                        try {
                            const domain = new URL(chunkUri).hostname.replace('www.', '').split('.')[0];
                            const srcLower = (item.sourceArticle || '').toLowerCase().replace(/[\s\-\.]/g, '');
                            if (domain.length > 2 && srcLower.includes(domain)) {
                                score += 0.5;
                                method = 'domain-match';
                            }
                        } catch { }

                        // Title similarity
                        const titleScore = wordSimilarity(storyText, chunkText);
                        score += titleScore;
                        if (titleScore > 0.3 && !method) method = 'title-match';

                        // URL path keyword match (check if URL path contains key words from story)
                        try {
                            const pathWords = new URL(chunkUri).pathname.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
                            const headWords = (item.headline || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
                            const pathOverlap = headWords.filter(w => pathWords.some(pw => pw.includes(w) || w.includes(pw))).length;
                            if (pathOverlap > 0) {
                                score += pathOverlap * 0.15;
                                if (!method) method = 'path-match';
                            }
                        } catch { }

                        if (!method && score > 0) method = 'fuzzy-match';

                        return { ci, score, method, chunkTitle: chunk.title || '', chunkUri };
                    });

                    return { idx, chunkScores: chunkScores.sort((a, b) => b.score - a.score) };
                }).filter(Boolean);

                // Assign best matches, prioritising highest scores first
                // Sort stories by their best available score (highest first) so confident matches go first
                storyScores.sort((a, b) => (b.chunkScores[0]?.score || 0) - (a.chunkScores[0]?.score || 0));

                for (const story of storyScores) {
                    const item = parsed[story.idx];
                    let assigned = false;

                    for (const cs of story.chunkScores) {
                        if (usedChunkIdxs.has(cs.ci)) continue; // Already used by another story
                        if (cs.score <= 0) continue;

                        usedChunkIdxs.add(cs.ci);
                        item.articleUrl = cs.chunkUri;
                        item.groundingTitle = cs.chunkTitle;
                        item.urlMatchScore = cs.score;

                        // Classify confidence
                        if (cs.method === 'domain-match' || cs.score >= 0.5) {
                            item.urlMatchMethod = 'domain-match';
                        } else if (cs.score >= 0.25) {
                            item.urlMatchMethod = 'title-match';
                        } else {
                            item.urlMatchMethod = 'best-guess';
                        }

                        console.log(`[URL] Story ${story.idx + 1}: ${cs.score >= 0.25 ? '✅' : '🟡'} ${item.urlMatchMethod} (score: ${cs.score.toFixed(2)}, method: ${cs.method}) → ${cs.chunkUri}`);
                        if (cs.chunkTitle) console.log(`  Grounding title: "${cs.chunkTitle}"`);
                        assigned = true;
                        break;
                    }

                    if (!assigned) {
                        // Last resort: assign any remaining unused chunk (Gemini DID search, so URLs exist)
                        for (let ci = 0; ci < cleanChunks.length; ci++) {
                            if (!usedChunkIdxs.has(ci)) {
                                usedChunkIdxs.add(ci);
                                item.articleUrl = cleanChunks[ci].uri;
                                item.groundingTitle = cleanChunks[ci].title || '';
                                item.urlMatchMethod = 'best-guess';
                                item.urlMatchScore = 0;
                                console.warn(`[URL] Story ${story.idx + 1}: 🟡 best-guess (no keyword match) → ${cleanChunks[ci].uri}`);
                                assigned = true;
                                break;
                            }
                        }
                    }

                    if (!assigned) {
                        console.warn(`[URL] Story ${story.idx + 1}: ⚠️ ALL CHUNKS EXHAUSTED — will attempt URL rescue`);
                        item.articleUrl = '';
                        item.urlMatchMethod = 'unverified';
                    }
                }
            }

            // ─── URL RESCUE PASS ─────────────────────────────────────
            // Any story that STILL has no URL gets a targeted follow-up search
            const missingUrlStories = parsed
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => !item.articleUrl || item.urlMatchMethod === 'unverified');

            if (missingUrlStories.length > 0) {
                console.log(`[URL-RESCUE] ${missingUrlStories.length} stories need URL rescue...`);
                addLogEntry('api', `URL rescue: searching for ${missingUrlStories.length} missing URLs`);

                const rescuePromises = missingUrlStories.map(async ({ item, idx }) => {
                    try {
                        const searchQuery = `${item.sourceArticle || item.headline || ''}`;
                        console.log(`[URL-RESCUE] Story ${idx + 1}: searching for "${searchQuery}"`);

                        const rescuePrompt = `Find the exact URL for this article. Search the web and return ONLY the URL.

ARTICLE TO FIND: "${searchQuery}"
${item.source ? `PUBLICATION: ${item.source}` : ''}

Return a JSON object with ONE field:
{"url": "the real article URL from your search results"}

If you absolutely cannot find this specific article, find the closest matching article on the same topic from a reputable source and return that URL instead.

Return ONLY the JSON object, nothing else.`;

                        const rescueResponse = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{ parts: [{ text: rescuePrompt }] }],
                                    tools: [{ google_search: {} }],
                                    generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
                                })
                            }
                        );

                        if (!rescueResponse.ok) {
                            console.warn(`[URL-RESCUE] Story ${idx + 1}: API error ${rescueResponse.status}`);
                            return;
                        }

                        const rescueData = await rescueResponse.json();

                        // First try: extract URL from grounding metadata and resolve redirects
                        let rescuedUrl = '';
                        const rescueGM = rescueData.candidates?.[0]?.groundingMetadata;
                        if (rescueGM?.groundingChunks) {
                            for (const chunk of rescueGM.groundingChunks) {
                                let uri = chunk.web?.uri || '';
                                if (!uri || uri.includes('youtube.com') || uri.includes('youtu.be')) continue;
                                // Resolve redirect if needed
                                if (uri.includes('grounding-api-redirect')) {
                                    uri = await resolveRedirectUrl(uri);
                                }
                                if (uri && !uri.includes('grounding-api-redirect') && !uri.includes('googleapis.com')) {
                                    rescuedUrl = uri;
                                    break;
                                }
                            }
                        }

                        // Second try: parse from response text
                        if (!rescuedUrl) {
                            let rescueText = '';
                            for (const part of (rescueData.candidates?.[0]?.content?.parts || [])) {
                                if (part.text) rescueText += part.text;
                            }
                            rescueText = rescueText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
                            try {
                                const parsed = JSON.parse(rescueText.match(/\{[\s\S]*\}/)?.[0] || '{}');
                                if (parsed.url && parsed.url.startsWith('http') &&
                                    !parsed.url.includes('youtube.com') &&
                                    !parsed.url.includes('grounding-api-redirect') &&
                                    !parsed.url.includes('googleapis.com')) {
                                    rescuedUrl = parsed.url;
                                }
                            } catch { }
                        }

                        if (rescuedUrl) {
                            item.articleUrl = rescuedUrl;
                            item.urlMatchMethod = 'url-rescue';
                            console.log(`[URL-RESCUE] Story ${idx + 1}: ✅ RESCUED → ${rescuedUrl}`);
                            addLogEntry('success', `URL rescue ✓ Story ${idx + 1} → ${rescuedUrl.substring(0, 60)}...`);
                        } else {
                            console.warn(`[URL-RESCUE] Story ${idx + 1}: ❌ Could not find URL even after rescue search`);
                            addLogEntry('error', `URL rescue failed for story ${idx + 1}: ${item.headline?.substring(0, 50)}`);
                        }
                    } catch (err) {
                        console.error(`[URL-RESCUE] Story ${idx + 1}: Error during rescue:`, err);
                    }
                });

                await Promise.allSettled(rescuePromises);

                const stillMissing = parsed.filter(item => !item.articleUrl).length;
                if (stillMissing > 0) {
                    console.warn(`[URL-RESCUE] ${stillMissing} stories still have no URL after rescue`);
                    addLogEntry('error', `${stillMissing} stories still missing URLs after rescue attempts`);
                } else {
                    console.log('[URL-RESCUE] All stories now have URLs!');
                    addLogEntry('success', 'All 7 stories have verified URLs');
                }
            }

            return parsed;
        } catch (e) {
            console.error('[Gemini] JSON parse failed. Error:', e.message);
            console.error('[Gemini] Content (first 1000 chars):', content.substring(0, 1000));
            console.error('[Gemini] Content (last 500 chars):', content.substring(Math.max(0, content.length - 500)));
            addLogEntry('error', `[Gemini] JSON parse failed. Content: ${content.substring(0, 500)}`);
            throw new Error('Failed to parse Gemini response as JSON. Try again.');
        }
    }

    return content;
}

// ─── HeyGen Video Generation API ─────────────────────────────────────
export async function generateHeyGenVideo({ script, avatarId, voiceId, apiKey }) {
    if (!apiKey) {
        throw new Error('HeyGen API key not configured. Go to Settings to add your key.');
    }

    // Parse the script sections into scenes
    const sections = ['HOOK', 'SCENARIO', 'THE SCIENCE', 'THE COST', 'THE BRIDGE', 'CTA'];
    const scenes = sections.map((section, i) => {
        const regex = new RegExp(`${section}[^:]*:\\s*([\\s\\S]*?)(?=${sections[i + 1] ? sections[i + 1] : '==='}|$)`);
        const match = script.match(regex);
        const text = (match?.[1] || '').trim();
        return {
            scene_type: 'talking_photo',
            character: {
                type: 'avatar',
                avatar_id: avatarId || 'default',
                voice: { type: 'text', voice_id: voiceId || 'default', input_text: text }
            },
            background: { type: 'color', value: '#0A1628' }
        };
    }).filter(s => s.character.voice.input_text);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey
        },
        body: JSON.stringify({
            video_inputs: scenes,
            dimension: { width: 1080, height: 1920 }
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HeyGen API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.video_id || data.video_id;
}

// ─── HeyGen Video Status Check ───────────────────────────────────────
export async function checkHeyGenVideoStatus(videoId, apiKey) {
    const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
        headers: { 'X-Api-Key': apiKey }
    });

    if (!response.ok) {
        throw new Error(`HeyGen status check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: data.data?.status || 'unknown',
        videoUrl: data.data?.video_url || null,
        thumbnailUrl: data.data?.thumbnail_url || null
    };
}

// ─── Generate Email Copy (Claude) ─────────────────────────────
export async function generateEmail({ topic, pillar, cta, postContent, apiKey }) {
    // Extract rich article data from topic
    const articleTitle = topic?.sourceArticle || topic?.headline || '';
    const articleUrl = topic?.articleUrl || '';
    const killerDataPoint = topic?.killerDataPoint || '';
    const summary = topic?.summary || '';
    const racingRelevance = topic?.racingRelevance || '';
    const mechanism = topic?.mechanism || '';
    const source = topic?.source || '';
    const talkingPoints = topic?.talkingPoints || [];

    const prompt = `You are Craig Muirhead, writing a detailed nurture email to your list of motorcycle racers. This email is built around a specific article you found during your weekly research.

TOPIC: ${topic?.headline || topic || 'Mental performance in motorcycle racing'}
PILLAR: ${pillar?.name || 'Mental Performance'} — ${pillar?.description || ''}
CTA: ${cta?.name || 'Rider Mindset Quiz'} — Trigger: ${cta?.triggerWord || 'MINDSET'}

=== THE SOURCE ARTICLE (use this as the backbone of the email) ===
${articleTitle ? `ARTICLE TITLE: ${articleTitle}` : ''}
${source ? `SOURCE: ${source}` : ''}
${articleUrl ? `URL: ${articleUrl}` : ''}
${summary ? `SUMMARY: ${summary}` : ''}
${killerDataPoint ? `KILLER DATA POINT: "${killerDataPoint}"` : ''}
${mechanism ? `NEUROSCIENCE MECHANISM: ${mechanism}` : ''}
${racingRelevance ? `RACING RELEVANCE: ${racingRelevance}` : ''}
${talkingPoints.length > 0 ? `KEY TALKING POINTS:\n${talkingPoints.map(p => '- ' + p).join('\n')}` : ''}

${postContent ? `RELATED SOCIAL POST (for voice/angle reference — do NOT copy):\n${postContent.substring(0, 600)}\n` : ''}

WRITE A DETAILED EMAIL (400-600 words). This is NOT a quick note — it's a proper article-style email that delivers genuine value. The reader should feel like they learned something specific.

EMAIL STRUCTURE:
1. HOOK (1-2 sentences): Open with the article's most fascinating finding. Name the study, researcher, or athlete. Make them curious.
2. THE ARTICLE INSIGHT (3-5 sentences): Share the key finding from the article in detail. Use the killer data point. Explain what the researchers/athletes discovered and WHY it matters.
3. THE NEUROSCIENCE (3-4 sentences): Explain the brain mechanism behind this finding. Reference ${mechanism || 'the relevant neuroscience'}. Use plain language. This is where Craig adds the layer the original article doesn't have.
4. THE RACING SCENARIO (3-4 sentences): Paint a vivid, specific motorcycle racing scenario where this exact pattern plays out. Turn numbers, session context (qualifying vs race), physical sensations (tyre grip, braking force, lean angle). Show the reader THEIR experience through the lens of this research.
5. THE DATA BRIDGE (2-3 sentences): Connect to Camino Coaching debrief data. "After ${CRAIG_STATS.debriefs} debriefs..." or "${CRAIG_STATS.personalBests} PBs tracked..." Show the pattern is real and measurable.
6. THE CTA (2-3 sentences): Separated by ·· — casual, unrelated. "Oh, by the way..." Comment trigger word or direct link.

RULES:
- UK English throughout (colour, analyse, programme, tyre, favourite)
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, throttle control, session, qualifying, grid, paddock, the bike, leathers, lid
- WOW not HOW: reveal the problem and neuroscience, NEVER the specific fix or methodology
- Reference the source article by name — this is borrowed authority
- Include the killer data point prominently
- Write like you're talking to a mate in the paddock — direct, warm, data-driven
- NEVER use em dashes or en dashes. Use commas or full stops instead.
- No emojis except occasionally in CTA section
- Short paragraphs (1-3 sentences), mobile-friendly formatting

OUTPUT FORMAT (return as JSON):
{
  "subject": "Email subject line (max 50 chars, curiosity-driven, lowercase feel)",
  "preheader": "Preview text (max 80 chars, complements subject, teases the data point)",
  "hook": "Opening 1-2 sentences — reference the article directly. Name it.",
  "articleInsight": "3-5 sentences expanding on the article's key finding. Include the killer data point. This is the meat.",
  "dataHighlight": "The single killer data point or quote, formatted as a standalone callout",
  "problem": "3-4 sentences: the neuroscience mechanism explained in plain language. Why this happens in the brain.",
  "racingScenario": "3-4 sentences: vivid motorcycle racing scenario where this plays out. Turn numbers, session context, sensations.",
  "bridge": "2-3 sentences: connect to Camino debrief data. Tease the solution without giving it away.",
  "ctaText": "CTA button text (max 5 words, action-oriented)",
  "ctaUrl": "${cta?.url || 'https://caminocoaching.co.uk/rider-mindset'}",
  "signoff": "Short sign-off line before the name (1 sentence, personal)"
}

Return ONLY the JSON object. No markdown, no code fences.`;

    const result = await callClaude(prompt, apiKey, true);

    if (Array.isArray(result)) {
        return result[0];
    }
    return result;
}

// ─── Render Email as GHL-Compatible HTML ─────────────────────
export function renderEmailHTML(emailData, pillar) {
    const {
        subject = 'From the paddock...',
        preheader = '',
        hook = '',
        articleInsight = '',
        dataHighlight = '',
        problem = '',
        racingScenario = '',
        bridge = '',
        ctaText = 'Take the Free Quiz',
        ctaUrl = 'https://caminocoaching.co.uk/rider-mindset',
        signoff = 'Speak soon'
    } = emailData;

    const pillarColor = pillar?.color || '#00BFA5';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${subject}</title>
<!--[if !mso]><!-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
</style>
<!--<![endif]-->
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; background-color: #0D1117; font-family: 'Inter', Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { display: block; outline: none; text-decoration: none; border: 0; }
  a { color: #00BFA5; text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; padding: 0 16px !important; }
    .content { padding: 28px 20px !important; }
    .cta-btn { display: block !important; text-align: center !important; }
    h1 { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#0D1117;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

<!-- Wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;">
<tr><td align="center" style="padding:24px 0;">

<!-- Container -->
<table role="presentation" class="container" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

<!-- Header Bar -->
<tr><td style="padding:0 0 2px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:linear-gradient(90deg,${pillarColor},#00BFA5);height:4px;border-radius:4px 4px 0 0;"></td>
    </tr>
  </table>
</td></tr>

<!-- Main Content Card -->
<tr><td class="content" style="background-color:#0A1628;padding:36px 32px;border-radius:0 0 8px 8px;">

  <!-- Logo/Brand -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:13px;font-weight:700;color:#00BFA5;letter-spacing:1.5px;text-transform:uppercase;">CAMINO COACHING</span>
    </td></tr>
  </table>

  <!-- Hook -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;">
      <h1 style="font-size:24px;font-weight:700;color:#F0F6FC;line-height:1.3;margin:0;">${hook}</h1>
    </td></tr>
  </table>

  ${articleInsight ? `
  <!-- Article Insight -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.7;color:#C8D1DC;margin:0;">${articleInsight}</p>
    </td></tr>
  </table>` : ''}

  ${dataHighlight ? `
  <!-- Killer Data Point Callout -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:24px 0 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(218,165,32,0.08);border-left:4px solid #DAA520;border-radius:0 6px 6px 0;">
        <tr><td style="padding:16px 20px;">
          <p style="font-size:16px;line-height:1.5;color:#F0F6FC;font-weight:600;margin:0;">"${dataHighlight}"</p>
        </td></tr>
      </table>
    </td></tr>
  </table>` : ''}

  <!-- Problem/Science -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.7;color:#B0BAC5;margin:0;">${problem}</p>
    </td></tr>
  </table>

  ${racingScenario ? `
  <!-- Racing Scenario -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(0,191,165,0.06);border-left:4px solid #00BFA5;border-radius:0 6px 6px 0;">
        <tr><td style="padding:16px 20px;">
          <p style="font-size:15px;line-height:1.65;color:#C8D1DC;margin:0;font-style:italic;">${racingScenario}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>` : ''}

  <!-- Bridge -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.65;color:#D1D5DB;font-weight:600;margin:0;font-style:italic;">${bridge}</p>
    </td></tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td class="cta-btn" style="background-color:#00BFA5;border-radius:6px;padding:14px 32px;">
          <a href="${ctaUrl}" target="_blank" style="color:#0A1628;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;letter-spacing:0.5px;">${ctaText}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Sign-off -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);margin-top:28px;">
      <p style="font-size:14px;line-height:1.5;color:#8B949E;margin:0 0 4px 0;">${signoff}</p>
      <p style="font-size:14px;font-weight:700;color:#F0F6FC;margin:0;">Craig Muirhead</p>
      <p style="font-size:12px;color:#00BFA5;margin:2px 0 0 0;">Camino Coaching — Motorcycle Racer Mental Performance</p>
    </td></tr>
  </table>

</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 0 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:12px 0;">
      <p style="font-size:11px;color:#484F58;margin:0;">
        You're receiving this because you signed up for mental performance insights for motorcycle racers.
        <br><a href="{{unsubscribe_link}}" style="color:#484F58;text-decoration:underline;">Unsubscribe</a> · <a href="{{preferences_link}}" style="color:#484F58;text-decoration:underline;">Email preferences</a>
      </p>
      <p style="font-size:11px;color:#30363D;margin:8px 0 0 0;">
        © ${new Date().getFullYear()} Camino Coaching · caminocoaching.co.uk
      </p>
    </td></tr>
  </table>
</td></tr>

</table>
<!-- /Container -->

</td></tr>
</table>
<!-- /Wrapper -->

</body>
</html>`;
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
