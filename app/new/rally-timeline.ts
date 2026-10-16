export const HANDOFF_FRAMES = 300
export const RALLY_FRAMES = 416
export const RALLY_END_FRAME = 420 + HANDOFF_FRAMES + RALLY_FRAMES
export const PITCH_HANDOFF_FRAMES = 240
export const PENALTY_FRAMES = 600
export const PENALTY_START_FRAME = RALLY_END_FRAME + PITCH_HANDOFF_FRAMES
export const SPORTS_FRAMES = PENALTY_START_FRAME + PENALTY_FRAMES + 1

const clamp = (n: number) => Math.max(0, Math.min(1, n))

// Seven returns bounce and meet a paddle; the last high lob passes above the opponent's bat.
export function rallyAt(frame: number) {
  const f = Math.max(0, Math.min(RALLY_FRAMES, frame))
  const turn = Math.min(7, Math.floor(f / 52))
  const t = (f - turn * 52) / 52
  const fromRight = turn % 2 === 0
  const travel = t < 0.76 ? t / 0.76 : (t - 0.76) / 0.24
  const missed = turn === 7
  const x = t < 0.76 ? 0.82 - 0.54 * travel : 0.28 - 0.1 * travel
  const y =
    t < 0.76
      ? 480 + 100 * travel - 4 * 175 * travel * (1 - travel)
      : 580 - 100 * travel - 4 * 18 * travel * (1 - travel)
  const hit = (side: number) => {
    const phase = (((f - side * 52) % 104) + 104) % 104
    return phase < 16 ? Math.sin((phase / 16) * Math.PI) : 0
  }
  return {
    frame: f,
    // Final return is a high lob from Me, not another contact at the opponent's bat.
    ballX: missed ? 0.18 + 0.64 * t : fromRight ? x : 1 - x,
    ballY: missed ? 480 - 120 * t - 4 * 130 * t * (1 - t) : y,
    missed,
    // Only once the ball is past the bat, not for the whole approaching turn.
    angry: missed && t > 0.76,
    leftHit: hit(1),
    rightHit: hit(0),
    leftStep: Math.sin((f * Math.PI) / 52) * 9,
    rightStep: -Math.sin((f * Math.PI) / 52) * 9,
    bounce:
      !missed && t > 0.7 && t < 0.82
        ? Math.sin(((t - 0.7) / 0.12) * Math.PI)
        : 0,
    fromRight,
  }
}

// Fixed-length arm chains: paddle hand follows the actual grip; free hand lags the swing.
export function rallyArmsAt(frame: number) {
  const pose = rallyAt(frame)
  const lag = rallyAt(pose.frame - 4).leftHit
  const angle = (-pose.leftHit * 26 * Math.PI) / 180
  const solve = (
    shoulder: { x: number; y: number },
    wrist: { x: number; y: number },
    upper: number,
    forearm: number,
  ) => {
    const dx = wrist.x - shoulder.x,
      dy = wrist.y - shoulder.y
    const d = Math.hypot(dx, dy)
    const along = (upper ** 2 - forearm ** 2 + d ** 2) / (2 * d)
    const bend = Math.sqrt(Math.max(0, upper ** 2 - along ** 2))
    const elbow = {
      x: shoulder.x + (dx * along - dy * bend) / d,
      y: shoulder.y + (dy * along + dx * bend) / d,
    }
    return {
      shoulder,
      elbow,
      wrist,
      handAngle:
        (Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) * 180) / Math.PI - 90,
    }
  }
  return {
    free: solve(
      { x: 18, y: 137 },
      {
        x: -16 - 24 * lag + (pose.leftStep / 9) * 8,
        y: 246 - 42 * lag + Math.sin((pose.frame * Math.PI) / 26) * 5,
      },
      68,
      64,
    ),
    paddle: solve(
      { x: 106, y: 137 },
      {
        x: 101 + 76 * Math.cos(angle) - 82 * Math.sin(angle),
        y: 144 + 76 * Math.sin(angle) + 82 * Math.cos(angle),
      },
      66,
      66,
    ),
  }
}

// Camera follows a long fall; the new table enters from below. All geometry is seek-safe.
export function handoffAt(
  frame: number,
  width: number,
  height: number,
  screenWidth = width,
) {
  const smooth = (n: number) => {
    const t = clamp(n)
    return t * t * (3 - 2 * t)
  }
  const compact = screenWidth <= 700
  const courtWidth = compact ? width : width * 0.62
  const courtHeight = compact ? height * 0.4 : height
  const courtScale = Math.min(courtWidth / 1000, courtHeight / 840)
  const rallyWidth = compact ? 900 : 1440
  // Match the mobile copy lane so labels and heads never sit behind the text.
  const rallyTop = compact ? Math.max(height * 0.44, 360) : height * 0.32
  const rallyHeight = height - rallyTop
  const rallyScale = Math.min(width / rallyWidth, rallyHeight / 820)
  const h = clamp((frame - 420) / HANDOFF_FRAMES)
  const pan = smooth((h - 0.12) / 0.76) * height * 1.1
  const entrance = smooth((h - 0.28) / 0.66)
  const morph = smooth((h - 0.42) / 0.27)
  const fromX = (courtWidth - 1000 * courtScale) / 2 + 850 * courtScale
  const fromY = (courtHeight - 840 * courtScale) / 2 + 350 * courtScale
  const toX =
    (width - rallyWidth * rallyScale) / 2 +
    rallyWidth * (compact ? 0.68 : 0.82) * rallyScale
  const toY = rallyTop + (rallyHeight - 820 * rallyScale) / 2 + 480 * rallyScale
  const travel = smooth((h - 0.08) / 0.92)
  const x = fromX + (toX - fromX) * smooth((h - 0.52) / 0.48)
  const worldY = fromY + (toY + height * 1.1 - fromY) * travel
  const y = worldY - pan
  const radius = 27 * courtScale * (1 - morph) + 9 * rallyScale * morph
  return {
    compact,
    courtWidth,
    courtHeight,
    rallyTop,
    rallyHeight,
    h,
    pan,
    entrance,
    morph,
    x,
    y,
    radius,
    worldY,
  }
}

// Pixel-derived boundaries keep the handoff aligned with the semantic story, even after reflow.
export function sportsFrameAt(
  progress: number,
  bridge: number,
  rally: number,
  pitchBridge: number,
  penalty: number,
) {
  const p = clamp(progress)
  if (p < bridge) return Math.round(420 * clamp(p / bridge))
  if (p < rally)
    return (
      420 + Math.round(HANDOFF_FRAMES * clamp((p - bridge) / (rally - bridge)))
    )
  if (p < pitchBridge)
    return (
      420 +
      HANDOFF_FRAMES +
      Math.round(RALLY_FRAMES * clamp((p - rally) / (pitchBridge - rally)))
    )
  if (p < penalty)
    return (
      RALLY_END_FRAME +
      Math.round(
        PITCH_HANDOFF_FRAMES *
          clamp((p - pitchBridge) / (penalty - pitchBridge)),
      )
    )
  return (
    PENALTY_START_FRAME +
    Math.round(PENALTY_FRAMES * clamp((p - penalty) / (1 - penalty)))
  )
}

const smooth = (n: number) => {
  const t = clamp(n)
  return t * t * (3 - 2 * t)
}
// Ronaldo stays visible from behind. No eye-camera, WebGL or elapsed-time animation.
export function penaltyAt(frame: number) {
  const f = Math.max(0, Math.min(PENALTY_FRAMES, frame))
  const run = smooth((f - 265) / 120)
  const windup = smooth((f - 350) / 35)
  const strike = smooth((f - 385) / 25)
  const follow = smooth((f - 410) / 65)
  const flight = clamp((f - 410) / 120)
  return {
    frame: f,
    run,
    windup,
    strike,
    follow,
    flight,
    stride: Math.sin(run * Math.PI * 6) * (1 - windup),
    settle: smooth((f - 530) / 70),
    wallJump: 22 * Math.sin(Math.PI * clamp((f - 405) / 60)),
    keeperDive: smooth((f - 420) / 60),
    goalReveal: smooth((f - 530) / 70),
    net: Math.sin(Math.PI * clamp((f - 520) / 65)),
    phase:
      f < 265
        ? 'Ronaldo. United. No. 7.'
        : f < 385
          ? 'The run-up.'
          : f < 410
            ? 'Right foot. Commit.'
            : f < 530
              ? 'Take the shot.'
              : 'Keep shipping.',
  }
}

export function footballViewport(height: number) {
  const top = Math.max(height * 0.34, 320)
  return { top, height: Math.max(1, Math.round(height - top)) }
}

export function footballLayout(width: number, height: number) {
  const viewWidth = width < 700 ? 700 : 1200
  const skyHeight = 160
  const viewHeight = 820 + skyHeight
  const scale = Math.min(width / viewWidth, height / viewHeight)
  return {
    viewWidth,
    viewHeight,
    skyHeight,
    scale,
    offsetX: (width - viewWidth * scale) / 2,
    offsetY: (height - viewHeight * scale) / 2,
  }
}

export function penaltyBallAt(frame: number, viewWidth: number) {
  const { flight: t, settle } = penaltyAt(frame)
  const goalWidth = Math.min(540, viewWidth * 0.77)
  return {
    x: viewWidth / 2 + 10 + (goalWidth * 0.36 - 10) * smooth(t),
    y: (655 - 385 * t - 1200 * t * (1 - t)) * (1 - settle) + 405 * settle,
    radius: 22 * (1 - t) + 9 * t,
  }
}

// One shared contact point: Ronaldo's right boot reaches this ball before it can fly.
export function ronaldoAt(frame: number, viewWidth: number) {
  const pose = penaltyAt(frame)
  const ball = penaltyBallAt(0, viewWidth)
  const x = viewWidth / 2 - 155 + 125 * pose.run
  const y = 400 - 12 * pose.run
  const scale = 1.05 - 0.16 * pose.run
  const impactX = (ball.x - x) / scale
  const impactY = (ball.y + ball.radius - y) / scale + 24
  const rightX =
    (38 + pose.stride * 18 + pose.windup * 75) * (1 - pose.strike) +
    impactX * pose.strike -
    pose.follow * 75
  const rightY =
    (330 - pose.stride * 20 + pose.windup * 45) * (1 - pose.strike) +
    impactY * pose.strike -
    pose.follow * 85
  return {
    ...pose,
    x,
    y,
    scale,
    rightX,
    rightY,
    leftX: -26 - pose.stride * 14,
    leftY: 333 + pose.stride * 18,
    bootAngle: 30 * pose.windup * (1 - pose.strike) - 25 * pose.follow,
  }
}

// Two fixed bone lengths; the palm follows the forearm, never an independent wrist twist.
export function ronaldoArmAt(pose: ReturnType<typeof penaltyAt>, side: number) {
  const shoulder = { x: side * 35, y: 99 }
  const wrist = {
    x:
      side < 0
        ? -64 - 20 * pose.windup + 8 * pose.follow
        : 70 + 22 * pose.windup + 6 * pose.follow,
    y:
      side < 0
        ? 183 - 8 * pose.stride - 28 * pose.windup + 10 * pose.follow
        : 177 + 10 * pose.stride - 18 * pose.windup - 8 * pose.follow,
  }
  const dx = wrist.x - shoulder.x,
    dy = wrist.y - shoulder.y
  const length = Math.hypot(dx, dy)
  const along = (56 ** 2 - 52 ** 2 + length ** 2) / (2 * length)
  const bend = Math.sqrt(Math.max(0, 56 ** 2 - along ** 2))
  const elbow = {
    x: shoulder.x + (dx * along + dy * bend * side) / length,
    y: shoulder.y + (dy * along - dx * bend * side) / length,
  }
  const handAngle =
    (Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) * 180) / Math.PI - 90
  return { shoulder, elbow, wrist, handAngle }
}

export function penaltyScreenBallAt(
  frame: number,
  width: number,
  height: number,
) {
  const layout = footballLayout(width, height)
  const ball = penaltyBallAt(frame, layout.viewWidth)
  return {
    x: layout.offsetX + ball.x * layout.scale,
    y: layout.offsetY + (ball.y + layout.skyHeight) * layout.scale,
    radius: ball.radius * layout.scale,
  }
}

export function pitchHandoffAt(
  frame: number,
  width: number,
  height: number,
  screenWidth = width,
  stageLeft = 0,
) {
  const p = clamp(frame / PITCH_HANDOFF_FRAMES)
  const rally = handoffAt(420 + HANDOFF_FRAMES, width, height, screenWidth)
  const rallyScale = Math.min(
    width / (rally.compact ? 900 : 1440),
    rally.rallyHeight / 820,
  )
  const start = {
    ...rally,
    y: rally.y + (rallyAt(RALLY_FRAMES).ballY - 480) * rallyScale,
  }
  const viewport = footballViewport(height)
  const screenLanding = penaltyScreenBallAt(0, screenWidth, viewport.height)
  const landing = { ...screenLanding, x: screenLanding.x - stageLeft }
  const pan = height * 1.05 * smooth((p - 0.18) / 0.7)
  const edge = screenWidth - stageLeft + start.radius * 2
  const x =
    start.x +
    (edge - start.x) * smooth(p / 0.3) +
    (landing.x - edge) * smooth((p - 0.35) / 0.65)
  const worldY =
    start.y + (viewport.top + landing.y + height * 1.05 - start.y) * smooth(p)
  const morph = smooth((p - 0.42) / 0.45)
  return {
    progress: p,
    pan,
    x,
    y: worldY - pan,
    worldY,
    radius: start.radius * (1 - morph) + landing.radius * morph,
    morph,
    pitchY: viewport.top + height * 1.05 * (1 - smooth((p - 0.25) / 0.65)),
  }
}
