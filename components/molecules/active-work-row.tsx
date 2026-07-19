'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ActiveWork } from '@/types/personal'

interface Props {
  item: ActiveWork
}

export function ActiveWorkRow({ item }: Props) {
  return (
    <div className="group -mx-3">
      <Link
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block rounded-xl px-3 py-4',
          'transition-colors duration-200 ease-out',
          'hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:focus-visible:outline-zinc-400',
        )}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Name row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Active pulse dot */}
              <span
                className="relative flex h-2 w-2 shrink-0"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none dark:opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>

              {/* Name with underline draw-in */}
              <span className="relative font-[450] text-zinc-900 dark:text-zinc-50">
                {item.name}
                <span className="ml-0.5 opacity-0 group-hover:opacity-100 text-zinc-900 dark:text-zinc-50 transition-opacity duration-200">
                  ↗
                </span>
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
              {item.type && (
                <span className="shrink-0 rounded border border-zinc-200 px-1.5 py-px text-[10px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
                  {item.type}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-snug text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
