import type { RefObject } from 'react'
import styles from './court.module.css'
import { RallyArt } from './rally-art'
import { StoryRail } from './story-rail'

export function MavonicStory({
  chapterRef,
  motionAllowed,
}: {
  chapterRef: RefObject<HTMLElement | null>
  motionAllowed: boolean
}) {
  return (
    <section
      ref={chapterRef}
      id="mavonic"
      className={styles.mavonic}
      aria-labelledby="mavonic-title"
      tabIndex={-1}
    >
      <figure className={styles.rallyStill} aria-hidden="true">
        <RallyArt />
      </figure>
      <StoryRail chapterRef={chapterRef} motionAllowed={motionAllowed}>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.company}>
              Mavonic · October 2024 – September 2025
            </p>
            <h2 id="mavonic-title">
              Between backend <span>& AI.</span>
            </h2>
            <p>
              Mavonic took me full-stack. I joined as an SDE I, moving between
              interfaces, backend systems, and AI.
            </p>
            <p>
              On{' '}
              <a
                href="https://www.propertyguru.ae"
                target="_blank"
                rel="noopener noreferrer"
              >
                PropertyGuru ↗
              </a>
              : Next.js + Strapi, serving 10K+ daily visitors.
            </p>
            <a className={styles.skipRally} href="#zosma">
              Skip to Zosma AI ↓
            </a>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>Backend · Returning the serve</p>
            <h3>Past the interface.</h3>
            <p>
              Strapi APIs, role-based access, lead assignment, and salesperson
              follow-ups. I worked on SQL queries and backend optimizations,
              too.
            </p>
            <p>
              Back on the frontend, I moved key PropertyGuru pages from
              request-time SSR to SSG + ISR.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>AI · A new return</p>
            <h3>Then the work got eyes.</h3>
            <p>
              I built a FaceNet recognition service used across internal
              projects, then an async FastAPI + Agno + Groq vision bot for daily
              stand-ups.
            </p>
            <p>
              It detected attendance and nudged absentees on Slack.{' '}
              <a
                href="https://github.com/Shanvit7/daily-standup-bot"
                target="_blank"
                rel="noopener noreferrer"
              >
                See the bot ↗
              </a>
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>Back to the product</p>
            <h3>A wider game. Same focus.</h3>
            <p>
              I also built{' '}
              <a
                href="https://www.draftus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Draftus ↗
              </a>{' '}
              from scratch: a mobile-first student–mentor platform with Next.js,
              Supabase, and TanStack Query.
            </p>
            <p>
              Backend to AI, then back to what people needed on screen. That was
              my Mavonic rally.
            </p>
          </div>
        </article>
      </StoryRail>
    </section>
  )
}
