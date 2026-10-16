'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import styles from './paper.module.css'

const rightPage =
  'M300 132C365 88 445 101 510 126L510 330C435 303 365 307 300 350C300 278 300 204 300 132Z'
const liftedPage =
  'M300 132C332 58 365 36 392 52L384 270C348 284 322 315 300 350C300 278 300 204 300 132Z'
const leftPage =
  'M300 132C235 88 155 101 90 126L90 330C165 303 235 307 300 350C300 278 300 204 300 132Z'

// Only the illustration scrubs. Article links remain plain, visible server HTML.
export function WritingStory({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null)
  const id = useId().replaceAll(':', '')
  const reduced = useReducedMotion()
  // Motion values differ from the static SSR markup, so animate only after mount.
  const [animated, setAnimated] = useState(false)
  useEffect(() => setAnimated(reduced === false), [reduced])
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start 90%', 'end 90%'],
    layoutEffect: false,
  })
  const leaf = useTransform(
    scrollYProgress,
    [0.08, 0.35, 0.65],
    [rightPage, liftedPage, leftPage],
  )
  const ink = useTransform(scrollYProgress, [0, 0.28], [0.12, 1])
  const notes = useTransform(scrollYProgress, [0.55, 0.9], [0, 1])

  return (
    <section
      ref={section}
      id="writing"
      className={styles.writing}
      aria-labelledby="writing-title"
    >
      <header className={styles.writingHeading}>
        <p>Off the court. Into the margins.</p>
        <h2 id="writing-title">Sometimes I write.</h2>
        <p>
          Notes from building, experimenting, and following a question a little
          further.
        </p>
      </header>
      <div className={styles.writingSpread}>
        <div className={styles.bookSticky} aria-hidden="true">
          <svg
            viewBox="0 0 600 440"
            className={styles.book}
            data-book-art
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <mask id={`${id}-book-wax`} style={{ maskType: 'luminance' }}>
                <image
                  href="/new/wax-grain.png"
                  width="600"
                  height="440"
                  preserveAspectRatio="none"
                />
              </mask>
            </defs>
            <g
              mask={`url(#${id}-book-wax)`}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M64 145Q184 94 300 151Q412 93 535 145L547 358Q420 323 300 381Q186 324 53 359Z"
                fill="var(--blue)"
                stroke="var(--blue)"
                strokeWidth="10"
              />
              <path
                d="M79 137Q184 89 300 143Q416 90 521 137L528 345Q420 311 300 366Q185 312 72 345Z"
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="2"
              />
              <path
                d="M82 146Q186 101 300 153Q413 102 518 146M78 337Q189 308 300 357Q412 309 523 337M77 344Q188 316 300 364Q415 316 525 344"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.5"
              />
              <path
                d={leftPage}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              <path
                d={rightPage}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              <motion.path
                data-book-ink
                d="M300 137Q294 231 300 350M114 159Q189 137 266 164M112 177Q188 155 265 182M111 195Q185 174 263 199M112 213Q179 193 249 215M335 160Q413 136 488 158M334 178Q413 156 489 176M336 196Q412 175 488 194M338 214Q405 195 472 212"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="3.5"
                pathLength={animated ? ink : 1}
              />
              <path
                d="M451 112L471 117L471 190L461 181L451 188Z"
                fill="var(--red)"
              />
              <motion.path
                data-book-leaf
                d={animated ? leaf : leftPage}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              <motion.g style={{ opacity: animated ? notes : 1 }}>
                <path
                  d="M113 157Q184 139 265 162M112 178Q184 157 266 182M112 199Q179 179 250 201"
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="3.5"
                />
                <path
                  d="M127 252C127 237 150 232 160 250C171 230 193 240 190 254C185 270 160 286 160 286C160 286 132 269 127 252Z"
                  fill="none"
                  stroke="var(--red)"
                  strokeWidth="4"
                />
                <path
                  d="M213 254L236 247L254 259L233 269ZM214 277L235 271L253 282L232 291ZM214 300L235 294L253 305L232 314Z"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="3"
                />
                <path
                  d="M351 254Q413 240 476 255M352 274Q402 261 451 274M351 294Q411 279 476 294"
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="3.5"
                />
              </motion.g>
              <path
                d="M490 374L538 328L548 339L501 386L485 390Z"
                fill="var(--red)"
                stroke="var(--red)"
                strokeWidth="3"
              />
              <path
                d="M500 370L512 382M505 365L517 377"
                stroke="var(--paper)"
                strokeWidth="2"
              />
              <path
                d="M54 78L70 91M87 59L91 79M523 71L513 89M552 102L532 108"
                fill="none"
                stroke="var(--red)"
                strokeWidth="4"
              />
            </g>
          </svg>
          <p className={styles.bookNote}>
            A few things I’m thinking through. ↗
          </p>
        </div>
        <div className={styles.writingPosts}>{children}</div>
      </div>
    </section>
  )
}
