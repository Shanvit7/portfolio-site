// Run against a running dev/production server: node scripts/check-paper-intro.mjs [origin]
import assert from 'node:assert/strict'

const origin = process.argv[2] || 'http://localhost:3100'
const response = await fetch(origin)
assert.equal(response.status, 200, '/')
const paperPage = await response.text()
assert.doesNotMatch(
  paperPage,
  /max-w-screen-sm/,
  'New page has no legacy shell',
)
assert.doesNotMatch(paperPage, /<canvas[\s>]/, 'No floating glyph canvas')
assert.equal((paperPage.match(/<h1[\s>]/g) || []).length, 1, 'One main heading')
assert.match(paperPage, /Front End engineer\./)
assert.match(paperPage, /Product at heart\./)
assert.match(paperPage, /From a blank canvas to products people use\./)
assert.match(paperPage, /Curious about how engineering shapes/)
assert.match(paperPage, /70K\+ weekly/)
assert.match(paperPage, /under 1s/)
assert.match(paperPage, /65% in three months/)
assert.doesNotMatch(paperPage, /name="robots" content="noindex, nofollow"/)
assert.match(paperPage, /rel="canonical" href="[^"]*\//)
const favicon = await fetch(new URL('/favicon.ico', origin))
assert.equal(favicon.status, 200)
assert.equal(favicon.headers.get('content-type'), 'image/x-icon')
assert.deepEqual(
  [...new Uint8Array(await favicon.arrayBuffer()).slice(0, 4)],
  [0, 0, 1, 0],
  'Screenshot-derived favicon is a valid ICO',
)
const legacyRoute = await fetch(new URL('/new', origin), { redirect: 'manual' })
assert.equal(legacyRoute.status, 307, '/new redirects permanently to root')
assert.equal(new URL(legacyRoute.headers.get('location'), origin).pathname, '/')
assert.match(paperPage, /stillMark/, 'Original crayon texture retained')
for (const part of ['greeting', 'first', 'surname', 'underline']) {
  assert.match(
    paperPage,
    new RegExp(`id="intro-${part}-ink"`),
    'Initial ink mask available in server HTML',
  )
}
assert.match(
  paperPage,
  /<noscript><style>[^<]*animation:none;stroke-dashoffset:0/,
  'No-JS name starts fully drawn',
)
assert.match(
  paperPage,
  /<h1[^>]*>[\s\S]*?>Shanvit<\/[\s\S]*?S Shetty/,
  'Name remains semantic text, not an image',
)
assert.equal(
  (paperPage.match(/<main[\s>]/g) || []).length,
  1,
  'One main landmark',
)
assert.match(
  paperPage,
  /Finding my feet\./,
  'IoTric chapter available without JS',
)
assert.doesNotMatch(paperPage, /Skip to Mavonic|Skip to Zosma AI|Skip the shot/)
assert.match(
  paperPage,
  /Skip to introduction/,
  'Keyboard skip link remains available',
)
assert.doesNotMatch(
  paperPage,
  /zolorag/i,
  'Removed project stays out of portfolio',
)
assert.match(paperPage, /Say hello on LinkedIn/)
assert.match(paperPage, /linkedin\.com\/in\/shanvit-shetty/)
assert.match(paperPage, /Still building it alongside my role at Zosma AI/)
assert.match(paperPage, /underlying systems that help/)
assert.match(paperPage, /href="#writing"/)
assert.match(paperPage, /Sometimes I write\./)
assert.match(paperPage, /data-book-art/)
assert.match(paperPage, /data-book-leaf/)
assert.match(
  paperPage,
  /shanvitshetty\.substack\.com\/p\/emotion-is-a-missing-primitive-in/,
)
assert.match(paperPage, /substack\.com\/@shanvitshetty\/p-201153688/)
assert.match(paperPage, /href="https:\/\/www\.enoobs\.com\/"/)
assert.match(paperPage, /Hono agent runtime/)
assert.doesNotMatch(paperPage, /across 10\+ model providers/)
assert.ok(
  paperPage.indexOf('id="writing"') < paperPage.indexOf('id="tabot"'),
  'Writing follows sports; Tabot has its own section after it',
)
assert.match(paperPage, /70K\+ weekly users/)
assert.match(paperPage, /github\.com\/Shanvit7\/tabot/)
assert.match(paperPage, /shanvit7\.github\.io\/tabot/)
const tabotPreview = await fetch(new URL('/tabot-preview.webp', origin))
assert.equal(tabotPreview.status, 200, 'Tabot preview asset is available')
assert.equal(
  (paperPage.match(/<article[\s>]/g) || []).length,
  12,
  'Four beats each for IoTric, Mavonic and Zosma readable without JS',
)
assert.match(paperPage, /qie-chatbot/, 'Real IoTric work included')
assert.match(
  paperPage,
  /Between backend/,
  'Mavonic chapter available without JS',
)
assert.match(
  paperPage,
  /FaceNet/,
  'AI work comes from existing portfolio content',
)
assert.match(paperPage, /SSG \+ ISR/, 'Backend/frontend work included')
assert.match(
  paperPage,
  /data-rally-frame="135"/,
  'Static rally artwork available',
)
assert.match(
  paperPage,
  /data-rally-character="bender"/,
  'Backend & AI is Bender',
)
assert.match(
  paperPage,
  /data-avatar-reference="glasses-waves-beard"/,
  'User reference traits retained in crayon avatar',
)
assert.match(paperPage, /data-athlete-shorts="plain-dark"/)
const legs = paperPage.match(/data-athlete-legs="closed-thighs" d="([^"]+)"/)
assert.ok(legs, 'Closed thigh outlines prevent white clothing-shaped holes')
assert.equal((legs[1].match(/Z/g) || []).length, 2, 'Both legs closed')
assert.match(
  paperPage,
  /data-court-frame="170"/,
  'Static court artwork available',
)
assert.match(
  paperPage,
  /Zosma AI · September 2025/,
  'Zosma chapter available without JS',
)
assert.match(
  paperPage,
  /data-football-view="behind-ronaldo"/,
  'Crayon football artwork available without JS',
)
assert.match(
  paperPage,
  /data-stadium-crowd="true"/,
  'Static night stadium and crowd available',
)
for (const asset of ['paper.png', 'crayon-stroke.png', 'wax-grain.png']) {
  const response = await fetch(new URL(`/new/${asset}`, origin))
  assert.equal(response.status, 200, asset)
  assert.equal(response.headers.get('content-type'), 'image/png', asset)
}
assert.doesNotMatch(
  paperPage,
  /__remotion-player/,
  'Player remains lazy, not SSR',
)
console.log(
  'Paper portfolio checks passed at root; /new redirects; no legacy shell.',
)
