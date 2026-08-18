import { cn } from '@/lib/utils'
import type { PresenceStatus } from '@/lib/types'

const statusConfig: Record<
  PresenceStatus,
  { label: string; dot: string; ring: string }
> = {
  focusing: {
    label: 'Focusing',
    dot: 'bg-primary',
    ring: 'ring-primary/25',
  },
  available: {
    label: 'Available',
    dot: 'bg-online',
    ring: 'ring-online/25',
  },
  'on-break': {
    label: 'On a break',
    dot: 'bg-chart-2',
    ring: 'ring-chart-2/25',
  },
}

const avatarTones = [
  'bg-primary/15 text-primary',
  'bg-online/15 text-online',
  'bg-chart-2/20 text-chart-2',
  'bg-chart-4/15 text-chart-4',
  'bg-accent text-accent-foreground',
]

export function toneForId(id: string): string {
  let sum = 0
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  return avatarTones[sum % avatarTones.length]
}

export function Avatar({
  initials,
  id,
  size = 'md',
  className,
}: {
  initials: string
  id: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'size-9 text-xs',
    md: 'size-11 text-sm',
    lg: 'size-16 text-lg',
  }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold font-display tracking-wide',
        sizes[size],
        toneForId(id),
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  )
}

export function StatusPill({
  status,
  className,
}: {
  status: PresenceStatus
  className?: string
}) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

export function StatusDot({
  status,
  className,
}: {
  status: PresenceStatus
  className?: string
}) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-block size-3 rounded-full ring-4',
        config.dot,
        config.ring,
        className,
      )}
    />
  )
}

export { statusConfig }
