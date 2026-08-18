'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-float-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl bg-card shadow-2xl',
          'sm:rounded-4xl animate-float-in',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 pb-3 pt-4">
          <span className="mx-auto h-1 w-10 rounded-full bg-border sm:hidden" aria-hidden />
          {title && (
            <h2 className="hidden font-display text-base font-semibold sm:block">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/70"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
