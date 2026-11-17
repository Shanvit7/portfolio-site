# Photo loading audit — 2026-11-17

Production build (`next build` / `next start`), Lighthouse 13.6.0, localhost:3100, mobile 412×823 at DPR 1.75. Single-run lab comparisons, not field data or p75. Both before/after use Lighthouse's same simulated mobile throttling (150ms RTT, 1638.4Kbps, 4× CPU).

| Metric                        |      Before |     After |
| ----------------------------- | ----------: | --------: |
| Collage image response bodies |   126,162 B |  62,320 B |
| Total transferred             | 1,386,104 B | 897,645 B |
| Scripts transferred           |   335,183 B | 226,632 B |
| FCP                           |    1,106 ms |  1,057 ms |
| LCP                           |    1,106 ms |  1,057 ms |
| CLS                           |           0 |         0 |
| TBT                           |     43.5 ms |   11.5 ms |
| Performance score             |         100 |       100 |

Image payload fell 50.6%. Paint-time difference is small and within normal lab noise; CLS was already good. Total-page changes include concurrent unrelated cleanup; don't attribute the entire transfer delta to images. TBT isn't a field INP measurement.

An additional applied DevTools-throttled run (150ms request latency, 1600Kbps down, 750Kbps up, 4× CPU) measured FCP/LCP 897ms, CLS 0, TBT 27.5ms. Different throttling method: not a before/after comparison. These are local-origin results; deployment latency and cold image transformations still require production checks.

## Changes

- Main portrait is eager/high priority. Verified responsive image preload in server HTML; no hydration dependency. Don't preload all eight full-size images.
- Static image imports provide dimensions, tiny inline preview data, hashed URLs and Next's immutable optimized-image cache behavior.
- Responsive sizes follow actual print dimensions; lazy thumbnail auto-sizing uses rendered width where supported. Added 192/320/512px variants to avoid oversized downloads. Thumbnail quality 60; full-size quality remains 75. Default WebP retained to avoid AVIF cold-encoding cost.
- Tiny thumbnail placeholders use their data URLs directly rather than eight SVG Gaussian filters. An intermediate SVG-filter version regressed lab TBT to 801ms and was discarded.
- Enlarged previews reuse the selected cached thumbnail immediately, load a correctly sized sharper image on click, then crossfade silently. Explicit preview dimensions prevent the image/close control collapsing before metadata loads. No loading overlay. On failure, cached photo and close control remain available; closing/reopening retries.
- Deferred below-fold GIF and crayon font preload. React Scan dynamically imports only in development, not in production hydration path. No analytics changes.

## Checks

`node scripts/check-photo-collage.mjs http://localhost:3100` verifies server portrait preload, no eager GIF preload, responsive collage, keyboard/focus, correct previews, stable cached preview when full-size requests fail, retry, no loading overlay, close-button geometry, and reduced motion. Typecheck, targeted Biome checks, production build and diff checks pass.

Local raw Lighthouse artifacts: `/tmp/portfolio-perf-before.json`, `/tmp/portfolio-perf-final.json`, `/tmp/portfolio-perf-slow.json` (temporary, not committed).
