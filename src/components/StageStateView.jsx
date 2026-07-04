import { useState } from 'react'
import PieChart from './PieChart.jsx'
import {
  analyzeProject,
  buildChartSegments,
  formatPercent,
} from '../utils/stageAnalysis.js'

function StageStateView({ parsed }) {
  const [hoveredKey, setHoveredKey] = useState(null)
  const analysis = analyzeProject(parsed)

  if (analysis.error) {
    return <p className="state-view__message">{analysis.error}</p>
  }

  const segments = buildChartSegments(analysis.roots)

  return (
    <div className="state-view">
      <div className="state-view__grid">
        <div className="state-view__chart">
          <PieChart
            segments={segments}
            activeKey={hoveredKey}
            onSegmentHover={setHoveredKey}
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
              {analysis.roots.map((root, index) => (
                <tr
                  key={root.key}
                  className={
                    hoveredKey === root.key ? 'state-view__row--active' : undefined
                  }
                  onMouseEnter={() => setHoveredKey(root.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <td>
                    <span
                      className="state-view__dot"
                      style={{ backgroundColor: segments[index]?.color }}
                      aria-hidden="true"
                    />
                    {root.label}
                  </td>
                  <td>{formatPercent(root.progress)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="state-view__divider" aria-hidden="true" />
    </div>
  )
}

export default StageStateView
