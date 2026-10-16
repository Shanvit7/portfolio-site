import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import { Patrick_Hand, Rubik_Dirt } from 'next/font/google'
import Image from 'next/image'
import {
  BLOG_POSTS,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  WORK_EXPERIENCE,
} from '@/lib/constants'
import { IotricStory } from './new/iotric-story'
import styles from './new/paper.module.css'
import { WritingStory } from './new/writing-story'

const crayon = Rubik_Dirt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-crayon',
  display: 'swap',
})

const handwriting = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shanvit S Shetty - Front End Engineer',
  description:
    'Frontend engineer. Built for 70K+ weekly users, cut property-listing load time from ~10s to under 1s, and helped grow organic traffic 65% in three months. Building Tabot alongside my day job.',
  alternates: { canonical: '/' },
}

// Back-and-forth crayon passes, not a straight left-to-right wipe.
const scribblePath = Array.from(
  { length: 33 },
  (_, i) =>
    `${i ? 'L' : 'M'}${(-0.04 + i * 0.034).toFixed(3)} ${i % 2 ? -0.15 : 1.15}`,
).join(' ')

export default function PaperIntro() {
  const currentWork = WORK_EXPERIENCE[0]

  return (
    <main
      className={`${styles.paper} ${crayon.variable} ${handwriting.variable}`}
    >
      <a className={styles.skipLink} href="#intro">
        Skip to introduction
      </a>
      <div className={styles.sheet}>
        <header className={styles.header}>
          <span className={styles.wordmark} aria-hidden="true">
            s.s<span aria-hidden="true">✳</span>
          </span>
          <nav className={styles.nav} aria-label="Find Shanvit">
            {GITHUB_URL && (
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            )}
            {LINKEDIN_URL && (
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                Say hello on LinkedIn{' '}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            )}
          </nav>
        </header>

        <section id="intro" className={styles.intro} aria-label="Introduction">
          <div className={styles.nameBlock}>
            <svg
              className={styles.inkMasks}
              width="0"
              height="0"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                {['greeting', 'first', 'surname', 'underline'].map((part) => (
                  <mask
                    key={part}
                    id={`intro-${part}-ink`}
                    maskUnits="objectBoundingBox"
                    maskContentUnits="objectBoundingBox"
                    x="0"
                    y="0"
                    width="1"
                    height="1"
                    style={{ maskType: 'alpha' }}
                  >
                    <path
                      className={styles.inkStroke}
                      data-ink-part={part}
                      d={part === 'underline' ? 'M-0.1 0.5H1.1' : scribblePath}
                      pathLength="1"
                      fill="none"
                      stroke="white"
                      strokeWidth={part === 'underline' ? 2 : 0.09}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </mask>
                ))}
              </defs>
            </svg>
            <noscript>
              <style>{`.${styles.inkStroke}{animation:none;stroke-dashoffset:0}`}</style>
            </noscript>
            <p
              className={styles.greeting}
              style={{ maskImage: 'url(#intro-greeting-ink)' }}
            >
              hey, I’m <span aria-hidden="true">↴</span>
            </p>
            <h1 className={styles.name}>
              <span
                className={styles.firstName}
                style={{ maskImage: 'url(#intro-first-ink)' }}
              >
                Shanvit
              </span>
              <span
                className={styles.surname}
                style={{ maskImage: 'url(#intro-surname-ink)' }}
              >
                S Shetty<span className={styles.period}>.</span>
              </span>
            </h1>
            <div className={styles.marks} aria-hidden="true">
              <div
                className={styles.stillMark}
                style={{ maskImage: 'url(#intro-underline-ink)' }}
              />
            </div>
            <p className={styles.nameNote}>
              Building smarter, simpler systems.
            </p>
          </div>

          <div className={styles.about}>
            <p className={styles.role}>
              Front End engineer.
              <span>Product at heart.</span>
            </p>
            <p className={styles.description}>
              4+ years building and shipping web applications. From a blank
              canvas to products people use.
            </p>
            <p className={styles.curiosity}>
              Curious about how engineering shapes the way people find, use, and
              grow with a product.
            </p>
            {EMAIL && (
              <a className={styles.contact} href={`mailto:${EMAIL}`}>
                Let’s build something
                <ArrowUpRight aria-hidden="true" size={24} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </section>

        <footer className={styles.pageNote}>
          <p className={styles.current}>
            <span className={styles.currentMark} aria-hidden="true">
              ✳
            </span>
            Currently building at{' '}
            <a
              href={currentWork.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentWork.company} <span aria-hidden="true">↗</span>
            </a>
          </p>
          <p className={styles.marginNote}>
            A fresh page,
            <br />
            same curious mind.
          </p>
        </footer>
      </div>
      <IotricStory />
      <WritingStory>
        <ol className={styles.postList}>
          {BLOG_POSTS.map((post) => (
            <li key={post.uid}>
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                <h3>{post.title}</h3>
                <span>
                  Read on Substack <ArrowUpRight aria-hidden="true" size={20} />
                </span>
              </a>
              <p>{post.description}</p>
            </li>
          ))}
        </ol>
      </WritingStory>
      <section
        className={styles.project}
        id="tabot"
        aria-labelledby="tabot-title"
      >
        <div className={styles.projectCopy}>
          <p className={styles.projectLabel}>On the side. Still building.</p>
          <h2 id="tabot-title">Tabot</h2>
          <p>
            I built an open-source, local-first Chrome extension and dashboard
            that turns browser activity into session timelines, domain history,
            navigation paths, and recurring-visit patterns.
          </p>
          <p>
            Optional MCP/ChatGPT access answers questions over filtered results.
            Raw browsing history stays on-device.
          </p>
          <p className={styles.projectStatus}>
            Still building it alongside my role at Zosma AI.
          </p>
          <div className={styles.projectLinks}>
            <a
              href="https://github.com/Shanvit7/tabot"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <a
              href="https://shanvit7.github.io/tabot/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
        <figure className={styles.projectPreview}>
          <Image
            src="/tabot-preview.webp"
            alt="Tabot browser extension showing a browsing session timeline"
            width={960}
            height={540}
            sizes="(max-width: 800px) 100vw, 52vw"
          />
        </figure>
      </section>
    </main>
  )
}
