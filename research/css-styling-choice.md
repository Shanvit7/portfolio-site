# CSS approach: Tailwind vs. StyleX

## Recommendation

Do not migrate the portfolio wholesale. Keep the existing CSS Modules for its bespoke page and motion/layout styling. If choosing one of the two for future utility styling, choose Tailwind: Tailwind v4 is already installed and configured, while StyleX adds a new compilation pipeline that this site does not currently need.

## Repository evidence

- `package.json` already includes `tailwindcss` 4.1, `@tailwindcss/postcss`, and `@tailwindcss/typography`.
- `postcss.config.mjs` already registers `@tailwindcss/postcss`; `app/globals.css` imports Tailwind.
- The main portfolio styling lives in `app/components/portfolio/stories/paper.module.css` and `court.module.css` (roughly 1,116 lines combined), covering custom responsive layouts, visual treatments, animation, and reduced-motion behavior.
- The only literal utility-class usage found is `bg-white antialiased` on the root body. Most UI styling uses CSS Modules.

## Tradeoffs

- **Tailwind:** lowest adoption cost here because v4 is already wired. Good fit if the team wants utility-first authoring and rapid layout changes. Replacing the existing detailed CSS Modules would be a style migration, not a capability upgrade.
- **StyleX:** official docs describe it as compile-time atomic CSS with composable/type-safe styles, optimized for large or growing JavaScript-authored UI and reusable components. Its documented Next.js setup adds a Babel config and StyleX-aware PostCSS configuration. That setup cost is hard to justify for this mostly bespoke, CSS-Module-based portfolio.
- **CSS Modules (current):** simplest fit for the site’s long, component-scoped rules and distinctive responsive/motion behavior. No need to move these rules into either framework.

## Sources (official)

- Tailwind, Next.js installation: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- StyleX, ideal use cases: https://stylexjs.com/docs/learn/
- StyleX, installation overview and compiler approaches: https://stylexjs.com/docs/learn/installation/
- StyleX, Next.js setup: https://stylexjs.com/docs/learn/installation/nextjs/
