// TYPES
import { Project, WorkExperience, BlogPost, SocialLink } from '@/types/personal';

export const WEBSITE_URL = process.env.WEBSITE_URL as string;

export const PROJECTS: Project[] = [
    {
      name: 'Searcho',
      description:
        'An intelligent news platform built on News API',
      link: 'https://searcho-web.vercel.app',
      video:
        'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
      id: 'searcho',
    },
    {
      name: 'Legitimacy (Beta)',
      description: 'Secure PDF sharing platform',
      link: 'https://legitimacy-mavonic.vercel.app',
      video:
        'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
      id: 'legitimacy',
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
      title: "I Didn't Care About AI — Until It Got Agentic",
      description: 'Not a hot take — just some thoughts on what pulled me toward agentic systems and why they make more sense to me than the rest of AI so far.',
      link: '/blog/i-didnt-care-about-ai-until-it-got-agentic',
      uid: 'blog-1',
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
  