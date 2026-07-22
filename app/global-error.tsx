'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold">FinPilot encountered an error</h1>
            <button className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white" onClick={reset}>
              Reload application
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
