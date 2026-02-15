// TYPES
import { Project, WorkExperience, BlogPost, SocialLink } from '@/types/personal'

export const WEBSITE_URL = process.env.WEBSITE_URL as string

export const PROJECTS: Project[] = [
  {
    name: 'CQRS OMS Demo',
    description:
      'Order Management System with Bun, Hono, and Zod — CQRS and Event Sourcing with PostgreSQL and Redis.',
    link: 'https://github.com/Shanvit7/cqrs-server-demo',
    image: 'github-placeholder',
    id: 'cqrs-server-demo',
  },
  {
    name: 'A2A Travel Agents Demo',
    description:
      'Mastra receptionist agent orchestrating Agno hotel and flight booking agents via A2A protocol.',
    link: 'https://github.com/Shanvit7/a2a-mastra-demo',
    image: 'github-placeholder',
    id: 'a2a-travel-demo',
  },
  {
    name: 'Email Triage SLM',
    description:
      'Fine-tuned small language models for email classification and structured triage outputs using LoRA on Tinker Labs',
    link: 'https://github.com/Shanvit7/email-triage-slm',
    image: 'github-placeholder',
    id: 'email-triage-slm',
  },
  {
    name: 'AskBit',
    description:
      'FAQ assistant using bit vector encoding for semantic search with integrated RAG via local Llama 3',
    link: 'https://github.com/Shanvit7/askbit',
    image: 'github-placeholder',
    id: 'askbit',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Zosma AI',
    title: 'Founding Engineer',
    start: 'Sep 2025',
    end: 'Present',
    link: 'https://zosma.ai',
    id: 'work1',
    description: `
Had a chance to explore a lot of interesting AI-related projects and prototypes. Currently working on **vertical AI agents**.

### Highlights:
- Built a *whatsapp ecommerce support agent* POC using **Mastra** for [**Foodstories**](https://www.foodstories.shop)
- Working as a fullstack engineer on the [**Foodstories**](https://www.foodstories.shop) website built on **Next.js**, optimizing and implementing new features
- Built an AI workflow suggesting exercises using Mastra and **TOON** for token optimization for [**Dashfit**](https://dashfit.in)
- Learnt a lot about **multi agentic systems** and their **patterns** 
- Understood nuances of working with **LLMs** and their **limitations**
- Learning about Context Engineering, RAG and Fine-tuning
    `,
    what_i_did: [
      'developed a whatsapp ecommerce support agent',
      'learnt and did hands-on implementation of agentic workflow systems',
      'building vertical AI agents',
    ],
  },
  {
    company: 'Mavonic',
    title: 'SDE I',
    start: 'Oct 2024',
    end: 'Sep 2025',
    link: 'https://mavonic.com',
    id: 'work2',
    description: `
After IOTric, I joined Mavonic as an **SDE-1** and went full-stack from day one. I worked on [**PropertyGuru**](https://www.propertyguru.ae), a real estate platform built on **Next.js** and **Strapi**, which pulled in **10K+** daily visitors.

### Highlights:
- Handled core site, internal agent portal, and [**CreditNow**](https://www.creditnow.ae) (same stack)
- Coordinated with project managers and DevOps team for frequent daily deployments
- Used **Cursor** (Agentic IDE) and **v0.dev** for rapid UI iteration

After PropertyGuru , I worked on [**Draftus**](https://www.draftus.com), a US-based online social talent mining application (MVP), continuing in a full-stack role.

### Side Projects:
- Face recognition **Python service** (used across multiple internal projects)
- Google Meet automated [**stand-up bot**](https://github.com/Shanvit7/daily-standup-bot) using **Agno** that daily joins and pings absentees on Slack
- Secure PDF sharing [**POC**](https://legitimacy-mavonic.vercel.app) for an internal product idea
`,
    what_i_did: [
      'made facial recognition python service used throughout multiple internal projects',
      'built automated bot to join daily standup Meet and ping absentees on slack',
      'worked on a website with 10k+ daily visitors',
      'built SDK to make enterprise data secure and private',
    ],
  },
  {
    company: 'Iotric',
    title: 'SDE I',
    start: 'Feb 2023',
    end: 'Oct 2024',
    link: 'https://iotric.com',
    id: 'work3',
    description: `
After graduating, I joined **Iotric** as an **SDE-1**, starting with [**myIDFi**](https://myidfi.com), a mortgage comparison platform built with **React**, **Material UI**, and **RTK Query**. Later, I joined [**Enoobs**](https://www.enoobs.com), Iotric's first in-house product — a social media platform built exclusively for gamers — where I led the frontend and managed two interns,collaborating across teams. The product ran for 10 months before being shelved due to low traction.

### Highlights:
- Shipped production UI for **myIDFi**; used **ChatGPT** early on to boost development and debugging
- Led frontend for **Enoobs** using **Next.js**, coordinated with designers, and proposed new features
- Mentored interns and worked cross-functionally across product and design

### Side Projects:
- Worked as a **backend engineer** for few projects for self-learning
- Built a [**Node** chatbot package](https://www.npmjs.com/package/qie-chatbot), later evolved into a [**full-fledged product**](https://botric.ai) by the company

A fast-paced, high-growth phase filled with learning and real-world impact.
`,
    what_i_did: [
      'built a gamers-only social platform from scratch using next-js',
      'developed and published chatbot node package',
      'built core mortgage platform features: analytics, integrations, and email templates',
    ],
  },
  {
    company: 'Iotric',
    title: 'SDE (Intern)',
    start: 'Jul 2022',
    end: 'Feb 2023',
    link: 'https://iotric.com',
    id: 'work4',
    description: `
In my final year of undergrad, I interned as a **Software Developer**, primarily working on the **frontend**—especially legacy **React** codebases using **class components** and **Redux**.

### Highlights:
- Translated **Figma** designs into functional UIs
- Gained hands-on experience syncing frontend with backend APIs
- Managed application state effectively with **Redux**
- Navigated legacy codebases in the pre-ChatGPT era, relying heavily on **Stack Overflow**

This internship laid the foundation for my full-time journey, teaching me the value of hands-on debugging and real-world frontend patterns.
`,
    what_i_did: [
      'hands on experience with web development and its fundamentals',
      'worked extensively on 2-3 diverse client projects',
      'integrated Mirrorfly chat SDK for real-time communication features',
      'maintained and updated legacy React codebases',
    ],
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "I Didn't Care About AI — Until It Got Agentic",
    description:
      'Not a hot take — just some thoughts on what pulled me toward agentic systems and why they make more sense to me than the rest of AI so far.',
    link: '/blog/i-didnt-care-about-ai-until-it-got-agentic',
    uid: 'blog-1',
  },
]

export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL as string

export const EMAIL = process.env.NEXT_PUBLIC_EMAIL as string

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Email',
    link: `mailto:${EMAIL}`,
  },
  {
    label: 'LinkedIn',
    link: process.env.NEXT_PUBLIC_LINKEDIN_URL as string,
  },
]

export const PROFILE_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: GITHUB_URL,
  },
  {
    label: 'HackerRank',
    link: process.env.NEXT_PUBLIC_HACKERRANK_URL as string,
  },
  {
    label: 'LeetCode',
    link: process.env.NEXT_PUBLIC_LEETCODE_URL as string,
  },
  {
    label: 'Hugging Face',
    link: process.env.NEXT_PUBLIC_HUGGINGFACE_URL as string,
  },
]
