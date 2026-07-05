function PieChart({
  segments,
  activeKey,
  pinnedKey,
  onSegmentHover,
  onSegmentClick,
  chartLabel,
  emptyLabel,
}) {
  if (!segments.length) {
    return (
      <div className="pie-chart pie-chart--empty" aria-hidden="true">
        {emptyLabel}
      </div>
    )
  }

  const size = 240
  const cx = size / 2
  const cy = size / 2
  const outerRadius = size / 2 - 6
  const innerRadius = outerRadius * 0.42
  const band = outerRadius - innerRadius
  const focusKey = pinnedKey ?? activeKey

  return (
    <figure className="pie-chart" aria-label={chartLabel}>
      <svg viewBox={`0 0 ${size} ${size}`} className="pie-chart__svg" role="img">
        {segments.map((segment) => {
          const progressOuter =
            innerRadius + band * Math.min(100, Math.max(0, segment.progress)) / 100
          const isPinned = pinnedKey === segment.key
          const isHighlighted = focusKey === segment.key
          const isDimmed = focusKey != null && !isHighlighted

          return (
            <g
              key={segment.key}
              className={[
                'pie-chart__segment',
                isHighlighted ? 'pie-chart__segment--active' : '',
                isPinned ? 'pie-chart__segment--pinned' : '',
                isDimmed ? 'pie-chart__segment--dimmed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`${segment.label}: ${segment.progress}%`}
              aria-pressed={isPinned}
              onMouseEnter={() => onSegmentHover(segment.key)}
              onMouseLeave={() => onSegmentHover(null)}
              onClick={() => onSegmentClick(segment.key)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSegmentClick(segment.key)
                }
              }}
            >
              <path
                className="pie-chart__slice pie-chart__slice--base"
                d={describeAnnularSlice(
                  cx,
                  cy,
                  innerRadius,
                  outerRadius,
                  segment.startAngle,
                  segment.endAngle,
                )}
                fill={segment.color}
                stroke="rgba(20, 28, 24, 0.55)"
                strokeWidth="1.25"
                tabIndex={0}
              />
              {segment.progress > 0 ? (
                <path
                  className="pie-chart__slice pie-chart__slice--progress"
                  d={describeAnnularSlice(
                    cx,
                    cy,
                    innerRadius,
                    progressOuter,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                  fill={segment.colorProgress}
                  stroke="none"
                  pointerEvents="none"
                />
              ) : null}
            </g>
          )
        })}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius - 1}
          fill="rgba(20, 28, 24, 0.88)"
          pointerEvents="none"
        />
      </svg>
    </figure>
  )
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

function describeAnnularSlice(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  if (outerRadius <= innerRadius) {
    return ''
  }

  const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle)
  const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle)
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle)
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ')
}

export default PieChart
