'use client'

import { useMotionValue } from 'motion/react'
import { type RefObject, useEffect } from 'react'

// Read scroll position on moving frames, not from Safari's delayed fling events.
// Geometry is cached: no layout reads in the scroll/animation hot path.
export const useScrollProgress = (
  target: RefObject<HTMLElement | null>,
  startViewport: number,
  endViewport: number,
) => {
  const progress = useMotionValue(0)
  useEffect(() => {
    const element = target.current
    if (!element) return
    let start = 0
    let distance = 1
    let raf = 0
    let previous = Number.NaN
    let still = 0
    const sync = () => {
      progress.set(
        Math.max(0, Math.min(1, (window.scrollY - start) / distance)),
      )
    }
    const tick = () => {
      if (window.scrollY === previous) still++
      else still = 0
      previous = window.scrollY
      sync()
      raf = still < 10 ? requestAnimationFrame(tick) : 0
    }
    const follow = () => {
      still = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const measure = () => {
      const rect = element.getBoundingClientRect()
      start = rect.top + window.scrollY - window.innerHeight * startViewport
      distance = Math.max(
        1,
        rect.height + window.innerHeight * (startViewport - endViewport),
      )
      sync()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    observer.observe(document.body)
    const events = ['scroll', 'wheel', 'touchstart', 'touchmove'] as const
    for (const event of events)
      window.addEventListener(event, follow, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pageshow', measure)
    measure()
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      for (const event of events) window.removeEventListener(event, follow)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pageshow', measure)
    }
  }, [target, startViewport, endViewport, progress])
  return progress
}
