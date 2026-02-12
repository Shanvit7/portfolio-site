'use client'

import { Github } from 'lucide-react'
import ProjectVideo from '@/components/molecules/project-video'
import type { Project } from '@/types/personal'

export function ProjectCard({ project }: { project: Project }) {
  const CardWrapper = project.links ? 'div' : 'a'
  const cardProps = project.links
    ? { className: 'group block space-y-2' }
    : {
        href: project.link,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'group block space-y-2',
      }

  return (
    <CardWrapper {...cardProps}>
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 transition-transform duration-200 ring-inset group-hover:scale-[1.02] dark:bg-zinc-950/40 dark:ring-zinc-800/50">
        {project.video ? (
          <ProjectVideo src={project.video} />
        ) : project.image ? (
          <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-linear-to-br from-purple-600 via-purple-700 to-purple-800">
            <Github className="h-16 w-16 text-white/90" />
          </div>
        ) : null}
      </div>
      <div className="px-1">
        <div className="font-base group/link relative inline-block font-[450] text-zinc-900 dark:text-zinc-50">
          {project.name}
          <span className="absolute bottom-0.5 left-0 block h-px w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover/link:max-w-full dark:bg-zinc-50" />
        </div>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        {project.links && project.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {project.links.map(({ label, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                onClick={(e) => e.stopPropagation()}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
