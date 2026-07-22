'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[60vh] place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">FinPilot could not load this page.</p>
        <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  )
}
