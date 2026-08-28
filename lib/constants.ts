// TYPES
import type {
  ActiveWork,
  BlogPost,
  SocialLink,
  WorkExperience,
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
Shipping several interesting AI-related projects, products and prototypes. Wearing multiple hats, when needed.

### Highlights:
- Worked as a frontend engineer on the [**Foodstories**](https://www.foodstories.shop) website built on **Next.js**, optimizing and implementing new features, *later platform raised ₹50Cr led by Nikhil Kamath*
- Built an AI workflow suggesting workout routines & exercises for [**Dashfit**](https://dashfit.in) - using **Mastra** and **TOON** for token optimization plus **PromptFoo** evals.
- Built a **Next.js + Fastify** vendor CRM integrating **SAP data** for shipment tracking on [**Foodstories**](https://www.foodstories.shop).
- Built a **Legal Ops** litigation platform with **Kanban workflows, RBAC, audit history, analytics, and six PDF reports** — including an offline-first PWA with queued updates, reconnect sync, and an outbox-based scheduler for hearing notifications via email.
- Owned **Zosma AI Web** technical SEO, Core Web Vitals, and observability — **Grafana Faro** real-user monitoring
- Built [**zolorag**](https://github.com/zosmaai/zolorag) from scratch — a fully local RAG app for chatting with PDF documents, no cloud, no external services
- Built a **Tauri Desktop** app pulling Tally Data via gateway using **tally-xml**
- Built a *whatsapp ecommerce support agent* POC using **Mastra** for [**Foodstories**](https://www.foodstories.shop)
- Experimenting with **SLMs**, **local LLM inference**, and **AI harness** tooling — fine-tuning and agent scaffolding
    `,
    what_i_did: [
      'developed a whatsapp ecommerce support agent',
      'learnt and did hands-on implementation of agentic workflow systems',
      'Shipped in-house products across web, desktop, and npm',
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
After IOTric, I joined Mavonic as an **SDE-1** and went full-stack from day one. Mostly worked on [**PropertyGuru**](https://www.propertyguru.ae), a real estate website marketplace built on **Next.js** and **Strapi**, which pulled in **10K+** daily visitors. Driving UI/UX, SEO, and performance improvements; reworked key pages from runtime SSR to **SSG + ISR** to reduce request-time server work and improve initial load performance.

### Highlights:
- Built **Next.js realtor leads platform** for PropertyGuru with **RBAC**, lead assignment, salesperson workflows, and follow-ups, backed by **Strapi** authentication/APIs; contributed to **SQL/query and backend optimizations** to improve response times.
- Built US-based student-mentor platform [**Draftus**](https://www.draftus.com) - **mobile-first Next.js + Supabase** web app, a US-based online social talent mining application (MVP), continuing in a full-stack role.
- Google Meet automated [**stand-up bot**](https://github.com/Shanvit7/daily-standup-bot) using **Agno** that daily joins and pings absentees on Slack.
- Used **Cursor** (Agentic IDE) and **v0.dev** for rapid UI iteration
`,
    what_i_did: [
      'made facial recognition python service used throughout multiple internal projects',
      'built automated bot to join daily standup Meet and ping absentees on slack',
      'worked on a website with 10k+ daily visitors',
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
After graduating, I joined **Iotric** as an **SDE-I**, starting with [**myIDFi**](https://myidfi.com), a mortgage comparison platform built with **React**, **Material UI**, and **RTK Query**. Later, joined [**Enoobs**](https://www.enoobs.com), Iotric's first in-house product — a social media platform built exclusively for gamers — where I led the frontend and managed two interns,collaborating across teams.

### Highlights:
- Shipped production UI for **myIDFi**; effectively used **AI** early on to boost development and debugging
- Led frontend for **Enoobs** using **Next.js**, coordinated with designers, proposed & shipped new features
- Built a [**npm** chatbot package](https://www.npmjs.com/package/qie-chatbot), later evolved into a [**full-fledged product**](https://botric.ai) by the company
- Worked as a **backend engineer** for few projects for self-learning
- Mentored interns and worked cross-functionally across product and design

A fast-paced, high-growth phase filled with learning and real-world impact.
`,
    what_i_did: [
      'built a gamers-only social platform from scratch using next-js',
      'developed and published chatbot npm package',
      'shipped features and bug fixes to mortgage platform',
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
    id: 'active-4',
    name: 'tabot',
    description:
      'Local-first work-memory layer for browser workers — turns browser activity into structured, portable context you own.',
    type: 'OSS',
    link: 'https://shanvit7.github.io/tabot/',
    links: [
      { label: 'GitHub', url: 'https://github.com/Shanvit7/tabot' },
      { label: 'Live', url: 'https://shanvit7.github.io/tabot/' },
    ],
  },
  {
    id: 'active-2',
    name: 'pi-llm-wiki',
    description:
      'Self-maintaining Obsidian-compatible knowledge base for pi — turns raw sources into an interlinked wiki over time.',
    type: 'OSS',
    link: 'https://github.com/zosmaai/pi-llm-wiki',
    links: [{ label: 'GitHub', url: 'https://github.com/zosmaai/pi-llm-wiki' }],
  },
  {
    id: 'active-3',
    name: 'zosma-cowork',
    description:
      'Desktop GUI for the pi coding agent — open-source Claude Cowork alternative.',
    type: 'OSS',
    link: 'https://github.com/zosmaai/zosma-cowork',
    links: [
      { label: 'GitHub', url: 'https://github.com/zosmaai/zosma-cowork' },
    ],
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
