import { useMemo } from 'react'
import { formatPercent } from '../utils/stageAnalysis.js'

const BAR_OFFSETS = [4, -3, 2, -5, 1, -2, 3, -4, 5, -1]
const BAR_COUNT = 7

function buildBars(overall, segmentColors) {
  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const offset = BAR_OFFSETS[index % BAR_OFFSETS.length]
    const width = Math.min(100, Math.max(6, overall + offset))

    return {
      id: index,
      width,
      top: 10 + (index / Math.max(BAR_COUNT - 1, 1)) * 80,
      height: index % 3 === 0 ? 4 : index % 3 === 1 ? 2 : 3,
      color: segmentColors[index % segmentColors.length] ?? 'var(--color-accent)',
      delay: index * 80,
    }
  })
}

function OverallProgressHero({ overall, segmentColors }) {
  const bars = useMemo(
    () => buildBars(overall, segmentColors),
    [overall, segmentColors],
  )
  const animationKey = `${Math.round(overall * 10)}`

  return (
    <div className="state-view__overall-hero" key={animationKey}>
      <div className="state-view__overall-bars" aria-hidden="true">
        {bars.map((bar) => (
          <span
            key={bar.id}
            className="state-view__overall-bar"
            style={{
              '--bar-width': `${bar.width}%`,
              '--bar-delay': `${bar.delay}ms`,
              '--bar-color': bar.color,
              '--bar-top': `${bar.top}%`,
              '--bar-height': `${bar.height}px`,
            }}
          />
        ))}
      </div>

      <p className="state-view__overall-value">
        {formatPercent(overall)}
        <span className="state-view__overall-unit">%</span>
      </p>
    </div>
  )
}

export default OverallProgressHero
