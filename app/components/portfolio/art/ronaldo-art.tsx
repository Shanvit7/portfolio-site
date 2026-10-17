import {
  ronaldoArmAt,
  type ronaldoAt,
  ronaldoLegAt,
} from '@/components/portfolio/timeline/rally-timeline'

type Point = { x: number; y: number }

const n = (value: number) => Math.round(value * 1000) / 1000
const normal = (a: Point, b: Point) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return { x: -(b.y - a.y) / d, y: (b.x - a.x) / d }
}
const edge = (p: Point, direction: Point, width: number) =>
  `${n(p.x + direction.x * width)} ${n(p.y + direction.y * width)}`

// Continuous tapered contours, matching Harden's painted anatomy rather than capsule joints.
const Leg = ({
  hip,
  knee,
  ankle,
  skin,
}: {
  hip: Point
  knee: Point
  ankle: Point
  skin: string
}) => {
  const u = normal(hip, knee),
    l = normal(knee, ankle)
  const m = { x: (u.x + l.x) / 2, y: (u.y + l.y) / 2 }
  const sock = {
    x: knee.x + (ankle.x - knee.x) * 0.18,
    y: knee.y + (ankle.y - knee.y) * 0.18,
  }
  const stripe = {
    x: knee.x + (ankle.x - knee.x) * 0.3,
    y: knee.y + (ankle.y - knee.y) * 0.3,
  }
  return (
    <g stroke="#292c38" strokeWidth="2.1" strokeLinejoin="round">
      <path
        d={`M${edge(hip, u, 17)}Q${edge(knee, u, 17)} ${edge(knee, m, 12)}L${edge(ankle, l, 9)}L${edge(ankle, l, -9)}L${edge(knee, m, -12)}Q${edge(knee, u, -17)} ${edge(hip, u, -17)}Z`}
        fill={skin}
      />
      <path
        d={`M${knee.x} ${knee.y}L${edge(ankle, l, -9)}L${edge(knee, m, -12)}L${edge(hip, u, -17)}Z`}
        fill="#895a45"
        stroke="none"
      />
      <path
        d={`M${edge(sock, l, 12)}L${edge(sock, l, -12)}L${edge(ankle, l, -9)}L${edge(ankle, l, 9)}Z`}
        fill="#26303f"
      />
      <path
        d={`M${edge(stripe, l, 11)}L${edge(stripe, l, -11)}M${edge({ x: stripe.x + l.y * 5, y: stripe.y - l.x * 5 }, l, 11)}L${edge({ x: stripe.x + l.y * 5, y: stripe.y - l.x * 5 }, l, -11)}`}
        stroke="#e3e3da"
        strokeWidth="2.4"
      />
    </g>
  )
}

const Boot = ({
  x,
  y,
  angle = 0,
  color = '#c8d444',
}: {
  x: number
  y: number
  angle?: number
  color?: string
}) => {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle})`}
      stroke="#292e36"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path
        d="M-10-5L-12-13L-7-21Q0-27 7-21L13-12L19 8Q17 16 4 17L-14 12Z"
        fill={color}
      />
      <path d="M-14 9L4 14L18 7M-5-14L6-12M-5-9L8-7M-4-4L9-1" fill="none" />
      <path
        d="M-7-18Q-2-24 0-24Q3-24 7-18"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <path d="M-9 14L-9 19M3 18V22M13 14L15 19" strokeWidth="3" />
    </g>
  )
}

const RonaldoArm = ({
  pose,
  side,
}: {
  pose: ReturnType<typeof ronaldoAt>
  side: number
}) => {
  const {
    shoulder: s,
    elbow: e,
    wrist: w,
    handAngle,
  } = ronaldoArmAt(pose, side)
  const u = normal(s, e),
    l = normal(e, w)
  const m = { x: (u.x + l.x) / 2, y: (u.y + l.y) / 2 }
  const cuff = { x: s.x + (e.x - s.x) * 0.43, y: s.y + (e.y - s.y) * 0.43 }
  const skin = side < 0 ? '#bf8564' : '#d09a74'
  return (
    <g
      data-ronaldo-arm={side < 0 ? 'left' : 'right'}
      stroke="#5d4237"
      strokeWidth="2"
    >
      <path
        d={`M${edge(s, u, 15)}Q${edge(e, u, 15)} ${edge(e, m, 11)}Q${edge(e, l, 12)} ${edge(w, l, 6)}L${edge(w, l, -6)}Q${edge(e, l, -11)} ${edge(e, m, -10)}Q${edge(e, u, -14)} ${edge(s, u, -15)}Z`}
        fill={skin}
      />
      <path
        d={`M${n(e.x)} ${n(e.y)}L${edge(w, l, -6)}Q${edge(e, l, -11)} ${edge(e, m, -10)}L${edge(s, u, -15)}Z`}
        fill="#91614b"
        stroke="none"
        opacity=".4"
      />
      <path
        d={`M${edge(s, u, 19)}L${edge(cuff, u, 17)}Q${n(cuff.x)} ${n(cuff.y + 3)} ${edge(cuff, u, -17)}L${edge(s, u, -19)}Z`}
        fill={side < 0 ? '#ba3931' : '#cf4439'}
        stroke="#642c2e"
      />
      <path
        d={`M${edge(cuff, u, 16)}L${edge(cuff, u, -16)}`}
        stroke="#e8e4d7"
        strokeWidth="3"
      />
      <g
        transform={`translate(${n(w.x)} ${n(w.y)}) rotate(${n(handAngle)}) scale(${side} 1)`}
      >
        <path
          d="M-6-4L6-4L8 7L6 19Q0 24-6 19L-8 10L-12 4L-10-1L-5 5Z"
          fill={skin}
        />
        <path
          d="M-4 13L-4 19M0 14V21M4 13L4 19M-5 5L-4 10"
          fill="none"
          strokeWidth="1.2"
        />
      </g>
    </g>
  )
}

export const RonaldoArt = ({
  pose,
}: {
  pose: ReturnType<typeof ronaldoAt>
}) => {
  const left = { x: pose.leftX, y: pose.leftY }
  const right = { x: pose.rightX, y: pose.rightY }
  return (
    <g
      data-football-player="ronaldo"
      data-ronaldo-visible="true"
      transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale})`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="0" cy="351" rx="73" ry="12" fill="#0a1726" opacity=".4" />
      <Leg {...ronaldoLegAt(pose, -1)} skin="#c38b68" />
      <Boot {...left} angle={-8 + pose.stride * 8} />
      <Leg {...ronaldoLegAt(pose, 1)} skin="#d19a76" />
      <Boot {...right} angle={pose.bootAngle} />
      <g transform={`rotate(${pose.lean} 0 200)`}>
        <RonaldoArm pose={pose} side={-1} />
        <RonaldoArm pose={pose} side={1} />
        <path
          d="M-41 182L40 182L48 223L13 232L0 214L-12 234L-47 222Z"
          fill="#efede3"
          stroke="#303441"
          strokeWidth="2.4"
        />
        <path
          d="M-40 189L-45 218M37 188L44 218M-9 217L-13 229"
          stroke="#c34136"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M-37 87L-15 77L16 77L39 87L45 118L36 159L40 192Q0 204-42 191L-36 150L-45 119Z"
          fill="#c33c32"
          stroke="#632c30"
          strokeWidth="2.6"
        />
        <path
          d="M-36 116L-26 165L-31 187L-41 188L-36 147ZM24 100L39 116L31 166L37 190L22 192L16 165Z"
          fill="#9e302d"
          stroke="none"
        />
        <path
          d="M-31 176L-9 184L25 179M-27 124L-13 130M21 134L31 128M-29 190L3 195L33 188"
          stroke="#f18365"
          opacity=".6"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M-14 73L-17 88Q0 105 18 87L15 73"
          fill="#e6e1d5"
          stroke="#633333"
          strokeWidth="2"
        />
        <path
          d="M-10 61L-11 83Q0 92 12 82L12 61Z"
          fill="#ba805f"
          stroke="#614337"
          strokeWidth="1.6"
        />
        <path
          d="M-23 25Q-13 5 8 9Q32 12 29 38L25 62L12 76L-8 73L-24 53Z"
          fill="#cd9773"
          stroke="#5b3e34"
          strokeWidth="2"
        />
        <path
          d="M-26 34L-28 20L-20 9L-13 11L-10 0L-2 5L4-2L11 4L19 0L24 9L30 12L31 31L28 47L19 61L6 66L-12 61L-22 56L-28 47Z"
          fill="#282b32"
          stroke="#252731"
          strokeWidth="2"
        />
        <path d="M-22 45Q0 56 24 42L19 61L6 66L-11 62L-21 55Z" fill="#51483f" />
        <path
          d="M-19 17L-5 12L17 14M-19 24L-7 19L22 20M-16 49L-15 54M-6 53L-5 59M6 54L6 61M17 51L16 57"
          fill="none"
          stroke="#68584d"
          strokeWidth="1.6"
        />
        <path
          d="M-23 43Q-31 39-29 49Q-27 58-21 54"
          fill="#d49d77"
          stroke="#6b4736"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="125"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="900"
          letterSpacing="1"
          fill="#f8eadb"
        >
          RONALDO
        </text>
        <text
          x="-2"
          y="177"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontStyle="italic"
          fontSize="55"
          fontWeight="900"
          fill="#f8eadb"
        >
          7
        </text>
      </g>
    </g>
  )
}

export const DefenderArt = ({
  keeper = false,
  skin = '#c49376',
}: {
  keeper?: boolean
  skin?: string
}) => {
  const kit = keeper ? '#d7ad51' : '#48669a'
  return (
    <g
      data-football-player={keeper ? 'keeper' : 'wall'}
      stroke="#29313d"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse
        cx="0"
        cy="352"
        rx="57"
        ry="9"
        fill="#0b1d28"
        opacity=".4"
        stroke="none"
      />
      <path
        d="M-33 204L-31 268L-30 334L-11 335L-4 269L8 211M10 208L17 268L20 335L39 333L38 261L35 204"
        fill={skin}
      />
      <path
        d="M-31 278L-10 280L-11 335L-30 334ZM18 280L39 278L39 333L20 335Z"
        fill={keeper ? '#324b3b' : '#e6e5dd'}
      />
      <path
        d="M-32 330L-11 329L-7 344L-12 354L-45 353L-44 344ZM20 330L39 329L49 346L45 353L17 352Z"
        fill={keeper ? '#e1cf79' : '#e69a62'}
      />
      <path
        d="M-41 184L39 185L43 225L9 234L0 214L-10 234L-45 224Z"
        fill={keeper ? '#334b3d' : '#263b5b'}
      />
      <path
        d="M-34 87L-11 78L11 78L37 90L45 124L34 166L40 195Q0 207-40 193L-34 154L-44 117Z"
        fill={kit}
      />
      <path
        d="M-25 108L-20 178L-34 190M21 107L28 184M-16 181L5 185"
        stroke="#d2e0dd"
        opacity=".35"
        fill="none"
      />
      <path d="M-11 67L-13 85Q0 100 14 83L12 66" fill={skin} />
      <path
        d="M-26 28Q-22 6 0 8Q26 8 28 30L23 61L9 77L-9 75L-24 58Z"
        fill={skin}
      />
      <path
        d="M-28 37L-29 19L-18 6L-5 3L2 8L13 2L26 15L29 31L17 27L9 21L-1 29L-20 25L-23 44Z"
        fill="#2c303b"
      />
      <path
        d="M-19 41L-7 38M6 38L19 40M-16 45L-8 44M9 44L16 45M-2 47L-5 56L3 56M-8 65L8 65"
        fill="none"
        stroke="#43352f"
        strokeWidth="2.5"
      />
      <path d="M-17 44L-8 43M8 43L16 44" stroke="#f0ede1" strokeWidth="2" />
      {keeper ? (
        <>
          <path
            d="M-35 94L-57 104L-81 89L-109 64L-120 79L-90 113L-57 131L-35 121M36 95L58 104L82 88L110 64L121 79L90 113L58 132L35 121"
            fill={kit}
          />
          <path
            d="M-113 70L-124 53L-136 56L-139 71L-125 87ZM113 70L124 53L136 56L139 71L125 87Z"
            fill="#eee4bd"
          />
        </>
      ) : (
        <>
          <path
            d="M-38 97L-51 111L-45 156L-12 191L1 179L-24 144L-21 115M36 98L50 115L43 157L15 192L0 180L23 144L20 116"
            fill={skin}
          />
          <path
            d="M-40 94L-51 106L-48 126L-21 119L-22 103ZM37 94L51 108L47 126L21 118L22 103Z"
            fill={kit}
          />
          <path d="M-13 180L0 176L14 182L13 193L-1 198L-15 192Z" fill={skin} />
        </>
      )}
    </g>
  )
}
