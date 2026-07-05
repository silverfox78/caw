import { useTranslation } from 'react-i18next'
import { formatPercent } from '../utils/stageAnalysis.js'
import { getProgressEmoji } from '../utils/stageProgressMood.js'

function MissionProgressBar({ value, color, className = '' }) {
  const fill = Math.min(100, Math.max(0, value))

  return (
    <div
      className={`state-mission__bar${className ? ` ${className}` : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fill * 10) / 10}
    >
      <span
        className="state-mission__bar-fill"
        style={{ width: `${fill}%`, '--bar-color': color }}
      />
    </div>
  )
}

function MissionRow({
  root,
  color,
  isPinned,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const { t } = useTranslation()
  const share = root.share ?? 100
  const progress = root.progress ?? 0
  const participation = root.displayProgress ?? progress
  const emoji = getProgressEmoji(progress)

  return (
    <div
      className={[
        'state-mission__row',
        isHighlighted ? 'state-mission__row--active' : '',
        isPinned ? 'state-mission__row--pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="row"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className="state-mission__cell state-mission__cell--color" role="cell">
        <span className="state-mission__dot" style={{ backgroundColor: color }} aria-hidden="true" />
      </span>

      <span className="state-mission__cell state-mission__cell--mood" role="cell" aria-hidden="true">
        {emoji}
      </span>

      <span className="state-mission__cell state-mission__cell--name" role="cell">
        {isPinned ? (
          <span className="state-view__pin state-mission__pin" aria-hidden="true">
            ✓
          </span>
        ) : null}
        {root.label}
      </span>

      <span className="state-mission__cell state-mission__cell--bar" role="cell">
        <MissionProgressBar value={progress} color={color} />
      </span>

      <span className="state-mission__cell state-mission__cell--metric" role="cell" title={t('state.shareTitle')}>
        {formatPercent(share)}%
      </span>

      <span className="state-mission__cell state-mission__cell--metric" role="cell" title={t('state.progressTitle')}>
        {formatPercent(progress)}%
      </span>

      <span
        className="state-mission__cell state-mission__cell--metric state-mission__cell--participation"
        role="cell"
        title={t('state.participationTitle')}
      >
        {formatPercent(participation)}%
      </span>
    </div>
  )
}

function StateMissionBoard({
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
    <div className="state-mission" aria-label={t('state.missionStatus')}>
      <div className="state-mission__table-section">
        <p className="state-mission__section-label">{t('state.missionStatus')}</p>

        <div className="state-mission__table" role="table">
          <div className="state-mission__head" role="row">
            <span className="state-mission__cell state-mission__cell--color" role="columnheader">
              <span className="visually-hidden">{t('common.color')}</span>
            </span>
            <span className="state-mission__cell state-mission__cell--mood" role="columnheader">
              <span className="visually-hidden">{t('common.mood')}</span>
            </span>
            <span className="state-mission__cell state-mission__cell--name" role="columnheader">
              {t('state.stage')}
            </span>
            <span className="state-mission__cell state-mission__cell--bar" role="columnheader">
              {t('state.progress')}
            </span>
            <span className="state-mission__cell state-mission__cell--metric" role="columnheader">
              {t('state.share')}
            </span>
            <span className="state-mission__cell state-mission__cell--metric" role="columnheader">
              {t('state.done')}
            </span>
            <span
              className="state-mission__cell state-mission__cell--metric state-mission__cell--participation"
              role="columnheader"
            >
              {t('state.total')}
            </span>
          </div>

          {roots.map((root, index) => {
            const isPinned = pinnedKey === root.key
            const isHighlighted = (pinnedKey ?? hoveredKey) === root.key

            return (
              <MissionRow
                key={root.key}
                root={root}
                color={segments[index]?.color}
                isPinned={isPinned}
                isHighlighted={isHighlighted}
                onMouseEnter={() => onHover(root.key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onPin(root.key)}
              />
            )
          })}
        </div>
      </div>

      <div className="state-mission__global">
        <p className="state-mission__section-label">{t('state.globalProgress')}</p>
        <MissionProgressBar value={overall} color="var(--color-accent-hot)" className="state-mission__bar--global" />
        <p className="state-mission__global-value">{formatPercent(overall)}%</p>
      </div>
    </div>
  )
}

export default StateMissionBoard
