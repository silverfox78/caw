import { useTranslation } from 'react-i18next'
import OverallProgressHero from './OverallProgressHero.jsx'
import ProgressShareLabel from './ProgressShareLabel.jsx'

function StateSummaryLegacy({
  roots,
  segments,
  overall,
  pinnedKey,
  hoveredKey,
  onHover,
  onPin,
}) {
  const { t } = useTranslation()

  return (
    <>
      <p className="state-view__overall-label">{t('state.projectProgress')}</p>
      <OverallProgressHero
        overall={overall}
        segmentColors={segments.map((segment) => segment.color)}
      />

      <table className="state-view__table">
        <thead>
          <tr>
            <th scope="col">{t('state.stage')}</th>
            <th scope="col">{t('state.progress')}</th>
          </tr>
        </thead>
        <tbody>
          {roots.map((root, index) => {
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
                onMouseEnter={() => onHover(root.key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onPin(root.key)}
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
                <td>
                  <ProgressShareLabel
                    progress={root.progress}
                    share={root.share ?? 100}
                    displayProgress={root.displayProgress ?? root.progress}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default StateSummaryLegacy
