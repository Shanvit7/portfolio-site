export const HANDOFF_FRAMES = 300
export const RALLY_FRAMES = 416
export const RALLY_END_FRAME = 420 + HANDOFF_FRAMES + RALLY_FRAMES
export const PITCH_HANDOFF_FRAMES = 360
export const PENALTY_FRAMES = 600
export const PENALTY_START_FRAME = RALLY_END_FRAME + PITCH_HANDOFF_FRAMES
export const SPORTS_FRAMES = PENALTY_START_FRAME + PENALTY_FRAMES + 1

const clamp = (n: number) => Math.max(0, Math.min(1, n))

// Seven returns bounce and meet a paddle; the last high lob passes above the opponent's bat.
export const rallyAt = (frame: number) => {
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
export const rallyArmsAt = (frame: number) => {
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
export const handoffAt = (
  frame: number,
  width: number,
  height: number,
  screenWidth = width,
) => {
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
export const sportsFrameAt = (
  progress: number,
  bridge: number,
  rally: number,
  pitchBridge: number,
  penalty: number,
) => {
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
export const penaltyAt = (frame: number) => {
  const f = Math.max(0, Math.min(PENALTY_FRAMES, frame))
  const run = smooth((f - 265) / 120)
  const windup = smooth((f - 350) / 35)
  const strike = smooth((f - 385) / 25)
  const follow = smooth((f - 410) / 65)
  const flight = clamp((f - 410) / 120)
  const impactAge = f - 530
  return {
    frame: f,
    run,
    windup,
    strike,
    follow,
    flight,
    stride:
      Math.sin(((f - 265) * Math.PI) / 20) *
      smooth((f - 265) / 18) *
      (1 - windup),
    settle: smooth((f - 530) / 70),
    wallJump: 22 * Math.sin(Math.PI * clamp((f - 405) / 60)),
    keeperDive: smooth((f - 420) / 60),
    goalReveal: smooth((f - 530) / 70),
    netImpact: {
      opacity: impactAge < 0 ? 0 : (1 - clamp(impactAge / 42)) ** 2,
      spread: clamp(impactAge / 42),
      squash: impactAge < 0 ? 0 : 1 - smooth(impactAge / 18),
    },
    net:
      f <= 530
        ? 0
        : Math.sin(((f - 530) * Math.PI) / 18) * Math.exp(-(f - 530) / 28),
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

export const footballViewport = (height: number) => {
  const top = Math.max(height * 0.34, 380)
  return { top, height: Math.max(1, Math.round(height - top)) }
}

export const footballLayout = (width: number, height: number) => {
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

export const penaltyBallAt = (frame: number, viewWidth: number) => {
  const { flight: t, settle, net } = penaltyAt(frame)
  const goalWidth = Math.min(540, viewWidth * 0.77)
  return {
    x: viewWidth / 2 + 10 + (goalWidth * 0.36 - 10) * smooth(t) + net * 48,
    y: (655 - 1420 * t + 1075 * t * t) * (1 - settle) + 405 * settle + net * 22,
    radius: 22 * (1 - t) + 9 * t,
  }
}

// Both mesh directions sample the same displacement, so intersections stay tied.
export const penaltyNetPointAt = (
  x: number,
  y: number,
  viewWidth: number,
  net: number,
) => {
  const goalWidth = Math.min(540, viewWidth * 0.77)
  const left = viewWidth / 2 - goalWidth / 2 + 15
  const right = viewWidth / 2 + goalWidth / 2 - 15
  const anchor = Math.max(
    0,
    Math.min(
      1,
      (x - left) / 30,
      (right - x) / 30,
      (y - 218) / 28,
      (414 - y) / 28,
    ),
  )
  const distance =
    ((x - viewWidth / 2 - goalWidth * 0.36) / 85) ** 2 + ((y - 310) / 70) ** 2
  const displacement = net * Math.exp(-distance) * anchor
  return { x: x + displacement * 48, y: y + displacement * 22 }
}

// One shared contact point: Ronaldo's right boot reaches this ball before it can fly.
export const ronaldoAt = (frame: number, viewWidth: number) => {
  const pose = penaltyAt(frame)
  const ball = penaltyBallAt(0, viewWidth)
  const x = viewWidth / 2 - 155 + 125 * pose.run
  const y = 400 - 12 * pose.run
  const scale = 1.05 - 0.16 * pose.run
  // Toe, not ankle, meets the ball. Keep the leg within its anatomical reach.
  const contactAngle = (-65 * Math.PI) / 180
  const toeX = 19 * Math.cos(contactAngle) - 8 * Math.sin(contactAngle)
  const toeY = 19 * Math.sin(contactAngle) + 8 * Math.cos(contactAngle)
  const impactX = (ball.x - ball.radius - x) / scale - toeX
  const impactY = (ball.y - y) / scale - toeY
  const rightX =
    (38 + pose.stride * 31 + pose.windup * 50) * (1 - pose.strike) +
    impactX * pose.strike -
    pose.follow * 45
  const rightY =
    (330 - Math.max(0, pose.stride) * 24 + pose.windup * 8) *
      (1 - pose.strike) +
    impactY * pose.strike -
    pose.follow * 42
  return {
    ...pose,
    x,
    y,
    scale,
    rightX,
    rightY,
    leftX: -26 - pose.stride * 25,
    leftY: 333 - Math.max(0, -pose.stride) * 20,
    bootAngle:
      25 * pose.windup * (1 - pose.strike) -
      65 * pose.strike +
      30 * pose.follow,
    lean: -4 * pose.windup + 7 * pose.strike - 4 * pose.follow,
  }
}

// Rear-view projection: depth foreshortens bones, rather than pushing knees sideways.
export const ronaldoLegAt = (
  pose: ReturnType<typeof ronaldoAt>,
  side: number,
) => {
  const hip = { x: side < 0 ? -21 : 23, y: side < 0 ? 203 : 204 }
  const ankle = {
    x: side < 0 ? pose.leftX : pose.rightX,
    y: side < 0 ? pose.leftY : pose.rightY,
  }
  const flex =
    side < 0
      ? Math.max(0, -pose.stride) * 4
      : pose.windup * (1 - pose.strike) * 10 + pose.follow * 5
  const knee = {
    x: hip.x + (ankle.x - hip.x) * 0.5 + flex * side,
    y: hip.y + (ankle.y - hip.y) * 0.5,
  }
  return { hip, knee, ankle }
}

// Two fixed bone lengths; the palm follows the forearm, never an independent wrist twist.
export const ronaldoArmAt = (
  pose: ReturnType<typeof penaltyAt>,
  side: number,
) => {
  const shoulder = { x: side * 35, y: 99 }
  const wrist = {
    x:
      side < 0
        ? -64 - 22 * pose.windup - 16 * pose.strike + 18 * pose.follow
        : 70 + 14 * pose.windup - 30 * pose.strike + 14 * pose.follow,
    y:
      side < 0
        ? 178 -
          22 * pose.stride -
          35 * pose.windup -
          12 * pose.strike +
          20 * pose.follow
        : 174 +
          22 * pose.stride -
          24 * pose.windup -
          15 * pose.strike +
          26 * pose.follow,
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

export const penaltyScreenBallAt = (
  frame: number,
  width: number,
  height: number,
) => {
  const layout = footballLayout(width, height)
  const ball = penaltyBallAt(frame, layout.viewWidth)
  return {
    x: layout.offsetX + ball.x * layout.scale,
    y: layout.offsetY + (ball.y + layout.skyHeight) * layout.scale,
    radius: ball.radius * layout.scale,
  }
}

export const pitchHandoffAt = (
  frame: number,
  width: number,
  height: number,
  screenWidth = width,
  stageLeft = 0,
) => {
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
  // Ball rim hits the viewport, then horizontal velocity reverses without a pause.
  const impact = 0.3
  const edge = screenWidth - stageLeft - start.radius - 1
  const approach = p / impact
  const rebound = clamp((p - impact) / (1 - impact))
  const x =
    p <= impact
      ? start.x + (edge - start.x) * approach ** 2 * (2 - approach)
      : edge + (landing.x - edge) * rebound * (2 - rebound)
  // Ease the on-screen fall independently; one shared camera pan moves both scenes.
  const fall = viewport.top + landing.y - start.y
  const y = start.y + fall * smooth(p)
  const impactAge = p - impact
  const morph = smooth((p - 0.42) / 0.45)
  return {
    progress: p,
    pan,
    x,
    y,
    worldY: y + pan,
    radius: start.radius * (1 - morph) + landing.radius * morph,
    morph,
    // Fixed contact point: burst stays on the wall while the ball rebounds away.
    knock: {
      x: screenWidth - stageLeft - 1,
      y: start.y + fall * smooth(impact),
      opacity: impactAge < 0 ? 0 : (1 - clamp(impactAge / 0.13)) ** 2,
      spread: clamp(impactAge / 0.13),
      squash: Math.max(0, 1 - Math.abs(impactAge) / 0.035),
    },
    pitchY: viewport.top + height * 1.05 - pan,
  }
}
