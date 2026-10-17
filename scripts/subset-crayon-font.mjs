// Run: node scripts/subset-crayon-font.mjs
// Keep the same font, but ship English glyphs instead of the entire Latin subset.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

// ponytail: English display copy only; extend this set before adding other languages.
const characters = `${Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('')}\u00a0–—‘’“”…`
const url = new URL('https://fonts.googleapis.com/css2')
url.searchParams.set('family', 'Rubik Dirt')
url.searchParams.set('display', 'swap')
url.searchParams.set('text', characters)
const cssResponse = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  },
})
assert.ok(cssResponse.ok, `Font CSS: ${cssResponse.status}`)
const css = await cssResponse.text()
const fontUrl = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1]
assert.ok(
  fontUrl && css.includes("format('woff2')"),
  'Expected Google WOFF2 font',
)
const fontResponse = await fetch(fontUrl)
assert.ok(fontResponse.ok, `Font download: ${fontResponse.status}`)
const font = Buffer.from(await fontResponse.arrayBuffer())
assert.equal(font.subarray(0, 4).toString(), 'wOF2')
const licenseResponse = await fetch(
  'https://raw.githubusercontent.com/google/fonts/main/ofl/rubikdirt/OFL.txt',
)
assert.ok(licenseResponse.ok, `Font license: ${licenseResponse.status}`)
const directory = new URL('../app/fonts/', import.meta.url)
await mkdir(directory, { recursive: true })
await writeFile(new URL('rubik-dirt-english.woff2', directory), font)
await writeFile(
  new URL('OFL-RubikDirt.txt', directory),
  await licenseResponse.text(),
)
console.log(`Rubik Dirt English: ${font.length} bytes`)
