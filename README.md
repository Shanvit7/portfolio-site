# Shanvit S Shetty | Portfolio

Personal portfolio for Shanvit S Shetty, a software engineer building web products and exploring machine learning, LLMs, and agentic systems.

## Stack

- Next.js App Router, React 19, TypeScript
- Tailwind CSS 4 and CSS Modules
- Motion and Remotion

## Run locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

`NEXT_PUBLIC_SITE_URL` defaults to `https://shanvit.vercel.app` and supplies canonical metadata, JSON-LD, robots, and sitemap URLs. Set it to the production origin if the site domain changes.

Other optional public profile links and contact details are listed in `.env.example`. Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` to enable pageview and custom-event tracking; script URL defaults to Umami Cloud and can point to self-hosted Umami. Tracking is limited to the hostname in `NEXT_PUBLIC_SITE_URL`.

## Checks and production build

```bash
pnpm check
pnpm build
pnpm start
```

Performance measurements and regression commands: [CWV notes](research/cwv-optimization.md).
The local English Rubik Dirt subset can be regenerated with `node scripts/subset-crayon-font.mjs`; extend its character set before adding other display languages.
