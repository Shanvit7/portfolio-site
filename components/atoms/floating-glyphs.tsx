'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const GLYPHS = [
  '{ }',
  '</ >',
  '=>',
  '[ ]',
  '//',
  '&&',
  '||',
  '()',
  'fn',
  'AI',
  '??',
  '!=',
  '->',
  '**',
  '0x',
  '::',
  '~>',
  '++',
  'null',
  'true',
  'async',
  'await',
  'import',
  'const',
  'type',
  'use()',
  '.map()',
  '∑',
  '∞',
  'λ',
  '⊕',
  '∂',
  '∇',
]

const COLORS_DARK = [
  'rgba(255,255,255,A)',
  'rgba(200,180,255,A)', // soft purple
  'rgba(160,220,255,A)', // faint cyan
  'rgba(255,255,255,A)',
  'rgba(255,255,255,A)', // white weighted higher
]

const COLORS_LIGHT = [
  'rgba(80,80,100,A)',
  'rgba(120,80,180,A)', // soft purple
  'rgba(60,140,200,A)', // faint cyan
  'rgba(80,80,100,A)',
  'rgba(80,80,100,A)', // slate weighted higher
]

const COUNT = 38
const BASE_FONT = 12
const REPEL_RADIUS = 100
const REPEL_STRENGTH = 1.2

type Glyph = {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  alpha: number
  targetAlpha: number
  speed: number
  fontSize: number
  drift: number
  rotation: number
  rotationSpeed: number
  color: string
}

function makeGlyph(w: number, h: number, randomY = false, dark = true): Glyph {
  const palette = dark ? COLORS_DARK : COLORS_LIGHT
  const color = palette[Math.floor(Math.random() * palette.length)]
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + Math.random() * 120,
    vx: 0,
    vy: 0,
    text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    alpha: randomY ? Math.random() * 0.6 : 0,
    targetAlpha: Math.random() * 0.35 + 0.3,
    speed: Math.random() * 0.3 + 0.1,
    fontSize: BASE_FONT + Math.random() * 10,
    drift: (Math.random() - 0.5) * 0.25,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.008,
    color,
  }
}

export function FloatingGlyphs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const pathname = usePathname()
  const shouldShow = !pathname.startsWith('/blog')

  useEffect(() => {
    if (!shouldShow) return () => {} // no-op cleanup

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let glyphs: Glyph[] = []

    const isDark = () => document.documentElement.classList.contains('dark')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      glyphs = Array.from({ length: COUNT }, () =>
        makeGlyph(canvas.width, canvas.height, true, isDark()),
      )
    }

    // re-color glyphs when theme toggles
    const observer = new MutationObserver(() => {
      const dark = isDark()
      const palette = dark ? COLORS_DARK : COLORS_LIGHT
      glyphs.forEach((g) => {
        g.color = palette[Math.floor(Math.random() * palette.length)]
      })
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i]

        // cursor repulsion
        const dx = g.x - mx
        const dy = g.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          g.vx += (dx / dist) * force
          g.vy += (dy / dist) * force
        }

        // dampen velocity
        g.vx *= 0.88
        g.vy *= 0.88

        g.x += g.drift + g.vx
        g.y -= g.speed + Math.max(0, -g.vy)
        g.rotation += g.rotationSpeed

        // fade
        const progress = 1 - g.y / canvas.height
        if (progress < 0.08) {
          g.alpha += 0.015
        } else if (progress > 0.88) {
          g.alpha -= 0.012
        } else {
          g.alpha += (g.targetAlpha - g.alpha) * 0.04
        }
        g.alpha = Math.max(0, Math.min(0.75, g.alpha))

        // draw with rotation
        ctx.save()
        ctx.translate(g.x, g.y)
        ctx.rotate(g.rotation)
        ctx.globalAlpha = g.alpha
        ctx.font = `${g.fontSize}px monospace`
        ctx.fillStyle = g.color.replace('A', String(g.alpha))
        ctx.fillText(g.text, 0, 0)
        ctx.restore()

        // respawn
        if (g.y < -24 || (g.alpha <= 0.01 && g.y < canvas.height * 0.15)) {
          glyphs[i] = makeGlyph(canvas.width, canvas.height)
        }
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      observer.disconnect()
    }
  }, [shouldShow])

  return shouldShow ? (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ willChange: 'transform' }}
      aria-hidden
    />
  ) : null
}
