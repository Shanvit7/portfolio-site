import { useId } from 'react'
import { courtAt } from './court-timeline'
import { HardenArt } from './harden-art'

type CourtPose = ReturnType<typeof courtAt>

// Shared artwork for the SSR/reduced-motion still and Remotion's seekable frames.
export function CourtArt({
  pose = courtAt(170),
  showBall = true,
}: {
  pose?: CourtPose
  showBall?: boolean
}) {
  const id = useId().replaceAll(':', '')
  const { x, ballX, ballY, rotation, squash, shadow, net } = pose
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -80 1000 840"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      data-court-frame={Math.round(pose.frame)}
    >
      <defs>
        <mask id={`${id}-wax`} style={{ maskType: 'luminance' }}>
          <image
            href="/new/wax-grain.png"
            x="0"
            y="-80"
            width="1000"
            height="840"
          />
        </mask>
      </defs>
      <g
        transform={`translate(${500 * (1 - pose.camera)} ${380 * (1 - pose.camera)}) scale(${pose.camera})`}
        mask={`url(#${id}-wax)`}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g fill="none" stroke="#2b4cc6">
          <path
            d="M25 650L976 650M72 664L971 664"
            strokeWidth="2"
            opacity=".3"
          />
          <path
            d="M765 650Q581 545 739 452L978 452M830 452L904 650M945 452L978 540"
            strokeWidth="2"
            opacity=".16"
          />
          <path
            d="M46 712L221 698M294 708L325 704M737 704L950 685"
            strokeWidth="3"
            opacity=".2"
          />
        </g>
        <g
          transform={`translate(${x - 60} ${pose.effort * 20})`}
          fill="none"
          stroke="#2449cf"
          opacity={pose.effort * 0.5}
        >
          <path
            d="M-20 300L143 286M-50 332L106 316M-16 354L157 334M20 391L122 373M-30 456L80 442"
            strokeWidth="3"
          />
          <path
            d="M-5 310L96 301M-66 365L73 347M-2 408L85 392M-48 474L108 453"
            strokeWidth="1.5"
          />
        </g>
        <g opacity=".16" fill="#253555">
          <ellipse
            cx={x + 140}
            cy="653"
            rx={123 - pose.jump * 0.4}
            ry={10 - pose.jump * 0.07}
          />
          <ellipse cx={ballX} cy="652" rx={28 * shadow} ry={5 * shadow} />
        </g>
        <g fill="none">
          <path
            d="M958 646L958 177L877 154"
            stroke="#242834"
            strokeWidth="13"
          />
          <path d="M963 646L963 179" stroke="#616575" strokeWidth="3" />
          <path
            d="M944 130L944 313L900 301L900 119Z"
            fill="#f9fafc"
            stroke="#252a38"
            strokeWidth="4"
          />
          <path
            d="M906 125L938 134L938 300L906 293Z"
            stroke="#aab5cb"
            strokeWidth="2"
          />
          <path
            d="M912 222L934 228L934 269L912 264Z"
            stroke="#bb352a"
            strokeWidth="3"
          />
          <path
            d={`M814 273L826 ${333 + net}L875 ${333 + net}L892 271M826 333L885 284M839 336L894 282M816 281L861 336M826 276L876 336M814 298L887 297M822 316L881 316`}
            stroke="#788398"
            strokeWidth="1.7"
          />
          <ellipse
            cx="852"
            cy="271"
            rx="43"
            ry="10"
            stroke="#ba392b"
            strokeWidth="6"
          />
          <path d="M895 270L917 266" stroke="#ba392b" strokeWidth="6" />
        </g>
        <use
          href={`#${id}-harden`}
          transform="translate(-38 6)"
          opacity={pose.effort * 0.06}
        />
        <HardenArt pose={pose} id={id} />
        <path
          d={`M${pose.releaseX} ${pose.releaseY}Q${(pose.releaseX + 850) / 2} ${(pose.releaseY + 270) / 2 - 250} 850 270`}
          fill="none"
          stroke="#294bd1"
          strokeWidth="2"
          strokeDasharray="6 13"
          opacity={pose.shot > 0 && pose.shot < 1 ? 0.22 : 0}
        />
        <g
          opacity={showBall ? 1 : 0}
          transform={`translate(${ballX} ${ballY}) scale(${1 / squash} ${squash})`}
        >
          <g transform={`rotate(${rotation})`}>
            <circle r="27" fill="#df7429" stroke="#462e29" strokeWidth="2.7" />
            <path
              d="M-21-17Q-28 13-6 25Q17 33 25 10Q13 22-4 12Q-18 3-21-17"
              fill="#bf4c20"
            />
            <path d="M-14-20Q3-29 17-15L7-9Z" fill="#f5ad54" />
            <path
              d="M-27 1L27-1M-2-27L2 27M-19-19Q5-8-16 22M18-20Q-6-2 19 19"
              fill="none"
              stroke="#4e3028"
              strokeWidth="1.9"
            />
          </g>
        </g>
        <path
          d="M810 271Q851 289 895 271"
          fill="none"
          stroke="#ba392b"
          strokeWidth="5"
        />
        <g fill="none" stroke="#c13c2d" strokeWidth="3" opacity={pose.net / 16}>
          <path d="M798 259L783 248M804 245L798 226M898 292L914 304M905 280L926 285" />
        </g>
      </g>
    </svg>
  )
}
