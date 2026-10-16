// Run: node scripts/check-rally.mjs
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
  rallyAt,
  rallyArmsAt,
  handoffAt,
  sportsFrameAt,
  SPORTS_FRAMES,
  RALLY_FRAMES,
  HANDOFF_FRAMES,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
for (const [width, height, screenWidth = width] of [
  [1296, 1000],
  [342, 844],
  [272, 568],
  [720, 700],
  [691, 1024, 768],
  [652, 900, 700],
  [631, 900, 701],
]) {
  const start = handoffAt(420, width, height, screenWidth)
  const end = handoffAt(420 + HANDOFF_FRAMES, width, height, screenWidth)
  const compact = screenWidth <= 700
  assert.equal(end.compact, compact, 'Artwork and copy use viewport breakpoint')
  const top = compact ? Math.max(height * 0.44, 360) : height * 0.32
  const sceneWidth = compact ? 900 : 1440
  const scale = Math.min(width / sceneWidth, (height - top) / 820)
  assert.ok(
    Math.abs(
      end.x -
        ((width - sceneWidth * scale) / 2 +
          sceneWidth * (compact ? 0.68 : 0.82) * scale),
    ) < 1e-8,
    'Morph meets the receiving paddle',
  )
  assert.ok(
    Math.abs(end.y - (top + (height - top - 820 * scale) / 2 + 480 * scale)) <
      1e-8,
  )
  assert.ok(
    end.worldY - start.worldY > height,
    'Drop travels more than a screen in world space',
  )
  assert.equal(start.morph, 0)
  assert.equal(end.morph, 1)
  for (let f = 421; f <= 420 + HANDOFF_FRAMES; f++) {
    const pose = handoffAt(f, width, height, screenWidth)
    const previous = handoffAt(f - 1, width, height, screenWidth)
    assert.ok(
      Math.hypot(pose.x - previous.x, pose.y - previous.y) < 12,
      'No teleport during camera-follow drop',
    )
    assert.ok(
      pose.worldY >= previous.worldY,
      'Ball falls continuously in world space',
    )
    assert.ok(
      pose.y > 0 && pose.y < height,
      'Camera keeps the morphing ball on screen',
    )
  }
}
assert.deepEqual(rallyAt(-1), rallyAt(0))
assert.deepEqual(rallyAt(1000), rallyAt(RALLY_FRAMES))
assert.equal(sportsFrameAt(-1, 0.5, 0.65, 0.8, 0.9), 0)
assert.equal(
  sportsFrameAt(0.5, 0.5, 0.65, 0.8, 0.9),
  420,
  'Basket meets the handoff exactly',
)
assert.equal(
  sportsFrameAt(0.65, 0.5, 0.65, 0.8, 0.9),
  420 + HANDOFF_FRAMES,
  'Morph ends at first paddle return',
)
assert.equal(sportsFrameAt(1, 0.5, 0.65, 0.8, 0.9), SPORTS_FRAMES - 1)
assert.equal(sportsFrameAt(2, 0.5, 0.65, 0.8, 0.9), SPORTS_FRAMES - 1)
for (let f = 0; f <= RALLY_FRAMES; f++) {
  const pose = rallyAt(f)
  assert.deepEqual(pose, rallyAt(f), 'Reverse seeking never changes a pose')
  assert.ok(
    Object.values(pose).every(
      (v) => typeof v === 'boolean' || Number.isFinite(v),
    ),
  )
  assert.ok(pose.ballX >= 0.18 - 1e-10 && pose.ballX <= 0.82 + 1e-10)
  assert.ok(pose.ballY <= 580 + 1e-10, 'No ball below the tabletop')
  if (Math.abs(pose.ballX - 0.5) < 0.02)
    assert.ok(pose.ballY < 445, 'Every return clears the net')
  if (f) {
    const previous = rallyAt(f - 1)
    assert.ok(
      Math.hypot(
        (pose.ballX - previous.ballX) * 1440,
        pose.ballY - previous.ballY,
      ) < 35,
      `Continuous return at ${f}`,
    )
  }
}
for (let frame = 0; frame <= RALLY_FRAMES; frame++) {
  const arms = rallyArmsAt(frame)
  for (const [name, upper, lower] of [
    ['free', 68, 64],
    ['paddle', 66, 66],
  ]) {
    const { shoulder, elbow, wrist } = arms[name]
    assert.ok(
      Math.abs(Math.hypot(elbow.x - shoulder.x, elbow.y - shoulder.y) - upper) <
        1e-8,
      'Biceps keeps fixed length',
    )
    assert.ok(
      Math.abs(Math.hypot(wrist.x - elbow.x, wrist.y - elbow.y) - lower) < 1e-8,
      'Forearm keeps fixed length',
    )
    if (frame) {
      const prev = rallyArmsAt(frame - 1)[name].wrist
      assert.ok(
        Math.hypot(prev.x - wrist.x, prev.y - wrist.y) < 12,
        'Hands move continuously',
      )
    }
  }
  const angle = (-rallyAt(frame).leftHit * 26 * Math.PI) / 180
  assert.ok(
    Math.abs(
      arms.paddle.wrist.x - (101 + 76 * Math.cos(angle) - 82 * Math.sin(angle)),
    ) < 1e-8,
    'Grip follows actual paddle transform',
  )
  assert.ok(
    arms.free.wrist.x < 0,
    'Free hand stays outside torso, never on hip or in pocket',
  )
}
assert.notDeepEqual(
  rallyArmsAt(52).free.wrist,
  rallyArmsAt(62).free.wrist,
  'Free arm counterbalances the swing',
)
for (let turn = 0; turn < 7; turn++) {
  const hit = rallyAt(turn * 52)
  assert.ok(Math.abs(hit.ballX - (turn % 2 ? 0.18 : 0.82)) < 1e-10)
  assert.equal(hit.ballY, 480, 'Return meets paddle height')
  assert.ok(
    Math.abs(rallyAt(turn * 52 + 52 * 0.76).ballY - 580) < 1e-8,
    'One bounce on receiving half',
  )
}
assert.equal(
  rallyAt(RALLY_FRAMES).ballY,
  360,
  'Last lob clears the opponent bat, not another contact',
)
console.log(
  `Rally checks passed: ${SPORTS_FRAMES} combined frames, hoop handoff, seven net-clearing returns then a miss, reversible seeking.`,
)
