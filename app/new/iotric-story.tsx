'use client'

import { useInView } from 'motion/react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import styles from './court.module.css'
import { CourtArt } from './court-art'
import { MavonicStory } from './mavonic-story'
import { StoryRail } from './story-rail'
import { ZosmaStory } from './zosma-story'

const CourtPlayer = dynamic(() => import('./court-player'), {
  ssr: false,
  loading: () => <CourtArt />,
})

export function IotricStory() {
  const track = useRef<HTMLDivElement>(null)
  const basketball = useRef<HTMLElement>(null)
  const bridge = useRef<HTMLDivElement>(null)
  const rally = useRef<HTMLElement>(null)
  const pitchBridge = useRef<HTMLDivElement>(null)
  const penalty = useRef<HTMLElement>(null)
  const nearby = useInView(track, { once: true, margin: '300px' })
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia(
      '(prefers-reduced-motion: reduce), (max-height: 550px), (max-height: 650px) and (orientation: landscape)',
    )
    const phone = window.matchMedia('(max-width: 700px)')
    const update = () => {
      setMotionAllowed(!preference.matches)
      setMobile(phone.matches)
    }
    update()
    preference.addEventListener('change', update)
    phone.addEventListener('change', update)
    return () => {
      preference.removeEventListener('change', update)
      phone.removeEventListener('change', update)
    }
  }, [])

  return (
    <div className={styles.chapter}>
      <header className={styles.heading}>
        <div>
          <p className={styles.company}>IoTric · July 2022 — October 2024</p>
          <h2 id="iotric-title">Finding my feet.</h2>
          <p className={styles.subtitle}>
            How I got into frontend, one real problem at a time.
          </p>
        </div>
        <div className={styles.instructions}>
          <p>
            Scroll to follow the play <span aria-hidden="true">↘</span>
          </p>
          <a href="#mavonic">Skip to Mavonic ↓</a>
        </div>
      </header>

      <div ref={track} className={styles.track} data-motion={motionAllowed}>
        <figure className={styles.court} data-sports-stage>
          <div className={styles.art} aria-hidden="true">
            {motionAllowed && nearby ? (
              <CourtPlayer
                target={track}
                bridge={bridge}
                rally={rally}
                pitchBridge={pitchBridge}
                penalty={penalty}
              />
            ) : (
              <CourtArt />
            )}
          </div>
          <figcaption className={styles.caption}>
            <span>Brooklyn, no. 13. My kind of inspiration.</span>
          </figcaption>
        </figure>

        <section
          ref={basketball}
          className={`${styles.story} ${styles.basketballStory}`}
          aria-labelledby="iotric-title"
          data-basketball-story
        >
          <StoryRail
            chapterRef={basketball}
            motionAllowed={motionAllowed && mobile}
          >
            <article className={styles.beat}>
              <p className={styles.date}>July 2022 · The first bounce</p>
              <h3>
                Final year.
                <br />
                First codebase.
              </h3>
              <p>
                I joined IoTric as an intern while finishing undergrad. My
                starting point: legacy React, class components, and Redux.
              </p>
              <p className={styles.aside}>
                A real app is a very different teacher.
              </p>
            </article>
            <article className={styles.beat}>
              <p className={styles.date}>2022–23 · Getting the reps in</p>
              <h3>
                Read. Debug.
                <br />
                Try again.
              </h3>
              <p>
                I built interfaces, wired up APIs, and integrated Mirrorfly
                chat. Learning meant tracing state through someone else’s code
                and finding answers on Stack Overflow.
              </p>
              <p className={styles.aside}>
                This was before ChatGPT became my debugging partner.
              </p>
            </article>
            <article className={styles.beat}>
              <p className={styles.date}>April 2023 · Making the team</p>
              <h3>
                Intern to
                <br />
                SDE I.
              </h3>
              <p>
                After graduating, I joined full-time. On myIDFi, a mortgage
                comparison platform, I shipped production UI with React,
                Material UI, and RTK Query.
              </p>
              <p className={styles.aside}>Frontend was becoming my thing.</p>
            </article>
            <article className={styles.beat}>
              <p className={styles.date}>2023–24 · Taking the shot</p>
              <h3>
                From fixing UI
                <br />
                to owning it.
              </h3>
              <p>
                At Enoobs, a social platform for gamers, I led the Next.js
                frontend, mentored two interns, and worked with product and
                design to ship features.
              </p>
              <p>
                I also published{' '}
                <a
                  href="https://www.npmjs.com/package/qie-chatbot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  qie-chatbot ↗
                </a>
                , which later grew into the company’s{' '}
                <a
                  href="https://botric.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  botric.ai ↗
                </a>
                .
              </p>
            </article>
          </StoryRail>
        </section>
        <div ref={bridge} className={styles.handoff} aria-hidden="true" />
        <MavonicStory chapterRef={rally} motionAllowed={motionAllowed} />
        <div ref={pitchBridge} className={styles.handoff} aria-hidden="true" />
        <ZosmaStory chapterRef={penalty} motionAllowed={motionAllowed} />
        <div className={styles.finalHold} aria-hidden="true" />
      </div>

      <div id="after-iotric" tabIndex={-1} className={styles.outro}>
        <p>Still frontend at heart. Still taking the shot.</p>
        <a href="#intro">Back to the introduction ↑</a>
      </div>
    </div>
  )
}
