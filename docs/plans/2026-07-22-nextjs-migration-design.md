# Next.js Migration Design

## Goal

Migrate FinPilot from a Vite-hosted React single-page application to a native Next.js App Router application without changing its current UI, sample-data model, or browser-persisted behavior.

## Architecture

Next.js will own routing through the `app/` directory. Route groups will separate marketing, authentication, and authenticated-application layouts without changing public URLs. Existing screens will move to `src/screens` as reusable client components so Next does not mistake them for its legacy Pages Router, while small server `page.tsx` files provide native routes, metadata boundaries, redirects, and dynamic segments. The marketing and application layouts will accept `children` rather than React Router's `Outlet`.

The first migration deliberately keeps Zustand persistence, mock authentication, forms, charts, and browser APIs on the client. A small navigation compatibility module will expose the existing `Link`, `NavLink`, and hook shapes while implementing them with `next/link` and `next/navigation`. This reduces risky mechanical changes across more than thirty mature screens while removing React Router from the runtime. Search-parameter handling will update the URL through the Next router, and active-link matching will derive from `usePathname`.

The root layout will import global CSS, define site metadata, initialize theme behavior, and render the toaster. Vite entry/configuration files and Vite-only dependencies will be removed. Next.js will use the existing Tailwind configuration and `@/*` TypeScript alias. Public browser configuration will use the `NEXT_PUBLIC_` prefix.

## Error Handling and Verification

Next's `not-found.tsx`, `error.tsx`, and `global-error.tsx` conventions will provide route and runtime fallbacks. A migration contract test will verify the required route tree and ensure Vite/React Router are absent from runtime configuration. Verification will include the contract test, ESLint, TypeScript/production build, and representative browser navigation across static, redirected, query-string, and dynamic routes. No database, server authentication, or API migration is included.
