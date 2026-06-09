'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProjectCard } from '@/components/molecules/project-card'
import { PROJECTS } from '@/lib/constants'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_ITEM = { duration: 0.3 }

export default function ProjectsPage() {
  return (
    <motion.main
      className="pb-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={VARIANTS_ITEM}
        transition={TRANSITION_ITEM}
        className="mb-8 flex items-center gap-3"
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </motion.div>

      <motion.div
        variants={VARIANTS_ITEM}
        transition={TRANSITION_ITEM}
        className="mb-8"
      >
        <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
          Projects
        </h1>
        <p className="mt-1.5 text-zinc-500 dark:text-zinc-400">
          Things I've built, shipped, and tinkered with.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </motion.main>
  )
}
