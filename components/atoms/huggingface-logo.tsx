'use client'

import { siHuggingface } from 'simple-icons'

export function HuggingfaceLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d={siHuggingface.path} />
    </svg>
  )
}
