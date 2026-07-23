import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))
const root = new URL('../', import.meta.url)

test('package uses Next.js without Vite or React Router', () => {
  assert.match(packageJson.dependencies.next, /^\^16\./)
  assert.equal(packageJson.scripts.dev, 'next dev')
  assert.equal(packageJson.scripts.build, 'next build')
  assert.equal(packageJson.scripts.start, 'next start')
  assert.equal(packageJson.dependencies.next !== undefined, true)
  assert.equal(packageJson.dependencies['react-router'], undefined)
  assert.equal(packageJson.dependencies['react-router-dom'], undefined)
  assert.equal(packageJson.devDependencies.vite, undefined)
})

test('all existing URLs have native App Router pages', () => {
  const pageFiles = [
    'app/(marketing)/page.tsx',
    'app/(marketing)/features/page.tsx',
    'app/(marketing)/pricing/page.tsx',
    'app/(marketing)/security/page.tsx',
    'app/(marketing)/about/page.tsx',
    'app/(marketing)/contact/page.tsx',
    'app/(marketing)/help/page.tsx',
    'app/(marketing)/privacy/page.tsx',
    'app/(marketing)/terms/page.tsx',
    'app/(auth)/sign-in/page.tsx',
    'app/(auth)/sign-up/page.tsx',
    'app/(auth)/forgot-password/page.tsx',
    'app/(auth)/reset-password/page.tsx',
    'app/(auth)/verify-email/page.tsx',
    'app/onboarding/page.tsx',
    'app/app/page.tsx',
    'app/app/dashboard/page.tsx',
    'app/app/transactions/page.tsx',
    'app/app/transactions/import/page.tsx',
    'app/app/budgets/page.tsx',
    'app/app/accounts/page.tsx',
    'app/app/accounts/[id]/page.tsx',
    'app/app/debt/page.tsx',
    'app/app/debt/payoff-planner/page.tsx',
    'app/app/loans/car-calculator/page.tsx',
    'app/app/loans/calculator/page.tsx',
    'app/app/loans/scenarios/page.tsx',
    'app/app/loans/[id]/amortization/page.tsx',
    'app/app/goals/page.tsx',
    'app/app/goals/[id]/page.tsx',
    'app/app/bills/page.tsx',
    'app/app/stocks/page.tsx',
    'app/app/stocks/[ticker]/page.tsx',
    'app/app/reports/page.tsx',
    'app/app/notifications/page.tsx',
    'app/app/settings/page.tsx',
    'app/app/settings/[section]/page.tsx',
  ]

  const missing = pageFiles.filter((file) => !existsSync(new URL(file, root)))
  assert.deepEqual(missing, [])
})

test('legacy Vite entry points and React Router imports are removed', () => {
  assert.equal(existsSync(new URL('vite.config.ts', root)), false)
  assert.equal(existsSync(new URL('src/main.tsx', root)), false)
  assert.equal(existsSync(new URL('src/App.tsx', root)), false)

  const sourceFiles = readdirSync(new URL('src/', root), { recursive: true })
    .filter((file) => /\.[cm]?[jt]sx?$/.test(file))
  const legacyImports = sourceFiles.filter((file) => {
    const source = readFileSync(new URL(`src/${file}`, root), 'utf8')
    return /from ['"]react-router(?:-dom)?['"]/.test(source)
  })

  assert.deepEqual(legacyImports, [])
  assert.equal(existsSync(new URL('src/lib/navigation.tsx', root)), true)
})

test('reusable screens do not collide with Next router directories', () => {
  assert.equal(existsSync(new URL('src/pages', root)), false)
  assert.equal(existsSync(new URL('src/screens', root)), true)

  const appFiles = readdirSync(new URL('app/', root), { recursive: true })
    .filter((file) => /\.[cm]?[jt]sx?$/.test(file))
  const legacyScreenImports = appFiles.filter((file) =>
    readFileSync(new URL(`app/${file}`, root), 'utf8').includes("from '@/pages/"),
  )
  assert.deepEqual(legacyScreenImports, [])
})

test('Tailwind 3 sources do not contain Tailwind 4 variable shorthand', () => {
  const componentFiles = readdirSync(new URL('src/', root), { recursive: true })
    .filter((file) => /\.[jt]sx?$/.test(file))
  const incompatible = componentFiles.filter((file) => {
    const source = readFileSync(new URL(`src/${file}`, root), 'utf8')
    return /--spacing\(|[a-z-]+-\(--/.test(source)
  })
  assert.deepEqual(incompatible, [])
})
