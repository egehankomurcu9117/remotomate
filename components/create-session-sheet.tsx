'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BottomSheet } from '@/components/bottom-sheet'
import { cn } from '@/lib/utils'
import { focusLabels } from '@/lib/mock-data'
import type { WorkFocus, WorkSession } from '@/lib/types'

const focusOptions = Object.entries(focusLabels) as [WorkFocus, string][]
const startOptions = [15, 30, 60]
const durationOptions = [45, 60, 90, 120]

export function CreateSessionSheet({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (session: WorkSession) => void
}) {
  const [title, setTitle] = useState('')
  const [place, setPlace] = useState('')
  const [focus, setFocus] = useState<WorkFocus>('deep-work')
  const [startIn, setStartIn] = useState(30)
  const [duration, setDuration] = useState(90)
  const [capacity, setCapacity] = useState(4)
  const [note, setNote] = useState('')

  const valid = title.trim().length > 2 && place.trim().length > 2

  function reset() {
    setTitle('')
    setPlace('')
    setFocus('deep-work')
    setStartIn(30)
    setDuration(90)
    setCapacity(4)
    setNote('')
  }

  function submit() {
    if (!valid) return
    onCreate({
      id: `s-${Date.now()}`,
      title: title.trim(),
      hostId: 'me',
      focus,
      place: place.trim(),
      area: 'Your area',
      distanceMeters: 0,
      startsInMin: startIn,
      durationMin: duration,
      capacity,
      attendeeIds: ['me'],
      note: note.trim() || 'Come focus together.',
    })
    reset()
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Start a work session">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="font-display text-xl font-semibold">Host a session</h3>
          <p className="text-sm text-muted-foreground">
            Invite nearby workers to focus alongside you.
          </p>
        </div>

        <Field label="What are you working on?">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning deep work block"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Where?">
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Quiet cafe corner · name of the spot"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Focus type">
          <div className="flex flex-wrap gap-2">
            {focusOptions.map(([key, label]) => (
              <Chip key={key} active={focus === key} onClick={() => setFocus(key)}>
                {label}
              </Chip>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts in">
            <div className="flex gap-2">
              {startOptions.map((m) => (
                <Chip key={m} active={startIn === m} onClick={() => setStartIn(m)}>
                  {m}m
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Duration">
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((m) => (
                <Chip key={m} active={duration === m} onClick={() => setDuration(m)}>
                  {m < 60 ? `${m}m` : `${m / 60}h`}
                </Chip>
              ))}
            </div>
          </Field>
        </div>

        <Field label={`Group size · up to ${capacity}`}>
          <input
            type="range"
            min={2}
            max={8}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </Field>

        <Field label="A note on the vibe (optional)">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Silent focus, short chat on breaks."
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Button className="w-full rounded-full" disabled={!valid} onClick={submit}>
          Publish session
        </Button>
      </div>
    </BottomSheet>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}
