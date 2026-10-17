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

Set `NEXT_PUBLIC_SITE_URL` to the deployed site's canonical origin, for example `https://your-domain.example`. This supplies `metadataBase` and enables the homepage canonical and Open Graph URL. Leave unset locally if no public origin is configured.

Other optional public profile links and contact details are listed in `.env.example`.

## Checks and production build

```bash
pnpm check
pnpm build
pnpm start
```
