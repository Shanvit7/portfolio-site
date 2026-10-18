'use client'

import { useMotionValueEvent } from 'motion/react'
import {
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { FootballArt } from '@/components/portfolio/art/football-art'
import { SportsArt } from '@/components/portfolio/art/sports-art'
import { useScrollProgress } from '@/components/portfolio/stories/use-scroll-progress'
import {
  footballViewport,
  PENALTY_START_FRAME,
  pitchHandoffAt,
  RALLY_END_FRAME,
  sportsFrameAt,
} from '@/components/portfolio/timeline/rally-timeline'

const CourtComposition = ({
  frame,
  width,
  height,
  screenWidth,
  stageLeft,
}: {
  frame: number
  width: number
  height: number
  screenWidth: number
  stageLeft: number
}) => {
  const id = useId().replaceAll(':', '')
  const handoff = pitchHandoffAt(
    frame - RALLY_END_FRAME,
    width,
    height,
    screenWidth,
    stageLeft,
  )
  const { progress, pan, x, y, radius, morph, pitchY, knock } = handoff
  const trail = pitchHandoffAt(
    frame - RALLY_END_FRAME - 5,
    width,
    height,
    screenWidth,
    stageLeft,
  )
  return (
    <div
      data-sports-frame={frame > RALLY_END_FRAME ? frame : undefined}
      data-pitch-handoff={progress.toFixed(3)}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'visible',
        clipPath: `inset(0 ${width + stageLeft - screenWidth}px 0 ${-stageLeft}px)`,
      }}
    >
      {progress < 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(${-width * 0.08 * progress}px, ${-pan}px, 0)`,
          }}
        >
          <SportsArt
            frame={Math.min(frame, RALLY_END_FRAME)}
            width={width}
            height={height}
            screenWidth={screenWidth}
            showRallyBall={frame <= RALLY_END_FRAME}
            missProgress={progress}
          />
        </div>
      )}
      {/* Mount offscreen early: the final rally must not also construct a stadium. */}
      <div
        data-football-bleed
        style={{
          position: 'absolute',
          left: -stageLeft,
          top: 0,
          transform: `translate3d(0, ${pitchY}px, 0)`,
          width: screenWidth,
          height: footballViewport(height).height,
        }}
      >
        <FootballArt
          frame={Math.max(0, frame - PENALTY_START_FRAME)}
          width={screenWidth}
          height={footballViewport(height).height}
          showBall={progress >= 1}
        />
      </div>
      {frame > RALLY_END_FRAME && progress < 1 && (
        <svg
          aria-hidden="true"
          width={screenWidth}
          height={height}
          viewBox={`0 0 ${screenWidth} ${height}`}
          style={{ position: 'absolute', left: -stageLeft, top: 0 }}
        >
          <defs>
            <mask id={`${id}-pitch-wax`} style={{ maskType: 'alpha' }}>
              <image
                href="/portfolio/textures/wax-grain-alpha.png"
                width={screenWidth}
                height={height}
                preserveAspectRatio="none"
              />
            </mask>
          </defs>
          <g
            mask={`url(#${id}-pitch-wax)`}
            transform={`translate(${stageLeft} 0)`}
          >
            <path
              d={`M${trail.x} ${trail.y}L${x} ${y}`}
              stroke="#b83b31"
              strokeWidth="2"
              fill="none"
              opacity={1 - morph}
            />
            {knock.opacity > 0 && (
              <g
                data-edge-knock={knock.opacity.toFixed(3)}
                transform={`translate(${knock.x} ${knock.y})`}
                opacity={knock.opacity}
                fill="none"
                stroke="#b83b31"
                strokeLinecap="round"
              >
                <path d="M-1 -24V24" strokeWidth="4" />
                <g
                  transform={`scale(${(0.75 + knock.spread * 0.8) * (screenWidth <= 700 ? 0.8 : 1)})`}
                >
                  <path
                    d="M-12 -28L-20 -46M-20 -14L-38 -26M-24 0H-52M-20 14L-38 26M-12 28L-20 46"
                    strokeWidth="3"
                  />
                  <ellipse
                    rx={12 + knock.spread * 20}
                    ry={18 + knock.spread * 26}
                    stroke="#394453"
                    strokeWidth="1.5"
                    opacity="0.65"
                  />
                </g>
              </g>
            )}
            <g
              data-handoff-ball
              transform={`translate(${x + radius * knock.squash * 0.38} ${y}) scale(${1 - knock.squash * 0.38} ${1 + knock.squash * 0.3})`}
            >
              <g transform={`rotate(${frame * 2})`}>
                <circle
                  r={radius}
                  fill="#f5f0df"
                  stroke="#394453"
                  strokeWidth={1 + morph}
                />
                <g fill="#293341" opacity={morph}>
                  <path
                    d={`M0 ${-radius * 0.45}L${radius * 0.44} ${-radius * 0.13}L${radius * 0.27} ${radius * 0.37}H${-radius * 0.27}L${-radius * 0.44} ${-radius * 0.13}Z`}
                  />
                  <path
                    d={`M${-radius} 0L${-radius * 0.7} ${radius * 0.32}L${-radius * 0.6} ${-radius * 0.25}ZM${radius * 0.6} ${radius * 0.15}L${radius * 0.85} ${radius * 0.4}L${radius * 0.9} ${-radius * 0.3}Z`}
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      )}
    </div>
  )
}

const CourtPlayer = ({
  target,
  bridge,
  rally,
  pitchBridge,
  penalty,
}: {
  target: RefObject<HTMLDivElement | null>
  bridge: RefObject<HTMLDivElement | null>
  rally: RefObject<HTMLElement | null>
  pitchBridge: RefObject<HTMLDivElement | null>
  penalty: RefObject<HTMLElement | null>
}) => {
  const [frame, setFrame] = useState(0)
  const lastFrame = useRef(-1)
  const bounds = useRef({
    bridge: 0.25,
    rally: 0.42,
    pitchBridge: 0.62,
    penalty: 0.78,
  })
  const [size, setSize] = useState({
    width: 1440,
    height: 900,
    screenWidth: 1440,
    stageLeft: 0,
  })
  const scrollYProgress = useScrollProgress(target, 0, 1)

  const seek = useCallback((progress: number) => {
    const frame = sportsFrameAt(
      progress,
      bounds.current.bridge,
      bounds.current.rally,
      bounds.current.pitchBridge,
      bounds.current.penalty,
    )
    if (frame === lastFrame.current) return
    setFrame(frame)
    lastFrame.current = frame
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', seek)
  useEffect(() => {
    const track = target.current
    const handoff = bridge.current
    const nextChapter = rally.current
    const nextHandoff = pitchBridge.current
    const finalChapter = penalty.current
    const stage = track?.querySelector<HTMLElement>('[data-sports-stage]')
    if (
      !track ||
      !handoff ||
      !nextChapter ||
      !nextHandoff ||
      !finalChapter ||
      !stage
    )
      return
    const measure = () => {
      const rect = track.getBoundingClientRect()
      const distance = Math.max(1, rect.height - stage.clientHeight)
      bounds.current = {
        bridge: (handoff.getBoundingClientRect().top - rect.top) / distance,
        rally: (nextChapter.getBoundingClientRect().top - rect.top) / distance,
        pitchBridge:
          (nextHandoff.getBoundingClientRect().top - rect.top) / distance,
        penalty:
          (finalChapter.getBoundingClientRect().top - rect.top) / distance,
      }
      const stageRect = stage.getBoundingClientRect()
      const scale = stageRect.width / stage.clientWidth
      const next = {
        width: Math.max(1, stage.clientWidth),
        height: Math.max(1, stage.clientHeight),
        screenWidth: document.documentElement.clientWidth / scale,
        stageLeft: stageRect.left / scale,
      }
      setSize((current) =>
        current.width === next.width &&
        current.height === next.height &&
        current.screenWidth === next.screenWidth &&
        current.stageLeft === next.stageLeft
          ? current
          : next,
      )
      lastFrame.current = -1
      seek(scrollYProgress.get())
    }
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(stage)
    observer.observe(nextChapter)
    observer.observe(finalChapter)
    measure()
    return () => observer.disconnect()
  }, [target, bridge, rally, pitchBridge, penalty, scrollYProgress, seek])

  return <CourtComposition frame={frame} {...size} />
}

export default CourtPlayer
