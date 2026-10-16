// Run: node scripts/check-penalty.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(
    new URL('../app/new/rally-timeline.ts', import.meta.url),
    'utf8',
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
)
const {
  footballViewport,
  footballLayout,
  penaltyAt,
  penaltyBallAt,
  penaltyScreenBallAt,
  ronaldoAt,
  ronaldoArmAt,
  pitchHandoffAt,
  handoffAt,
  rallyAt,
  sportsFrameAt,
  RALLY_END_FRAME,
  RALLY_FRAMES,
  PENALTY_START_FRAME,
  PITCH_HANDOFF_FRAMES,
  PENALTY_FRAMES,
  SPORTS_FRAMES,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
const close = (a, b, message) =>
  assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} vs ${b}`)
for (const [width, height] of [
  [1296, 1000],
  [342, 844],
  [720, 1024],
  [700, 660],
]) {
  const viewport = footballViewport(height)
  assert.ok(viewport.top >= 320, 'Night artwork stays below the job copy')
  const point = penaltyScreenBallAt(0, width, viewport.height)
  const landing = pitchHandoffAt(PITCH_HANDOFF_FRAMES, width, height)
  close(landing.x, point.x, 'Handoff meets illustrated ball x')
  close(landing.y, viewport.top + point.y, 'Handoff meets illustrated ball y')
  close(landing.radius, point.radius, 'No ball-size pop')
  const rally = handoffAt(720, width, height)
  const rallyScale = Math.min(
    width / (rally.compact ? 900 : 1440),
    rally.rallyHeight / 820,
  )
  const start = pitchHandoffAt(0, width, height)
  close(
    start.y,
    rally.y + (rallyAt(RALLY_FRAMES).ballY - 480) * rallyScale,
    'Drop starts above the missed paddle, not on it',
  )
  let escapedRight = false
  for (let frame = 1; frame <= PITCH_HANDOFF_FRAMES; frame++) {
    const p = pitchHandoffAt(frame, width, height)
    const prev = pitchHandoffAt(frame - 1, width, height)
    assert.ok(
      Math.hypot(p.x - prev.x, p.y - prev.y) < 15,
      'Continuous missed-return path',
    )
    assert.ok(p.y > 0 && p.y < height, 'Camera follows falling ball')
    assert.ok(p.worldY >= prev.worldY, 'World-space fall never reverses')
    escapedRight ||= p.x - p.radius > width
  }
  assert.ok(escapedRight, 'Ball exits screen right')
  const { viewWidth } = footballLayout(width, viewport.height)
  const launch = penaltyBallAt(0, viewWidth)
  const shot = ronaldoAt(410, viewWidth)
  close(shot.bootAngle, 0, 'Toe faces ball at release')
  close(
    shot.x + shot.rightX * shot.scale,
    launch.x,
    'Ronaldo right boot actually meets ball x',
  )
  close(
    shot.y + (shot.rightY - 24) * shot.scale,
    launch.y + launch.radius,
    'Right boot meets ball edge before release',
  )
  assert.deepEqual(
    penaltyBallAt(409, viewWidth),
    launch,
    'Ball waits for Ronaldo',
  )
  assert.ok(
    penaltyBallAt(520, viewWidth).radius < launch.radius / 2,
    'Shot recedes into goal depth, not sideways across screen',
  )
  for (let f = 0; f <= PENALTY_FRAMES; f++) {
    const ball = penaltyBallAt(f, viewWidth)
    const player = ronaldoAt(f, viewWidth)
    for (const side of [-1, 1]) {
      const { shoulder, elbow, wrist, handAngle } = ronaldoArmAt(player, side)
      close(
        Math.hypot(elbow.x - shoulder.x, elbow.y - shoulder.y),
        56,
        'Upper arm keeps fixed length',
      )
      close(
        Math.hypot(wrist.x - elbow.x, wrist.y - elbow.y),
        52,
        'Forearm keeps fixed length',
      )
      close(
        handAngle + 90,
        (Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) * 180) / Math.PI,
        'Hand stays aligned with forearm',
      )
      assert.ok(Math.abs(handAngle) < 55, 'No twisted wrist')
    }
    assert.ok(
      Number.isFinite(
        ball.x + ball.y + ball.radius + player.rightX + player.rightY,
      ),
    )
    assert.ok(
      player.scale > 0.8 && player.scale < 1.1,
      'Ronaldo stays visible, never becomes an eye-camera',
    )
    assert.deepEqual(
      penaltyAt(f),
      penaltyAt(f),
      'Reverse scrubbing is deterministic',
    )
    if (penaltyAt(f).flight >= 0.45 && penaltyAt(f).flight <= 0.65)
      assert.ok(
        ball.y + ball.radius < 303 - penaltyAt(f).wallJump,
        'Shot clears three-man wall',
      )
  }
  const goal = penaltyBallAt(530, viewWidth)
  assert.ok(
    goal.y - goal.radius > 205 && goal.y + goal.radius < 425,
    'Ball enters below crossbar',
  )
}
for (const [screenWidth, stageWidth, height] of [
  [390, 342, 844],
  [1440, 1296, 1000],
  [2510, 1440, 944],
]) {
  const left = (screenWidth - stageWidth) / 2
  const viewport = footballViewport(height)
  const drop = pitchHandoffAt(
    PITCH_HANDOFF_FRAMES,
    stageWidth,
    height,
    screenWidth,
    left,
  )
  const ball = penaltyScreenBallAt(0, screenWidth, viewport.height)
  close(drop.x + left, ball.x, 'Full-bleed offset keeps ball continuous')
  close(drop.y, viewport.top + ball.y, 'Full-bleed vertical landing')
  assert.ok(
    Array.from({ length: PITCH_HANDOFF_FRAMES }, (_, f) =>
      pitchHandoffAt(f, stageWidth, height, screenWidth, left),
    ).some((p) => p.x + left - p.radius > screenWidth),
    'Miss exits actual screen, not just the old content column',
  )
}
for (const width of [900, 1440]) {
  const compact = width === 900
  for (let f = 364; f <= RALLY_FRAMES; f++) {
    const pose = rallyAt(f)
    const bx =
      (compact ? 0.5 + (pose.ballX - 0.5) * 0.5625 : pose.ballX) * width
    const dx = bx - width * (compact ? 0.68 : 0.82)
    const dy = pose.ballY - 480 - pose.rightStep
    const angle = (24 * Math.PI) / 180
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle)
    assert.ok(
      (localX / (27 + 9)) ** 2 + (localY / (35 + 9)) ** 2 > 1,
      'Final ball never touches Backend & AI paddle',
    )
    assert.equal(pose.rightHit, 0, 'No false return stroke')
  }
}
assert.equal(sportsFrameAt(0.6, 0.2, 0.4, 0.6, 0.8), RALLY_END_FRAME)
assert.equal(sportsFrameAt(0.8, 0.2, 0.4, 0.6, 0.8), PENALTY_START_FRAME)
assert.equal(sportsFrameAt(1, 0.2, 0.4, 0.6, 0.8), SPORTS_FRAMES - 1)
for (let f = 0; f <= 530; f++)
  assert.equal(
    penaltyAt(f).goalReveal,
    0,
    'Constellation cannot reveal GOAL before net contact',
  )
assert.ok(penaltyAt(531).goalReveal > 0, 'Stars connect only after goal')
assert.equal(
  penaltyAt(PENALTY_FRAMES).goalReveal,
  1,
  'Fully bright on final scroll frame',
)
assert.deepEqual(penaltyAt(-1), penaltyAt(0))
assert.deepEqual(penaltyAt(900), penaltyAt(PENALTY_FRAMES))
const art = readFileSync(
  new URL('../app/new/football-art.tsx', import.meta.url),
  'utf8',
)
assert.ok(
  art.includes('data-stadium-crowd="true"') &&
    art.includes('data-football-view="behind-ronaldo"'),
)
const rail = readFileSync(
  new URL('../app/new/story-rail.tsx', import.meta.url),
  'utf8',
)
assert.match(
  rail,
  /className=\{styles.copyStage\}\s+style=\{\{ opacity: motionAllowed \? opacity : 1 \}\}/,
  'Fade whole sticky lane, not just text inside opaque background',
)
const deps = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)
for (const name of ['three', '@react-three/fiber', '@remotion/three'])
  assert.ok(!deps.dependencies[name], 'No rejected 3D dependency')
console.log(
  `Penalty checks passed: ${SPORTS_FRAMES} frames, genuine rally miss, continuous drop, visible Ronaldo boot contact, depth shot, night crowd and no Three.js.`,
)
