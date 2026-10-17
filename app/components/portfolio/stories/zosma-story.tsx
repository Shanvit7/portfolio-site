import type { RefObject } from 'react'
import { FootballArt } from '@/components/portfolio/art/football-art'
import styles from '@/components/portfolio/stories/court.module.css'
import { StoryRail } from './story-rail'

export const ZosmaStory = ({
  chapterRef,
  motionAllowed,
}: {
  chapterRef: RefObject<HTMLElement | null>
  motionAllowed: boolean
}) => {
  return (
    <section
      ref={chapterRef}
      id="zosma"
      className={`${styles.mavonic} ${styles.footballChapter}`}
      aria-labelledby="zosma-title"
      tabIndex={-1}
    >
      {!motionAllowed && (
        <figure className={styles.penaltyStill}>
          <FootballArt />
          <figcaption className={styles.caption}>
            Ronaldo, United number 7, lines up a night-match shot against a
            three-man wall and goalkeeper.
          </figcaption>
        </figure>
      )}
      <StoryRail chapterRef={chapterRef} motionAllowed={motionAllowed}>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.company}>
              Zosma AI · September 2025 – Present
            </p>
            <h2 id="zosma-title">
              Now I take <span>the shot.</span>
            </h2>
            <p>
              I joined as a Founding Engineer. I still build interfaces, but now
              I also own performance, SEO, offline workflows, and AI product
              surfaces.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>First, get the foundations right</p>
            <h3>Build for the people using it.</h3>
            <p>
              At{' '}
              <a
                href="https://www.foodstories.shop"
                target="_blank"
                rel="noopener noreferrer"
              >
                Foodstories ↗
              </a>
              , I shipped checkout, gifting, bulk orders, and personalized
              hampers for 4K+ daily and 70K+ weekly users.
            </p>
            <p>
              SSR, ISR, and SSG brought Lighthouse to 98 and First Contentful
              Paint below one second. Organic traffic grew 65% in three months.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>Then, handle what gets in the way</p>
            <h3>Systems that keep their footing.</h3>
            <p>
              A Next.js + Fastify vendor CRM connected SAP shipment data. I also
              built a legal platform using Next.js, Server Actions, and
              PostgreSQL, with Kanban, role-based access, audit history, and PDF
              report generation.
            </p>
            <p>
              Its offline-first PWA queued edits, synced on reconnect, and
              scheduled hearing notifications.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>The next goal</p>
            <h3>Interfaces for AI.</h3>
            <p>
              On{' '}
              <a
                href="https://github.com/zosmaai/zosma-cowork"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zosma Cowork ↗
              </a>
              , I built Next.js interfaces for an open-source AI coworker,
              separating the product experience from the Hono agent runtime and
              contributing to monorepo/application architecture migration.
            </p>
            <p>
              On Zosma AI’s site: better Core Web Vitals, less JavaScript, and
              Grafana Faro observability.
            </p>
          </div>
        </article>
      </StoryRail>
    </section>
  )
}
