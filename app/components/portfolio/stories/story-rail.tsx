import { motion, useScroll, useTransform } from 'motion/react'
import type { ReactNode, RefObject } from 'react'
import styles from '@/components/portfolio/stories/court.module.css'

// Shared by Mavonic and Zosma; text stays semantic and outside the decorative Player.
export const StoryRail = ({
  chapterRef,
  motionAllowed,
  children,
}: {
  chapterRef: RefObject<HTMLElement | null>
  motionAllowed: boolean
  children: ReactNode
}) => {
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  })
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.32, 0.4, 0.52, 0.6, 0.72, 0.8, 1],
    ['0%', '0%', '0%', '-100%', '-100%', '-200%', '-200%', '-300%', '-300%'],
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.205, 1],
    [0, 0, 1, 1],
  )
  return (
    <>
      <motion.div
        className={styles.copyStage}
        style={{ opacity: motionAllowed ? opacity : 1 }}
      >
        <motion.div
          className={styles.copyRail}
          style={{ x: motionAllowed ? x : 0 }}
          onFocusCapture={(event) => {
            const chapter = chapterRef.current
            const article = event.target.closest('article')
            if (
              !motionAllowed ||
              !chapter ||
              !article ||
              !event.target.matches(':focus-visible')
            )
              return
            const index = Array.from(event.currentTarget.children).indexOf(
              article,
            )
            if (index < 0) return
            window.scrollTo({
              top:
                chapter.getBoundingClientRect().top +
                window.scrollY +
                (chapter.clientHeight * (index + 0.12)) / 4,
              behavior: 'instant',
            })
          }}
        >
          {children}
        </motion.div>
      </motion.div>
      <div className={styles.rallyRunway} aria-hidden="true" />
    </>
  )
}
