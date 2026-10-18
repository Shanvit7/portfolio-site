import { motion, useTransform } from 'motion/react'
import { Children, type ReactNode, type RefObject } from 'react'
import styles from '@/components/portfolio/stories/court.module.css'
import { useScrollProgress } from './use-scroll-progress'

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
  const count = Children.count(children)
  const scrollYProgress = useScrollProgress(chapterRef, 1, 0)
  const x = useTransform(
    scrollYProgress,
    [
      0,
      ...Array.from({ length: count }, (_, i) => [
        (i + 1) / (count + 1),
        (i + 1.6) / (count + 1),
      ]).flat(),
      1,
    ],
    [
      '0%',
      ...Array.from({ length: count }, (_, i) => [
        `${-i * 100}%`,
        `${-i * 100}%`,
      ]).flat(),
      `${-(count - 1) * 100}%`,
    ],
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 1 / (count + 1), 1 / (count + 1) + 0.005, 1],
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
                (chapter.clientHeight * (index + 0.12)) / count,
              behavior: 'instant',
            })
          }}
        >
          {children}
        </motion.div>
      </motion.div>
      <div
        className={styles.rallyRunway}
        style={{ height: `${count * 100}svh` }}
        aria-hidden="true"
      />
    </>
  )
}
