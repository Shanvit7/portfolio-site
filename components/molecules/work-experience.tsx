'use client'
// CORE
import React from 'react'
import ReactMarkdown from 'react-markdown'
// COMPONENTS
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
} from '@/components/atoms/morphing-dialog'

// TYPES
interface WorkExperienceDialogProps {
  children: React.ReactNode
  company: string
  title: string
  start: string
  end: string
  description: string
}

const WorkExperienceDialog: React.FC<WorkExperienceDialogProps> = ({
  children,
  title,
  company,
  start,
  end,
  description,
}) => (
  <MorphingDialog>
    <MorphingDialogTrigger className="inline-block cursor-pointer text-xs text-zinc-600 dark:text-zinc-400">
      {children}
    </MorphingDialogTrigger>
    <MorphingDialogContainer>
      <MorphingDialogContent className="max-h-[80vh] max-w-full overflow-y-auto rounded-lg bg-white p-4 sm:max-w-lg sm:p-6 md:max-w-2xl dark:bg-zinc-950">
        <MorphingDialogTitle className="flex flex-row justify-between text-lg font-bold dark:text-zinc-100">
          {title} at {company}
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {start} - {end}
          </p>
        </MorphingDialogTitle>
        <MorphingDialogDescription className="prose dark:prose-invert pt-2 text-sm text-zinc-600 dark:text-zinc-300">
          <ReactMarkdown>{description}</ReactMarkdown>
        </MorphingDialogDescription>
      </MorphingDialogContent>
    </MorphingDialogContainer>
  </MorphingDialog>
)

export default WorkExperienceDialog
