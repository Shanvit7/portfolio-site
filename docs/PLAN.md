# Paper-and-crayon portfolio

## Current implementation

- The paper-and-crayon portfolio is now the canonical homepage at `/`; old portfolio UI is replaced. `/new` redirects to `/`.
- The portfolio intro lives at `/`:  white paper, Rubik Dirt display lettering, Patrick Hand copy, blue/red crayon accents, and a static wax underline.
- Fresh full-width composition reuses existing portfolio facts, not its layout. Role copy: **Front End engineer. Product at heart.**
- Original `/` page is unchanged. Its shell is isolated through `components/portfolio-shell.tsx`.
- `remotion` and `@remotion/player` are installed at matching version `4.0.536`, but not imported by the static intro.
- Intro remains static. One scroll-scrubbed Remotion stage connects IoTric basketball, Mavonic ping-pong, and Zosma AI football.
- Root route now carries canonical metadata and is indexable. Regression checks: `node scripts/check-paper-intro.mjs [origin]` against a running server, plus `node scripts/check-court.mjs`, `node scripts/check-rally.mjs`, `node scripts/check-penalty.mjs`, and responsive browser check `node scripts/check-responsive.mjs [origin]` (requires installed `agent-browser`).

## Latest correction · 17 October 2026 · Intro scribble, shorts and responsive layouts

- Intro name and underline now draw sequentially from real looping SVG scribble paths. The greeting appears first, then first name, surname and crayon underline. Text remains semantic and selectable; existing textured lettering and underline assets remain the reveal masks. Animation finishes in 2.65 seconds without shifting layout. No-JS and reduced-motion users see fully drawn static copy.
- Browser inspected midway and after completion: letters fill progressively through crosshatching scribble paths, not as a uniform straight wipe; all four strokes reach offset zero. Regression validates the sequence, no layout change, and reduced-motion static state.

- White clothing-shaped gap was an anatomy-path defect, not the hem stripes. Both thigh paths are explicitly closed. The initial skin fill exposed an unwanted central wedge; shorts are now recut longer with a lower rounded crotch and dark center seam, covering all central skin. Enlarged browser close-up verified normal shorts and a clean open gap between legs, with neither white inset nor dangling skin. Regression checks cover both closed contours and shorts point-in-fill across the former wedge. Latest close-up: `/tmp/portfolio-paper-qa/rally-shorts-closeup.png`.
- Basketball story reuses `StoryRail` on screens at or below 700px: four semantic panels move right to left below the sticky court, with focus-driven link navigation. Desktop retains its vertical story beside Harden. No duplicated copy or new dependencies.
- Small portrait phones retain animation down to 551px high. Reduced motion, heights at or below 550px, and landscape heights at or below 650px use static, vertically readable stories. This supersedes the earlier blanket 650px-height cutoff.
- Shared artwork now determines compact mode from actual viewport width, not the narrower chapter column. This fixes the tablet hoop overlapping story text. Mobile rally art starts below `max(44svh, 360px)`, matching its text lane; football copy spacing is tightened to fit its existing 320px-minimum lane.
- `StoryRail` explicitly resets opacity to 1 and x to 0 when motion switches off. Omitting these styles retained Motion's previous opacity 0 during phone-to-desktop resizing and hid desktop copy.
- Browser regression covers 320×568, 320×667, 360×640, 375×667, 390×844, 430×932, 768×1024, 1440×900 and 844×390; all twelve beats, no page overflow, pinned text visibility, horizontal direction, clipping, keyboard link focus, responsive resizing and reduced motion. Screenshots inspected for small-phone rally/football and corrected tablet basketball. Physical-device Safari/Android and formal performance/accessibility audits remain unverified.
- Latest screenshots: `/tmp/portfolio-paper-qa/rally-closed-thighs-desktop.png`, `rally-small-phone.png`, `football-small-phone.png`, `basketball-mobile-first.png`, `basketball-mobile-slide.png`, `tablet-responsive-fixed.png`.

## Zosma AI night stadium · Awaiting review

User corrections supersede the initial football direction: **no Three.js; crayon-anime artwork only; watch Ronaldo take the shot, not through his eyes.** The implemented camera remains behind Ronaldo and keeps his whole body visible. Original intro and accepted Harden artwork remain unchanged.

- The final Mavonic return is a high lob from Me. It passes above Backend & AI's paddle without contact, exits the actual right screen edge, and drops/morphs into the football. A late failed swing is not a return hit.
- Latest rally art request: Me is an athletic, muscular crayon character with an approximate likeness from the user's supplied portrait; Backend & AI is Bender from Futurama. Follow-up correction lightens skin, reduces exaggerated head/beard/grin proportions, broadens shoulders and tapers the waist. `rallyArmsAt()` supplies fixed-length elbow chains: paddle hand follows the real grip transform, free hand counterbalances with four-frame lag instead of resting on the hip. Shared `Paddle` preserves exact contact anchors and miss geometry. Shorts are plain dark, with the white hem stripes removed at the user's request. No portrait file was copied into public assets.
- Stadium fills the viewport width, without white side gutters. Continuous semicircular crowd tiers extend beyond both screen edges, with floodlights, night colors, waving supporters, a three-man wall and goalkeeper. Perspective and shrinking ball convey depth without WebGL.
- Football sky now has 160 additional illustration units and sparse stars. Stars begin scattered; only after net contact at penalty frame 530 do they form a bright connected GOAL constellation, completing on the last frame 600. Reverse scrolling restores scattered stars, with no early letter outline.
- Ronaldo wears United red/white, RONALDO 7, dark socks and yellow boots. Scroll controls preparation, run-up, right-foot contact, follow-through, keeper dive and net response. Arms use fixed-length two-bone geometry; palms align to forearms rather than rotating independently.
- Four sourced Zosma HTML story panels cover founding-engineer ownership, Foodstories, SAP CRM/Legal Ops, and Cowork/local AI. Shared `story-rail.tsx` moves Mavonic and Zosma panels right to left. Headings sit higher in a separate top paper lane.
- **Scroll masking bug fixed:** fading only the text left an opaque sticky background covering the incoming stadium. Opacity now belongs to the entire lane, and reveal starts only after the chapter reaches the pinned top position.
- Football reserves `max(34svh, 320px)` for copy; `footballViewport()` uses the same rule. Full bleed uses measured viewport width and stage offset, with Remotion's native `overflowVisible` and a viewport clip. Other sports retain their existing framing.
- Timeline: **1,977 frames at 60fps**, with 240 football-handoff frames, 600 penalty frames and a final reading hold. Native scroll only; no autoplay, timers or export. Three.js, React Three Fiber and @remotion/three were removed.
- Reduced motion, short viewports and no-JS retain static crayon illustrations and all twelve semantic story beats. Hidden football fallback is unmounted once animated mode activates.

### Resume files and verification

- `app/new/football-art.tsx`, `ronaldo-art.tsx`, `zosma-story.tsx`, `story-rail.tsx`; shared `rally-timeline.ts`, `court-player.tsx`, `court.module.css`, `sports-art.tsx` and `iotric-story.tsx`.
- Passed: four regression scripts, TypeScript, targeted Biome and production build. Penalty checks cover real missed-paddle clearance, full-bleed handoff alignment, right-boot contact before ball release, fixed arm lengths, untwisted wrists, depth trajectory and goal clearance.
- Browser inspected desktop, 390×844 mobile, 768×1024 tablet, 2510×944 ultrawide, reduced motion and reverse scrolling. No canvas, horizontal overflow or runtime/hydration errors. Copy and stadium bounds stay disjoint; stadium reaches x=0 through viewport right edge.
- Reproduced the white-block issue during native wheel scrolling before the chapter pinned. Verified the corrected lane is transparent before pinning and visible at top=0 afterward.
- Latest QA: `/tmp/portfolio-paper-qa/football-bleed-bowl.png`, `football-fullbleed-mobile.png`, `football-fullbleed-wide.png`, `football-no-white-block.png`, `football-pinned-fixed.png`.
- Await user feedback; do not mark this artwork accepted or resume Harden polish without a request. Formal performance/accessibility audit remains deferred.

## Prior checkpoint · Mavonic rally · Accepted before Zosma

This implements the user's next-scene request and later corrections. The IoTric v1 checkpoint below remains a historical snapshot; its stop instruction still applies to further Harden illustration polish, not this newly requested chapter.

- **Sides: me versus backend + AI.** Blue player is labelled “Me”; red opponent is labelled “Backend & AI”. It is not backend versus AI.
- Ball goes through the basketball hoop, falls a long distance while the camera follows down, gradually shrinks/loses its seams, and reaches the opponent's ping-pong paddle. The table enters from below instead of immediately crossfading over the court.
- Handoff reserves **240svh of native scroll** and 300 seekable frames. Complete sports timeline: **1,137 frames at 60fps**. No timers, autoplay, scroll hijacking, new animation dependencies, or video export.
- Mavonic copy occupies a pinned top lane. Four semantic HTML panels move **right to left**, with reading holds between slides; they no longer travel vertically through the playing area. Keyboard focus brings an offscreen panel into view.
- Full-width table and two athletic player silhouettes use the existing blue/red/white crayon palette and wax texture. Mobile repositions players and ball contacts to keep complete silhouettes inside the viewport.
- Facts come from `lib/constants.ts` and `.references/frontend.md`: October 2024–September 2025; PropertyGuru's Next.js/Strapi platform and 10K+ daily visitors; RBAC, lead workflows, SQL/backend work and SSG/ISR; FaceNet; async FastAPI/Agno/Groq vision stand-up bot with Slack notifications; Draftus with Next.js, Supabase and TanStack Query.
- Reduced-motion, no-JS, and viewports at or below 650px high use compact static illustrations and vertically readable copy, without a long animation runway. Intro and original `/` remain unchanged.

### Resume files and checks

- `app/new/iotric-story.tsx`, `court-player.tsx`, and `court.module.css`: shared sticky stage, measured section boundaries, lazy Player, responsive/static modes.
- `app/new/mavonic-story.tsx`: sourced story copy, pinned horizontal rail and keyboard-focus handling.
- `app/new/rally-timeline.ts`: pure rally, handoff camera/ball geometry and section-to-frame mapping; `rally-art.tsx` and `sports-art.tsx`: artwork and continuous scene composition.
- `court-art.tsx` accepts ball visibility so the handoff draws only one ball. `court-timeline.ts` rounds hand coordinates at sub-pixel precision to prevent server/browser trig hydration mismatches.
- Passed: all three regression scripts, TypeScript, targeted Biome and production build. Rally checks cover eight returns, net clearance, reversible seeking, continuous on-screen handoff, world-space drop distance and paddle alignment on desktop/mobile.
- Browser checked at 1440×1000, 768×1024, 390×844, plus compact 720×500 and reduced-motion mode. No horizontal overflow or browser errors. Verified reverse scrolling and keyboard Tab focus into the AI story panel.
- QA screenshots: `/tmp/portfolio-paper-qa/mavonic-horizontal-first.png`, `mavonic-horizontal-mid.png`, `mavonic-drop-20.png`, `mavonic-drop-50.png`, `mavonic-drop-80.png`, `mavonic-mobile-final.png`, `mavonic-mobile-ai.png`, `mavonic-tablet.png`, and `mavonic-reduced.png`.
- User accepted this stage before requesting Zosma. Its later final-return miss correction is recorded above. Further likeness/art direction and a formal performance/accessibility audit can follow separately.

## Checkpoint · 16 October 2026 · IoTric court v1

**User accepted this version as working for now. Stop here; character styling and animation polish will be improved later.** This supersedes the earlier animation pause and intro-only scope, not the requirement to keep the intro itself static.

### Saved implementation

- `/new` retains the approved white-paper/crayon intro and unchanged role copy. Original `/` remains untouched.
- “Finding my feet.” covers only IoTric: final-year internship in July 2022, React/Redux and debugging experience, April 2023 transition to SDE I, myIDFi, Enoobs frontend ownership and mentoring, and qie-chatbot/botric.ai through October 2024.
- One lazy Remotion Player owns the scene. Native scroll maps directly to `PlayerRef.seekTo()` over 481 frames at 60fps; no autoplay, scroll hijacking, or video export.
- Ball drops, Harden accelerates through a low dribble, gathers with both hands overhead, and releases a deep high-arc shot toward the hoop. Net reacts after the basket.
- Current character follows the supplied shooting reference: rear three-quarter view, athletic silhouette, Nets black/white kit, “HARDEN 13”, white sleeve/socks, and wax-grain finish. Earlier front-facing caricature and segmented-limb artwork were replaced.
- Pause/resume controls were removed at the user's request. Stopping scroll stops motion. Reduced-motion and short-height viewports use compact static artwork; story text remains server-rendered and readable without JavaScript.
- Desktop uses a sticky court beside scrolling story beats. Mobile places the court above the story. Further visual refinement is explicitly deferred, not considered finished art direction.

### Resume from these files

- `app/new/iotric-story.tsx`: chapter copy, lazy loading, motion preference and viewport handling.
- `app/new/court-player.tsx`: embedded Remotion composition and scroll-to-frame bridge.
- `app/new/court-timeline.ts`: pure frame-derived motion, leg geometry, gather and shot trajectory.
- `app/new/harden-art.tsx`: current rear-view character and two-handed shooting pose.
- `app/new/court-art.tsx`: court, hoop, ball, camera framing and shared static artwork.
- `app/new/court.module.css`: responsive chapter/sticky layout.
- `public/new/wax-grain.png`: static crayon texture mask.

### Verification at checkpoint

- Passed: `node scripts/check-court.mjs` (481 deterministic frames, continuous ball path, fixed leg lengths, court contact, shot and net response).
- Passed: `node scripts/check-paper-intro.mjs` (original-page/shell preservation, route metadata, semantic story and static assets).
- Passed: `pnpm exec tsc --noEmit` and targeted Biome checks for `app/new` and both scripts.
- Browser inspected at `http://localhost:3100/new`. Latest rear-view shooting screenshot: `/tmp/portfolio-paper-qa/court-rear-gather.png`. Earlier desktop/mobile checks found no horizontal overflow; final rear-view mobile/reduced-motion/200%-zoom review and production build remain pending.
- No additional runtime packages were installed for this chapter. No Figma or HyperFrames substitution.

### Deferred until requested

- Improve Harden's likeness, illustration finish and aggressive drive choreography beyond this accepted first pass.
- Refine two-handed gather, left-handed release and follow-through against the user's reference.
- Finish full responsive/accessibility/performance QA and production build before treating this experimental route as release-ready.
- Do not add other employers, project sections or more animation without a new request.

## Original scope and research

The sections below preserve the initial research and future proposals. The implementation and checkpoint above take precedence over their outdated scope, package status and stop instructions.

- Keep `/` working and looking exactly as it does today.
- Build the new experience at `/new`, incrementally, after discussing this plan.
- Direction requested: paper-white background, crayon-like typography and copy presentation, crayon-inspired motion, and connected on-reveal animation.
- This is a deliberate visual experiment for `/new`, not a replacement for the global brand in `PRODUCT.md`.
- Font choices, exact copy, section composition, and motion intensity remain proposals, not approvals.

## 1. UX direction before library selection

**Physical reference:** a frontend engineer's white sketchbook, with wax-crayon lettering, a few purposeful marks, and real screenshots of shipped interfaces. Not a children's worksheet or a generic notebook template.

**Voice:** tactile, precise, curious. Personality comes from material and motion; credibility comes from the work.

Visitors are recruiters, collaborators, and other developers, often skimming on a phone or laptop. Within roughly 10 seconds, they should understand who Shanvit is, what he builds, and where to see his work. Motion must never delay those answers.

### Recommended designer workflow

1. Select a small reference board: real white paper, real crayon strokes, two type specimens, and a few portfolio compositions. Separate material references from layout references.
2. Build desktop and mobile hero studies directly in Next.js at `/new`, then inspect and iterate with `agent-browser`. No Figma, design-file handoff, or external mockup stage.
3. Approve a tiny material/type study: one heading, one paragraph, one link, one underline. Check whether it reads as crayon rather than chalk, pencil, or felt-tip pen.
4. Define choreography in code and brief notes: what triggers each mark, what it connects to, and what remains after it finishes. Preview Remotion sequences directly in the browser.
5. Build one vertical slice at `/new`, inspect it with `agent-browser`, then extend it section by section.

Do not design the entire site or install a collection of effect libraries before approving that first slice.

## 2. What the codebase already provides

Versions below were checked against installed packages, not inferred from generic Next.js examples.

| Existing tool | Installed version | Use for `/new` |
| --- | --- | --- |
| Next.js App Router | 16.3.3 | New route, metadata, optimized assets and fonts |
| React | 19.2.3 | Semantic page content and small interactive components |
| Tailwind CSS | 4.1.18 | Existing utilities; scoped CSS for material-specific details |
| Motion (`motion/react`) | 11.18.2 | Viewport triggers, coordinated reveals, SVG path drawing |
| `opentype.js` | 1.3.4 | Already supports the existing signature; not needed for ordinary text |
| `lucide-react` | Already installed | Functional icons only, if needed; not crayon illustration assets |
| `next/font` | Built into Next.js | Route-scoped, self-hosted typography |

Relevant code:

- `app/page.tsx`: current portfolio and its page-load animation. Leave unchanged now; its repeated blur/fade entrances are not the new motion direction.
- `app/layout.tsx`: global theme provider, floating canvas, header, footer, and narrow `max-w-screen-sm` content shell.
- `components/signature.tsx`: existing SVG/mask/path animation technique. Study the technique, but do not turn every paragraph into glyph paths or assume its current accessibility/fallback behavior is ready for reuse.
- `lib/constants.ts`: reusable project, experience, and contact data. Do not rewrite shared content to restyle `/new`.
- `.references/frontend.md`: stronger frontend-focused evidence to curate later, subject to confirming claims and public project assets.

### Important routing constraint

Adding `app/new/page.tsx` alone would still inherit the old shell. A nested layout cannot remove its parent header, footer, constrained width, or canvas.

Before implementation, agree on a minimal shared-shell extraction: retain the existing page file, move the existing visual shell into a small pathname-aware component, and bypass that shell for `/new` and its descendants. Server-rendered page content can still pass through as `children`.

- Preserve existing shell behavior on all other routes.
- Give `/new` its own full-width paper surface, header, and footer.
- Do not run the floating-glyph canvas on `/new`; hiding its pixels is not enough.
- Keep `/new` explicitly light without changing the visitor's saved theme for `/`.
- Avoid full-screen fixed overlays, negative-margin breakouts, or hiding the old header/footer with CSS.
- Route groups are an alternative if multiple independent experiences become necessary, not a prerequisite now.

This shared layout work is **future work requiring review**, not part of this documentation change.

## 3. Visual system proposal

### Paper and color

- Start with neutral paper white, approximately `#FDFDFD`, not beige parchment.
- Use one small, static, licensed paper texture only if the material study benefits from it. Keep it extremely faint; no animated full-screen noise.
- Graphite text, approximately `#282828`, carries the reading experience.
- Try deep crayon blue for links, with restrained red/green annotations. Yellow is a decorative highlight, not small text on white.
- Final colors become scoped semantic tokens; measure contrast on the actual textured result before approval.
- Let whitespace dominate. Do not surround every section with a sketchy box.

### Type and copy

**Starting shortlist, not a final font decision:**

| Role | Candidate | Reason / limitation |
| --- | --- | --- |
| Headings and short display copy | Cabin Sketch, 400/700 | Textured display lettering; closer to sketch than guaranteed wax crayon. Must pass the material study. |
| Paragraphs, navigation, project captions | Patrick Hand, 400 | Clear handwritten body copy. Not inherently a grainy crayon font. |
| If neither feels materially right | A licensed crayon display font or artist-made lettering | Review specimen, web-embedding rights, glyph coverage, and payload before acquiring. |

The requested crayon identity should cover the copy, not only decorative headings. Keep long text handwritten and readable; concentrate stronger wax texture in large lettering and marks. If full wax texture on every paragraph is desired, test it at mobile body sizes before committing.

- Keep normal text as selectable HTML, including the main heading. Do not replace copy with canvas, images, or outline-only SVG.
- Start body size around 18–20px for the handwriting candidate, with comfortable line height. Check dense words, punctuation, numerals, and links.
- Use `next/font/google` or licensed local files through `next/font/local`, scoped to `/new`; no external runtime font stylesheet.
- Two families maximum initially. Do not load the candidate families globally.
- Short, specific copy about actual interfaces shipped. No invented metrics or generic claims about “crafting digital experiences.”
- Candidate hierarchy: name → frontend role and concrete value → selected work → supporting experience → contact.

### Assets

Use real project screenshots for evidence, with deliberate crayon captions or framing. Any wax strokes should be scanned/artist-authored or properly licensed assets. Simple custom SVG paths can reveal those assets, but procedurally wobbly geometry alone does not create crayon material.

## 4. Motion: reveal with continuation

**Working interpretation to confirm next:** marks draw when their section enters view, then visually hand off to the next section. “Continuation” means connected choreography, not mandatory infinite wobble or a page that can only be read by scrubbing.

| Moment | Proposed behavior |
| --- | --- |
| Hero | Name and role are readable immediately; a short wax underline draws to establish the material. |
| Section entry | A margin mark or connector continues into the next heading, then its relevant accent completes. |
| Project reveal | A screenshot receives a short textured edge/reveal; caption emphasis follows. Do not replay the same fade-up on every item. |
| Link hover or keyboard focus | A quick underline reinforces the interactive target; native pointer and focus behavior remain. |
| Resting state | Finished marks stay in place. No page-wide jitter, flashing texture, or endless drawing loop. |

### Technical approach

- Reuse `motion/react`: `useInView`/`whileInView` for viewport triggers, variants for local choreography, SVG `pathLength` for line drawing.
- For a true textured stroke, animate a simple reveal mask over a prepared wax-stroke asset. A smooth SVG line is the reveal mechanism, not the final material.
- Start with one short sequence per section. Retain completion state so scrolling back does not repeatedly erase and redraw the page.
- Use `useScroll` + `useTransform` only if we choose genuinely scroll-linked continuation. Triggered playback and scroll scrubbing are different interaction models.
- Use Remotion for the signature crayon sequence: a frame-controlled decorative composition embedded with `@remotion/player`. Begin with one hero sequence, not a Player around every section. Motion controls viewport entry; Remotion controls the composition's internal timeline. Never animate the same property with both engines.
- Drive composition animation from `useCurrentFrame()` and frame-based interpolation. Reveal once, pause offscreen, and retain progress on return. For explicitly scroll-scrubbed scenes, map scroll progress to `PlayerRef.seekTo()` instead of simultaneously running playback.
- Keep headings, copy, links, and navigation as semantic HTML outside the decorative Player. Provide a finished static mark while loading, without JavaScript, and for reduced motion. Lazy-load the client-side Player, reserve its dimensions, and verify mobile playback before expanding its use.
- Remotion orchestrates the marks; approved wax assets/masks supply their texture. Remotion does not make ordinary paths look like crayon automatically.
- Initial timing study: approximately 450–900ms for a drawn accent and 60–100ms between related marks. Tune in browser, not as universal defaults.
- Content is visible in the server-rendered/no-JavaScript state. Decorative masks and drawing must never gate access to text or links.
- Use `MotionConfig reducedMotion="user"` plus explicit `useReducedMotion`/CSS handling for masks and SVG strokes. The blanket setting does not disable every custom animated property.
- Reduced motion shows finished marks immediately. No long scribble sequence, parallax, or jitter.
- Avoid bounce, scroll hijacking, autoplay sound, or custom cursor requirements.

Current online Motion docs include newer APIs than installed Motion 11.18.2. Verify chosen APIs against the installed version during implementation; no upgrade is assumed here.

## 5. Package decisions

**Planned stack: existing Next.js + Tailwind + Motion + SVG/CSS + approved fonts/assets, plus `remotion` and `@remotion/player` for the signature crayon sequence.**

Remotion was omitted from the first draft because viewport reveals alone are covered by Motion. That was too narrow for the requested expressive choreography. Include it for frame-controlled scenes, while keeping ordinary page interactions in Motion/CSS. Verify React/Next.js compatibility and current license terms before installation; keep Remotion package versions aligned.

| Option researched | Decision | When it earns a place |
| --- | --- | --- |
| Motion | Use existing install | Owns viewport triggers, DOM interactions, path drawing, and optional scroll progress. |
| `remotion` + `@remotion/player` | Include at implementation | Frame-controlled crayon choreography embedded in `/new`; start with one hero composition. No renderer, Studio, or cloud-rendering packages needed for browser playback. |
| Rough Notation | Optional, defer | Useful for numerous responsive, text-attached underlines/circles/highlights and ordered annotation groups. Its marker-like strokes are not wax texture. Prefer direct use over adding a React wrapper too. |
| Rough.js | Optional, defer | Useful if we need many generated sketch primitives. For a handful of fixed marks, prepared SVG/assets are simpler. Not a crayon renderer. |
| GSAP + ScrollTrigger | Defer | Reconsider if an approved storyboard needs complex pinned/scrubbed timelines that become awkward in Motion. Do not run two animation engines for the same effects by default. |
| Lenis / smooth-scroll packages | Skip initially | Native scrolling supports the proposed experience. |
| Three.js / React Three Fiber / shader noise | Skip initially | No 3D requirement; unnecessary cost for a paper-and-crayon page. |
| Lottie / Rive | Defer | Only if we acquire or author an actual illustrated animation that needs that runtime. |
| Extra component kit or font-to-path library | Skip initially | Existing stack and semantic HTML cover the proposed page. |

No package has been installed as part of this research.

## 6. Skills and tools to use, in order

These are development aids, not browser runtime dependencies.

1. **`impeccable`**: shape composition, visual hierarchy, material consistency, and later polish. Apply the user's explicit paper/crayon direction rather than substituting a generic portfolio style.
2. **`ui-ux-pro-max`**: typography, contrast, touch targets, motion guidance, and Next.js implementation checks. Its targeted “hand drawn” search matched **Anti-Polish / Raw Aesthetic**. Its broad design-system result instead suggested Swiss minimalism, which is off-brief and was not adopted.
3. **`agent-browser`** at `.agents/skills/agent-browser`: primary-source browsing now; desktop/mobile screenshots, scrolling, keyboard interaction, and reduced-motion checks once `/new` exists.
4. **`web-design-guidelines`**: accessibility and interaction review after there is an implementation to audit.
5. **`ponytail`**: reuse installed capabilities; add dependencies only for an approved effect with a demonstrated need.

**Direct execution only. No Figma.** Type comparisons, layout studies, and motion previews happen in the actual `/new` page and browser. Use Remotion's official React/Player documentation for its composition; no HyperFrames substitution or standalone video-production workflow is planned.

## 7. Incremental delivery plan

- [x] Inspect current stack and relevant layout/component code.
- [x] Research official motion, sketch-annotation, and font sources with `agent-browser`.
- [x] Record recommendations in this file only.
- [ ] **Discuss first:** confirm crayon material, type direction, and meaning of animation continuation.
- [ ] **In-browser material study:** implement one heading, paragraph, link, and animated stroke on paper white. No external design handoff.
- [ ] **Route foundation:** review shell isolation, add `/new`, route-scoped styles/fonts, and experiment metadata. Preserve `/`.
- [ ] **First vertical slice:** hero plus one real project, at mobile and desktop sizes. Include one Remotion crayon sequence with a static fallback and Motion-driven viewport trigger. Review before adding the rest.
- [ ] **Extend:** selected work, supporting experience, and contact, with distinct but connected reveal behavior.
- [ ] **Validate:** compare `/` before/after, then check `/new` across keyboard, touch, reduced motion, disabled JavaScript, and slow asset loading.

Likely initial files, only when implementation is approved: `app/new/page.tsx`, a co-located CSS module, a small motion component, one Remotion composition/Player wrapper, plus the minimal shared-shell extraction from `app/layout.tsx`. Keep Remotion scoped to the signature scene; avoid a generalized animation system.

### Acceptance checks for the build phase

- `/` keeps its existing appearance, content, theme behavior, and links.
- `/new` does not inherit duplicate navigation, the old footer, narrow shell, or floating-glyph animation.
- Paper-white surface remains white even if the existing portfolio is set to dark mode.
- Check 360px, 390px, 768px, and 1440px widths, plus 200% zoom. No clipped copy or horizontal scrolling.
- Body contrast ≥4.5:1, large text ≥3:1; visible keyboard focus and comfortable touch targets, aiming for 44×44px.
- Text remains selectable and readable without JavaScript, failed fonts, texture assets, or animation.
- Fast scrolling and returning to a section do not leave half-erased text or restart a page-long sequence.
- Decorative marks are hidden from assistive technology; meaningful screenshots have useful alt text.
- Route-specific title/canonical are explicit. Keep the experimental route out of search indexing until ready, rather than inheriting `/`'s canonical accidentally.
- Reserve screenshot dimensions; lazy-load below-fold imagery. Prefer small static textures over expensive full-screen filters.
- Run existing `pnpm lint` and `pnpm build`, distinguishing pre-existing failures. Inspect animation performance in-browser; do not claim a Lighthouse score without measuring it.

## 8. Sources and research limits

Primary sources opened with `agent-browser`:

- [Motion: React scroll animations](https://motion.dev/docs/react-scroll-animations): distinguishes viewport-triggered animation from scroll-linked progress; documents `viewport.once`, `useInView`, and `useScroll`.
- [Motion: SVG animation](https://motion.dev/docs/react-svg-animation): documents path drawing through `pathLength`, `pathSpacing`, and `pathOffset`.
- [Motion: accessibility](https://motion.dev/docs/react-accessibility): documents reduced-motion configuration and custom handling.
- [Rough Notation](https://roughnotation.com/): official live examples of annotations and ordered groups; underline control was exercised in the browser.
- [Rough.js](https://roughjs.com/): SVG/Canvas primitives, sketch styles, and MIT license. These are sketch capabilities, not a claim of wax rendering.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): triggers, pinning, scrubbing, and timeline control.
- [Cabin Sketch specimen](https://fonts.google.com/specimen/Cabin+Sketch) and [official font metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/cabinsketch/METADATA.pb): display family, weights 400/700, OFL.
- [Patrick Hand specimen](https://fonts.google.com/specimen/Patrick+Hand), [official metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/patrickhand/METADATA.pb), and [license](https://raw.githubusercontent.com/google/fonts/main/ofl/patrickhand/OFL.txt): handwriting family, weight 400, SIL OFL 1.1.

Remotion follow-up sources checked through `agent-browser`:

- [Remotion Player](https://www.remotion.dev/docs/player): embeds frame-based React compositions in React applications.
- [Player API](https://www.remotion.dev/docs/player/player): imperative `play()`, `pause()`, and `seekTo()` methods support viewport-triggered playback and explicit scroll-to-frame control.
- [Player installation](https://www.remotion.dev/docs/player/installation): official integration entry point. Packages are planned, not installed.

Local framework guides read from this installed Next.js version:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`

Limits: Google Fonts specimen pages did not reliably populate their previews in this browser session, so font availability/weights/licensing were checked against first-party repository metadata, not treated as an approved visual comparison. The existing portfolio was inspected in code; localhost port 3000 belonged to another application and was not used as portfolio-preview evidence. No final crayon assets were selected, no bundle/performance benchmarks were run, and no universal claim about what all UX designers use is intended.

## Next discussion

1. Material: true wax-crayon grain, or cleaner sketchbook lettering?
2. Continuation: reveal-once with connected marks, scroll-scrubbed drawing, or subtle ongoing animation after reveal?
3. First slice: name/role plus one featured project, or a different hero composition?

Stop here until the next design discussion.
