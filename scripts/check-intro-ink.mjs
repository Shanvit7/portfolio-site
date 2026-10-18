// Run: node scripts/check-intro-ink.mjs [origin]
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const response = await fetch(process.argv[2] || 'http://localhost:3000')
assert.equal(response.status, 200)
const html = await response.text()
for (const part of ['greeting', 'first', 'surname', 'underline']) {
  assert.match(html, new RegExp(`data-ink-part="${part}"`))
}
assert.doesNotMatch(
  html,
  /mask-image:url\(#intro-/,
  'No SVG fragment masks on HTML',
)
assert.match(
  html,
  /<noscript><style>[^<]*animation:none/,
  'No-JS ink stays visible',
)
const css = readFileSync(
  new URL(
    '../app/components/portfolio/stories/paper.module.css',
    import.meta.url,
  ),
  'utf8',
)
assert.match(
  css,
  /animation: scribble 0\.5s linear 0\.1s backwards/,
  'No persistent clip after animation finishes',
)
assert.match(
  css,
  /clip-path: polygon\(/,
  'Crayon edge uses native CSS clipping',
)
const timing = css.match(
  /\.inkReveal\[data-ink-part="underline"\]\s*\{([^}]+)\}/,
)?.[1]
assert.match(timing, /animation-name: underline/)
assert.match(timing, /animation-duration: 0\.75s/, 'Underline draws over 750ms')
assert.match(timing, /animation-timing-function: cubic-bezier/)
assert.match(timing, /animation-delay: 0\.65s/, 'No multi-second LCP delay')
assert.match(
  css,
  /content-visibility: auto/,
  'Offscreen sections skip rendering',
)
assert.match(
  css,
  /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.inkReveal\[data-ink-part\]\s*\{\s*animation: none/,
  'Reduced motion leaves ink fully visible',
)
console.log(
  'Intro ink: native CSS reveal, clips released, reduced-motion and no-JS fallbacks.',
)
