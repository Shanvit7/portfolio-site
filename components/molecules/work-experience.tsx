'use client';
// CORE
import React from 'react';
import ReactMarkdown from 'react-markdown';
// COMPONENTS
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
} from '@/components/atoms/morphing-dialog';

// TYPES
interface WorkExperienceDialogProps {
  children: React.ReactNode;
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

const WorkExperienceDialog: React.FC<WorkExperienceDialogProps> = ({ children, title, company, start, end, description }) => (
      <MorphingDialog>
        <MorphingDialogTrigger className="inline-block text-zinc-600 dark:text-zinc-400 text-xs cursor-pointer">
         {children}
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent className="p-6 bg-white dark:bg-zinc-950 rounded-lg max-w-2xl">
            <MorphingDialogTitle className="flex flex-row justify-between text-lg font-bold dark:text-zinc-100">
              {title} at {company}
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                {start} - {end}
              </p>
            </MorphingDialogTitle>
            <MorphingDialogDescription className="pt-2 text-sm prose dark:prose-invert text-zinc-600 dark:text-zinc-300">
              <ReactMarkdown>{description}</ReactMarkdown>
            </MorphingDialogDescription>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
);

export default WorkExperienceDialog; 