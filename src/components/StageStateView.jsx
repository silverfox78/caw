import { useCallback, useEffect, useState } from 'react'
import PieChart from './PieChart.jsx'
import StateMissionBoard from './StateMissionBoard.jsx'
import StateSummaryLegacy from './StateSummaryLegacy.jsx'
import ProgressShareLabel from './ProgressShareLabel.jsx'
import StageTreeView from './StageTreeView.jsx'
import {
  analyzeProject,
  buildChartSegments,
  findStageRoot,
} from '../utils/stageAnalysis.js'

function StageStateView({ parsed }) {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [pinnedKey, setPinnedKey] = useState(null)
  const [useLegacySummary, setUseLegacySummary] = useState(false)
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
        <div
          className={`state-view__grid${useLegacySummary ? '' : ' state-view__grid--mission'}`}
        >
          <div className="state-view__chart">
            <div className="state-view__chart-square">
              <PieChart
                segments={segments}
                activeKey={pinnedKey ?? hoveredKey}
                pinnedKey={pinnedKey}
                onSegmentHover={setHoveredKey}
                onSegmentClick={togglePin}
              />
            </div>
          </div>

          <div className={`state-view__summary${useLegacySummary ? '' : ' state-view__summary--mission'}`}>
            {useLegacySummary ? (
              <StateSummaryLegacy
                roots={analysis.roots}
                segments={segments}
                overall={analysis.overall}
                pinnedKey={pinnedKey}
                hoveredKey={hoveredKey}
                onHover={setHoveredKey}
                onPin={togglePin}
              />
            ) : (
              <StateMissionBoard
                roots={analysis.roots}
                segments={segments}
                overall={analysis.overall}
                pinnedKey={pinnedKey}
                hoveredKey={hoveredKey}
                onHover={setHoveredKey}
                onPin={togglePin}
              />
            )}
          </div>
        </div>

        <button
          type="button"
          className="state-view__version-toggle"
          onClick={() => setUseLegacySummary((current) => !current)}
          title={useLegacySummary ? 'Switch to mission board (v2)' : 'Switch to classic summary (v1)'}
        >
          {useLegacySummary ? 'v2' : 'v1'}
        </button>

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
              <ProgressShareLabel
                progress={activeStage.progress}
                share={activeStage.share ?? 100}
                displayProgress={activeStage.displayProgress ?? activeStage.progress}
              />
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
