import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StageIconButton from './StageIconButton.jsx'
import {
  addChildToTree,
  computeEditNodeMetrics,
  createLeafNode,
  removeNodeFromTree,
  updateNodeInTree,
} from '../utils/stageEditTree.js'
import { formatPercent } from '../utils/stageAnalysis.js'

function StageProgressBar({ value, hue }) {
  const fill = Math.min(100, Math.max(0, value))

  return (
    <div
      className="stage-table__bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fill * 10) / 10}
    >
      <span
        className="stage-table__bar-fill"
        style={{ width: `${fill}%`, '--stage-hue': hue }}
      />
    </div>
  )
}

function StageTableRow({
  node,
  siblings,
  parentShare,
  depth,
  hue,
  rangeMin,
  rangeMax,
  fieldErrors,
  onChange,
}) {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(true)
  const isBranch = node.kind === 'branch'
  const hasChildren = isBranch && node.children.length > 0
  const isLeaf = !isBranch
  const keyError = fieldErrors[`${node.id}-key`]
  const valueError = fieldErrors[`${node.id}-value`]

  const patchNode = (patch) => {
    onChange((nodes) => updateNodeInTree(nodes, node.id, patch))
  }

  const removeSelf = () => {
    onChange((nodes) => removeNodeFromTree(nodes, node.id))
  }

  const addChild = () => {
    onChange((nodes) => addChildToTree(nodes, node.id, createLeafNode(rangeMin)))
    setCollapsed(false)
  }

  const childUpdater = (updater) => {
    onChange((nodes) =>
      updateNodeInTree(nodes, node.id, {
        children: updater(node.children),
      }),
    )
  }

  const { progress, share, displayProgress } = computeEditNodeMetrics(
    node,
    siblings,
    rangeMin,
    rangeMax,
    parentShare,
  )

  return (
    <div
      className={`stage-table__block${isBranch ? ' stage-table__block--branch' : ' stage-table__block--leaf'}${collapsed ? ' stage-table__block--collapsed' : ''}`}
      style={{ '--stage-hue': hue, '--stage-depth': depth }}
    >
      <div className="stage-table__row">
        <span className="stage-table__cell stage-table__cell--toggle">
          {isBranch ? (
            <StageIconButton
              icon={collapsed ? 'expand' : 'collapse'}
              label={collapsed ? t('edition.expand') : t('edition.collapse')}
              variant="toggle"
              className={collapsed ? 'stage-icon-btn--closed' : 'stage-icon-btn--open'}
              onClick={() => setCollapsed((current) => !current)}
              aria-expanded={!collapsed}
            />
          ) : (
            <span className="stage-icon-btn stage-icon-btn--spacer" aria-hidden="true" />
          )}
        </span>

        <span className="stage-table__cell stage-table__cell--name">
          <input
            type="text"
            className={`edition-input edition-input--compact stage-table__input-name${keyError ? ' edition-input--invalid' : ''}`}
            value={node.key}
            placeholder={t('common.name')}
            onChange={(event) => patchNode({ key: event.target.value })}
            aria-invalid={Boolean(keyError)}
            aria-label={t('edition.stageName')}
            aria-describedby={keyError ? `${node.id}-key-error` : undefined}
          />
        </span>

        <span className="stage-table__cell stage-table__cell--bar">
          <StageProgressBar value={progress} hue={hue} />
        </span>

        <span className="stage-table__cell stage-table__cell--metric" title={t('edition.shareTitle')}>
          {formatPercent(share)}%
        </span>

        <span className="stage-table__cell stage-table__cell--metric" title={t('edition.progressTitle')}>
          {formatPercent(progress)}%
        </span>

        <span
          className="stage-table__cell stage-table__cell--metric stage-table__cell--total"
          title={t('edition.totalTitle')}
        >
          {formatPercent(displayProgress)}%
        </span>

        <span className="stage-table__cell stage-table__cell--value">
          {isLeaf ? (
            <input
              type="number"
              className={`edition-input edition-input--compact edition-input--compact-number stage-table__input-value${valueError ? ' edition-input--invalid' : ''}`}
              value={node.value}
              min={rangeMin}
              max={rangeMax}
              step={1}
              placeholder="Val"
              onChange={(event) => patchNode({ value: event.target.value })}
              aria-invalid={Boolean(valueError)}
              aria-label={t('edition.stageValue')}
              aria-describedby={valueError ? `${node.id}-value-error` : undefined}
            />
          ) : (
            <span className="stage-table__value-placeholder" aria-hidden="true">
              —
            </span>
          )}
        </span>

        <span className="stage-table__cell stage-table__cell--action">
          <StageIconButton icon="addItem" label={t('edition.addSubItem')} onClick={addChild} />
        </span>

        <span className="stage-table__cell stage-table__cell--action">
          <StageIconButton
            icon="remove"
            label={t('edition.remove', {
              name: node.key || t('edition.removeFallback'),
            })}
            variant="danger"
            onClick={removeSelf}
          />
        </span>
      </div>

      {(keyError || valueError) && (
        <div className="stage-table__errors">
          {keyError ? (
            <span className="edition-field__error" id={`${node.id}-key-error`}>
              {keyError}
            </span>
          ) : null}
          {valueError ? (
            <span className="edition-field__error" id={`${node.id}-value-error`}>
              {valueError}
            </span>
          ) : null}
        </div>
      )}

      {isBranch ? (
        <div className={`stage-table__children${collapsed ? ' stage-table__children--closed' : ''}`}>
          <div className="stage-table__children-inner">
            {hasChildren ? (
              node.children.map((child) => (
                <StageTableRow
                  key={child.id}
                  node={child}
                  siblings={node.children}
                  parentShare={share}
                  depth={depth + 1}
                  hue={hue}
                  rangeMin={rangeMin}
                  rangeMax={rangeMax}
                  fieldErrors={fieldErrors}
                  onChange={childUpdater}
                />
              ))
            ) : (
              <p className="stage-table__empty">{t('edition.noSubItems')}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StageEditor({ nodes, onChange, rangeMin, rangeMax, fieldErrors }) {
  const { t } = useTranslation()

  const addRoot = () => {
    onChange((current) => addChildToTree(current, null, createLeafNode(rangeMin)))
  }

  return (
    <div className="stage-editor">
      <div className="stage-editor__header">
        <h3 className="stage-editor__title">{t('edition.stages')}</h3>
        <div className="stage-editor__header-actions">
          <StageIconButton icon="addItem" label={t('edition.addItem')} onClick={addRoot} />
        </div>
      </div>

      {nodes.length === 0 ? (
        <p className="stage-editor__empty">{t('edition.noStages')}</p>
      ) : (
        <div className="stage-table">
          <div className="stage-table__head">
            <span className="stage-table__cell stage-table__cell--toggle" aria-hidden="true" />
            <span className="stage-table__cell stage-table__cell--name">{t('common.name')}</span>
            <span className="stage-table__cell stage-table__cell--bar">{t('state.progress')}</span>
            <span className="stage-table__cell stage-table__cell--metric">{t('state.share')}</span>
            <span className="stage-table__cell stage-table__cell--metric">{t('state.done')}</span>
            <span className="stage-table__cell stage-table__cell--metric stage-table__cell--total">
              {t('state.total')}
            </span>
            <span className="stage-table__cell stage-table__cell--value">{t('common.value')}</span>
            <span className="stage-table__cell stage-table__cell--action" aria-hidden="true" />
            <span className="stage-table__cell stage-table__cell--action" aria-hidden="true" />
          </div>

          <div className="stage-table__body">
            {nodes.map((node, index) => (
              <StageTableRow
                key={node.id}
                node={node}
                siblings={nodes}
                parentShare={100}
                depth={0}
                hue={Math.round((22 + index * (360 / Math.max(nodes.length, 1))) % 360)}
                rangeMin={rangeMin}
                rangeMax={rangeMax}
                fieldErrors={fieldErrors}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StageEditor
