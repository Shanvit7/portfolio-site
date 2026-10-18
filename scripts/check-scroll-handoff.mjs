// Run: node scripts/check-scroll-handoff.mjs [origin]
// Uses agent-browser's Chrome plus native CDP; no extra browser dependency.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(
    new URL(
      '../app/components/portfolio/timeline/rally-timeline.ts',
      import.meta.url,
    ),
    'utf8',
  ),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
)
const { sportsFrameAt } = await import(
  `data:text/javascript,${encodeURIComponent(outputText)}`
)
const session = `scroll-handoff-${process.pid}`
const browser = (...args) =>
  execFileSync('agent-browser', ['--session', session, ...args], {
    encoding: 'utf8',
    timeout: 30000,
  })
let socket
try {
  browser('open', process.argv[2] || 'http://localhost:3100')
  browser('set', 'viewport', '390', '844')
  const endpoint = new URL(browser('get', 'cdp-url').trim())
  const targets = await (
    await fetch(`http://${endpoint.host}/json/list`)
  ).json()
  socket = new WebSocket(
    targets.find((t) => t.type === 'page').webSocketDebuggerUrl,
  )
  await new Promise((resolve) =>
    socket.addEventListener('open', resolve, { once: true }),
  )
  let id = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const request = pending.get(message.id)
    if (!request) return
    pending.delete(message.id)
    if (message.error) request.reject(Error(JSON.stringify(message.error)))
    else request.resolve(message.result)
  })
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  // Artificially late scroll delivery must not stall gesture-started rAF tracking.
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
    const add = window.addEventListener.bind(window);
    window.addEventListener = (type, listener, options) => add(type,
      type === 'scroll' ? event => setTimeout(() => listener(event), 240) : listener, options);
  `,
  })
  await send('Page.reload')
  await delay(1400)
  await evaluate(`document.fonts.ready.then(() => true)`)
  await evaluate(
    `document.querySelector('[data-sports-stage]').scrollIntoView()`,
  )
  browser('wait', '--fn', `!!document.querySelector('[data-sports-frame]')`)
  const geometry = await evaluate(`(() => {
    const track = document.querySelector('[data-motion]'), rect = track.getBoundingClientRect();
    const stage = track.querySelector('[data-sports-stage]');
    const bridges = track.querySelectorAll(':scope > [aria-hidden=true]');
    const distance = rect.height - stage.clientHeight;
    const bound = e => (e.getBoundingClientRect().top - rect.top) / distance;
    const rally = document.querySelector('#mavonic');
    const start = rally.getBoundingClientRect().top + scrollY + rally.clientHeight - 220;
    const geometry = {top:rect.top + scrollY, distance, bounds:[bound(bridges[0]), bound(rally), bound(bridges[1]), bound(document.querySelector('#zosma'))]};
    scrollTo(0, start);
    return geometry;
  })()`)
  await delay(350)
  await evaluate(`(() => {
    window.crowdChanges = 0;
    window.crowdObserver = new MutationObserver(records => window.crowdChanges += records.length);
    window.crowdObserver.observe(document.querySelector('[data-football-stadium]'), {subtree:true, attributes:true, childList:true});
    window.initialStadium = document.querySelector('[data-football-stadium]');
    window.initialFootball = document.querySelector('[data-football-view]');
    window.sampleTimes = []; window.sampling = true;
    let previous = performance.now();
    const tick = t => { window.sampleTimes.push(t - previous); previous = t; if(window.sampling)requestAnimationFrame(tick) };
    requestAnimationFrame(tick);
  })()`)
  const samples = []
  for (const direction of [1, -1]) {
    for (let index = 0; index < 32; index++) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 180,
        y: 600,
        deltaX: 0,
        deltaY: direction * 75,
      })
      await delay(18)
      samples.push(
        await evaluate(
          `new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve({y:scrollY, frame:+document.querySelector('[data-sports-frame]').dataset.sportsFrame}))))`,
        ),
      )
    }
  }
  for (const sample of samples) {
    const expected = sportsFrameAt(
      (sample.y - geometry.top) / geometry.distance,
      ...geometry.bounds,
    )
    assert.ok(
      Math.abs(sample.frame - expected) <= 2,
      `Scroll-linked frame lagged: ${sample.frame}, expected ${expected}`,
    )
  }
  const result = await evaluate(`(() => {
    window.sampling = false; window.crowdObserver.disconnect();
    const times = window.sampleTimes.slice(2).sort((a,b) => a-b);
    const bleed = document.querySelector('[data-football-bleed]');
    const groups = [...document.querySelectorAll('[data-stadium-crowd] > div')];
    return {changes:window.crowdChanges, sameStadium:window.initialStadium === document.querySelector('[data-football-stadium]'), sameFootball:window.initialFootball === document.querySelector('[data-football-view]'), top:bleed.style.top, transform:bleed.style.transform, liveGroups:groups.filter(e => getComputedStyle(e).animationName !== 'none').length, p95:times[Math.floor(times.length*.95)]};
  })()`)
  assert.equal(
    result.changes,
    0,
    'Stadium must not mutate or remount during final-serve handoff',
  )
  assert.ok(
    result.sameStadium && result.sameFootball,
    'Stadium must already exist before final return',
  )
  assert.equal(result.top, '0px', 'Handoff must not animate layout-driving top')
  assert.match(result.transform, /translate3d/)
  assert.equal(
    result.liveGroups,
    9,
    'Crowd remains animated independently of scroll',
  )
  const crowdTransforms = () =>
    evaluate(`
    [...document.querySelectorAll('[data-stadium-crowd] > div')].map(e => getComputedStyle(e).transform)`)
  const before = await crowdTransforms()
  await delay(130)
  assert.notDeepEqual(
    await crowdTransforms(),
    before,
    'Crowd must move while scroll is idle',
  )
  console.log(
    `Final-serve handoff: ${samples.length} forward/reverse wheel checks pass with scroll events delayed 240ms; cached stadium, nine live crowd groups; p95 ${result.p95.toFixed(1)}ms.`,
  )
} finally {
  socket?.close()
  browser('close')
}
