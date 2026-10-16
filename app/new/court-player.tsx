'use client'

import { Player, type PlayerRef } from '@remotion/player'
import { useMotionValueEvent, useScroll } from 'motion/react'
import {
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { CourtArt } from './court-art'
import { COURT_FPS } from './court-timeline'
import { FootballArt } from './football-art'
import {
  footballViewport,
  PENALTY_START_FRAME,
  pitchHandoffAt,
  RALLY_END_FRAME,
  SPORTS_FRAMES,
  sportsFrameAt,
} from './rally-timeline'
import { SportsArt } from './sports-art'

function CourtComposition({
  screenWidth,
  stageLeft,
}: {
  screenWidth: number
  stageLeft: number
}) {
  const { width, height } = useVideoConfig()
  const frame = useCurrentFrame()
  const id = useId().replaceAll(':', '')
  if (frame <= RALLY_END_FRAME)
    return (
      <SportsArt
        frame={frame}
        width={width}
        height={height}
        screenWidth={screenWidth}
      />
    )
  const handoff = pitchHandoffAt(
    frame - RALLY_END_FRAME,
    width,
    height,
    screenWidth,
    stageLeft,
  )
  const { progress, pan, x, y, radius, morph, pitchY } = handoff
  return (
    <div
      data-sports-frame={frame}
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
            transform: `translate(${-width * 0.08 * progress}px, ${-pan}px)`,
          }}
        >
          <SportsArt
            frame={RALLY_END_FRAME}
            width={width}
            height={height}
            screenWidth={screenWidth}
            showRallyBall={false}
            missProgress={progress}
          />
        </div>
      )}
      <div
        data-football-bleed
        style={{
          position: 'absolute',
          left: -stageLeft,
          top: pitchY,
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
      {progress < 1 && (
        <svg
          aria-hidden="true"
          width={screenWidth}
          height={height}
          viewBox={`0 0 ${screenWidth} ${height}`}
          style={{ position: 'absolute', left: -stageLeft, top: 0 }}
        >
          <defs>
            <mask id={`${id}-pitch-wax`} style={{ maskType: 'luminance' }}>
              <image
                href="/new/wax-grain.png"
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
              d={`M${x - 22} ${y - 24}L${x - 8} ${y - 8}`}
              stroke="#b83b31"
              strokeWidth="2"
              fill="none"
              opacity={1 - morph}
            />
            <g transform={`translate(${x} ${y}) rotate(${frame * 2})`}>
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
        </svg>
      )}
    </div>
  )
}

export default function CourtPlayer({
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
}) {
  const player = useRef<PlayerRef>(null)
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
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  })

  const seek = useCallback((progress: number) => {
    const frame = sportsFrameAt(
      progress,
      bounds.current.bridge,
      bounds.current.rally,
      bounds.current.pitchBridge,
      bounds.current.penalty,
    )
    if (frame === lastFrame.current || !player.current) return
    player.current.seekTo(frame)
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
      setSize({
        width: Math.max(1, stage.clientWidth),
        height: Math.max(1, stage.clientHeight),
        screenWidth: document.documentElement.clientWidth / scale,
        stageLeft: stageRect.left / scale,
      })
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

  return (
    <Player
      ref={player}
      component={CourtComposition}
      inputProps={{ screenWidth: size.screenWidth, stageLeft: size.stageLeft }}
      overflowVisible
      compositionWidth={size.width}
      compositionHeight={size.height}
      durationInFrames={SPORTS_FRAMES}
      fps={COURT_FPS}
      controls={false}
      autoPlay={false}
      loop={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initiallyShowControls={false}
      showVolumeControls={false}
      numberOfSharedAudioTags={0}
      moveToBeginningWhenEnded={false}
      browserMediaControlsBehavior={{ mode: 'do-nothing' }}
      errorFallback={() => <CourtArt />}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
