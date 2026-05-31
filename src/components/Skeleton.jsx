export function SkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-8 w-12 rounded-xl" />
        </div>
        <div className="skeleton h-7 w-24 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-20 rounded-xl" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="skeleton h-14 w-full rounded-xl" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  )
}

export function SkeletonProductCard() {
  return (
    <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-10 w-28 rounded-2xl" />
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="glass-strong rounded-[1.75rem] p-6 space-y-4">
      <div className="skeleton h-12 w-12 rounded-2xl" />
      <div className="skeleton h-3 w-24 rounded-lg" />
      <div className="skeleton h-8 w-20 rounded-xl" />
    </div>
  )
}

export function SkeletonKitchen() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
