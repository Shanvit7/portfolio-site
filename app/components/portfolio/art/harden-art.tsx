import type { courtAt } from '@/components/portfolio/timeline/court-timeline'

type Pose = ReturnType<typeof courtAt>
type Point = { x: number; y: number }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const normal = (a: Point, b: Point): Point => {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  return { x: -(b.y - a.y) / length, y: (b.x - a.x) / length }
}
const offset = (p: Point, n: Point, width: number) =>
  `${p.x + n.x * width} ${p.y + n.y * width}`

const NEAR_SHOULDER: Point = { x: 182, y: 171 }
const FAR_SHOULDER: Point = { x: 91, y: 167 }

// One continuous anatomical contour, not separate rotating stick/capsule parts.
const Limb = ({
  start,
  joint,
  end,
  widths,
  fill,
  shade,
}: {
  start: Point
  joint: Point
  end: Point
  widths: [number, number, number]
  fill: string
  shade: string
}) => {
  const u = normal(start, joint)
  const l = normal(joint, end)
  const m = { x: (u.x + l.x) / 2, y: (u.y + l.y) / 2 }
  const [shoulder, elbow, wrist] = widths
  const contour = `M${offset(start, u, shoulder)}Q${offset(joint, u, shoulder)} ${offset(joint, m, elbow)}Q${offset(joint, l, elbow + 3)} ${offset(end, l, wrist)}L${offset(end, l, -wrist)}Q${offset(joint, l, -elbow - 2)} ${offset(joint, m, -elbow)}Q${offset(joint, u, -shoulder)} ${offset(start, u, -shoulder)}Q${start.x - (joint.x - start.x) * 0.12} ${start.y - (joint.y - start.y) * 0.12} ${offset(start, u, shoulder)}Z`
  return (
    <g stroke="#2b2c32" strokeWidth="1.8" strokeLinejoin="round">
      <path d={contour} fill={fill} />
      <path
        d={`M${start.x} ${start.y}Q${joint.x} ${joint.y} ${end.x} ${end.y}L${offset(end, l, -wrist)}Q${offset(joint, l, -elbow - 2)} ${offset(joint, m, -elbow)}Q${offset(joint, u, -shoulder)} ${offset(start, u, -shoulder)}Z`}
        fill={shade}
        stroke="none"
      />
    </g>
  )
}

const elbow = (start: Point, end: Point, side: number): Point => {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const distance = Math.hypot(dx, dy)
  const along = (95 ** 2 - 105 ** 2 + distance ** 2) / (2 * distance)
  const bend = Math.sqrt(Math.max(0, 95 ** 2 - along ** 2)) * side
  return {
    x: start.x + (dx * along + dy * bend) / distance,
    y: start.y + (dy * along - dx * bend) / distance,
  }
}

const Foot = ({ x, y, angle }: { x: number; y: number; angle: number }) => {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke="#30323a"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <g transform={`rotate(${angle})`}>
        <path d="M-12-60L12-60L11 0L-10 1Z" fill="#f0f0eb" />
        <path d="M3-58L12-58L11 0L4 0Z" fill="#c8cbd0" stroke="none" />
        <path d="M-11-53L11-53M-11-49L11-49" stroke="#a8acb6" strokeWidth="1" />
      </g>
      <path
        d="M-17-9L7-9L18 1L42 9Q51 15 44 19L-25 17Q-29 7-23-1Z"
        fill="#e9e9e4"
      />
      <path
        d="M-19-3L-5-6L9-2L19 8L35 11L25 13L5 7L-18 10Z"
        fill="#c96a36"
        stroke="none"
      />
      <path
        d="M-26 16L44 18M-4-1L9 3M-9 3L6 7M-13 7L2 11"
        fill="none"
        strokeWidth="1.7"
      />
    </g>
  )
}

export const HardenArt = ({ pose, id }: { pose: Pose; id: string }) => {
  const g = pose.gather
  const nearShoulder = NEAR_SHOULDER
  const farShoulder = FAR_SHOULDER
  const ball = { x: mix(260, 160, g), y: mix(327, -10, g) }
  const nearHand = { x: ball.x - 15 * g, y: ball.y - 27 + 47 * g }
  const farHand = {
    x: mix(-4, ball.x + 17, g),
    y: mix(270 + pose.stride * 16, ball.y + 10, g),
  }
  const nearElbow = elbow(nearShoulder, nearHand, -1)
  const farElbow = elbow(farShoulder, farHand, 1)
  const nearAnkle = { x: pose.nearAnkleX, y: pose.nearAnkleY }
  const farAnkle = { x: pose.farAnkleX, y: pose.farAnkleY }

  return (
    <g
      id={`${id}-harden`}
      transform={`translate(${pose.x} ${pose.y})`}
      opacity={pose.arrival}
    >
      <Limb
        start={{ x: 107, y: 300 }}
        joint={{ x: pose.farKneeX, y: pose.farKneeY }}
        end={farAnkle}
        widths={[24, 16, 10]}
        fill="#95614a"
        shade="#684638"
      />
      <Foot
        x={farAnkle.x}
        y={farAnkle.y}
        angle={
          (Math.atan2(farAnkle.y - pose.farKneeY, farAnkle.x - pose.farKneeX) *
            180) /
            Math.PI -
          90
        }
      />
      <Limb
        start={{ x: 145, y: 302 }}
        joint={{ x: pose.nearKneeX, y: pose.nearKneeY }}
        end={nearAnkle}
        widths={[26, 17, 10]}
        fill="#ae7858"
        shade="#855540"
      />
      <Foot
        x={nearAnkle.x}
        y={nearAnkle.y}
        angle={
          (Math.atan2(
            nearAnkle.y - pose.nearKneeY,
            nearAnkle.x - pose.nearKneeX,
          ) *
            180) /
            Math.PI -
          90
        }
      />

      <g transform={`rotate(${pose.lean} 130 300)`}>
        {/* Right arm is the guide; left shooting arm drives the ball overhead. */}
        <Limb
          start={farShoulder}
          joint={farElbow}
          end={farHand}
          widths={[20, 13, 7]}
          fill="#e5e8e8"
          shade="#a9b5c3"
        />
        <g
          transform={`translate(${farHand.x} ${farHand.y}) rotate(${mix(20, -25, g)})`}
          fill="#9e6b51"
          stroke="#3e302c"
          strokeWidth="1.3"
        >
          <path d="M-8-5L5-7L10-18L14-19L14-9L18-17L21-16L18-3L10 7L-4 10Z" />
          <path d="M6-7L11-2M13-10L15-5" fill="none" />
        </g>

        {/* Back-facing Nets jersey: shoulder blades, long back and fabric folds. */}
        <path
          d="M89 149L117 139L145 140L176 145L193 161Q191 194 181 219L178 283Q136 303 77 284L80 226Q66 190 75 163Z"
          fill="#252b36"
          stroke="#252932"
          strokeWidth="2.3"
        />
        <path
          d="M93 149Q126 179 169 147M79 160Q69 191 86 213M180 151Q170 175 185 202"
          fill="none"
          stroke="#efeee7"
          strokeWidth="3.5"
        />
        <path
          d="M82 222L100 233L92 265L107 286L80 281ZM166 203L179 217L168 274L153 285L151 255Z"
          fill="#121c2b"
        />
        <path
          d="M95 246L114 265L139 271L164 258M89 273L123 283L165 275M104 181L116 187M160 183L171 179"
          fill="none"
          stroke="#59616f"
          strokeWidth="1.5"
        />
        <path
          d="M80 226L78 276M179 222L173 277"
          stroke="#c6cbd4"
          strokeWidth="2"
        />
        <text
          x="133"
          y="211"
          fill="#f1f0e9"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="15"
          letterSpacing=".7"
          textAnchor="middle"
          transform="rotate(-4 133 211)"
        >
          HARDEN
        </text>
        <text
          x="132"
          y="265"
          fill="#f1f0e9"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="52"
          fontStyle="italic"
          textAnchor="middle"
          transform="rotate(-3 132 265)"
        >
          13
        </text>
        <path d="M126 180L130 180L130 188L126 188Z" fill="#e8e7e2" />

        {/* Rear three-quarter head, matching the supplied silhouette reference. */}
        <g transform={`rotate(${-g * 9} 156 121)`}>
          <path
            d="M140 116L136 142Q150 153 166 143L173 123Z"
            fill="#9f6b4e"
            stroke="#3e312b"
            strokeWidth="1.5"
          />
          <path d="M144 120L158 123L158 141L148 145L139 138Z" fill="#79513d" />
          <path
            d="M137 91Q134 71 154 68Q178 64 187 83L188 101L196 111L189 116L183 133L163 135L146 124Z"
            fill="#ae7855"
            stroke="#352e2b"
            strokeWidth="1.6"
          />
          <path
            d="M169 80L182 84L181 99L191 109L183 113L176 129L166 123Z"
            fill="#c18b62"
          />
          <path
            d="M137 105Q122 91 128 79L132 69L141 63L155 62L163 65L172 64L183 73L187 85L180 96L167 101L161 118L149 130L139 122Z"
            fill="#24282d"
            stroke="#272a30"
            strokeWidth="1.7"
          />
          <path
            d="M134 80Q147 64 171 72M132 87Q151 71 179 80M136 94Q152 80 171 83"
            fill="none"
            stroke="#4d4b4b"
            strokeWidth="1.6"
          />
          <path
            d="M136 92L151 82L171 80L183 85L182 91L165 88L148 91L139 100Z"
            fill="#192330"
          />
          <path
            d="M160 103Q173 94 174 108Q170 120 159 116Z"
            fill="#b17a59"
            stroke="#3e302b"
            strokeWidth="1.3"
          />
          <path
            d="M163 107L168 104L168 112L164 113"
            fill="none"
            stroke="#76503c"
            strokeWidth="1.2"
          />
          <path
            d="M182 103L190 104M187 107L189 110"
            stroke="#433229"
            strokeWidth="1.4"
          />
          <path
            d="M178 115L189 115L193 125L189 138L181 145L170 140L170 128Z"
            fill="#282b30"
          />
          <path
            d="M181 124L187 123M176 132L180 140M184 131L183 139"
            stroke="#4b4746"
            strokeWidth="1"
          />
        </g>

        <Limb
          start={nearShoulder}
          joint={nearElbow}
          end={nearHand}
          widths={[22, 13, 7]}
          fill="#b47d59"
          shade="#82533e"
        />
        <path
          d={`M${nearShoulder.x + 5} ${nearShoulder.y + 12}Q${nearElbow.x + 6} ${nearElbow.y - 12} ${nearElbow.x + 2} ${nearElbow.y + 1}`}
          fill="none"
          stroke="#d4a17a"
          strokeWidth="2"
        />
        <path
          d={`M${nearShoulder.x + 1} ${nearShoulder.y + 15}Q${nearElbow.x - 8} ${nearElbow.y - 15} ${nearElbow.x - 3} ${nearElbow.y - 1}`}
          fill="none"
          stroke="#655043"
          strokeWidth="3"
          opacity=".45"
        />
        <g
          transform={`translate(${nearHand.x} ${nearHand.y}) rotate(${mix(5, -22, g)})`}
          fill="#bb8460"
          stroke="#44312a"
          strokeWidth="1.3"
        >
          <path d="M-7 5L-8-6L-6-18L-2-20L0-9L3-22L7-22L7-9L11-20L15-19L12-5L17-12L21-10L17 2L9 10L0 13Z" />
          <path
            d="M1-6L2 3M7-7L7 2M12-5L11 3"
            fill="none"
            stroke="#80513d"
            strokeWidth="1"
          />
          <path d="M-7 6L7 11" stroke="#b13c30" strokeWidth="4" />
        </g>
      </g>

      <path
        d="M78 276Q127 294 178 278L190 348L148 361L130 335L111 364L64 345Z"
        fill="#252b36"
        stroke="#292c34"
        strokeWidth="2.2"
      />
      <path
        d="M80 288L76 338L108 351M175 291L180 340L151 350"
        fill="none"
        stroke="#d8dce0"
        strokeWidth="3"
      />
      <path
        d="M120 301L120 331L134 346L140 323L156 306L141 313Z"
        fill="#121c2a"
      />
      <path
        d="M86 294L105 309L99 330M160 318L170 332"
        fill="none"
        stroke="#555c67"
        strokeWidth="1.7"
      />
      <path d="M86 281L171 283" stroke="#a1a8b2" strokeWidth="1.3" />
    </g>
  )
}
