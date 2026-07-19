'use client'
// COMPONENTS
import { TextLoop } from '@/components/atoms/text-loop'
import ThemeSwitch from '@/components/organisms/theme-switch'
import { Signature } from '@/components/signature'
// CONSTANTS
import { GITHUB_URL } from '@/lib/constants'

const Footer = () => (
  <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
    <div className="flex flex-col items-center gap-4">
      <Signature
        text="Shanvit S Shetty"
        fontSize={24}
        duration={2}
        delay={0.3}
        color="currentColor"
        className="max-w-[90vw] text-zinc-800 sm:max-w-none dark:text-zinc-200"
        inView
        once
      />
      <div className="flex w-full flex-col-reverse items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-0">
        <a href={`${GITHUB_URL}/portfolio-site`} target="_blank" rel="noopener">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2026 Shanvit S Shetty.</span>
            <span>Built with Motion Primitives, Next.js and Tailwind CSS.</span>
          </TextLoop>
        </a>
        <div className="text-xs text-zinc-400">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
