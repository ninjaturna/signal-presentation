import { useState, useCallback } from 'react'

export function useUndoHistory<T>(initialState: T, maxHistory = 50) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [index, setIndex] = useState(0)

  const current = history[index]

  const push = useCallback((next: T) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, index + 1)
      const updated = [...trimmed, next]
      return updated.length > maxHistory ? updated.slice(-maxHistory) : updated
    })
    setIndex(prev => Math.min(prev + 1, maxHistory - 1))
  }, [index, maxHistory])

  const undo = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const redo = useCallback(() => setIndex(i => Math.min(history.length - 1, i + 1)), [history.length])

  const canUndo = index > 0
  const canRedo = index < history.length - 1

  return { current, push, undo, redo, canUndo, canRedo }
}
