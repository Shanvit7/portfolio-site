import { useId } from 'react'
import { rallyArmsAt, rallyAt } from './rally-timeline'

type Point = { x: number; y: number }

const n = (x: number) => Math.round(x * 1000) / 1000
const normal = (a: Point, b: Point) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return { x: -(b.y - a.y) / d, y: (b.x - a.x) / d }
}
const edge = (p: Point, a: Point, width: number) =>
  `${n(p.x + a.x * width)} ${n(p.y + a.y * width)}`

function Paddle({ hit, robot = false }: { hit: number; robot?: boolean }) {
  return (
    <g transform={`rotate(${hit * 35} 177 226)`}>
      <path
        d="M174 231L193 195"
        fill="none"
        stroke="#936747"
        strokeWidth="11"
      />
      <ellipse
        data-rally-paddle="true"
        cx="204"
        cy="177"
        rx="27"
        ry="35"
        transform="rotate(24 204 177)"
        fill="#c53d30"
        stroke="#773127"
        strokeWidth="4"
      />
      <path
        d="M188 154Q210 143 221 172"
        fill="none"
        stroke="#f28367"
        strokeWidth="3"
      />
      <path
        d={
          robot
            ? 'M166 216Q180 204 187 217L185 234L172 237Z'
            : 'M167 219Q173 211 181 213L187 217L187 230Q182 238 174 237L168 232Z'
        }
        fill={robot ? '#b6c0c2' : '#e3b994'}
        stroke={robot ? '#39484e' : '#805c48'}
        strokeWidth="2"
      />
      {!robot && (
        <path
          d="M170 220Q178 225 184 220M171 226L183 229M175 233L182 232"
          fill="none"
          stroke="#a67458"
          strokeWidth="1.3"
        />
      )}
      {robot && (
        <path
          d="M172 217L175 233M178 214L181 231"
          fill="none"
          stroke="#53636c"
          strokeWidth="2"
        />
      )}
    </g>
  )
}

function BenderArt({
  x,
  hit,
  step,
  compact,
  angry,
}: {
  x: number
  hit: number
  step: number
  compact: boolean
  angry: boolean
}) {
  const scale = compact ? 0.98 : 1
  return (
    <g
      data-rally-character="bender"
      transform={`translate(${x} ${480 - 177 * scale + step}) scale(${-scale} ${scale})`}
      stroke="#39484e"
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <ellipse
        cx="70"
        cy="490"
        rx="108"
        ry="10"
        fill="#263555"
        opacity=".1"
        stroke="none"
      />
      <g fill="none" strokeLinecap="round">
        <path
          d="M43 295Q27 350 0 398L-30 463M108 297L129 370L171 452"
          stroke="#39484e"
          strokeWidth="32"
        />
        <path
          d="M43 295Q27 350 0 398L-30 463M108 297L129 370L171 452"
          stroke="#a9b6b9"
          strokeWidth="25"
        />
        <path
          d="M26 319L48 327M18 342L40 351M9 366L31 375M-4 390L17 400M-15 413L7 423M-26 436L-5 447M105 321L131 314M113 346L138 339M121 370L148 361M134 394L158 383M147 417L171 407M160 440L184 429"
          stroke="#65777e"
          strokeWidth="2.5"
        />
      </g>
      <path
        d="M-43 450L-17 461L-20 477Q-2 479 0 491Q-29 503-68 493L-72 484L-61 470ZM157 442L184 435L191 458L214 470Q231 478 221 488L184 482L153 468Z"
        fill="#9cabad"
      />
      <path
        d="M-66 485Q-36 495-6 489M163 465L213 480"
        fill="none"
        stroke="#d3d9d6"
        strokeWidth="4"
      />
      <path
        d="M24 246L123 246L130 288Q116 311 74 311Q31 309 15 289Z"
        fill="#82969d"
      />
      <path
        d="M21 272Q75 291 127 270"
        fill="none"
        stroke="#d3dcd9"
        strokeWidth="3"
      />
      <g fill="none" strokeLinecap="round">
        <path d="M18 133Q-17 152-7 188L43 215" strokeWidth="27" />
        <path
          d="M18 133Q-17 152-7 188L43 215"
          stroke="#aebbbe"
          strokeWidth="20"
        />
        <path
          d="M-8 143L12 153M-15 159L6 167M-14 178L6 181M0 190L9 176M15 199L24 185M29 208L37 193"
          stroke="#62767e"
          strokeWidth="2"
        />
      </g>
      <path d="M36 202Q48 193 55 205L57 223L47 234L33 224Z" fill="#b8c3c4" />
      <path d="M42 205L47 224M50 206L52 221" fill="none" strokeWidth="2" />
      <path
        d="M15 131Q15 107 72 104Q133 105 138 129L136 246Q128 270 72 270Q16 268 12 247Z"
        fill="#a7b4b8"
      />
      <path
        d="M15 135Q32 145 40 146L37 248Q24 249 14 240Z"
        fill="#81969e"
        stroke="none"
      />
      <path
        d="M17 129Q75 151 135 130M16 246Q75 269 135 246"
        fill="none"
        stroke="#d5dddb"
        strokeWidth="3"
      />
      <path d="M60 158L120 158L119 236L59 236Z" fill="#acb9bc" />
      <path
        d="M64 164L114 164M64 231L113 231"
        fill="none"
        stroke="#dce0d9"
        strokeWidth="2"
      />
      <circle cx="111" cy="197" r="4" fill="#657c85" />
      <path d="M74 96V112Q88 121 106 111V95" fill="#7d929a" />
      <path
        d="M57 28Q57 7 91 7Q127 8 130 29L131 103Q100 117 58 103Z"
        fill="#b4c0c1"
      />
      <path d="M58 31L69 35L71 102L58 100Z" fill="#859ba2" stroke="none" />
      <path
        d="M61 27Q91 15 127 29"
        fill="none"
        stroke="#e1e5da"
        strokeWidth="3"
      />
      <path d="M89 7V-13" fill="none" strokeWidth="6" />
      <circle cx="89" cy="-18" r="5" fill="#c0ccca" />
      <path
        d="M66 40Q99 31 136 41L148 51L142 71Q107 82 66 70Z"
        fill="#29383e"
      />
      <ellipse
        cx="90"
        cy={angry ? 61 : 55}
        rx="16"
        ry={angry ? 9 : 15}
        fill="#eee6b1"
        stroke="none"
      />
      <ellipse
        cx="123"
        cy={angry ? 61 : 56}
        rx="16"
        ry={angry ? 9 : 15}
        fill="#eee6b1"
        stroke="none"
      />
      <path
        d={
          angry
            ? 'M91 59H99V67H91ZM124 59H132V67H124Z'
            : 'M91 48H99V59H91ZM124 49H132V60H124Z'
        }
        fill="#263138"
        stroke="none"
      />
      {angry && (
        <path
          d="M74 40H106V57L74 51ZM107 40H139V51L107 57Z"
          fill="#29383e"
          stroke="none"
        />
      )}
      <path
        d={
          angry
            ? 'M68 81Q103 75 136 81V101Q103 108 68 102Z'
            : 'M73 82Q103 77 130 81V99Q103 105 73 99Z'
        }
        fill="#eee6bd"
      />
      <path
        d={
          angry
            ? 'M69 90H135M78 81V101M89 79V104M100 79V104M111 79V104M122 80V103M132 81V101'
            : 'M74 90H129M83 81V100M94 80V102M105 80V102M116 80V101M126 81V100'
        }
        fill="none"
        stroke="#6e7772"
        strokeWidth="1.7"
      />
      <g
        transform={`rotate(${-hit * 26} 101 144)`}
        fill="none"
        strokeLinecap="round"
      >
        <path
          d="M109 137Q126 153 135 183L175 224"
          stroke="#39484e"
          strokeWidth="27"
        />
        <path
          d="M109 137Q126 153 135 183L175 224"
          stroke="#afbdc0"
          strokeWidth="21"
        />
        <path
          d="M108 144L124 130M117 159L135 147M123 174L144 164M134 190L153 177M146 203L166 188M160 217L179 202"
          stroke="#637880"
          strokeWidth="2"
        />
        <Paddle hit={hit} robot />
      </g>
    </g>
  )
}

function AthleteArm({
  arm,
  color,
  free = false,
}: {
  arm: ReturnType<typeof rallyArmsAt>['free']
  color: string
  free?: boolean
}) {
  const { shoulder: s, elbow: e, wrist: w, handAngle } = arm
  const u = normal(s, e),
    l = normal(e, w),
    m = { x: (u.x + l.x) / 2, y: (u.y + l.y) / 2 }
  const cuff = { x: s.x + (e.x - s.x) * 0.35, y: s.y + (e.y - s.y) * 0.35 }
  return (
    <g
      data-athlete-arm={free ? 'free' : 'paddle'}
      stroke="#805c48"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path
        d={`M${edge(s, u, 21)}Q${edge(e, u, 22)} ${edge(e, m, 14)}Q${edge(e, l, 16)} ${edge(w, l, 7)}L${edge(w, l, -7)}Q${edge(e, l, -13)} ${edge(e, m, -13)}Q${edge(e, u, -21)} ${edge(s, u, -21)}Z`}
        fill="#e1b28e"
      />
      <path
        d={`M${n(s.x)} ${n(s.y)}Q${n(e.x)} ${n(e.y - 6)} ${n(w.x)} ${n(w.y)}L${edge(w, l, -7)}Q${edge(e, l, -13)} ${edge(e, m, -13)}L${edge(s, u, -21)}Z`}
        fill="#c49273"
        stroke="none"
      />
      <path
        d={`M${edge(s, u, 24)}L${edge(cuff, u, 23)}Q${n(cuff.x)} ${n(cuff.y + 3)} ${edge(cuff, u, -23)}L${edge(s, u, -24)}Z`}
        fill={color}
        stroke="#263e79"
        strokeWidth="2.5"
      />
      <path
        d={`M${edge(cuff, u, 21)}L${edge(cuff, u, -21)}`}
        stroke="#9aaee6"
        strokeWidth="2"
      />
      <path
        d={`M${edge(e, u, 6)}Q${n(e.x + 2)} ${n(e.y - 8)} ${edge(e, l, 8)}`}
        stroke="#b78263"
        strokeWidth="1.5"
        fill="none"
      />
      {free && (
        <g transform={`translate(${n(w.x)} ${n(w.y)}) rotate(${n(handAngle)})`}>
          <path
            d="M-7-4L6-4L9 8L5 22Q1 25-4 22L-8 13L-12 5L-10 0L-5 6Z"
            fill="#e3b994"
          />
          <path
            d="M-4 13L-2 21M0 14L1 22M4 12L5 19"
            fill="none"
            strokeWidth="1.2"
          />
        </g>
      )}
    </g>
  )
}

function RallyPlayerArt({
  frame,
  x,
  flip,
  hit,
  step,
  color,
  compact,
  angry = false,
}: {
  frame: number
  x: number
  flip: boolean
  hit: number
  step: number
  color: string
  compact: boolean
  angry?: boolean
}) {
  const scale = compact ? 0.98 : 1
  if (flip)
    return (
      <BenderArt x={x} hit={hit} step={step} compact={compact} angry={angry} />
    )
  const arms = rallyArmsAt(frame)
  return (
    <g
      data-rally-character="shanvit"
      transform={`translate(${x} ${480 - 177 * scale + step}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <ellipse cx="70" cy="490" rx="108" ry="10" fill="#263555" opacity=".1" />
      <path
        data-athlete-legs="closed-thighs"
        d="M26 282L75 284L76 318Q43 366 16 420Q4 438-14 477L-44 468L-40 456Q-15 412-16 394L-3 357Q2 321 26 282ZM83 280L113 282Q120 310 136 346L151 377Q155 403 183 442L184 455L156 464Q133 421 121 404L105 380L66 316Z"
        fill="#dbac88"
        stroke="#805a46"
        strokeWidth="3"
      />
      <path
        d="M-41 453L-17 464L-22 484L-54 480ZM154 439L180 434L187 461L164 465Z"
        fill="#f5f5f4"
        stroke="#5c6370"
        strokeWidth="2"
      />
      <path
        d="M-53 473L-20 480L-7 494Q-39 505-71 494L-69 484ZM162 456L187 451L204 470L225 480Q216 495 189 484L159 475Z"
        fill="#252c40"
        stroke="#141c30"
        strokeWidth="3"
      />
      <path
        d="M-61 489L-14 494M178 474L210 486"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
      />
      <path
        d="M-4 361Q-1 383-16 397M126 348Q137 363 144 383M-11 414L-26 447M150 410L170 444"
        stroke="#ba886a"
        strokeWidth="3"
        fill="none"
      />
      <AthleteArm arm={arms.free} color={color} free />
      <path
        data-athlete-shorts="plain-dark"
        d="M28 238L116 244L146 337L94 352L79 340Q71 333 63 340L49 352L5 337Z"
        fill="#232b42"
        stroke="#161d31"
        strokeWidth="3"
      />
      <path d="M72 269L71 332" fill="none" stroke="#161d31" strokeWidth="2" />
      <path
        d="M1 118Q21 97 62 98Q111 98 133 122L140 157L122 181L116 245Q77 258 28 244L27 180L-3 155Z"
        fill={color}
        stroke="#252d43"
        strokeWidth="3"
      />
      <path
        d="M26 123Q49 135 73 129M79 129L109 122M29 152Q49 165 71 155M83 155L112 147M36 194L44 235M108 192L105 238"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity=".35"
      />
      <path
        d="M62 103L83 117L98 104L90 81L68 77Z"
        fill="#d7a482"
        stroke="#805b47"
        strokeWidth="2"
      />
      <g
        data-avatar-reference="glasses-waves-beard"
        transform="translate(12 15) scale(.82)"
      >
        <path
          d="M54 29Q62 12 85 16Q110 18 115 39L116 54L123 63L117 69L116 83Q110 98 96 102Q77 103 65 79L56 57Z"
          fill="#e6ba96"
          stroke="#805d49"
          strokeWidth="2.5"
        />
        <path
          d="M49 63Q39 53 45 47Q51 43 56 53L59 69Q49 76 46 62"
          fill="#e5b893"
          stroke="#8b634e"
          strokeWidth="2"
        />
        <path
          d="M44 46Q33 22 51 9L57 12Q59-2 79 3L91-1Q111-3 118 10Q132 19 122 33L115 46Q101 41 88 31Q71 48 55 48L56 66L48 65Z"
          fill="#27282c"
          stroke="#262831"
          strokeWidth="2.5"
        />
        <path
          d="M48 28Q56 14 73 17Q90 19 107 10M51 38Q68 28 84 24M89 29Q105 31 117 21M57 18L62 11"
          fill="none"
          stroke="#52463d"
          strokeWidth="2"
        />
        <path
          d="M57 63L62 66L65 78Q73 88 86 89Q101 92 116 77L116 87Q110 101 95 104Q78 103 67 89L59 73Z"
          fill="#302b29"
        />
        <path
          d="M55 43Q73 38 88 43L88 61Q85 73 70 70Q56 68 55 52ZM95 44Q108 40 117 46L118 58Q115 68 103 66Q94 64 95 53Z"
          fill="#e0d6b1"
          fillOpacity=".13"
          stroke="#25282d"
          strokeWidth="2.5"
        />
        <path
          d="M88 48Q92 45 96 49M55 48L48 45"
          fill="none"
          stroke="#25282d"
          strokeWidth="3"
        />
        <path
          d="M68 55Q75 51 82 54M102 54L111 54M116 61L121 63L116 67"
          fill="none"
          stroke="#50372d"
          strokeWidth="2"
        />
        <circle cx="77" cy="55" r="2" fill="#303037" />
        <circle cx="108" cy="54" r="1.8" fill="#303037" />
        <path
          d="M59 47L66 45M98 47L102 46"
          stroke="#ede5cd"
          strokeWidth="1.6"
          opacity=".5"
        />
        <path
          d="M84 85Q96 90 108 84Q103 94 96 94Q89 92 84 88Z"
          fill="#a16e58"
        />
        <path d="M86 85Q96 90 106 85L104 88Q97 91 88 88Z" fill="#f5ead7" />
        <path d="M85 77Q97 74 110 79L108 82Q97 80 86 82Z" fill="#332d2b" />
        <path
          d="M66 86L70 93M75 97L79 101M88 103L92 106M109 95L105 101"
          fill="none"
          stroke="#6c5141"
          strokeWidth="1.3"
        />
      </g>
      <path
        d="M35 168Q58 177 78 168M86 168L107 159"
        fill="none"
        stroke="#213f98"
        strokeWidth="3"
      />
      <AthleteArm arm={arms.paddle} color={color} />
      <g transform={`rotate(${-hit * 26} 101 144)`}>
        <Paddle hit={hit} />
      </g>
      <path
        d="M47 196L83 205M45 207L79 216"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity=".25"
      />
    </g>
  )
}

// Full silhouettes, real wax mask, shared between the live scene and static reading mode.
export function RallyArt({
  pose = rallyAt(135),
  compact = false,
  showBall = true,
}: {
  pose?: ReturnType<typeof rallyAt>
  compact?: boolean
  showBall?: boolean
}) {
  const id = useId().replaceAll(':', '')
  const width = compact ? 900 : 1440
  const scale = compact ? 0.98 : 1
  const left = width * (compact ? 0.32 : 0.18) - 204 * scale
  const bx = (compact ? 0.5 + (pose.ballX - 0.5) * 0.5625 : pose.ballX) * width
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} 820`}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      data-rally-frame={Math.round(pose.frame)}
    >
      <defs>
        <mask id={`${id}-rally-wax`} style={{ maskType: 'luminance' }}>
          <image
            href="/new/wax-grain.png"
            width={width}
            height="820"
            preserveAspectRatio="none"
          />
        </mask>
        <pattern
          id={`${id}-mesh`}
          width="13"
          height="11"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0H13V11" fill="none" stroke="#e3e9f2" strokeWidth="1" />
        </pattern>
      </defs>
      <g
        mask={`url(#${id}-rally-wax)`}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g
          fontFamily="var(--font-crayon), sans-serif"
          fontSize="38"
          textAnchor="middle"
        >
          <text
            x={width * 0.18}
            y="240"
            fill="#2b4cc6"
            transform={`rotate(-5 ${width * 0.18} 240)`}
          >
            Me
          </text>
          <text
            x={width * 0.82}
            y="240"
            fill="#b83b31"
            transform={`rotate(4 ${width * 0.82} 240)`}
          >
            <tspan x={width * 0.82} dy="-12">
              Backend
            </tspan>
            <tspan x={width * 0.82} dy="38">
              & AI
            </tspan>
          </text>
        </g>
        <path
          d={`M25 777Q${width / 2} 760 ${width - 25} 778M100 790L${width - 100} 790`}
          fill="none"
          stroke="#2b4cc6"
          strokeWidth="2"
          opacity=".2"
        />
        <RallyPlayerArt
          frame={pose.frame}
          x={left}
          flip={false}
          hit={pose.leftHit}
          step={pose.leftStep}
          color="#2b4cc6"
          compact={compact}
        />
        <RallyPlayerArt
          frame={pose.frame}
          x={width - left}
          flip
          hit={pose.rightHit}
          step={pose.rightStep}
          color="#b83b31"
          compact={compact}
          angry={pose.angry}
        />
        <g fill="none" stroke="#333f5b" strokeWidth="13">
          <path
            d={`M${width * 0.28} 627L${width * 0.25} 758M${width * 0.72} 627L${width * 0.75} 758M${width * 0.4} 537L${width * 0.39} 702M${width * 0.6} 537L${width * 0.61} 702M${width * 0.27} 708L${width * 0.73} 708`}
          />
        </g>
        <path
          d={`M${width * 0.21} 520L${width * 0.79} 520L${width * 0.85} 640L${width * 0.15} 640Z`}
          fill="#305cb0"
          stroke="#233e76"
          strokeWidth="4"
        />
        <path
          d={`M${width * 0.15} 640L${width * 0.85} 640V654L${width * 0.15} 654Z`}
          fill="#203e79"
          stroke="#243750"
          strokeWidth="3"
        />
        <path
          d={`M${width * 0.216} 526L${width * 0.784} 526L${width * 0.838} 633L${width * 0.162} 633ZM${width * 0.18} 582L${width * 0.82} 582`}
          fill="none"
          stroke="#f4f5ed"
          strokeWidth="4"
        />
        <path
          d={`M${width * 0.47} 510L${width * 0.53} 658`}
          fill="none"
          stroke="#202e49"
          strokeWidth="6"
        />
        <path
          d={`M${width * 0.47} 454L${width * 0.53} 554L${width * 0.53} 642L${width * 0.47} 532Z`}
          fill="#30425d"
          stroke="#233550"
          strokeWidth="2"
        />
        <path
          d={`M${width * 0.47} 454L${width * 0.53} 554L${width * 0.53} 642L${width * 0.47} 532Z`}
          fill={`url(#${id}-mesh)`}
        />
        <path
          d={`M${width * 0.47} 454L${width * 0.53} 554`}
          fill="none"
          stroke="#f5f5f2"
          strokeWidth="5"
        />
        <g opacity=".16" fill="#162c55">
          <ellipse cx={bx} cy="582" rx="19" ry="4" />
        </g>
        <g fill="none" stroke="#c13c2d" strokeWidth="2" opacity={pose.bounce}>
          <ellipse cx={bx} cy="583" rx="23" ry="6" />
        </g>
        {showBall && (
          <g>
            <path
              d={`M${bx + (pose.fromRight ? 38 : -38)} ${pose.ballY - 6}L${bx + (pose.fromRight ? 15 : -15)} ${pose.ballY - 2}`}
              fill="none"
              stroke="#c13c2d"
              strokeWidth="2"
              opacity=".5"
            />
            <circle
              cx={bx}
              cy={pose.ballY}
              r="9"
              fill="#fffaf0"
              stroke="#af7441"
              strokeWidth="2"
            />
            <path
              d={`M${bx - 3} ${pose.ballY - 5}L${bx + 2} ${pose.ballY - 6}`}
              stroke="#fff"
              strokeWidth="3"
            />
          </g>
        )}
      </g>
    </svg>
  )
}
