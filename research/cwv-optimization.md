# Portfolio loading/rendering measurements

Local production build, Lighthouse 12.8.2, headless Chrome, mobile preset, cold browser cache, `http://127.0.0.1:3101/`. These are lab results, not deployed/CrUX p75 data. No field INP measured; TBT is not INP.

## Changes

- `portfolio-page.tsx`: preload the small CSS-background underline texture at high priority. Applied network throttling showed this LCP resource was otherwise discovered around 1.6s and finished around 3.0s.
- Self-host the same Rubik Dirt face with printable ASCII and common English punctuation: 309,816 → 239,956 font bytes. No runtime dependency; Google Fonts subset download is reproducible with `node scripts/subset-crayon-font.mjs`. SIL OFL included in `app/fonts/`. Extend the script's glyph set before adding other languages.
- `paper.module.css`: native `content-visibility: auto` on writing and Tabot, with remembered intrinsic sizes. Content remains server HTML. This removes a misleading offscreen SVG mask LCP candidate and avoids offscreen layout/paint without JS virtualization. Do not contain the long sports track: its sticky stage must span all chapters.
- Overlap introductory strokes: full reveal finishes in 1.4s instead of 3.15s, retaining the eased 750ms underline. Trace can count the masked background before reveal completes, so this timing change is a perceived-completion improvement, not a proven LCP reduction by itself.
- Existing sports player stays dynamically imported only when its track approaches the viewport; static/reduced-motion and no-JS stories remain intact.
- Responsive regression checks exposed football copy exceeding the old 320px minimum text lane. CSS and shared `footballViewport()` now reserve 380px together, keeping the ball handoff aligned.

Concurrent texture cleanup moved assets to `/portfolio/textures/` and supplied lossless WebP paper/underline assets. Preserved those changes; their byte reduction is separate from the font saving above.

## Final measurements

Three sequential runs per method, no simultaneous browser tests. Medians:

| Lighthouse throttling method | Score | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: |
| `simulate` (default prediction) | 83 | 4.657s | 0 | 24ms |
| `devtools` (applied network/CPU throttling) | 99 | 1.641s | 0.000314 | 24.3ms |

Before the resource preload, applied-throttling run was 94 / 2.970s LCP. Final applied runs: 1.635, 1.641, 1.649s LCP, all score 99. Final simulated runs: 4.659, 4.657, 4.207s LCP, scores 83, 83, 86. Earlier simulated baseline was 84 / 4.588s (historical run: 80 / 5.196s); **no reliable simulated-score gain established**. Do not compare the old simulated 80 with the applied-throttling 99 as a before/after improvement.

The methods disagree. Keep both results visible; deploy and collect field data before declaring CWV fixed. Default simulated LCP remains poor. Server remains statically prerendered; no caching layer or additional animation framework added.

## Live production diagnosis (2026-10-17)

Three fresh Lighthouse 12.8.2 mobile `simulate` runs on `https://shanvit.vercel.app/` scored **84, 87, 90** (median 87). LCP was **4.139, 4.084, 3.643s**; CLS 0 and TBT 9–16ms. Confirms score can cross 90 on a single run, but not consistently. In the 87-point run, LCP element is the intro's `.stillMark` underline. Lighthouse marked request discoverable, high priority, and not lazy. Its run-3 phase breakdown was TTFB 643ms, load delay 816ms, resource load 1215ms, render delay 970ms. This is lab simulation, not Vercel's actual server response (the report's server audit was ~7ms).

Other audit leads: render-blocking CSS estimated 90ms; unused JS estimated 79KiB / 300ms. Neither is proven to be the dominant fix. The 240KB display font is already preloaded. Tested `next/font/local preload:false` locally: score stayed 83, LCP about 4.14–4.22s; font still requested at very high priority later. Reverted because no measured win. Don't drop the visual font or animation based on guesswork. Next experiment should target the LCP render/load phases and possible initial client JS cost, with matched repeated live/deploy runs; no tested source change here clears that bar.

## Reproduce

```bash
pnpm build
pnpm start --port 3101
# In another shell, repeat 3 times per method:
pnpm dlx lighthouse@12.8.2 http://127.0.0.1:3101 \
  --chrome-path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=performance --form-factor=mobile \
  --throttling-method=devtools \
  --output=json --output-path=/tmp/portfolio-cwv.json --save-assets --quiet
# Repeat with --throttling-method=simulate. Compare medians within each method.
node scripts/check-intro-ink.mjs http://127.0.0.1:3101
node scripts/check-paper-intro.mjs http://127.0.0.1:3101
node scripts/check-responsive.mjs http://127.0.0.1:3101
node scripts/check-penalty.mjs
```

Restart `next start` after rebuilding. A running server can retain old manifests and produce missing chunks after builds/asset moves. Do not benchmark while other agents rebuild the same `.next` directory or run browser tests.
