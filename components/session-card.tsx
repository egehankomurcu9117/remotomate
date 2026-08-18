'use client'

import { Clock, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatClockFromNow,
  formatDistance,
  formatDuration,
  formatStartsIn,
} from '@/lib/format'
import { focusLabels, getWorker } from '@/lib/mock-data'
import { Avatar } from '@/components/presence'
import type { WorkSession } from '@/lib/types'

export function SessionCard({
  session,
  joined,
  nowMs,
  onOpen,
}: {
  session: WorkSession
  joined: boolean
  nowMs: number | null
  onOpen: (session: WorkSession) => void
}) {
  const host = getWorker(session.hostId)
  const spotsLeft = session.capacity - session.attendeeIds.length
  const attendees = session.attendeeIds
    .map((id) => getWorker(id))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <button
      type="button"
      onClick={() => onOpen(session)}
      className={cn(
        'group flex w-full flex-col gap-4 rounded-3xl border p-5 text-left transition',
        joined
          ? 'border-primary/50 bg-primary/[0.06]'
          : 'border-border bg-card hover:border-primary/40 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            {focusLabels[session.focus]}
          </span>
          <p className="mt-2 font-display text-lg font-semibold leading-tight text-balance">
            {session.title}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-secondary px-3 py-2 text-center">
          <p className="text-sm font-semibold leading-none">
            {formatClockFromNow(session.startsInMin, nowMs)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatStartsIn(session.startsInMin)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {session.place}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {formatDuration(session.durationMin)}
        </span>
        <span className="inline-flex items-center gap-1">
          {formatDistance(session.distanceMeters)} away
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {attendees.map((a) => (
              <Avatar
                key={a!.id}
                id={a!.id}
                initials={a!.initials}
                size="sm"
                className="border-2 border-card"
              />
            ))}
          </div>
          <span className="ml-3 text-xs text-muted-foreground">
            Hosted by {host?.name.split(' ')[0] ?? 'someone'}
          </span>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold',
            joined
              ? 'bg-primary text-primary-foreground'
              : spotsLeft <= 1
                ? 'bg-chart-2/20 text-chart-2'
                : 'bg-online/15 text-online',
          )}
        >
          <Users className="size-3.5" />
          {joined ? 'Joined' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`}
        </span>
      </div>
    </button>
  )
}
