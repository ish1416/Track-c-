export default function AshokaChakra({ size = 48, color = '#1a237e', spin = false }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24
    const rad = (angle * Math.PI) / 180
    const r1 = 0.28, r2 = 0.46
    const cx = 0.5 + r1 * Math.sin(rad), cy = 0.5 - r1 * Math.cos(rad)
    const ex = 0.5 + r2 * Math.sin(rad), ey = 0.5 - r2 * Math.cos(rad)
    return <line key={i} x1={`${cx * 100}%`} y1={`${cy * 100}%`} x2={`${ex * 100}%`} y2={`${ey * 100}%`} stroke={color} strokeWidth="1.8" />
  })
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      aria-hidden="true"
      className={spin ? 'chakra-spin' : ''}
      style={{ flexShrink: 0 }}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="3.5" />
      <circle cx="50" cy="50" r="9" fill={color} />
      {spokes}
    </svg>
  )
}
