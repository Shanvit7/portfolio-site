import type { RefObject } from 'react'
import { RallyArt } from '@/components/portfolio/art/rally-art'
import styles from '@/components/portfolio/stories/court.module.css'
import { StoryRail } from './story-rail'

const beats = [
  {
    label: 'Mavonic · October 2024 – September 2025',
    company: true,
    title: (
      <>
        Between backend <span>& AI.</span>
      </>
    ),
    titleId: 'mavonic-title',
    paragraphs: [
      {
        id: 'full-stack',
        content: (
          <>
            Mavonic took me full-stack. I joined as an SDE I, moving between
            interfaces, backend systems, and AI.
          </>
        ),
      },
      {
        id: 'propertyguru-intro',
        content: (
          <>
            On{' '}
            <a
              href="https://www.propertyguru.ae"
              target="_blank"
              rel="noopener noreferrer"
            >
              PropertyGuru ↗
            </a>
            , I improved listings for 10K+ daily visitors, cutting load time
            from ~10 seconds to under 1 second.
          </>
        ),
      },
    ],
  },
  {
    label: 'Backend · Returning the serve',
    title: 'Past the interface.',
    paragraphs: [
      {
        id: 'backend-workflows',
        content: (
          <>
            I built role-based lead assignment and follow-up workflows for
            Realtor Leads, and contributed to SQL/query optimizations.
          </>
        ),
      },
      {
        id: 'propertyguru-performance',
        content: (
          <>
            PropertyGuru listings went from request-time rendering to SSG +
            ISR—staying fresh without making visitors wait. Pages loaded in{' '}
            <strong>under one second</strong>.
          </>
        ),
      },
    ],
  },
  {
    label: 'AI · A new return',
    title: 'Then the work got eyes.',
    paragraphs: [
      {
        id: 'facenet-bot',
        content: (
          <>
            I built a FaceNet recognition service used across internal projects,
            then an async FastAPI + Agno + Groq vision bot for daily stand-ups.
            Cursor IDE was in my corner for quick iterations; I still owned what
            shipped.
          </>
        ),
      },
      {
        id: 'bot-link',
        content: (
          <>
            It detected attendance and nudged absentees on Slack.{' '}
            <a
              href="https://github.com/Shanvit7/daily-standup-bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              See the bot ↗
            </a>
          </>
        ),
      },
    ],
  },
  {
    label: 'One year. Plenty of returns.',
    title: 'That was my rally at Mavonic.',
    paragraphs: [
      {
        id: 'draftus',
        content: (
          <>
            I moved between frontend, backend, and AI, returning to whichever
            part of the product needed me. I also built{' '}
            <a
              href="https://www.draftus.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Draftus ↗
            </a>{' '}
            from scratch: a mobile-first student–mentor platform with Next.js,
            Supabase, Resend and TanStack Query.
          </>
        ),
      },
    ],
  },
]

export const MavonicStory = ({
  chapterRef,
  motionAllowed,
}: {
  chapterRef: RefObject<HTMLElement | null>
  motionAllowed: boolean
}) => (
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
      {beats.map(({ label, company, title, titleId, paragraphs }) => (
        <article className={styles.rallyBeat} key={label}>
          <div className={styles.rallyCopy}>
            <p className={company ? styles.company : styles.date}>{label}</p>
            {titleId ? <h2 id={titleId}>{title}</h2> : <h3>{title}</h3>}
            {paragraphs.map(({ id, content }) => (
              <p key={id}>{content}</p>
            ))}
          </div>
        </article>
      ))}
    </StoryRail>
  </section>
)
