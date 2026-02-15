'use client'
// COMPONENTS
import { TextEffect } from '@/components/atoms/text-effect'
import Link from 'next/link'
// CONSTANTS
import { PROFILE_LINKS } from '@/lib/constants'

const Header = () => (
  <header className="mb-8 flex items-center justify-between">
    <div>
      <Link href="/" className="font-medium text-black dark:text-white">
        Shanvit S Shetty
      </Link>
      <TextEffect
        as="p"
        preset="fade"
        per="char"
        className="text-zinc-600 dark:text-zinc-500"
        delay={0.5}
      >
        Web Dev and AI Enthusiast
      </TextEffect>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pb-4 text-xs text-zinc-600 dark:text-zinc-400">
        {PROFILE_LINKS.map(({ label, link }) => (
          <a
            key={label}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  </header>
)

export default Header
