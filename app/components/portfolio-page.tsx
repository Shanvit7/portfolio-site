import { ArrowUpRight, Download } from 'lucide-react'
import { Patrick_Hand } from 'next/font/google'
import localFont from 'next/font/local'
import Image from 'next/image'
import { preload } from 'react-dom'
import { ContactCopy } from '@/components/contact-copy'
import { IotricStory } from '@/components/portfolio/stories/iotric-story'
import styles from '@/components/portfolio/stories/paper.module.css'
import { WritingStory } from '@/components/portfolio/stories/writing-story'
import {
  BLOG_POSTS,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  WORK_EXPERIENCE,
} from '@/lib/constants'

const crayon = localFont({
  src: '../fonts/rubik-dirt-english.woff2',
  weight: '400',
  variable: '--font-crayon',
  display: 'swap',
})

const handwriting = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
})

// Back-and-forth crayon passes, not a straight left-to-right wipe.
const scribblePath = Array.from(
  { length: 33 },
  (_, i) =>
    `${i ? 'L' : 'M'}${(-0.04 + i * 0.034).toFixed(3)} ${i % 2 ? -0.15 : 1.15}`,
).join(' ')

const PaperIntro = () => {
  preload('/portfolio/textures/crayon-stroke.webp', {
    as: 'image',
    fetchPriority: 'high',
  })
  const currentWork = WORK_EXPERIENCE[0]

  return (
    <main
      className={`${styles.paper} ${crayon.variable} ${handwriting.variable} isolate min-h-svh bg-paper bg-[url('/portfolio/textures/paper.webp')] bg-repeat [font-family:var(--font-handwriting),Segoe_Print,cursive] text-[1.25rem] leading-[1.45] text-ink scheme-light`}
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
                      d={part === 'underline' ? 'M0 0.5H1' : scribblePath}
                      pathLength="1"
                      fill="none"
                      stroke="white"
                      strokeWidth={part === 'underline' ? 1 : 0.09}
                      // Round caps at this mask scale reveal almost the entire underline at once.
                      strokeLinecap={part === 'underline' ? 'butt' : 'round'}
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
            <div className={styles.resumeActions}>
              <p className={styles.resumePrompt}>
                Skip the theatrics. My résumé: take a look. Take a copy.
              </p>
              <span className={styles.resumeSpark} aria-hidden="true">
                ✳
              </span>
              <div className={styles.resumeChoices}>
                <a
                  className={styles.resumeLink}
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Read online</span>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
                <a
                  className={styles.resumeLink}
                  href="/resume.pdf"
                  download="shanvit_shetty_resume.pdf"
                >
                  <Download aria-hidden="true" size={17} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
            {EMAIL && <ContactCopy email={EMAIL} />}
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

export default PaperIntro
