// Run: node scripts/check-penalty.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(
    new URL(
      '../app/components/portfolio/timeline/rally-timeline.ts',
      import.meta.url,
    ),
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
  ronaldoLegAt,
  penaltyNetPointAt,
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
  assert.equal(
    viewport.top,
    Math.max(height * 0.34, 380),
    'Night artwork reserves enough room for the job copy',
  )
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
  const path = Array.from({ length: PITCH_HANDOFF_FRAMES + 1 }, (_, f) =>
    pitchHandoffAt(f, width, height),
  )
  const hit = path.reduce((peak, point) => (point.x > peak.x ? point : peak))
  const impact = path.indexOf(hit)
  close(hit.x + hit.radius + 1, width, 'Ball visibly touches right screen edge')
  assert.ok(impact > 0 && impact < PITCH_HANDOFF_FRAMES)
  assert.ok(hit.x > path[impact - 1].x, 'Ball moves right into wall')
  assert.equal(
    path[impact - 1].knock.opacity,
    0,
    'No impact flash before contact',
  )
  assert.equal(hit.knock.opacity, 1, 'Knock flashes exactly at wall contact')
  assert.equal(hit.knock.squash, 1, 'Ball compresses at contact')
  close(hit.knock.y, hit.y, 'Burst anchors to actual collision height')
  assert.equal(landing.knock.opacity, 0, 'Impact burst clears before landing')
  assert.equal(landing.knock.squash, 0, 'Ball recovers its round shape')
  assert.ok(
    path[1].x - start.x < 0.2,
    'Approach eases in without a sideways snap',
  )
  assert.ok(
    Math.abs(landing.y - path[PITCH_HANDOFF_FRAMES - 1].y) < 0.1,
    'Fall settles gently onto pitch',
  )
  assert.ok(
    path[impact + 1].x - hit.x < -(hit.x - path[impact - 1].x) * 0.25,
    'Immediate rebound, not a pause and eased reversal',
  )
  for (let frame = 1; frame <= PITCH_HANDOFF_FRAMES; frame++) {
    const p = pitchHandoffAt(frame, width, height)
    const prev = pitchHandoffAt(frame - 1, width, height)
    assert.ok(
      Math.hypot(p.x - prev.x, p.y - prev.y) < 15,
      'Continuous missed-return path',
    )
    assert.ok(p.y > 0 && p.y < height, 'Camera follows falling ball')
    assert.ok(p.worldY >= prev.worldY, 'World-space fall never reverses')
    assert.ok(
      p.y >= prev.y,
      'Camera never makes falling ball float back upward',
    )
    close(
      p.pitchY + p.pan,
      viewport.top + height * 1.05,
      'Pitch shares camera pan',
    )
    assert.deepEqual(
      p,
      pitchHandoffAt(frame, width, height),
      'Impact is seek-safe',
    )
    assert.ok(
      p.x + p.radius + 1 <= width + 1e-7,
      'Ball never exits screen right',
    )
    assert.ok(
      frame <= impact ? p.x > prev.x : p.x < prev.x,
      'One clean right-edge collision, then leftward travel to pitch',
    )
  }
  const { viewWidth } = footballLayout(width, viewport.height)
  const launch = penaltyBallAt(0, viewWidth)
  const shot = ronaldoAt(410, viewWidth)
  const angle = (shot.bootAngle * Math.PI) / 180
  close(
    shot.x +
      (shot.rightX + 19 * Math.cos(angle) - 8 * Math.sin(angle)) * shot.scale,
    launch.x - launch.radius,
    'Toe meets left ball edge at release',
  )
  close(
    shot.y +
      (shot.rightY + 19 * Math.sin(angle) + 8 * Math.cos(angle)) * shot.scale,
    launch.y,
    'Toe meets ball at its centre height',
  )
  for (const frame of [0, 150, 265, 410]) {
    for (const side of [-1, 1]) {
      const { hip, knee, ankle } = ronaldoLegAt(
        ronaldoAt(frame, viewWidth),
        side,
      )
      close(
        knee.x,
        (hip.x + ankle.x) / 2,
        'Standing/contact legs stay straight',
      )
      close(knee.y, (hip.y + ankle.y) / 2, 'No sideways frog knee')
    }
  }
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
  const path = Array.from({ length: PITCH_HANDOFF_FRAMES + 1 }, (_, f) =>
    pitchHandoffAt(f, stageWidth, height, screenWidth, left),
  )
  const hit = path.reduce((peak, point) => (point.x > peak.x ? point : peak))
  close(
    hit.x + left + hit.radius + 1,
    screenWidth,
    'Bounce touches actual screen edge, not old content column',
  )
  for (const point of path)
    assert.ok(
      point.x + left + point.radius + 1 <= screenWidth + 1e-7,
      'Full ball remains visible throughout full-bleed rebound',
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
for (let f = 0; f < 530; f++) {
  assert.equal(
    penaltyAt(f).netImpact.opacity,
    0,
    'No ripple before net contact',
  )
  assert.equal(penaltyAt(f).netImpact.squash, 0, 'No compression during flight')
}
assert.equal(
  penaltyAt(530).netImpact.opacity,
  1,
  'Ripple starts exactly at impact',
)
assert.equal(
  penaltyAt(530).netImpact.squash,
  1,
  'Ball compresses at net contact',
)
assert.equal(penaltyAt(548).netImpact.squash, 0, 'Ball recovers after impact')
assert.equal(penaltyAt(572).netImpact.opacity, 0, 'Ripple fades completely')
for (let f = 531; f <= PENALTY_FRAMES; f++) {
  const impact = penaltyAt(f).netImpact
  const prev = penaltyAt(f - 1).netImpact
  assert.ok(impact.opacity <= prev.opacity && impact.spread >= prev.spread)
  assert.ok(impact.squash <= prev.squash, 'Compression recovers smoothly')
}
for (let f = 0; f <= 530; f++)
  assert.equal(penaltyAt(f).net, 0, 'No net reaction before impact')
assert.ok(penaltyAt(539).net > 0, 'Net stretches after impact')
assert.ok(penaltyAt(557).net < 0, 'Net recoils')
assert.ok(Math.abs(penaltyAt(599).net) < 0.1, 'Net motion damps out')
for (const width of [700, 1200]) {
  const goalWidth = Math.min(540, width * 0.77)
  const hit = { x: width / 2 + goalWidth * 0.36, y: 310 }
  assert.deepEqual(penaltyNetPointAt(hit.x, hit.y, width, 0), hit)
  const dent = penaltyNetPointAt(hit.x, hit.y, width, 1)
  close(dent.x, hit.x + 48, 'Net pocket follows ball horizontally')
  close(dent.y, hit.y + 22, 'Net pocket follows ball vertically')
  const pocket = penaltyNetPointAt(hit.x, hit.y, width, penaltyAt(539).net)
  assert.ok(pocket.x - hit.x > 30, 'Net deformation visibly registers the shot')
  const anchor = { x: width / 2 + goalWidth / 2 - 15, y: 310 }
  assert.deepEqual(
    penaltyNetPointAt(anchor.x, anchor.y, width, 1),
    anchor,
    'Posts remain anchored',
  )
}
assert.equal(
  penaltyAt(PENALTY_FRAMES).goalReveal,
  1,
  'Fully bright on final scroll frame',
)
assert.deepEqual(penaltyAt(-1), penaltyAt(0))
assert.deepEqual(penaltyAt(900), penaltyAt(PENALTY_FRAMES))
const art = readFileSync(
  new URL('../app/components/portfolio/art/football-art.tsx', import.meta.url),
  'utf8',
)
assert.ok(
  art.includes('data-stadium-crowd="true"') &&
    art.includes('data-football-view="behind-ronaldo"'),
)
const rail = readFileSync(
  new URL(
    '../app/components/portfolio/stories/story-rail.tsx',
    import.meta.url,
  ),
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
  `Penalty checks passed: ${SPORTS_FRAMES} frames, genuine rally miss, visible screen-edge knock, smooth camera-follow drop, visible Ronaldo boot contact, net-impact ripple and squash, night crowd and no Three.js.`,
)
