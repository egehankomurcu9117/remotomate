'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, MapPin, Plus, Radar, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentUser, sessions as seedSessions, workers } from '@/lib/mock-data'
import type { WorkSession, Worker } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ProximityRadar } from '@/components/proximity-radar'
import { WorkerCard } from '@/components/worker-card'
import { SessionCard } from '@/components/session-card'
import { WorkerSheet } from '@/components/worker-sheet'
import { SessionSheet } from '@/components/session-sheet'
import { CreateSessionSheet } from '@/components/create-session-sheet'

type Tab = 'people' | 'sessions'

export default function Page() {
  const [tab, setTab] = useState<Tab>('people')
  const [visible, setVisible] = useState(currentUser.isVisible)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [selectedSession, setSelectedSession] = useState<WorkSession | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [sessionList, setSessionList] = useState<WorkSession[]>(seedSessions)
  const [joinedIds, setJoinedIds] = useState<string[]>([])
  // Fixed client base time, set once after mount — avoids SSR/client drift.
  const [nowMs, setNowMs] = useState<number | null>(null)

  useEffect(() => {
    setNowMs(Date.now())
  }, [])

  const sortedWorkers = useMemo(
    () => [...workers].sort((a, b) => a.distanceMeters - b.distanceMeters),
    [],
  )
  const sortedSessions = useMemo(
    () => [...sessionList].sort((a, b) => a.startsInMin - b.startsInMin),
    [sessionList],
  )
  const availableCount = workers.filter((w) => w.status !== 'on-break').length

  function toggleJoin(id: string) {
    setJoinedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleCreate(session: WorkSession) {
    setSessionList((prev) => [session, ...prev])
    setJoinedIds((prev) => [...prev, session.id])
    setTab('sessions')
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight">
              Remotomate
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              Kadıköy, İstanbul
            </span>
          </div>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition',
              visible
                ? 'bg-online/15 text-online'
                : 'bg-secondary text-muted-foreground',
            )}
            aria-pressed={visible}
          >
            {visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {visible ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pb-28 pt-4">
        {/* Radar hero */}
        <section className="rounded-4xl border border-border bg-card p-5">
          <div className="mb-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold leading-tight text-balance">
                {availableCount} people focusing near you
              </h1>
              <p className="text-sm text-muted-foreground">
                You&apos;re not working alone today.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-online/15 px-2.5 py-1 text-xs font-medium text-online">
              <span className="size-1.5 animate-soft-pulse rounded-full bg-online" />
              Live
            </span>
          </div>
          <ProximityRadar
            workers={sortedWorkers}
            user={currentUser}
            selectedId={selectedWorker?.id}
            onSelect={(id) =>
              setSelectedWorker(workers.find((w) => w.id === id) ?? null)
            }
          />
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Tap a dot to see who&apos;s nearby. Your exact spot stays private.
          </p>
        </section>

        {/* Segmented tabs */}
        <div className="sticky top-[61px] z-20 mt-5 flex gap-1 rounded-full bg-secondary/70 p-1 backdrop-blur">
          <TabButton active={tab === 'people'} onClick={() => setTab('people')}>
            <Radar className="size-4" />
            Nearby people
          </TabButton>
          <TabButton active={tab === 'sessions'} onClick={() => setTab('sessions')}>
            <Users className="size-4" />
            Live sessions
          </TabButton>
        </div>

        {/* Lists */}
        <div className="mt-4 flex flex-col gap-3">
          {tab === 'people'
            ? sortedWorkers.map((w, i) => (
                <div
                  key={w.id}
                  className="animate-float-in"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <WorkerCard worker={w} onOpen={setSelectedWorker} />
                </div>
              ))
            : sortedSessions.map((s, i) => (
                <div
                  key={s.id}
                  className="animate-float-in"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <SessionCard
                    session={s}
                    joined={joinedIds.includes(s.id)}
                    nowMs={nowMs}
                    onOpen={setSelectedSession}
                  />
                </div>
              ))}
        </div>
      </main>

      {/* Floating create button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md justify-center px-5 pb-6">
        <Button
          onClick={() => setCreateOpen(true)}
          className="pointer-events-auto h-12 rounded-full px-6 shadow-lg shadow-primary/30"
        >
          <Plus className="size-4" />
          Start a work session
        </Button>
      </div>

      {/* Sheets */}
      <WorkerSheet
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onOpenSession={(s) => {
          setSelectedWorker(null)
          setSelectedSession(s)
        }}
      />
      <SessionSheet
        session={selectedSession}
        joined={selectedSession ? joinedIds.includes(selectedSession.id) : false}
        nowMs={nowMs}
        onClose={() => setSelectedSession(null)}
        onToggleJoin={toggleJoin}
      />
      <CreateSessionSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

function TabButton({
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
        'flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition',
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
