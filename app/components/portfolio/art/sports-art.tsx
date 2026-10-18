import { memo, useId } from 'react'
import { CourtArt } from '@/components/portfolio/art/court-art'
import { RallyArt } from '@/components/portfolio/art/rally-art'
import { courtAt } from '@/components/portfolio/timeline/court-timeline'
import {
  HANDOFF_FRAMES,
  handoffAt,
  rallyAt,
} from '@/components/portfolio/timeline/rally-timeline'

export const SportsArt = memo(
  ({
    frame,
    width,
    height,
    screenWidth = width,
    showRallyBall = true,
  }: {
    frame: number
    width: number
    height: number
    screenWidth?: number
    showRallyBall?: boolean
  }) => {
    const id = useId().replaceAll(':', '')
    const {
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
    } = handoffAt(frame, width, height, screenWidth)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        data-sports-frame={Math.round(frame)}
        data-handoff-progress={h.toFixed(3)}
      >
        <defs>
          <mask id={`${id}-ball-wax`} style={{ maskType: 'alpha' }}>
            <image
              href="/portfolio/textures/wax-grain-alpha.png"
              width={width}
              height={height}
              preserveAspectRatio="none"
            />
          </mask>
        </defs>
        {h < 0.88 && (
          <svg
            aria-hidden="true"
            x="0"
            y={-pan}
            width={courtWidth}
            height={courtHeight}
          >
            <CourtArt
              pose={courtAt(Math.min(frame, 420 + h * 50))}
              showBall={frame <= 420}
            />
          </svg>
        )}
        {frame > 420 && (
          <svg
            aria-hidden="true"
            x="0"
            y={rallyTop + height * 1.25 * (1 - entrance)}
            width={width}
            height={rallyHeight}
          >
            <RallyArt
              compact={compact}
              pose={rallyAt(frame - 420 - HANDOFF_FRAMES)}
              showBall={h >= 1 && showRallyBall}
            />
          </svg>
        )}
        {frame > 420 && h < 1 && (
          <g mask={`url(#${id}-ball-wax)`}>
            <g transform={`translate(${x} ${y}) rotate(${frame * 1.8})`}>
              <circle
                r={radius}
                fill={`rgb(${223 + 32 * morph} ${116 + 134 * morph} ${41 + 199 * morph})`}
                stroke="#99653c"
                strokeWidth={Math.max(1, radius * 0.07)}
              />
              <g
                opacity={1 - morph}
                fill="none"
                stroke="#4e3028"
                strokeWidth={Math.max(1, radius * 0.07)}
              >
                <path
                  d={`M${-radius} 0H${radius}M0 ${-radius}V${radius}M${-radius * 0.7} ${-radius * 0.7}Q${radius * 0.3} 0 ${-radius * 0.7} ${radius * 0.7}`}
                />
              </g>
            </g>
          </g>
        )}
      </svg>
    )
  },
)
