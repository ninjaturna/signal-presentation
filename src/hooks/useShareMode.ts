export type ShareMode = 'edit' | 'review' | 'present'

export function useShareMode(): ShareMode {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  if (mode === 'review') return 'review'
  if (mode === 'present') return 'present'
  return 'edit'
}
