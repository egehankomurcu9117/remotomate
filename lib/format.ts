export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatWalk(meters: number): string {
  // ~1.35 m/s walking pace.
  const min = Math.max(1, Math.round(meters / 1.35 / 60))
  return `${min} min walk`
}

export function formatStartsIn(diffMin: number): string {
  if (diffMin <= 0) return 'Started'
  if (diffMin < 60) return `in ${diffMin} min`
  const hours = Math.floor(diffMin / 60)
  const rest = diffMin % 60
  return rest ? `in ${hours}h ${rest}m` : `in ${hours}h`
}

/**
 * Clock time for a session that starts `minFromBase` minutes after `baseMs`.
 * Returns null until a client base time is available, so SSR renders a
 * neutral placeholder and avoids a hydration mismatch.
 */
export function formatClockFromNow(
  minFromBase: number,
  baseMs: number | null,
): string {
  if (baseMs === null) return '--:--'
  return new Date(baseMs + minFromBase * 60_000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`
  const hours = Math.floor(min / 60)
  const rest = min % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}
