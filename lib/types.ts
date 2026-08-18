// Domain types for Remotomate.
// Shapes mirror a future Supabase schema (snake_case columns map to these camelCase fields).

export type WorkFocus =
  | 'deep-work'
  | 'meetings'
  | 'admin'
  | 'creative'
  | 'learning'
  | 'casual'

export type PresenceStatus = 'focusing' | 'available' | 'on-break'

export interface Worker {
  id: string
  name: string
  role: string
  /** 2-letter initials used for the avatar. */
  initials: string
  /** Approximate distance from the current user, in meters. */
  distanceMeters: number
  /** Position on the proximity radar, in the range [-1, 1] for x and y. */
  radar: { x: number; y: number }
  status: PresenceStatus
  focus: WorkFocus
  /** What they're working on right now — a short, human sentence. */
  headline: string
  /** Minutes they've been in their current focus block. */
  focusingForMin: number
  /** Whether this worker is currently hosting an open session. */
  hostingSessionId?: string
  /** Loose neighborhood label (never a precise address — privacy first). */
  area: string
}

export interface WorkSession {
  id: string
  title: string
  hostId: string
  focus: WorkFocus
  /** Loose venue name / vibe (e.g. "Quiet cafe corner"). */
  place: string
  area: string
  distanceMeters: number
  /** Minutes from "now" (app load) until the session starts. */
  startsInMin: number
  /** Resolved ISO start time, computed on the client after mount. */
  startsAt?: string
  /** Length of the session in minutes. */
  durationMin: number
  capacity: number
  attendeeIds: string[]
  /** Short host note about the vibe / expectations. */
  note: string
}

export interface CurrentUser {
  id: string
  name: string
  initials: string
  role: string
  status: PresenceStatus
  focus: WorkFocus
  /** Whether the user is broadcasting their presence to nearby workers. */
  isVisible: boolean
}
