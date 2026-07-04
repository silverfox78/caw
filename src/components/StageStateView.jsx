import { useCallback, useEffect, useState } from 'react'
import PieChart from './PieChart.jsx'
import StageTreeView from './StageTreeView.jsx'
import {
  analyzeProject,
  buildChartSegments,
  findStageRoot,
  formatPercent,
} from '../utils/stageAnalysis.js'

function StageStateView({ parsed }) {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [pinnedKey, setPinnedKey] = useState(null)
  const analysis = analyzeProject(parsed)

  const togglePin = useCallback((key) => {
    setPinnedKey((current) => (current === key ? null : key))
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPinnedKey(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (analysis.error) {
    return <p className="state-view__message">{analysis.error}</p>
  }

  const segments = buildChartSegments(analysis.roots)
  const displayKey = pinnedKey ?? hoveredKey
  const activeStage = findStageRoot(analysis.roots, displayKey)
  const activeSegment = segments.find((segment) => segment.key === displayKey)

  return (
    <div className="state-view">
      <div className="state-view__top">
        <div className="state-view__grid">
          <div className="state-view__chart">
            <PieChart
              segments={segments}
              activeKey={pinnedKey ?? hoveredKey}
              pinnedKey={pinnedKey}
              onSegmentHover={setHoveredKey}
              onSegmentClick={togglePin}
            />
          </div>

          <div className="state-view__summary">
            <p className="state-view__overall-label">Project progress</p>
            <p className="state-view__overall-value">
              {formatPercent(analysis.overall)}
              <span className="state-view__overall-unit">%</span>
            </p>

            <table className="state-view__table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Progress</th>
                </tr>
              </thead>
              <tbody>
                {analysis.roots.map((root, index) => {
                  const isPinned = pinnedKey === root.key
                  const isHighlighted = (pinnedKey ?? hoveredKey) === root.key

                  return (
                    <tr
                      key={root.key}
                      className={[
                        isHighlighted ? 'state-view__row--active' : '',
                        isPinned ? 'state-view__row--pinned' : '',
                      ]
                        .filter(Boolean)
                        .join(' ') || undefined}
                      onMouseEnter={() => setHoveredKey(root.key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      onClick={() => togglePin(root.key)}
                    >
                      <td>
                        {isPinned ? (
                          <span className="state-view__pin" aria-hidden="true">
                            ✓
                          </span>
                        ) : null}
                        <span
                          className="state-view__dot"
                          style={{ backgroundColor: segments[index]?.color }}
                          aria-hidden="true"
                        />
                        {root.label}
                      </td>
                      <td>{formatPercent(root.progress)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <hr className="state-view__divider" aria-hidden="true" />
      </div>

      <section
        className="state-view__detail"
        aria-live="polite"
        aria-label={activeStage ? `${activeStage.label} breakdown` : 'Stage breakdown'}
      >
        {activeStage ? (
          <header className="state-view__detail-header">
            {pinnedKey === activeStage.key ? (
              <span className="state-view__pin state-view__pin--header" aria-hidden="true">
                ✓
              </span>
            ) : null}
            <span
              className="state-view__detail-dot"
              style={{ backgroundColor: activeSegment?.color }}
              aria-hidden="true"
            />
            <h2 className="state-view__detail-title">{activeStage.label}</h2>
            <span className="state-view__detail-progress">
              {formatPercent(activeStage.progress)}%
            </span>
          </header>
        ) : null}

        <div className="state-view__detail-scroll">
          <StageTreeView stage={activeStage} stageColor={activeSegment?.color} />
        </div>
      </section>
    </div>
  )
}

export default StageStateView
