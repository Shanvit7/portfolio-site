export const COURT_FRAMES = 481
export const COURT_FPS = 60

const between = (frame: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (frame - start) / (end - start)))
const radians = (degrees: number) => (degrees * Math.PI) / 180

// Two-bone legs keep anatomical lengths while feet plant and knees drive forward.
function knee(hx: number, hy: number, ax: number, ay: number) {
  const dx = ax - hx
  const dy = ay - hy
  const distance = Math.hypot(dx, dy)
  const along = (130 ** 2 - 145 ** 2 + distance ** 2) / (2 * distance)
  const bend = Math.sqrt(Math.max(0, 130 ** 2 - along ** 2))
  return {
    x: hx + (dx * along + dy * bend) / distance,
    y: hy + (dy * along - dx * bend) / distance,
  }
}

function actor(f: number) {
  const drive = between(f, 80, 320)
  const effort = Math.sin(drive * Math.PI)
  const cycle = ((f - 80) * Math.PI * 2) / 48
  const stride = Math.sin(cycle) * effort
  const raise = between(f, 320, 350)
  const gather = raise * raise * (3 - 2 * raise)
  const jump = Math.sin(between(f, 330, 405) * Math.PI) * 78
  const x = 60 + drive ** 1.65 * 400
  const y = 142 + effort * 24 - 45 * gather - jump
  const lean = 18 * effort - 8 * gather
  const nearAnkleX = 185 + stride * 90
  const farAnkleX = 65 - stride * 90
  const nearAnkleY = 632 - y - jump - Math.max(0, Math.cos(cycle)) * 48 * effort
  const farAnkleY = 632 - y - jump - Math.max(0, -Math.cos(cycle)) * 48 * effort
  const nearKnee = knee(145, 302, nearAnkleX, nearAnkleY)
  const farKnee = knee(107, 300, farAnkleX, farAnkleY)
  return {
    x,
    y,
    gather,
    lean,
    stride,
    effort,
    jump,
    nearAnkleX,
    nearAnkleY,
    farAnkleX,
    farAnkleY,
    nearKneeX: nearKnee.x,
    nearKneeY: nearKnee.y,
    farKneeX: farKnee.x,
    farKneeY: farKnee.y,
  }
}

function hand(pose: ReturnType<typeof actor>) {
  const l = radians(pose.lean)
  // Ball travels from the low dribble pocket to the two-handed overhead gather.
  const hx = 260 - 100 * pose.gather
  const hy = 327 - 337 * pose.gather
  // Sub-pixel rounding prevents server/browser trig differences in hydrated SVG paths.
  return {
    x: Number(
      (
        pose.x +
        130 +
        (hx - 130) * Math.cos(l) -
        (hy - 300) * Math.sin(l)
      ).toFixed(8),
    ),
    y: Number(
      (
        pose.y +
        300 +
        (hx - 130) * Math.sin(l) +
        (hy - 300) * Math.cos(l)
      ).toFixed(8),
    ),
  }
}

// One seekable timeline. No timers, playback loop, or accumulated physics state.
export function courtAt(frame: number) {
  const f = Math.max(0, Math.min(COURT_FRAMES - 1, frame))
  const body = actor(f)
  const palm = hand(body)
  const release = hand(actor(350))
  let ballX: number
  let ballY: number

  if (f < 40) {
    ballX = 320
    ballY = -120 + 740 * between(f, 0, 40) ** 2
  } else if (f < 80) {
    const rebound = between(f, 40, 80)
    ballX = 320
    ballY = 620 - 151 * (1 - (1 - rebound) ** 2)
  } else if (f < 320) {
    const cycle = ((f - 80) % 60) / 60
    const fall = 1 - Math.abs(2 * cycle - 1)
    ballX = palm.x - Math.sin(cycle * Math.PI) * 46 * body.effort
    ballY = palm.y + (620 - palm.y) * fall ** 2
  } else if (f < 350) {
    ballX = palm.x
    ballY = palm.y
  } else if (f < 420) {
    const shot = between(f, 350, 420)
    ballX = release.x + (850 - release.x) * shot
    ballY = release.y + (270 - release.y) * shot - 4 * 125 * shot * (1 - shot)
  } else {
    ballX = 850
    ballY = 270 + 350 * between(f, 420, 480) ** 2
  }

  return {
    frame: f,
    ...body,
    ballX,
    ballY,
    releaseX: release.x,
    releaseY: release.y,
    rotation: f * 7,
    squash: ballY > 610 ? 0.84 : 1,
    shadow: 0.25 + 0.75 * Math.max(0, Math.min(1, ballY / 620)),
    net: Math.sin(between(f, 420, 450) * Math.PI) * 16,
    arrival: between(f, 6, 24),
    shot: between(f, 350, 420),
    follow: between(f, 350, 370),
    camera: 1 + body.effort * 0.09,
  }
}
