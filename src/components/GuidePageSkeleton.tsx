export function GuidePageSkeleton() {
  return (
    <article
      className="mx-auto max-w-3xl animate-pulse px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-label="Loading guide"
    >
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 rounded-md bg-gold/10" />
        <div className="h-6 w-24 rounded-md bg-gold/10" />
        <div className="h-6 w-16 rounded-md bg-gold/10" />
      </div>
      <div className="mt-6 h-10 w-4/5 max-w-lg rounded-lg bg-parchment/10" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-parchment/10" />
        <div className="h-4 w-11/12 rounded bg-parchment/10" />
        <div className="h-4 w-4/5 rounded bg-parchment/10" />
      </div>
      <div className="mt-8 h-40 rounded-xl border border-gold/10 bg-gold/5" />
      <div className="mt-8 space-y-3">
        <div className="h-6 w-32 rounded bg-parchment/10" />
        <div className="h-4 w-full rounded bg-parchment/10" />
        <div className="h-4 w-full rounded bg-parchment/10" />
        <div className="h-4 w-5/6 rounded bg-parchment/10" />
      </div>
    </article>
  );
}

export function GuidesListSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-label="Loading guides"
    >
      <div className="h-10 w-64 rounded-lg bg-parchment/10" />
      <div className="mt-4 h-4 w-96 max-w-full rounded bg-parchment/10" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-56 rounded-xl border border-gold/10 bg-obsidian-light/60"
          />
        ))}
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse px-4 py-16 sm:px-6"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-10 w-72 max-w-full rounded-lg bg-parchment/10" />
      <div className="mt-4 h-4 w-full max-w-xl rounded bg-parchment/10" />
      <div className="mt-8 h-48 rounded-xl border border-gold/10 bg-obsidian-light/50" />
    </div>
  );
}
