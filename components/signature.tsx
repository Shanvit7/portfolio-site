'use client'
import { useEffect, useId, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import opentype from 'opentype.js'

interface SignatureProps {
  text?: string
  color?: string
  fontSize?: number
  duration?: number
  delay?: number
  className?: string
  inView?: boolean
  once?: boolean
}

export function Signature({
  text = 'Signature',
  color = '#000',
  fontSize = 14,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([])
  const [width, setWidth] = useState<number>(300)
  const [isMobile, setIsMobile] = useState(false)
  const height = 100
  const adjustedFontSize = isMobile ? fontSize * 0.6 : fontSize
  const horizontalPadding = adjustedFontSize * 0.1
  const topMargin = Math.max(5, (height - adjustedFontSize) / 2)
  const baseline = Math.min(height - 5, topMargin + adjustedFontSize)
  const maskId = `signature-reveal-${useId().replace(/:/g, '')}`
  const pathname = usePathname()

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        // Try multiple paths to ensure font loads correctly
        let font
        const fontPaths = [
          '/LastoriaBoldRegular.otf',
          './LastoriaBoldRegular.otf',
          `${window.location.origin}/LastoriaBoldRegular.otf`,
        ]

        for (const path of fontPaths) {
          try {
            font = await opentype.load(path)
            break
          } catch {
            // Try next path
          }
        }

        if (!font) {
          throw new Error('Font could not be loaded from any path')
        }

        let x = horizontalPadding
        const newPaths: string[] = []

        for (const char of text) {
          const glyph = font.charToGlyph(char)
          const path = glyph.getPath(x, baseline, adjustedFontSize)
          newPaths.push(path.toPathData(3))

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm
          x += advanceWidth * (adjustedFontSize / font.unitsPerEm)
        }

        setPaths(newPaths)
        setWidth(x + horizontalPadding)
      } catch {
        setPaths([])
        setWidth(text.length * adjustedFontSize * 0.6)
      }
    }

    load()
  }, [text, adjustedFontSize, baseline, horizontalPadding])

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  }

  return (
    <motion.svg
      key={`${pathname}-${paths.length}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      initial="hidden"
      whileInView={inView ? 'visible' : undefined}
      animate={inView ? undefined : 'visible'}
      viewport={{ once, amount: 0.3 }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={adjustedFontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: 'easeInOut',
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: 'easeInOut',
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  )
}
