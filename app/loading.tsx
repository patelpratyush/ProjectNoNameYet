export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-4 p-6" aria-label="Loading">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-32 rounded-xl bg-muted" />
      <div className="h-32 rounded-xl bg-muted" />
    </div>
  )
}
