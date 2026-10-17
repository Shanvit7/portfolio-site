// Run: node scripts/check-intro-ink.mjs [origin]
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const response = await fetch(process.argv[2] || 'http://localhost:3000')
assert.equal(response.status, 200)
const html = await response.text()
const underline = html.match(/<path\b[^>]*data-ink-part="underline"[^>]*>/)?.[0]
assert.ok(underline, 'Underline mask path is present')
assert.match(underline, /d="M0 0\.5H1"/, 'Draw spans underline exactly')
assert.match(underline, /stroke-width="1"/, 'Mask covers underline height')
assert.match(
  underline,
  /stroke-linecap="butt"/,
  'No oversized round cap revealing stroke at once',
)
const css = readFileSync(
  new URL(
    '../app/components/portfolio/stories/paper.module.css',
    import.meta.url,
  ),
  'utf8',
)
const timing = css.match(
  /\.inkStroke\[data-ink-part="underline"\]\s*\{([^}]+)\}/,
)?.[1]
assert.match(timing, /animation-duration: 0\.75s/, 'Underline draws over 750ms')
assert.match(
  timing,
  /animation-timing-function: cubic-bezier/,
  'Stroke accelerates and settles smoothly',
)
assert.match(timing, /animation-delay: 0\.65s/, 'No multi-second LCP delay')
assert.match(
  css,
  /content-visibility: auto/,
  'Offscreen sections skip rendering',
)
assert.match(
  css,
  /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.inkStroke\s*\{\s*animation: none/,
  'Reduced motion leaves ink fully drawn',
)
assert.match(
  html,
  /<noscript><style>[^<]*animation:none;stroke-dashoffset:0/,
  'No-JS fallback stays fully drawn',
)
console.log(
  'Intro ink checks passed: progressive mask, eased 750ms draw, reduced-motion and no-JS fallbacks.',
)
