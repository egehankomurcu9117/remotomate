'use client'

import { useState } from 'react'
import { Hand, MapPin, Timer, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BottomSheet } from '@/components/bottom-sheet'
import { Avatar, StatusPill } from '@/components/presence'
import { focusLabels, sessions } from '@/lib/mock-data'
import { formatDistance, formatWalk } from '@/lib/format'
import type { Worker, WorkSession } from '@/lib/types'

export function WorkerSheet({
  worker,
  onClose,
  onOpenSession,
}: {
  worker: Worker | null
  onClose: () => void
  onOpenSession: (session: WorkSession) => void
}) {
  const [waved, setWaved] = useState(false)
  const hostedSession = worker?.hostingSessionId
    ? sessions.find((s) => s.id === worker.hostingSessionId)
    : undefined

  return (
    <BottomSheet open={!!worker} onClose={onClose} title="Nearby worker">
      {worker && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar id={worker.id} initials={worker.initials} size="lg" />
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold leading-tight">
                {worker.name}
              </h3>
              <p className="text-sm text-muted-foreground">{worker.role}</p>
              <div className="mt-2">
                <StatusPill status={worker.status} />
              </div>
            </div>
          </div>

          <p className="rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed">
            &ldquo;{worker.headline}&rdquo;
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat icon={<MapPin className="size-4" />} label="Distance" value={formatDistance(worker.distanceMeters)} />
            <Stat icon={<Timer className="size-4" />} label="Focusing" value={`${worker.focusingForMin}m`} />
            <Stat icon={<Users className="size-4" />} label="Focus" value={focusLabels[worker.focus]} />
          </div>

          <p className="text-xs text-muted-foreground">
            {worker.area} · {formatWalk(worker.distanceMeters)}. Exact location stays private
            until you both agree to meet.
          </p>

          {hostedSession && (
            <div className="rounded-2xl border border-primary/40 bg-primary/[0.06] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Hosting a session
              </p>
              <p className="mt-1 font-display text-base font-semibold">{hostedSession.title}</p>
              <Button
                variant="outline"
                className="mt-3 w-full rounded-full"
                onClick={() => onOpenSession(hostedSession)}
              >
                View session
              </Button>
            </div>
          )}

          <Button
            className="w-full rounded-full"
            onClick={() => setWaved(true)}
            disabled={waved}
          >
            <Hand className="size-4" />
            {waved ? 'Wave sent — say hi on their next break' : 'Send a friendly wave'}
          </Button>
        </div>
      )}
    </BottomSheet>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3">
      <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-card text-primary">
        {icon}
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
