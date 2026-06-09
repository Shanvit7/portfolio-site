'use client'

import { Star } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useGithubStars } from '@/hooks/use-github-stars'
import type { ActiveWork } from '@/types/personal'

interface Props {
  item: ActiveWork
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function ActiveWorkRow({ item }: Props) {
  const stars = useGithubStars(item.githubRepo)

  return (
    <div
      className={cn(
        'group relative -mx-3 rounded-xl px-3 py-4',
        'transition-colors duration-200 ease-out',
        'hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50',
      )}
    >
      {/* Stretch link — primary destination */}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:focus-visible:outline-zinc-400"
        aria-label={`${item.name} — ${item.description}`}
      />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Name row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Active pulse dot */}
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none dark:opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </span>

            {/* Name with underline draw-in */}
            <span className="relative font-[450] text-zinc-900 dark:text-zinc-50">
              {item.name}
              <span
                className={cn(
                  'absolute -bottom-px left-0 h-px w-0 bg-zinc-800 dark:bg-zinc-200',
                  'transition-[width] duration-300 ease-out',
                  'group-hover:w-full',
                )}
                aria-hidden="true"
              />
            </span>

            {/* Type badge */}
            <span className="shrink-0 rounded border border-zinc-200 px-1.5 py-px text-[10px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
              {item.type}
            </span>

            {/* GitHub stars — fades in once loaded */}
            {stars !== null && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex shrink-0 items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500"
              >
                <Star className="h-3 w-3 fill-zinc-300 text-zinc-300 dark:fill-zinc-600 dark:text-zinc-600" />
                {formatStars(stars)}
              </motion.span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-snug text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>

          {/* Links — hidden by default on desktop, revealed on hover. Always visible on mobile. */}
          {item.links && item.links.length > 0 && (
            <div
              className={cn(
                'relative z-10 flex items-center gap-3',
                'translate-y-0 opacity-100',
                'sm:translate-y-1.5 sm:opacity-0',
                'transition-[opacity,transform] duration-200 ease-out',
                'sm:group-hover:translate-y-0 sm:group-hover:opacity-100',
              )}
            >
              {item.links.map(({ label, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-xs text-zinc-500 dark:text-zinc-400',
                    'transition-colors duration-150',
                    'hover:text-zinc-900 dark:hover:text-zinc-100',
                    'focus-visible:underline focus-visible:outline-none',
                  )}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
