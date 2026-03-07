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

// ─── Master System Prompt (Motorcycle Racers FB/IG) ──────────
// Source: AI_Content_Engine_Rider_Audience.docx — Data-Driven Operational Brief
const SYSTEM_PROMPT = `You are Craig Muirhead's Facebook & Instagram content strategist. You generate daily social media posts for motorcycle racers that deliver genuine value and include an unrelated CTA to one of the lead magnets.

# ABOUT CRAIG MUIRHEAD & CAMINO COACHING
- 59-year-old flow performance coach based in Mallorca, Spain
- 10 seasons inside elite racing paddocks (MotoGP, WorldSBK, BSB, Moto3, MotoE, F1, F4, GB3)
- 1,644 personal bests, 1,286 podiums, 1,063 race wins tracked
- Proprietary 'In The Zone' app: 1,800+ debriefs, 118+ riders, 142+ circuits worldwide
- 4.9 Trustpilot rating (84 reviews, 100% five-star) + 5.0 Google rating (36 reviews, 100% five-star) = 120 total reviews
- REVIEW AUTHORITY: Use these in rotation: "Rated 4.9 out of 5 on Trustpilot from 84 unprompted rider reviews" / "84 five-star reviews on Trustpilot. 100% satisfaction rate" / "120 reviews across Trustpilot and Google. Every single one is five stars."
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
    const pillarList = pillars.map((p, i) => {
        const schedule = WEEKLY_SCHEDULE[i];
        const brief = schedule?.contentBrief ? `\n   Content brief: ${schedule.contentBrief}` : '';
        const searchCats = p.searchCategories
            ? `\n   Search categories: ${p.searchCategories.map(c => c.name + ': ' + c.searchTerms).join(' | ')}`
            : '';
        return `${i + 1}. ${schedule?.day || 'Day ' + (i + 1)}: ${schedule?.contentType || p.name} (${p.name}) — ${p.description} \n   Search focus: ${schedule?.searchFocus || 'motorcycle racer mental performance'}${brief}${searchCats} \n   Sample topics: ${p.topics.slice(0, 3).join(', ')} `;
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

CRITICAL WEEKLY INSTRUCTION — OUTSIDE THE PADDOCK:
Every week, you MUST find at least 2 current stories from OUTSIDE motorsport (other sports, technology, science, achievements) that connect to mental performance principles. Use these for the Monday and Saturday posts. Prioritise stories that are ASPIRATIONAL, FASCINATING, or SURPRISING over stories that highlight problems.

OUTSIDE THE PADDOCK SEARCH CATEGORIES (pick from these for Mon + Sat):
1. ELITE ATHLETES IN OTHER SPORTS using mental performance tools (F1, tennis, Olympic athletes, rugby teams using neurofeedback, breathwork, flow training, visualisation)
2. TECHNOLOGY & INVENTIONS that measure or enhance human performance (EEG headsets, HRV monitors, eye-tracking, AI coaching, sleep tech, reaction time devices)
3. BREAKTHROUGH RESULTS in motorsport or beyond (championships, records, comebacks — add the mental performance analysis layer)
4. BRAIN SCIENCE DISCOVERIES (flow state studies, neuroplasticity, attention research, decision-making under pressure, dopamine and performance)
5. COMEBACKS & UNDERDOG STORIES (injury returns, no-budget teams winning, athletes written off proving everyone wrong)

The bridge back to motorcycle racing should feel natural, not forced. The rider should think "that is cool" FIRST, then "oh, that connects to my riding" SECOND.

WEEKLY CONTENT MIX:
- Monday: Outside the Paddock (Familiar) — aspirational story from outside motorsport
- Tuesday: Client Transformation (Sexy) — lead with the result, not the struggle
- Wednesday: Neuroscience Teach (Strange) — science-backed insight with racing application
- Thursday: Provocative Hook (Scary) — the ONE pain-forward post per week
- Friday: Timely Race Reaction (Familiar) — react to real race results from this week
- Saturday: Achievement/Tech Spotlight (Strange) — second Outside the Paddock post
- Sunday: Proof & Celebration (Sexy) — client wins, stats, review quotes. End on the highest note.

SEARCH PRIORITIES:
- MotoGP, WorldSBK, BSB, Moto2, Moto3 news with mental performance angles
- Rider interviews about pressure, crashes and coming back, confidence, pre - race nerves
- Peer - reviewed neuroscience studies on attention, flow, choking, reaction time
- Sports psychology research applicable to motorsport
- Stories from F1, tennis, rugby, Olympic sports, cycling, combat sports that connect to mental performance
- Performance technology innovations and brain science breakthroughs
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
1. A compelling Facebook headline / hook angle(MUST start with a specific data point or dramatic scenario)
2. The source article that inspired it(title, publication, and key data point)
3. 2 - 3 key talking points connecting the article to the pillar
4. The emotional hook — what should the rider reading this feel ? (Recognition > Fear > Curiosity > Hope)
5. A suggested neuroscience mechanism to reference
6. Racing relevance — ONE sentence connecting the finding to what a club or amateur motorcycle racer actually experiences on a race weekend. Use MOTORCYCLE language: corner, apex, lean angle, braking zone, turn -in, body position, hanging off, throttle control, session, FP1, qualifying, grid, holding area, paddock, the bike, leathers, lid. NEVER use car racing language.
7. Championship tie-in (OPTIONAL) — If a specific championship event is relevant, reference it.
8. Content brief — What type of post this should be (Outside the Paddock, Client Transformation, Neuroscience Teach, Provocative Hook, Timely Race Reaction, Achievement/Tech Spotlight, or Proof & Celebration)

QUALITY FILTERS — PREFER these sources:
- Motorcycle racing publications: MCN, Crash.net, MotoMatters, BSB.com, MotoGP.com, WorldSBK.com, The Race, Motorsport.com, ASBK.com.au, MotoAmerica.com, CSBK.ca
- Sports science journals: Frontiers in Psychology, BJSM, JSSM, Journal of Sports Sciences
- Neuroscience: Nature, Scientific American, New Scientist
- Credible news: BBC Sport, Sky Sports, ESPN
- Performance technology: Wired, TechCrunch, MIT Technology Review
- AVOID: listicles, self-help blogs, Reddit, unverified claims, car-only content

Format as JSON array:
[
    {
        "pillarId": "outside-the-paddock",
        "headline": "Red Bull's F1 team just started using real-time brainwave monitoring during simulator sessions. Here is why your mental data matters more than your suspension data.",
        "sourceArticle": "Title of article — Publication — key data point",
        "articleUrl": "URL if found",
        "talkingPoints": ["Point 1", "Point 2", "Point 3"],
        "emotionalHook": "Curiosity: That technology exists? I want that for my riding.",
        "mechanism": "Neurofeedback — training the brain to recognise and reproduce peak performance states",
        "racingRelevance": "If an F1 team measures brainwaves in the simulator, measuring your mental state before a session is not soft. It is the cutting edge.",
        "contentBrief": "Outside the Paddock — Monday post. Bridge from F1 tech to rider mental data."
    }
]

Return ONLY the JSON array with 7 items.`;

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
export async function generateVideoScript({ topic, chemicalId, videoLength = '45-60s', platform = 'FB Reel + IG Reel', outputFormat = '9:16', apiKey }) {

    const chemContext = buildVideoScriptContext(chemicalId, topic);

    // Get championship context for timely references
    const champCtx = getChampionshipContext();
    let raceNote = '';
    if (champCtx.hasLiveRacing) {
        raceNote = `\nRACE WEEKEND CONTEXT: Live racing this weekend — ${champCtx.currentWeekend.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}. Reference if naturally relevant.`;
    } else if (champCtx.hasRecentResults) {
        raceNote = `\nRECENT RACE CONTEXT: Recent results from ${champCtx.recent.map(e => `${e.flag} ${e.championship} at ${e.venue}`).join(', ')}.`;
    }

    const prompt = `You are Craig Muirhead's video content strategist. Write a complete video script for a ${videoLength} HeyGen avatar video about neurochemistry in motorcycle racing.

PRODUCTION CONTEXT:
- This video uses AI avatar (Craig's likeness) narrating over a Manus slide deck
- Platform: ${platform}
- Output format: ${outputFormat}
- Target length: ${videoLength}
${raceNote}

${chemContext}

RULES:
- Use UK English spelling throughout (colour, analyse, programme, tyre, favourite)
- Use MOTORCYCLE language: rider, corner, apex, lean angle, braking zone, turn-in, body position, throttle control, session, FP1, qualifying, grid, paddock, the bike
- NEVER use car racing language
- Write numbers out in full text for ElevenLabs voice (e.g., "two thousand two hundred and forty nine" not "2,249")
- WOW not HOW: Reveal the chemical and what it does. NEVER give the specific fix or programme methodology
- Warm, direct, confident tone. Like a trusted paddock insider talking to a mate.
- Every section must reference a specific racing scenario (corner, session type, grid position)
- Keep each section tight. This is a ${videoLength} video, not an essay.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

=== VIDEO SCRIPT ===
HOOK (0-5s):
[The scroll-stopping opening line. One sentence. This becomes the text overlay on Slide 1.]

SCENARIO (5-15s):
[Describe the on-track moment. Make the rider feel it. Specific corner, specific sensation.]

THE SCIENCE (15-35s):
[Name the chemical. Explain it in plain language. One clear mechanism.]

THE COST (35-45s):
[Quantify the impact. Lap time, corner time, race position. Use data.]

THE BRIDGE (45-55s):
[Tease the solution. Connect to the bigger picture. Never give the fix.]

CTA (55-60s):
[Casual, low-pressure. Rider Mindset Quiz or comment keyword.]

=== SLIDE DECK BRIEF (FOR MANUS) ===
Slide 1 — Hook: [Bold text for the hook. Max 15 words.]
Slide 2 — Scenario: [Short scenario text. Max 15 words.]
Slide 3 — The Chemical: [Chemical name in teal. One-line description.]
Slide 4 — The Mechanism: [2-3 short bullet points of how it manifests.]
Slide 5 — The Data: [One big stat. Large number + short label.]
Slide 6 — The Bridge: [Teaser line about the solution.]
Slide 7 — CTA: [Free Rider Mindset Quiz + URL or comment keyword.]
Slide 8 — End Card (Optional): [Camino Coaching logo. Review count.]

=== HEYGEN NOTES ===
[Avatar position, gesture suggestions, pace notes for this specific video.]

=== SOCIAL CAPTION ===
[A short Facebook/Instagram caption to post alongside the video. 50-100 words. Include CTA and 3-5 hashtags.]`;

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
async function callClaude(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Claude API key not configured. Go to Settings to add your key.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
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
        throw new Error(error.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim();

    if (!content) {
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
            throw new Error('Failed to parse Claude response as JSON. Please try again.');
        }
    }

    return content;
}

// ─── Gemini API Call with Google Search Grounding — Research ────
async function callGeminiWithSearch(prompt, apiKey, parseJson = true) {
    if (!apiKey) {
        throw new Error('Gemini API key not configured. Go to Settings to add your key.');
    }

    const dedupPrompt = prompt + buildDeduplicationContext();

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: dedupPrompt }] }],
                tools: [{ google_search: {} }],
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 8192
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    let content = '';
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part.text) content += part.text;
        }
    }

    content = content.trim();

    if (!content) {
        throw new Error('No content returned from Gemini API.');
    }

    if (parseJson) {
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
        } catch (e) {
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
    const prompt = `You are Craig Muirhead, writing a short nurture email to your list of motorcycle racers.

TOPIC: ${topic?.headline || topic || 'Mental performance in motorcycle racing'}
PILLAR: ${pillar?.name || 'Mental Performance'} — ${pillar?.description || ''}
CTA: ${cta?.name || 'Race Weekend Review'} — Trigger: ${cta?.triggerWord || 'REVIEW'}

${postContent ? `RELATED SOCIAL POST (for context — do NOT copy this word-for-word, use it as inspiration for the email angle):\n${postContent.substring(0, 500)}\n` : ''}

Write a SHORT nurture email. This is NOT a newsletter — it's a punchy, personal email from Craig.

RULES:
- UK English throughout
- Use motorcycle racing language (never car racing terms)
- WOW not HOW: reveal the problem and neuroscience, NEVER the methodology
- Maximum 200 words body (short, punchy, value-dense)
- Write like you're talking to a mate in the paddock — direct, no fluff
- Include a specific racing scenario or data point
- End with a clear CTA that links to the lead magnet

OUTPUT FORMAT (return as JSON):
{
  "subject": "Email subject line (max 50 chars, curiosity-driven, lowercase feel)",
  "preheader": "Preview text (max 80 chars, complements subject)",
  "hook": "Opening line — punchy, scenario-based, stops the scroll (1-2 sentences)",
  "problem": "The problem/neuroscience angle (2-3 sentences, include a data point or stat)",
  "bridge": "The 'what if' bridge — teases the solution without giving it away (1-2 sentences)",
  "ctaText": "CTA button text (max 5 words, action-oriented)",
  "ctaUrl": "${cta?.url || 'https://improve-rider.scoreapp.com'}",
  "signoff": "Short sign-off line before the name (1 sentence, personal)"
}

Return ONLY the JSON object. No markdown, no code fences.`;

    const result = await callClaude(prompt, apiKey, true);

    // callClaude with parseJson=true expects an array, but we're returning an object
    // So we need to handle this — the JSON might be parsed as-is or need extraction
    if (Array.isArray(result)) {
        return result[0]; // If it wrapped in an array
    }
    return result;
}

// ─── Render Email as GHL-Compatible HTML ─────────────────────
export function renderEmailHTML(emailData, pillar) {
    const {
        subject = 'From the paddock...',
        preheader = '',
        hook = '',
        problem = '',
        bridge = '',
        ctaText = 'Take the Free Review',
        ctaUrl = 'https://improve-rider.scoreapp.com',
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

  <!-- Problem/Science -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:20px 0 0 0;">
      <p style="font-size:15px;line-height:1.65;color:#B0BAC5;margin:0;">${problem}</p>
    </td></tr>
  </table>

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
