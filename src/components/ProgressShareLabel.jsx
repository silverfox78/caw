import { formatPercent } from '../utils/stageAnalysis.js'

export function shouldShowShareContrast(share, progress, displayProgress) {
  const cap = share ?? 100
  const achieved = displayProgress ?? progress
  return cap < 99.95 || Math.abs(achieved - progress) > 0.05
}

function ProgressShareLabel({ progress, share = 100, displayProgress, className = '', title }) {
  const cap = share ?? 100
  const internal = progress ?? 0
  const achieved = displayProgress ?? (internal * cap) / 100
  const showContrast = shouldShowShareContrast(cap, internal, achieved)
  const defaultTitle = showContrast
    ? `${formatPercent(achieved)}% of ${formatPercent(cap)}% project share (${formatPercent(internal)}% complete within stage)`
    : `${formatPercent(internal)}% complete`

  return (
    <span className={`progress-share${className ? ` ${className}` : ''}`} title={title ?? defaultTitle}>
      {showContrast ? (
        <>
          <span className="progress-share__achieved">{formatPercent(achieved)}%</span>
          <span className="progress-share__sep" aria-hidden="true">
            /
          </span>
          <span className="progress-share__cap">{formatPercent(cap)}%</span>
        </>
      ) : (
        <span className="progress-share__achieved">{formatPercent(internal)}%</span>
      )}
    </span>
  )
}

export default ProgressShareLabel
