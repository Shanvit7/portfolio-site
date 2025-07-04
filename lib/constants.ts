// TYPES
import { Project, WorkExperience, BlogPost, SocialLink } from '@/types/personal';

export const WEBSITE_URL = process.env.WEBSITE_URL as string;

export const PROJECTS: Project[] = [
    {
      name: 'Motion Primitives Pro',
      description:
        'Advanced components and templates to craft beautiful websites.',
      link: 'https://pro.motion-primitives.com/',
      video:
        'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
      id: 'project1',
    },
    {
      name: 'Motion Primitives',
      description: 'UI kit to make beautiful, animated interfaces.',
      link: 'https://motion-primitives.com/',
      video:
        'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
      id: 'project2',
    },
];
  
export const WORK_EXPERIENCE: WorkExperience[] = [
    {
      company: 'Zosma AI',
      title: 'Founding AI Engineer',
      start: 'Apr 2025',
      end: 'Present',
      link: 'https://zosma.ai',
      id: 'work1',
    },
    {
      company: 'Mavonic',
      title: 'SDE I',
      start: 'Oct 2024',
      end: 'Present',
      link: 'https://mavonic.com',
      id: 'work2',
    },
    {
      company: 'Iotric',
      title: 'SDE I',
      start: 'Feb 2023',
      end: 'Oct 2024',
      link: 'https://iotric.com',
      id: 'work3',
    },
    {
      company: 'Iotric',
      title: 'SDE (Intern)',
      start: 'Jul 2022',
      end: 'Feb 2023',
      link: 'https://iotric.com',
      id: 'work3',
    },
];
  
export const BLOG_POSTS: BlogPost[] = [
    {
      title: 'Exploring the Intersection of Design, AI, and Design Engineering',
      description: 'How AI is changing the way we design',
      link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
      uid: 'blog-1',
    },
    {
      title: 'Why I left my job to start my own company',
      description:
        'A deep dive into my decision to leave my job and start my own company',
      link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
      uid: 'blog-2',
    },
    {
      title: 'What I learned from my first year of freelancing',
      description:
        'A look back at my first year of freelancing and what I learned',
      link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
      uid: 'blog-3',
    },
    {
      title: 'How to Export Metadata from MDX for Next.js SEO',
      description: 'A guide on exporting metadata from MDX files to leverage Next.js SEO features.',
      link: '/blog/example-mdx-metadata',
      uid: 'blog-4',
    },
];

export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL as string;
  
export const SOCIAL_LINKS: SocialLink[] = [
    {
      label: 'Github',
      link: GITHUB_URL,
    },
    {
      label: 'LinkedIn',
      link: process.env.NEXT_PUBLIC_LINKEDIN_URL as string,
    },
  ]
  
  export const EMAIL = process.env.NEXT_PUBLIC_EMAIL as string;
  