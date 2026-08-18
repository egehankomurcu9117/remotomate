'use client'

import { MapPin, Timer, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistance, formatWalk } from '@/lib/format'
import { focusLabels } from '@/lib/mock-data'
import { Avatar, StatusPill } from '@/components/presence'
import type { Worker } from '@/lib/types'

export function WorkerCard({
  worker,
  onOpen,
}: {
  worker: Worker
  onOpen: (worker: Worker) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(worker)}
      className={cn(
        'group flex w-full items-start gap-3 rounded-3xl border border-border bg-card p-4 text-left transition',
        'hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <Avatar id={worker.id} initials={worker.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-display text-base font-semibold leading-tight">
            {worker.name}
          </p>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {formatDistance(worker.distanceMeters)}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{worker.role}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/90">
          {worker.headline}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusPill status={worker.status} />
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {focusLabels[worker.focus]}
          </span>
          {worker.hostingSessionId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary">
              <Users className="size-3" />
              Hosting
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {worker.area}
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="size-3.5" />
            {worker.focusingForMin}m in
          </span>
          <span className="ml-auto text-[11px]">{formatWalk(worker.distanceMeters)}</span>
        </div>
      </div>
    </button>
  )
}
