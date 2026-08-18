'use client'

import { cn } from '@/lib/utils'
import { formatDistance } from '@/lib/format'
import { statusConfig } from '@/components/presence'
import type { CurrentUser, Worker } from '@/lib/types'

export function ProximityRadar({
  workers,
  user,
  selectedId,
  onSelect,
}: {
  workers: Worker[]
  user: CurrentUser
  selectedId?: string
  onSelect: (id: string) => void
}) {
  const rings = [0.34, 0.62, 0.9]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      {/* Range rings */}
      {rings.map((r, i) => (
        <div
          key={r}
          className="absolute rounded-full border border-border/70"
          style={{
            inset: `${(1 - r) * 50}%`,
            opacity: 1 - i * 0.22,
          }}
        />
      ))}

      {/* Animated presence ping */}
      <span className="absolute inset-0 m-auto size-full rounded-full bg-primary/10 animate-radar-ping" />

      {/* Distance labels */}
      <span className="absolute left-1/2 top-[5%] -translate-x-1/2 text-[10px] font-medium text-muted-foreground">
        ~800 m
      </span>

      {/* Center: current user */}
      <div className="absolute inset-0 m-auto flex size-14 flex-col items-center justify-center">
        <div
          className={cn(
            'flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30',
          )}
        >
          <span className="font-display text-sm font-semibold">{user.initials}</span>
        </div>
      </div>

      {/* Worker dots */}
      {workers.map((w) => {
        const left = 50 + w.radar.x * 45
        const top = 50 + w.radar.y * 45
        const active = selectedId === w.id
        const config = statusConfig[w.status]
        return (
          <button
            key={w.id}
            type="button"
            onClick={() => onSelect(w.id)}
            className={cn(
              'absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full outline-none transition',
              'focus-visible:ring-2 focus-visible:ring-ring',
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-label={`${w.name}, ${formatDistance(w.distanceMeters)} away, ${config.label}`}
          >
            <span className="relative flex items-center justify-center">
              {active && (
                <span className="absolute size-10 rounded-full bg-primary/20 animate-soft-pulse" />
              )}
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 border-background bg-card text-[11px] font-semibold font-display shadow-md transition',
                  active ? 'ring-2 ring-primary scale-110' : 'ring-1 ring-border',
                )}
              >
                {w.initials}
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
                    config.dot,
                  )}
                />
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
