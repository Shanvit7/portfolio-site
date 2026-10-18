import { type CSSProperties, memo, useId } from 'react'
import { DefenderArt, RonaldoArt } from '@/components/portfolio/art/ronaldo-art'
import {
  footballLayout,
  penaltyAt,
  penaltyBallAt,
  penaltyNetPointAt,
  ronaldoAt,
} from '@/components/portfolio/timeline/rally-timeline'
import styles from './football.module.css'

const Crowd = memo(
  ({
    width,
    span,
    row: onlyRow,
    cohort = 0,
  }: {
    width: number
    span: number
    row?: number
    cohort?: number
  }) => {
    const count = Math.min(144, Math.max(51, Math.ceil(span / 26)))
    const radius = span * 0.6
    const arc = (base: number, rise: number) =>
      Array.from({ length: 61 }, (_, i) => {
        const angle = (i / 60 - 0.5) * Math.PI
        return `${i ? 'L' : 'M'}${(width / 2 + Math.sin(angle) * radius).toFixed(3)} ${(base + rise * (1 - Math.cos(angle))).toFixed(3)}`
      }).join(' ')
    return (
      <g data-stadium-shape="oval-bowl" strokeLinecap="round">
        {(onlyRow === undefined ? [0, 1, 2] : [onlyRow]).map((row) => (
          <g key={row}>
            {onlyRow === undefined && (
              <path
                d={arc(103 + row * 38, 135 + row * 22)}
                fill="none"
                stroke="#6c788e"
                strokeWidth="3"
              />
            )}
            {Array.from(
              { length: onlyRow === undefined ? 0 : Math.ceil(count / 3) },
              (_, index) => {
                const i = index * 3 + cohort
                if (i >= count) return null
                const angle = ((i + 0.5) / count - 0.5) * Math.PI
                const x = Number(
                  (width / 2 + Math.sin(angle) * radius).toFixed(3),
                )
                const cheer =
                  Math.round(Math.sin(i * 1.9 + row * 0.8) * 1000) / 1000
                const y = Number(
                  (
                    84 +
                    row * 38 +
                    (135 + row * 22) * (1 - Math.cos(angle)) -
                    Math.max(0, cheer) * 4
                  ).toFixed(3),
                )
                const color = ['#c85248', '#d0c7ad', '#7590b1', '#9e3d3b'][
                  (i + row * 3) % 4
                ]
                return (
                  <g key={x} transform={`translate(${x} ${y})`}>
                    <path
                      d={`M-5 16L-6 2L-13 ${-5 - cheer * 6}M5 16L6 2L13 ${-5 + cheer * 6}`}
                      stroke={color}
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M-5 13L-4 0H4L6 13"
                      fill={color}
                      stroke={color}
                      strokeWidth="3"
                    />
                    <ellipse
                      cx="0"
                      cy="-6"
                      rx="4.2"
                      ry="5"
                      fill={i % 3 ? '#c3997c' : '#94765e'}
                    />
                    {i % 4 === 0 && (
                      <path
                        d={`M-13 ${-7 - cheer * 6}L13 ${-7 + cheer * 6}`}
                        stroke="#e3d9bb"
                        strokeWidth="3"
                      />
                    )}
                  </g>
                )
              },
            )}
          </g>
        ))}
        {onlyRow === undefined && (
          <>
            <path
              d={arc(205, 205)}
              fill="none"
              stroke="#e2d6b7"
              strokeWidth="6"
            />
            <path
              d={arc(218, 205)}
              fill="none"
              stroke="#b43c37"
              strokeWidth="17"
            />
            <text
              x={width / 2}
              y="223"
              textAnchor="middle"
              fontFamily="var(--font-handwriting), cursive"
              fontSize="17"
              letterSpacing="7"
              fill="#f4e2c5"
            >
              UNITED
            </text>
          </>
        )}
      </g>
    )
  },
)

// Nine small, cached layers cheer independently; no per-fan scroll mutations.
const LiveCrowd = memo(
  ({
    width,
    height,
    celebrating,
  }: {
    width: number
    height: number
    celebrating: boolean
  }) => {
    const id = useId().replaceAll(':', '')
    const { viewWidth, skyHeight, scale, offsetY } = footballLayout(
      width,
      height,
    )
    const span = width / scale
    const left = (viewWidth - span) / 2
    return (
      <div
        className={styles.crowd}
        data-stadium-crowd="true"
        data-celebrating={celebrating}
      >
        {Array.from({ length: 9 }, (_, index) => {
          const row = Math.floor(index / 3),
            cohort = index % 3
          const top = 60 + row * 38,
            band = 185 + row * 22
          return (
            <div
              key={`${row}-${cohort}`}
              className={styles.crowdGroup}
              style={
                {
                  top: offsetY + (top + skyHeight) * scale,
                  height: band * scale,
                  animationDelay: `${-index * 0.19}s`,
                  '--cheer-duration': `${0.85 + row * 0.11 + cohort * 0.17}s`,
                } as CSSProperties
              }
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`${left} ${top} ${span} ${band}`}
                aria-hidden="true"
              >
                <defs>
                  <mask
                    id={`${id}-fans-${index}`}
                    maskUnits="userSpaceOnUse"
                    x={left}
                    y={top}
                    width={span}
                    height={band}
                    style={{ maskType: 'alpha' }}
                  >
                    <image
                      href="/portfolio/textures/wax-grain-alpha.png"
                      x={left}
                      y="-820"
                      width={span}
                      height="2460"
                      preserveAspectRatio="none"
                    />
                  </mask>
                </defs>
                <g mask={`url(#${id}-fans-${index})`}>
                  <Crowd
                    width={viewWidth}
                    span={span}
                    row={row}
                    cohort={cohort}
                  />
                </g>
              </svg>
            </div>
          )
        })}
      </div>
    )
  },
)

const GOAL_STARS = [
  [
    [50, 4],
    [15, 4],
    [0, 20],
    [0, 55],
    [15, 70],
    [50, 70],
    [50, 38],
    [30, 38],
  ],
  [
    [82, 4],
    [67, 20],
    [67, 55],
    [82, 70],
    [111, 70],
    [126, 55],
    [126, 20],
    [111, 4],
  ],
  [
    [148, 70],
    [170, 4],
    [186, 4],
    [208, 70],
  ],
  [
    [157, 44],
    [199, 44],
  ],
  [
    [229, 4],
    [229, 70],
    [277, 70],
  ],
]

const StarSky = memo(
  ({
    center,
    span,
    reveal,
  }: {
    center: number
    span: number
    reveal: number
  }) => {
    const scale = 1.4
    const ox = center - (277 * scale) / 2,
      oy = -125
    const connection = Math.max(0, (reveal - 0.4) / 0.6)
    const lines = GOAL_STARS.map(
      (trail, index) =>
        trail
          .map(
            ([x, y], i) =>
              `${i ? 'L' : 'M'}${ox + x * scale} ${oy + y * scale}`,
          )
          .join(' ') + (index === 1 ? 'Z' : ''),
    )
    const nodes = GOAL_STARS.flat()
    return (
      <g data-goal-constellation="true" data-goal-reveal={reveal.toFixed(3)}>
        {Array.from({ length: 11 }, (_, i) => {
          const x =
            center - span * 0.47 + (((i * 151 + 83) % 997) / 997) * span * 0.94
          const y = -152 + ((i * 47) % 143)
          return (
            <path
              key={x}
              d={`M${x - 2} ${y}h4M${x} ${y - 2}v4`}
              fill="none"
              stroke="#c5d1dd"
              strokeWidth="1.1"
              opacity=".55"
            />
          )
        })}
        <g
          fill="none"
          stroke="#fff1b5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={connection}
        >
          {lines.map((d) => (
            <g key={d}>
              <path d={d} strokeWidth="9" opacity=".12" />
              <path
                d={d}
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - connection}
                strokeWidth="2.4"
              />
            </g>
          ))}
        </g>
        {nodes.map(([tx, ty], i) => {
          // Stars start scattered, never hinting at letters before the net is hit.
          const sx =
            center - span * 0.44 + (((i * 113 + 27) % 997) / 997) * span * 0.88
          const sy = -150 + ((i * 79 + 37) % 143)
          const x = sx * (1 - reveal) + (ox + tx * scale) * reveal
          const y = sy * (1 - reveal) + (oy + ty * scale) * reveal
          return (
            <g key={`${tx}-${ty}`}>
              <circle
                cx={x}
                cy={y}
                r={7 * reveal}
                fill="#fbe6a2"
                opacity={reveal * 0.12}
              />
              <circle
                cx={x}
                cy={y}
                r={1.2 + reveal * 1.5}
                fill="#fff4c8"
                opacity={0.4 + 0.6 * reveal}
              />
              {reveal > 0 && (
                <path
                  d={`M${x - 4 * reveal} ${y}h${8 * reveal}M${x} ${y - 4 * reveal}v${8 * reveal}`}
                  stroke="#fff4c8"
                  strokeWidth="1.2"
                  opacity={reveal}
                />
              )}
            </g>
          )
        })}
      </g>
    )
  },
)

const GoalNet = memo(
  ({
    left,
    goalWidth,
    width,
    net,
  }: {
    left: number
    goalWidth: number
    width: number
    net: number
  }) => {
    const path = (vertical: boolean, position: number) =>
      Array.from({ length: 33 }, (_, i) => {
        const point = penaltyNetPointAt(
          vertical ? position : left + 15 + ((goalWidth - 30) * i) / 32,
          vertical ? 218 + (196 * i) / 32 : position,
          width,
          net,
        )
        return `${i ? 'L' : 'M'}${point.x.toFixed(3)} ${point.y.toFixed(3)}`
      }).join(' ')
    return (
      <>
        {Array.from({ length: 29 }, (_, i) => {
          const x = left + 15 + (i * (goalWidth - 30)) / 28
          return <path key={x} d={path(true, x)} />
        })}
        {Array.from({ length: 13 }, (_, i) => {
          const y = 218 + (i * 196) / 12
          return <path key={y} d={path(false, y)} />
        })}
      </>
    )
  },
)

// A separate, composited SVG keeps player updates from repainting the stadium.
const FootballStadium = memo(
  ({ width, height }: { width: number; height: number }) => {
    const id = useId().replaceAll(':', '')
    const {
      viewWidth: w,
      viewHeight,
      skyHeight,
      scale,
    } = footballLayout(width, height)
    const c = w / 2
    const span = width / scale
    const goalWidth = Math.min(540, w * 0.77)
    const left = c - goalWidth / 2,
      right = c + goalWidth / 2
    return (
      <div
        data-football-stadium
        style={{ position: 'absolute', inset: 0, transform: 'translateZ(0)' }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 ${-skyHeight} ${w} ${viewHeight}`}
          aria-hidden="true"
        >
          <defs>
            <mask
              id={`${id}-stadium-wax`}
              maskUnits="userSpaceOnUse"
              x={c - span / 2}
              y={-skyHeight}
              width={span}
              height={viewHeight}
              style={{ maskType: 'alpha' }}
            >
              <image
                href="/portfolio/textures/wax-grain-alpha.png"
                x={c - span / 2}
                y="-820"
                width={span}
                height="2460"
                preserveAspectRatio="none"
              />
            </mask>
          </defs>
          <g
            mask={`url(#${id}-stadium-wax)`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse
              cx={c}
              cy="395"
              rx={span * 0.75}
              ry="340"
              fill="#27354b"
              stroke="#6d788c"
              strokeWidth="3"
            />
            <ellipse
              cx={c}
              cy="395"
              rx={span * 0.72}
              ry="308"
              fill="#354257"
              stroke="#637086"
              strokeWidth="3"
            />
            <ellipse
              cx={c}
              cy="395"
              rx={span * 0.69}
              ry="276"
              fill="#293a50"
              stroke="#66758a"
              strokeWidth="3"
            />
            <path
              d={`M${c - span * 1.2} 900Q${c} -360 ${c + span * 1.2} 900V1640H${c - span * 1.2}Z`}
              fill="#244b43"
            />
            <Crowd width={w} span={span} />
            {[0.05, 0.95].map((side) => (
              <g
                key={side}
                transform={`translate(${c + ((side - 0.5) * width) / scale} 0)`}
              >
                <path
                  d={`M0 69L${(0.5 - side) * w * 1.3} 520L${(0.5 - side) * w * 0.35} 520Z`}
                  fill="#f3e5b8"
                  opacity=".045"
                />
                <path
                  d="M-6 75L-13 238M6 75L13 238M-10 148L8 125L-9 104M-11 195L10 171L-10 148"
                  stroke="#83919c"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M-36 48L33 45L37 77L-35 80Z"
                  fill="#e8d9a2"
                  stroke="#e5d6b4"
                  strokeWidth="3"
                />
                <path
                  d="M-30 58L29 55M-30 70L30 67M-17 52L-15 74M0 50L2 73M18 50L20 72"
                  stroke="#fff6d5"
                  strokeWidth="5"
                />
                <path
                  d="M-45 42L-56 29M45 40L55 28M0 30L-1 16"
                  stroke="#e0c78b"
                  strokeWidth="2"
                  opacity=".7"
                />
              </g>
            ))}
            {Array.from({ length: 58 }, (_, i) => {
              const y = 272 + i * 11
              const x = ((i * 151) % (w + 180)) - 90
              return (
                <path
                  key={y}
                  d={`M${x} ${y}l${95 + ((i * 71) % 280)} ${-3 + (i % 5)}M${x + 22} ${y + 4}l${75 + (i % 140)} -2`}
                  fill="none"
                  stroke={i % 3 ? '#6a8958' : '#98a66d'}
                  strokeWidth={i % 3 ? 2 : 1.5}
                  opacity=".35"
                />
              )
            })}
            <g fill="none" stroke="#d5d8b9" strokeWidth="2.5" opacity=".7">
              <path
                d={`M${left - 80} 425L${left - 180} 690H${right + 180}L${right + 80} 425M${left - 18} 420L${left - 42} 495H${right + 42}L${right - 18} 420M-300 423H${w + 300}`}
              />
              <path d={`M${c - 175} 690Q${c} 812 ${c + 175} 690`} />
              <path d={`M${c + 3} 662L${c + 17} 662`} strokeWidth="4" />
            </g>
            <path
              d={`M${left} 205H${right}V425L${right - 17} 410V218H${left + 17}V410L${left} 425Z`}
              fill="#bdc5b1"
              opacity=".12"
            />
          </g>
        </svg>
      </div>
    )
  },
)

// Painted perspective, not a 3D renderer. Same real wax-grain mask as the court and rally.
export const FootballArt = memo(
  ({
    frame = 150,
    width = 1200,
    height = 820,
    showBall = true,
  }: {
    frame?: number
    width?: number
    height?: number
    showBall?: boolean
  }) => {
    const id = useId().replaceAll(':', '')
    const pose = penaltyAt(frame)
    const {
      viewWidth: w,
      viewHeight,
      skyHeight,
      scale,
    } = footballLayout(width, height)
    const c = w / 2
    const span = width / scale
    const goalWidth = Math.min(540, w * 0.77)
    const left = c - goalWidth / 2,
      right = c + goalWidth / 2
    const ball = penaltyBallAt(frame, w)
    const shooter = ronaldoAt(frame, w)
    return (
      <div
        data-football-frame={Math.round(frame)}
        data-football-view="behind-ronaldo"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          aspectRatio: `${width} / ${height}`,
          background: '#172336',
        }}
      >
        <FootballStadium width={width} height={height} />
        <LiveCrowd width={width} height={height} celebrating={frame >= 530} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 ${-skyHeight} ${w} ${viewHeight}`}
          aria-hidden="true"
          focusable="false"
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <mask
              id={`${id}-football-wax`}
              maskUnits="userSpaceOnUse"
              x={c - span / 2}
              y={-skyHeight}
              width={span}
              height={viewHeight}
              style={{ maskType: 'alpha' }}
            >
              <image
                href="/portfolio/textures/wax-grain-alpha.png"
                x={c - span / 2}
                y="-820"
                width={span}
                height="2460"
                preserveAspectRatio="none"
              />
            </mask>
            <clipPath id={`${id}-goal-net`}>
              <path d={`M${left + 15} 218H${right - 15}V414H${left + 15}Z`} />
            </clipPath>
          </defs>
          <g
            mask={`url(#${id}-football-wax)`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <StarSky center={c} span={span} reveal={pose.goalReveal} />
            <g
              clipPath={`url(#${id}-goal-net)`}
              fill="none"
              stroke="#a5b5a0"
              strokeWidth="1.4"
              opacity=".65"
            >
              <GoalNet
                left={left}
                goalWidth={goalWidth}
                width={w}
                net={pose.net}
              />
            </g>
            {showBall && pose.netImpact.opacity > 0 && (
              <g
                data-net-impact={pose.netImpact.opacity.toFixed(3)}
                clipPath={`url(#${id}-goal-net)`}
                fill="none"
                stroke="#fff1b5"
                strokeWidth="2"
                opacity={pose.netImpact.opacity}
              >
                <g
                  transform={`translate(${c + goalWidth * 0.36} 310) scale(${1 + pose.netImpact.spread * 2.5})`}
                >
                  <ellipse rx="16" ry="12" strokeWidth="1.5" />
                  <path d="M-24 -10l-9 -5M-10 -22l-4 -9M14 -20l6 -8M25 0h11M18 18l7 7M-4 24l-2 9M-24 12l-9 6" />
                </g>
              </g>
            )}
            <path
              d={`M${left} 425V205H${right}V425M${left} 205L${left + 17} 218M${right} 205L${right - 17} 218M${left} 425L${left + 17} 410M${right} 425L${right - 17} 410`}
              fill="none"
              stroke="#111e2c"
              strokeWidth="11"
            />
            <path
              d={`M${left} 425V205H${right}V425M${left} 205L${left + 17} 218M${right} 205L${right - 17} 218`}
              fill="none"
              stroke="#e6e3cf"
              strokeWidth="6"
            />
            <g
              transform={`translate(${c + 8 - pose.keeperDive * 170} ${263 - 30 * Math.sin(pose.keeperDive * Math.PI)}) rotate(${-pose.keeperDive * 62} 0 100) scale(.45)`}
            >
              <DefenderArt keeper />
            </g>
            {[-1, 0, 1].map((side, i) => (
              <g
                key={side}
                transform={`translate(${c + side * 65} ${303 - pose.wallJump}) scale(.55)`}
              >
                <DefenderArt skin={['#b77d5c', '#d4a07a', '#946649'][i]} />
              </g>
            ))}
            <RonaldoArt pose={shooter} />
            {showBall && (
              <g data-football-ball="true">
                <ellipse
                  cx={ball.x}
                  cy={655 - pose.flight * 240}
                  rx={ball.radius * 1.2}
                  ry={ball.radius * 0.22}
                  fill="#0c202b"
                  opacity={0.3 * (1 - pose.flight)}
                />
                {pose.flight > 0 && pose.flight < 1 && (
                  <path
                    d={`M${ball.x - 8} ${ball.y + 40}l-2 30M${ball.x + 9} ${ball.y + 38}l4 20`}
                    stroke="#e6d9b7"
                    strokeWidth="2"
                    fill="none"
                    opacity=".5"
                  />
                )}
                <g
                  data-net-ball-squash={pose.netImpact.squash.toFixed(3)}
                  transform={`translate(${ball.x} ${ball.y}) scale(${1 + pose.netImpact.squash * 0.28} ${1 - pose.netImpact.squash * 0.3})`}
                >
                  <g transform={`rotate(${pose.flight * 560})`}>
                    <circle
                      r={ball.radius}
                      fill="#efead9"
                      stroke="#273747"
                      strokeWidth="2"
                    />
                    <g fill="#283646" stroke="#283646" strokeWidth="1.4">
                      <path
                        d={`M0 ${-ball.radius * 0.45}L${ball.radius * 0.44} ${-ball.radius * 0.13}L${ball.radius * 0.27} ${ball.radius * 0.37}H${-ball.radius * 0.27}L${-ball.radius * 0.44} ${-ball.radius * 0.13}Z`}
                      />
                      <path
                        d={`M${-ball.radius} 0L${-ball.radius * 0.7} ${ball.radius * 0.32}L${-ball.radius * 0.6} ${-ball.radius * 0.25}ZM${ball.radius * 0.6} ${ball.radius * 0.15}L${ball.radius * 0.85} ${ball.radius * 0.4}L${ball.radius * 0.9} ${-ball.radius * 0.3}Z`}
                      />
                    </g>
                  </g>
                </g>
              </g>
            )}
            <text
              x="20"
              y="798"
              fill="#e4d9b9"
              fontFamily="var(--font-handwriting), cursive"
              fontSize="23"
            >
              {pose.phase}
            </text>
          </g>
        </svg>
      </div>
    )
  },
)
