// Run with agent-browser installed: node scripts/check-responsive.mjs [origin]
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const origin = process.argv[2] || 'http://localhost:3100'
const session = execFileSync(
  'agent-browser',
  ['session', 'id', '--scope', 'worktree', '--prefix', 'portfolio-responsive'],
  { encoding: 'utf8' },
).trim()
const env = { ...process.env, AGENT_BROWSER_SESSION: session }
const browser = (...args) =>
  execFileSync('agent-browser', args, {
    env,
    encoding: 'utf8',
    timeout: 30000,
  })
const evaluate = (source) => {
  const response = JSON.parse(browser('eval', '--json', source))
  assert.ok(response.success, JSON.stringify(response.error))
  return response.data.result
}
const settle = () =>
  evaluate(`new Promise(resolve => requestAnimationFrame(() =>
  requestAnimationFrame(() => resolve(true))))`)
const scrollTo = (y) => {
  const delta = Math.round(y - evaluate('scrollY'))
  if (delta)
    browser('scroll', delta > 0 ? 'down' : 'up', String(Math.abs(delta)))
  settle()
}

try {
  browser('open', origin)
  evaluate('document.fonts.ready.then(() => true)')
  const ink = evaluate(`(() => {
    const animations = document.getAnimations().filter(a => a.effect?.target?.dataset.inkPart);
    if (animations.length !== 4) throw Error('Four one-shot ink strokes expected');
    return [0, 850, 1800, 2800].map(time => {
      animations.forEach(a => {a.pause(); a.currentTime = time});
      return {height:document.querySelector('h1').getBoundingClientRect().height,
        strokes:Object.fromEntries(animations.map(a => [a.effect.target.dataset.inkPart,
          parseFloat(getComputedStyle(a.effect.target).strokeDashoffset)]))};
    });
  })()`)
  assert.ok(
    ink.every((frame) => frame.height === ink[0].height),
    'Ink does not shift heading layout',
  )
  assert.ok(
    ink[1].strokes.first > 0 && ink[1].strokes.first < 1,
    'First name is scribbled progressively',
  )
  assert.equal(ink[1].strokes.surname, 1, 'Surname waits for first name')
  assert.ok(
    ink[2].strokes.surname > 0 && ink[2].strokes.surname < 1,
    'Surname follows first name',
  )
  assert.ok(
    Object.values(ink[3].strokes).every((offset) => offset === 0),
    'Every stroke finishes fully visible',
  )
  console.log(
    'Intro: sequential scribble masks finish in 2.65s, no layout shift',
  )
  for (const [width, height] of [
    [320, 568],
    [320, 667],
    [360, 640],
    [375, 667],
    [390, 844],
    [430, 932],
    [768, 1024],
    [1440, 900],
    [844, 390],
  ]) {
    browser('set', 'viewport', String(width), String(height))
    const animated = height > 550 && (height > 650 || width < height)
    browser(
      'wait',
      '--fn',
      `document.querySelector('[data-motion]')?.dataset.motion === '${animated}'`,
    )
    evaluate('document.fonts.ready.then(() => true)')
    scrollTo(0)
    const chapters = evaluate(`(() => {
      if (document.documentElement.scrollWidth > innerWidth) throw Error('Page overflow');
      if (document.querySelectorAll('article').length !== 12) throw Error('Missing story');
      return [...document.querySelectorAll('[data-basketball-story], #mavonic, #zosma')]
        .map(e => ({top:e.getBoundingClientRect().top + scrollY, height:e.clientHeight}));
    })()`)
    if (!animated) {
      assert.equal(
        evaluate(
          `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyRail]')).transform`,
        ),
        'none',
      )
      assert.equal(
        evaluate(`!!document.querySelector('[data-rally-character=shanvit]')`),
        true,
      )
      console.log(`${width}×${height}: static landscape, all 12 beats readable`)
      continue
    }
    for (const [chapterIndex, chapter] of chapters.entries()) {
      if (chapterIndex === 0 && width > 700) {
        assert.equal(
          evaluate(
            `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyRail]')).display`,
          ),
          'block',
        )
        continue
      }
      for (let index = 0; index < 4; index++) {
        scrollTo(chapter.top + (chapter.height * (index + 0.12)) / 4)
        const panel = evaluate(`(() => {
          const chapter = document.querySelectorAll('[data-basketball-story], #mavonic, #zosma')[${chapterIndex}];
          const stage = chapter.querySelector('[class*=copyStage]');
          const rail = chapter.querySelector('[class*=copyRail]');
          const article = chapter.querySelectorAll('article')[${index}];
          const box = article.getBoundingClientRect(), lane = stage.getBoundingClientRect();
          const matrix = new DOMMatrixReadOnly(getComputedStyle(rail).transform);
          return {x:matrix.m41, y:matrix.m42, left:box.left, right:box.right, bottom:box.bottom,
            laneBottom:lane.bottom, laneTop:lane.top, opacity:+getComputedStyle(stage).opacity,
            overflow:document.documentElement.scrollWidth > innerWidth};
        })()`)
        assert.ok(
          !panel.overflow,
          `${width}: chapter ${chapterIndex}, panel ${index} overflows page`,
        )
        assert.equal(panel.y, 0, 'Copy moves horizontally, never bottom to top')
        assert.ok(
          panel.left >= -1 && panel.right <= width + 1,
          `${width}: panel offscreen ${JSON.stringify(panel)}`,
        )
        assert.ok(
          panel.bottom <= panel.laneBottom + 1,
          `${width}: text clipped ${JSON.stringify(panel)}`,
        )
        assert.ok(
          Math.abs(panel.laneTop) < 1 && panel.opacity === 1,
          'Text lane pinned and visible',
        )
        if (index) assert.ok(panel.x < 0, 'Later beats enter right to left')
      }
    }
    if (width === 390) {
      // Native keyboard focus must bring a clipped basketball link into view.
      browser('focus', '[data-basketball-story] a')
      scrollTo(chapters[0].top)
      browser('press', 'Tab')
      settle()
      assert.ok(
        evaluate(`(() => {
        const link = document.activeElement, rect = link.getBoundingClientRect();
        return link.closest('[data-basketball-story]') && rect.left >= 0 && rect.right <= innerWidth;
      })()`),
        'Keyboard focus reveals linked basketball beat',
      )
      scrollTo(chapters[1].top + 80)
      assert.ok(
        evaluate(`(() => {
        const shorts = document.querySelector('[data-athlete-shorts]');
        return shorts && [63, 71, 79].every(x => shorts.isPointInFill(new DOMPoint(x, 326)));
      })()`),
        'Shorts cover central thigh wedge, with no exposed skin below crotch',
      )
    }
    console.log(
      `${width}×${height}: all chapters fit; horizontal phone beats, vertical desktop preserved`,
    )
  }
  browser('set', 'viewport', '390', '844')
  scrollTo(0)
  browser(
    'wait',
    '--fn',
    `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyStage]')).opacity === '0'`,
  )
  browser('set', 'viewport', '1440', '900')
  browser(
    'wait',
    '--fn',
    `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyStage]')).opacity === '1'`,
  )
  assert.equal(
    evaluate(
      `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyRail]')).transform`,
    ),
    'none',
  )
  console.log('Phone → desktop resize resets hidden opacity and rail position')
  browser('set', 'viewport', '390', '844')
  browser('set', 'media', 'light', 'reduced-motion')
  browser(
    'wait',
    '--fn',
    `document.querySelector('[data-motion]')?.dataset.motion === 'false'`,
  )
  assert.equal(evaluate(`document.querySelectorAll('article').length`), 12)
  assert.equal(
    evaluate(
      `getComputedStyle(document.querySelector('[data-basketball-story] [class*=copyRail]')).transform`,
    ),
    'none',
  )
  assert.ok(evaluate(`document.documentElement.scrollWidth <= innerWidth`))
  assert.ok(
    evaluate(
      `[...document.querySelectorAll('[class*=copyStage]')].every(e => getComputedStyle(e).opacity === '1')`,
    ),
  )
  assert.ok(
    evaluate(
      `[...document.querySelectorAll('[data-ink-part]')].every(e => getComputedStyle(e).animationName === 'none' && parseFloat(getComputedStyle(e).strokeDashoffset) === 0)`,
    ),
    'Reduced-motion intro starts fully drawn',
  )
  console.log(
    'Reduced motion: finished intro and all 12 beats readable without scrubbing',
  )
} finally {
  browser('close')
}
