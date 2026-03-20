import { useState, useCallback, useRef } from 'react'

export interface TextSelection {
  text: string
  fieldKey: string
}

export function useTextSelection() {
  const [selection, setSelection] = useState<TextSelection | null>(null)
  const activeFieldKey = useRef<string>('')

  const onFocus = useCallback((fieldKey: string) => {
    activeFieldKey.current = fieldKey
  }, [])

  const onBlur = useCallback(() => {
    // Small delay so click on "Link this" button registers before clearing
    setTimeout(() => {
      activeFieldKey.current = ''
    }, 200)
  }, [])

  const onSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const el = e.currentTarget
    const start = el.selectionStart ?? 0
    const end   = el.selectionEnd   ?? 0
    const text  = el.value.slice(start, end).trim()

    if (text.length > 1) {
      setSelection({ text, fieldKey: activeFieldKey.current })
    } else {
      setSelection(null)
    }
  }, [])

  const clearSelection = useCallback(() => setSelection(null), [])

  return { selection, onFocus, onBlur, onSelect, clearSelection }
}
