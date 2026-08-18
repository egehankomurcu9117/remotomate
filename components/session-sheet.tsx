'use client'

import { Check, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BottomSheet } from '@/components/bottom-sheet'
import { Avatar } from '@/components/presence'
import { focusLabels, getWorker } from '@/lib/mock-data'
import {
  formatClockFromNow,
  formatDistance,
  formatDuration,
  formatStartsIn,
} from '@/lib/format'
import type { WorkSession } from '@/lib/types'

export function SessionSheet({
  session,
  joined,
  nowMs,
  onClose,
  onToggleJoin,
}: {
  session: WorkSession | null
  joined: boolean
  nowMs: number | null
  onClose: () => void
  onToggleJoin: (id: string) => void
}) {
  const host = session ? getWorker(session.hostId) : undefined
  const attendees = session
    ? session.attendeeIds.map((id) => getWorker(id)).filter(Boolean)
    : []
  const spotsLeft = session ? session.capacity - session.attendeeIds.length : 0

  return (
    <BottomSheet open={!!session} onClose={onClose} title="Work session">
      {session && (
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
              {focusLabels[session.focus]}
            </span>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-balance">
              {session.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Row icon={<Clock className="size-4" />}>
              <span className="font-medium text-foreground">
                {formatClockFromNow(session.startsInMin, nowMs)}
              </span>{' '}
              · {formatDuration(session.durationMin)} · starts{' '}
              {formatStartsIn(session.startsInMin)}
            </Row>
            <Row icon={<MapPin className="size-4" />}>
              {session.place} · {formatDistance(session.distanceMeters)} away
            </Row>
            <Row icon={<Users className="size-4" />}>
              {session.attendeeIds.length} going · {spotsLeft} spot
              {spotsLeft === 1 ? '' : 's'} left
            </Row>
          </div>

          <p className="rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed">
            {session.note}
          </p>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Who&apos;s coming</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {attendees.map((a) => (
                <div key={a!.id} className="flex items-center gap-2">
                  <Avatar id={a!.id} initials={a!.initials} size="sm" />
                  <span className="text-sm">
                    {a!.name.split(' ')[0]}
                    {a!.id === session.hostId && (
                      <span className="ml-1 text-[10px] text-primary">host</span>
                    )}
                  </span>
                </div>
              ))}
              {joined && (
                <div className="flex items-center gap-2">
                  <Avatar id="me" initials="YO" size="sm" />
                  <span className="text-sm">You</span>
                </div>
              )}
            </div>
          </div>

          <Button
            className="w-full rounded-full"
            variant={joined ? 'outline' : 'default'}
            onClick={() => onToggleJoin(session.id)}
          >
            {joined ? (
              <>
                <Check className="size-4" />
                You&apos;re in — tap to leave
              </>
            ) : (
              <>Request to join · {formatClockFromNow(session.startsInMin, nowMs)}</>
            )}
          </Button>
          {!joined && (
            <p className="-mt-2 text-center text-xs text-muted-foreground">
              {host?.name.split(' ')[0]} gets notified and shares the exact spot once you join.
            </p>
          )}
        </div>
      )}
    </BottomSheet>
  )
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  )
}
