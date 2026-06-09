// TYPES
import {
  WorkExperience,
  BlogPost,
  SocialLink,
  ActiveWork,
} from '@/types/personal'

export const WEBSITE_URL = process.env.WEBSITE_URL as string

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Zosma AI',
    title: 'Founding Engineer',
    start: 'Sep 2025',
    end: 'Present',
    link: 'https://zosma.ai',
    id: 'work1',
    description: `
Had a chance to explore a lot of interesting AI-related projects and prototypes. Currently working on making **better harnesses** for AI models.

### Highlights:
- Built a *whatsapp ecommerce support agent* POC using **Mastra** for [**Foodstories**](https://www.foodstories.shop)
- Worked as a fullstack engineer on the [**Foodstories**](https://www.foodstories.shop) website built on **Next.js**, optimizing and implementing new features
- Built an AI workflow suggesting exercises using Mastra and **TOON** for token optimization for [**Dashfit**](https://dashfit.in)
- Contributing to [**OpenZosma**](https://www.zosma.ai/openzosma) — an open-source self-hosted platform for hierarchical AI agents started by Zosma AI
- Contributing to [**pi-llm-wiki**](https://github.com/zosmaai/pi-llm-wiki) — a self-maintaining Obsidian-compatible knowledge base for pi, following Karpathy's LLM Wiki pattern
- Contributing to [**zosma-cowork**](https://github.com/zosmaai/zosma-cowork) — a desktop GUI for the pi coding agent, open-source Claude Cowork alternative
- Built [**zolorag**](https://github.com/zosmaai/zolorag) from scratch — a fully local RAG app for chatting with PDF documents, no cloud, no external services
- Experimenting with **SLMs**, **local LLM inference**, and **AI harness** tooling — fine-tuning and agent scaffolding
    `,
    what_i_did: [
      'developed a whatsapp ecommerce support agent',
      'learnt and did hands-on implementation of agentic workflow systems',
      'building better harnesses for LLMs and SLMs',
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
    start: 'Apr 2023',
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
    end: 'Apr 2023',
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

export const ACTIVE_WORK: ActiveWork[] = [
  {
    id: 'active-1',
    name: 'pi-llm-wiki',
    description:
      'Self-maintaining Obsidian-compatible knowledge base for pi — turns raw sources into an interlinked wiki over time.',
    type: 'OSS',
    link: 'https://github.com/zosmaai/pi-llm-wiki',
    links: [{ label: 'GitHub', url: 'https://github.com/zosmaai/pi-llm-wiki' }],
    githubRepo: 'zosmaai/pi-llm-wiki',
  },
  {
    id: 'active-2',
    name: 'zosma-cowork',
    description:
      'Desktop GUI for the pi coding agent — open-source Claude Cowork alternative.',
    type: 'OSS',
    link: 'https://github.com/zosmaai/zosma-cowork',
    links: [
      { label: 'GitHub', url: 'https://github.com/zosmaai/zosma-cowork' },
    ],
    githubRepo: 'zosmaai/zosma-cowork',
  },
  {
    id: 'active-3',
    name: 'zolorag',
    description:
      'Fully local RAG app for PDF documents — single process, no cloud, no external services.',
    type: 'OSS',
    link: 'https://github.com/zosmaai/zolorag',
    links: [{ label: 'GitHub', url: 'https://github.com/zosmaai/zolorag' }],
    githubRepo: 'zosmaai/zolorag',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Emotion Is a Missing Primitive in AI Memory',
    description:
      'Exploring how adopting human-like memory principles—importance, repetition, recency, and context—could make AI systems more efficient and focused as they scale.',
    link: 'https://substack.com/@shanvitshetty/p-195320978',
    uid: 'blog-3',
    date: 'Apr 10, 2026',
  },
  {
    title: 'How I Trained an Email Triage SLM Using Tinker APIs',
    description:
      "A learning project exploring LoRA fine-tuning and Tinker's distributed training API. Email triage served as a concrete use case to understand the mechanics of fine-tuning small language models.",
    link: 'https://substack.com/@shanvitshetty/p-201153688',
    uid: 'blog-2',
    date: 'Feb 21, 2026',
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
  {
    label: 'Substack',
    link: 'https://substack.com/@shanvitshetty',
  },
]
