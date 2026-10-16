// Run: node scripts/check-court.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(
  new URL('../app/new/court-timeline.ts', import.meta.url),
  'utf8',
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
})
const { courtAt, COURT_FRAMES } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)

assert.deepEqual(courtAt(-20), courtAt(0), 'Clamp before start')
assert.deepEqual(courtAt(999), courtAt(COURT_FRAMES - 1), 'Clamp after end')
assert.equal(courtAt(40).ballY, 620, 'Initial drop meets court')
assert.equal(courtAt(80).ballY, 469, 'Rebound reaches hand')
assert.equal(courtAt(110).ballY, 620, 'Dribble meets court')
assert.ok(courtAt(140).ballY < 540, 'Low dribble returns to hand')
assert.ok(
  courtAt(281).x - courtAt(280).x > courtAt(141).x - courtAt(140).x,
  'Drive accelerates toward hoop',
)
assert.equal(courtAt(420).ballX, 850, 'Shot enters rim')
assert.equal(courtAt(420).ballY, 270, 'Shot enters rim')
assert.equal(courtAt(480).ballY, 620, 'Ball lands after basket')
assert.ok(courtAt(435).net > 15, 'Net reacts after basket')
assert.ok(Math.abs(courtAt(480).net) < 1e-10, 'Net settles')

for (let frame = 0; frame < COURT_FRAMES; frame++) {
  const pose = courtAt(frame)
  assert.deepEqual(pose, courtAt(frame), 'Seeking is deterministic')
  assert.ok(
    Object.values(pose).every(Number.isFinite),
    `Finite pose at ${frame}`,
  )
  assert.ok(pose.ballY <= 620, `Ball stays above court at ${frame}`)
  for (const [hx, hy, kx, ky, ax, ay] of [
    [
      145,
      302,
      pose.nearKneeX,
      pose.nearKneeY,
      pose.nearAnkleX,
      pose.nearAnkleY,
    ],
    [107, 300, pose.farKneeX, pose.farKneeY, pose.farAnkleX, pose.farAnkleY],
  ]) {
    assert.ok(
      Math.abs(Math.hypot(kx - hx, ky - hy) - 130) < 1e-8,
      `Thigh length at ${frame}`,
    )
    assert.ok(
      Math.abs(Math.hypot(ax - kx, ay - ky) - 145) < 1e-8,
      `Shin length at ${frame}`,
    )
    assert.ok(ay + pose.y <= 632 + 1e-8, `Foot stays above court at ${frame}`)
  }
  if (frame > 0) {
    const previous = courtAt(frame - 1)
    assert.ok(
      Math.hypot(pose.ballX - previous.ballX, pose.ballY - previous.ballY) < 40,
      `Continuous ball path at ${frame}`,
    )
  }
}
console.log(
  `Court checks passed: ${COURT_FRAMES} deterministic frames, drop, dribbles, shot, landing.`,
)
