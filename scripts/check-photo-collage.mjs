// Requires agent-browser and a running server: node scripts/check-photo-collage.mjs [origin]
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const session = execFileSync(
  'agent-browser',
  ['session', 'id', '--scope', 'worktree', '--prefix', 'photo-collage-check'],
  { encoding: 'utf8' },
).trim()
const browser = (...args) =>
  execFileSync('agent-browser', args, {
    encoding: 'utf8',
    timeout: 30000,
    env: { ...process.env, AGENT_BROWSER_SESSION: session },
  })
const evaluate = (source) => {
  const result = JSON.parse(browser('eval', '--json', source))
  assert.ok(result.success, JSON.stringify(result.error))
  return result.data.result
}

const origin = process.argv[2] || 'http://localhost:3100'
const html = await (await fetch(origin)).text()
assert.match(
  html,
  /<link[^>]+rel="preload"[^>]+as="image"[^>]+shanvit-s-shetty\./,
)
assert.doesNotMatch(
  html,
  /<link[^>]+rel="preload"[^>]+href="\/tabot-chatgpt-search.gif"/,
)

try {
  browser('open', origin)
  evaluate('document.fonts.ready.then(() => true)')
  const emergence = evaluate(`(() => {
    const cards = [...document.querySelectorAll('#intro [data-photo]')];
    cards.forEach(card => { card.style.animation = 'none' });
    void cards[0].offsetWidth;
    cards.forEach(card => { card.style.animation = '' });
    const animations = cards.map(card => card.getAnimations()[0]);
    animations.forEach(animation => { animation.pause(); animation.currentTime = 0 });
    const centers = cards.slice(1).map(card => {
      const box = card.getBoundingClientRect();
      return [box.x + box.width / 2, box.y + box.height / 2];
    });
    animations.forEach(animation => animation.finish());
    const hero = cards[0].getBoundingClientRect();
    return { centers, hero: { left: hero.left, right: hero.right, top: hero.top, bottom: hero.bottom } };
  })()`)
  assert.equal(emergence.centers.length, 7)
  for (const [x, y] of emergence.centers) {
    assert.ok(
      Math.abs(x - emergence.centers[0][0]) < 1,
      'Photos start in one stack',
    )
    assert.ok(
      Math.abs(y - emergence.centers[0][1]) < 1,
      'Photos start in one stack',
    )
    assert.ok(
      x > emergence.hero.left && x < emergence.hero.right,
      'Stack behind portrait',
    )
    assert.ok(
      y > emergence.hero.top && y < emergence.hero.bottom,
      'Stack behind portrait',
    )
  }

  for (const width of [320, 375, 768, 900, 1440]) {
    browser('set', 'viewport', String(width), '1000')
    evaluate(
      'new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))',
    )
    const layout = evaluate(`(() => {
      const cards = [...document.querySelectorAll('#intro [data-photo]')];
      const board = cards[0].parentElement;
      const greeting = board.previousElementSibling;
      const gap = cards[0].querySelector('img').getBoundingClientRect().top - greeting.getBoundingClientRect().bottom;
      return { count: cards.length, headings: document.querySelectorAll('h1').length,
        greetingAbove: greeting.textContent === 'hey, I’m', gap,
        sizes: cards.map(card => card.offsetWidth),
        hintClearance: board.nextElementSibling.getBoundingClientRect().top +
          Number.parseFloat(getComputedStyle(board.nextElementSibling).paddingTop) -
          Math.max(...cards.map(card => card.getBoundingClientRect().bottom)),
        captionsVisible: cards.every(card => {
          const r = card.querySelector('figcaption').getBoundingClientRect();
          return card.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
        visible: cards.every(card => { const r = card.getBoundingClientRect();
          return r.left >= 0 && r.right <= innerWidth && r.width >= 44 && card.checkVisibility(); }),
        arrows: document.querySelectorAll('[aria-label="Next photo"], [aria-label="Previous photo"]').length };
    })()`)
    assert.equal(layout.count, 8, `${width}px: all photos appear together`)
    assert.equal(layout.headings, 1)
    assert.equal(layout.arrows, 0, 'No carousel')
    assert.ok(
      layout.visible,
      `${width}px: photos fit viewport and remain tappable`,
    )
    assert.ok(new Set(layout.sizes).size >= 3, 'Varied print sizes')
    const surrounding = layout.sizes.slice(1)
    assert.ok(
      Math.max(...surrounding) / Math.min(...surrounding) >= 1.5,
      'Surrounding prints have visibly different sizes',
    )
    assert.ok(layout.greetingAbove, 'Greeting stays above whole collage')
    assert.ok(
      layout.gap >= 0 && layout.gap <= 48,
      `${width}px: greeting stays close to portrait`,
    )
    assert.ok(
      layout.captionsVisible,
      `${width}px: photo captions remain readable`,
    )
    assert.ok(
      layout.hintClearance >= 0,
      `${width}px: collage does not cover helper text (${layout.hintClearance}px clearance)`,
    )
  }

  // An unavailable full-size image must not collapse the preview or strand focus.
  browser('network', 'route', '**/*q=75', '--abort')
  browser('click', '[data-photo="0"] button')
  browser(
    'wait',
    '--fn',
    "!!document.querySelector('#intro dialog [role=alert]')",
  )
  assert.ok(
    evaluate(`(() => {
      const dialog = document.querySelector('#intro dialog');
      const image = dialog.querySelector('img');
      const source = document.querySelector('[data-photo="0"] img');
      return dialog.open && image.getBoundingClientRect().width > 100 &&
        image.parentElement.style.backgroundImage.includes(source.currentSrc) &&
        !dialog.textContent.includes('Loading') &&
        dialog.querySelector('[aria-busy]').getAttribute('aria-busy') === 'false';
    })()`),
    'Failed full-size request preserves cached preview, stable size, and close control without a loading overlay',
  )
  browser('press', 'Escape')
  browser('network', 'unroute')

  for (let index = 0; index < 8; index++) {
    browser('click', `[data-photo="${index}"] button`)
    assert.equal(
      evaluate(`document.querySelector('#intro dialog img')?.alt`),
      evaluate(`document.querySelector('[data-photo="${index}"] img').alt`),
      `Photo ${index}: no stale preview image`,
    )
    browser('wait', '--fn', "document.querySelector('#intro dialog').open")
    assert.ok(
      evaluate(
        `!document.querySelector('#intro dialog').textContent.includes('Loading')`,
      ),
      'Progressive preview has no loading overlay',
    )
    browser(
      'wait',
      '--fn',
      'document.querySelector(\'#intro dialog img\')?.dataset.ready === "true"',
    )
    assert.ok(
      evaluate(`(() => {
      const dialog = document.querySelector('#intro dialog');
      const source = document.querySelector('[data-photo="${index}"] img');
      const image = dialog.querySelector('img').getBoundingClientRect();
      const close = dialog.querySelector('button').getBoundingClientRect();
      return dialog.open && dialog.querySelector('img').alt === source.alt &&
        close.left >= image.left && close.right <= image.right && close.top >= image.top &&
        close.width >= 40 && close.height >= 40 &&
        document.activeElement.getAttribute('aria-label') === 'Close enlarged photo';
    })()`),
      `Photo ${index}: opens correct image with close focused: ${JSON.stringify(
        evaluate(`(() => {
          const dialog = document.querySelector('#intro dialog');
          return { image: dialog.querySelector('img').getBoundingClientRect().toJSON(),
            close: dialog.querySelector('button').getBoundingClientRect().toJSON(),
            focused: document.activeElement.getAttribute('aria-label') };
        })()`),
      )}`,
    )
    browser('press', 'Escape')
    assert.ok(
      evaluate(`!document.querySelector('#intro dialog').open &&
      document.activeElement === document.querySelector('[data-photo="${index}"] button')`),
      'Escape restores focus',
    )
  }
  browser('click', '[data-photo="0"] button')
  browser('wait', '--fn', "document.querySelector('#intro dialog').open")
  evaluate(
    `document.querySelector('#intro dialog').dispatchEvent(new MouseEvent('click', { bubbles: true }))`,
  )
  browser('wait', '--fn', "!document.querySelector('#intro dialog').open")
  assert.ok(
    evaluate(
      `document.activeElement === document.querySelector('[data-photo="0"] button')`,
    ),
    'Backdrop click closes modal and restores focus',
  )
  browser('set', 'media', 'light', 'reduced-motion')
  assert.ok(
    evaluate(`[...document.querySelectorAll('#intro [data-photo]')].every(card =>
    getComputedStyle(card).animationName === 'none') &&
    getComputedStyle(document.querySelector('#intro dialog[open]') || document.querySelector('#intro dialog')).animationName === 'none'`),
    'Reduced motion shows static collage',
  )
  console.log(
    'Collage passed: eight visible photos, fan-out origin, varied sizes, responsive fit, enlarge/close, focus, reduced motion.',
  )
} finally {
  browser('close')
}
