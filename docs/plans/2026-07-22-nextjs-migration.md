# Next.js Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the existing FinPilot Vite/React Router frontend into a native Next.js App Router frontend while preserving all current routes and browser-local behavior.

**Architecture:** Native `app/` route files and layouts will wrap the existing screens, which remain client components. A focused navigation adapter backed by `next/link` and `next/navigation` will preserve existing component APIs while React Router and Vite are removed.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Zustand, Node test runner

---

### Task 1: Add a failing migration contract

**Files:**
- Create: `tests/next-migration.test.mjs`
- Modify: `package.json`

**Step 1: Write the failing test**

Add Node tests that assert the package uses Next scripts without Vite or React Router and that every current static/dynamic URL has a corresponding `app/**/page.tsx` file.

**Step 2: Run test to verify it fails**

Run: `node --test tests/next-migration.test.mjs`

Expected: FAIL because the package and App Router tree still use Vite and React Router.

### Task 2: Replace the build tool configuration

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `eslint.config.js`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Delete: `vite.config.ts`
- Delete: `index.html`
- Delete: `tsconfig.app.json`
- Delete: `tsconfig.node.json`

**Step 1: Update dependencies and scripts**

Replace Vite scripts/packages with Next.js, remove React Router and the Vite inspection plugin, and add `test`, `dev`, `build`, `start`, and `lint` scripts suitable for Next.js.

**Step 2: Install from the lockfile definition**

Run: `npm install`

Expected: dependencies install and `package-lock.json` updates without audit errors blocking installation.

**Step 3: Configure TypeScript, Next, and ESLint**

Use Next's bundler module resolution, JSX preservation, Next plugin, and flat ESLint presets while retaining strict TypeScript and `@/*` aliases.

### Task 3: Create the native App Router tree

**Files:**
- Create: `app/layout.tsx`
- Create: `app/providers.tsx`
- Create: `app/loading.tsx`
- Create: `app/error.tsx`
- Create: `app/global-error.tsx`
- Create: `app/not-found.tsx`
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/**/page.tsx`
- Create: `app/(auth)/**/page.tsx`
- Create: `app/onboarding/page.tsx`
- Create: `app/app/layout.tsx`
- Create: `app/app/**/page.tsx`

**Step 1: Add root layout and providers**

Import global CSS, expose metadata, mount theme/toast client behavior, and add Next error/loading conventions.

**Step 2: Map every existing route**

Create thin pages for all marketing, auth, onboarding, application, redirect, and dynamic routes from `src/App.tsx`.

**Step 3: Run the contract test**

Run: `node --test tests/next-migration.test.mjs`

Expected: route-file assertions pass; dependency assertions may remain failing until Task 4 is complete.

### Task 4: Replace React Router integration

**Files:**
- Create: `src/lib/navigation.tsx`
- Modify: `src/components/layout/MarketingLayout.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: all files importing `react-router` under `src/`
- Move: `src/pages/` to `src/screens/`
- Modify: all screen components under `src/screens/`
- Modify: `src/services/api.ts`
- Delete: `src/App.tsx`
- Delete: `src/main.tsx`

**Step 1: Implement Next-backed navigation primitives**

Implement `Link`, `NavLink`, `useNavigate`, `useLocation`, `useParams`, and a React-Router-compatible `useSearchParams` using Next primitives.

**Step 2: Convert layout outlets to children**

Give both shared layouts typed `children`, preserve transitions and active states, and wrap path/search hooks in the route-level loading boundary as needed.

**Step 3: Establish client boundaries**

Mark hook-driven existing screens and layouts as client components without moving browser-only state into server components.

**Step 4: Rename the public API environment variable**

Change `VITE_API_BASE_URL` to `NEXT_PUBLIC_API_BASE_URL`.

**Step 5: Run the contract test**

Run: `npm test`

Expected: PASS with all migration contract assertions green.

### Task 5: Resolve build and lint integration issues

**Files:**
- Modify: only files reported by TypeScript, Next build, or ESLint

**Step 1: Run lint**

Run: `npm run lint`

Expected: exit 0 with no lint errors.

**Step 2: Run production build**

Run: `npm run build`

Expected: exit 0 and all static/dynamic routes appear in the Next build route summary.

**Step 3: Re-run all automated checks**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0.

### Task 6: Verify representative routes in a browser

**Files:**
- Modify: only files needed to fix reproduced navigation or hydration defects

**Step 1: Start the development server**

Run: `npm run dev`

Expected: Next reports a local URL and accepts requests.

**Step 2: Exercise representative routes**

Check `/`, `/features`, `/sign-in`, `/app` redirect, `/app/dashboard`, `/app/accounts?add=1`, one account detail, one stock detail, one goal detail, and `/app/settings` redirect. Confirm navigation, persisted state, dynamic parameters, query parameters, and 404 behavior.

**Step 3: Perform final verification**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0 after browser verification fixes.
