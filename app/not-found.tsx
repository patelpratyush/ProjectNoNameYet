import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you requested does not exist.</p>
        <Link className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/">
          Return home
        </Link>
      </div>
    </main>
  )
}
