import type { RefObject } from 'react'
import styles from './court.module.css'
import { FootballArt } from './football-art'
import { StoryRail } from './story-rail'

export function ZosmaStory({
  chapterRef,
  motionAllowed,
}: {
  chapterRef: RefObject<HTMLElement | null>
  motionAllowed: boolean
}) {
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
              I joined as a Founding Engineer. Frontend is still home; now I
              ship across web, desktop, and AI workflows.
            </p>
            <p>More ownership. Real users. A lot of different problems.</p>
            <a className={styles.skipRally} href="#after-iotric">
              Skip the shot ↓
            </a>
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
              , I built and optimized the Next.js storefront serving 4K+ daily
              and 70K+ weekly users.
            </p>
            <p>
              Checkout, gifting, bulk orders, and a personalized hamper builder.
              Product analytics showed what happened after shipping.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>Then, handle what gets in the way</p>
            <h3>Systems that keep their footing.</h3>
            <p>
              A vendor CRM connected Next.js and Fastify to SAP shipment data.
              Legal Ops brought Kanban, RBAC, audit history, and PDF reports.
            </p>
            <p>
              I also built its offline-first PWA: queued updates, reconnect
              sync, and an outbox scheduler for hearing notifications.
            </p>
          </div>
        </article>
        <article className={styles.rallyBeat}>
          <div className={styles.rallyCopy}>
            <p className={styles.date}>The next goal</p>
            <h3>Make AI useful. Keep shipping.</h3>
            <p>
              On{' '}
              <a
                href="https://github.com/zosmaai/zosma-cowork"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zosma Cowork ↗
              </a>
              , I built agent chat infrastructure and authentication for 10+
              model providers across React, Tauri, Rust, and Node.js.
            </p>
            <p>
              Alongside that: agentic workflows, local LLM experiments, and{' '}
              <a
                href="https://github.com/zosmaai/zolorag"
                target="_blank"
                rel="noopener noreferrer"
              >
                zolorag ↗
              </a>
              , a fully local PDF chat app.
            </p>
          </div>
        </article>
      </StoryRail>
    </section>
  )
}
