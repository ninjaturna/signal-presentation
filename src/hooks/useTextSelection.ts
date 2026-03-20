import { useState, useCallback, useRef, useEffect } from 'react'

export interface TextSelection {
  text: string
  fieldKey: string
}

export function useTextSelection() {
  const [selection, setSelection] = useState<TextSelection | null>(null)
  const activeFieldKey = useRef<string>('')
  const inInputRef = useRef<boolean>(false)

  const onFocus = useCallback((fieldKey: string) => {
    activeFieldKey.current = fieldKey
    inInputRef.current = true
  }, [])

  const onBlur = useCallback(() => {
    // Small delay so click on "Apply highlight" button registers before clearing
    setTimeout(() => {
      activeFieldKey.current = ''
      inInputRef.current = false
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

  // Also capture native DOM selection (e.g. user selects text on the canvas)
  useEffect(() => {
    const handleSelectionChange = () => {
      // If we're inside a tracked input/textarea, let onSelect handle it
      if (inInputRef.current) return

      const domSel = document.getSelection()
      if (!domSel || domSel.isCollapsed) {
        // Don't clear if we still have a valid selection (user may have clicked Apply)
        return
      }

      // Ignore selections inside form elements
      const anchor = domSel.anchorNode
      if (!anchor) return
      let node: Node | null = anchor
      while (node) {
        if (
          node instanceof HTMLTextAreaElement ||
          node instanceof HTMLInputElement ||
          (node instanceof HTMLElement && node.contentEditable === 'true')
        ) return
        node = node.parentNode
      }

      const text = domSel.toString().trim()
      if (text.length > 1) {
        setSelection({ text, fieldKey: 'canvas' })
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [])

  const clearSelection = useCallback(() => setSelection(null), [])

  return { selection, onFocus, onBlur, onSelect, clearSelection }
}
