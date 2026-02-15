'use client'
// COMPONENTS
import { motion } from 'motion/react'
import { Spotlight } from '@/components/atoms/spotlight'
import MagneticSocialLink from '@/components/molecules/social-link'
import { ProjectCard } from '@/components/molecules/project-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselIndicator,
} from '@/components/motion-primitives/carousel'
import WorkExperienceDialog from '@/components/molecules/work-experience'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/atoms/animated-background'
import { TextLoop } from '@/components/atoms/text-loop'
// CONSTANTS
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from '@/lib/constants'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

const Personal = () => (
  <motion.main
    className="space-y-24"
    variants={VARIANTS_CONTAINER}
    initial="hidden"
    animate="visible"
  >
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
      <div className="flex-1">
        <p className="text-zinc-600 dark:text-zinc-400">
          Started with web apps, now exploring ML, LLMs, and agentic workflows —
          one at a time. Enjoys prototyping, working across the stack, and
          building things that are clear, useful, and simple. Cares about
          thoughtful UX, fast iteration, and solving real problems with clarity
          and intent.
        </p>
      </div>
    </motion.section>

    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
      <h3 className="mb-5 text-lg font-medium">What I'm Cooking</h3>
      <Carousel className="w-full pb-12">
        <CarouselContent className="-ml-4">
          {PROJECTS.map((project) => (
            <CarouselItem
              key={project.id}
              className="basis-full pl-4 sm:basis-1/2"
            >
              <ProjectCard project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation alwaysShow />
        <CarouselIndicator />
      </Carousel>
    </motion.section>

    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
      <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
      <div className="grid grid-cols-1 gap-4">
        {WORK_EXPERIENCE.map(
          ({
            id,
            title,
            company,
            start,
            end,
            description,
            what_i_did,
            link,
          }) => (
            <div
              key={id}
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-px dark:bg-zinc-600/30"
            >
              <Spotlight
                className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white p-3 sm:p-4 dark:bg-zinc-950">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <h4 className="font-normal dark:text-zinc-100">{title}</h4>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      {company}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {start} - {end}
                    </p>
                    <WorkExperienceDialog
                      title={title}
                      company={company}
                      start={start}
                      end={end}
                      description={description}
                    >
                      <TextLoop>
                        {what_i_did.map((item) => (
                          <span
                            key={item}
                            className="wrap-break-word whitespace-normal will-change-contents"
                          >
                            {item}
                          </span>
                        ))}
                      </TextLoop>
                    </WorkExperienceDialog>
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </motion.section>

    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
      <h3 className="mb-3 text-lg font-medium">Blog</h3>
      <div className="flex flex-col space-y-0">
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.uid}
              className="-mx-3 rounded-xl px-3 py-3"
              href={post.link}
              data-id={post.uid}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal dark:text-zinc-100">{post.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </motion.section>

    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
      <h3 className="mb-5 text-lg font-medium">Connect</h3>
      <p className="mb-5 text-zinc-600 dark:text-zinc-400">
        Feel free to contact me at{' '}
        <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </p>
      <div className="flex flex-wrap items-center justify-start gap-3">
        {SOCIAL_LINKS.map((link) => (
          <MagneticSocialLink key={link.label} link={link.link}>
            {link.label}
          </MagneticSocialLink>
        ))}
      </div>
    </motion.section>
  </motion.main>
)

export default Personal
