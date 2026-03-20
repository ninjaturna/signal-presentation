export function Divider({ vertical }: { vertical?: boolean }) {
  return (
    <div style={{
      [vertical ? 'width' : 'height']: 1,
      [vertical ? 'height' : 'width']: vertical ? 16 : '100%',
      background: 'var(--color-ink-border)',
      flexShrink: 0,
    }} />
  )
}
