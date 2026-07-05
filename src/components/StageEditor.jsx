import { useState } from 'react'
import StageIconButton from './StageIconButton.jsx'
import {
  addChildToTree,
  computeEditNodeProgress,
  createBranchNode,
  createLeafNode,
  removeNodeFromTree,
  updateNodeInTree,
} from '../utils/stageEditTree.js'
import { formatPercent } from '../utils/stageAnalysis.js'

function StageNode({
  node,
  depth,
  hue,
  rangeMin,
  rangeMax,
  fieldErrors,
  onChange,
}) {
  const [collapsed, setCollapsed] = useState(true)
  const isBranch = node.kind === 'branch'
  const hasChildren = isBranch && node.children.length > 0
  const keyError = fieldErrors[`${node.id}-key`]
  const valueError = fieldErrors[`${node.id}-value`]

  const patchNode = (patch) => {
    onChange((nodes) => updateNodeInTree(nodes, node.id, patch))
  }

  const removeSelf = () => {
    onChange((nodes) => removeNodeFromTree(nodes, node.id))
  }

  const addChild = (child) => {
    onChange((nodes) => addChildToTree(nodes, node.id, child))
    setCollapsed(false)
  }

  const childUpdater = (updater) => {
    onChange((nodes) =>
      updateNodeInTree(nodes, node.id, {
        children: updater(node.children),
      }),
    )
  }

  const progress = computeEditNodeProgress(node, rangeMin, rangeMax)
  const progressLabel = `${formatPercent(progress)}%`

  const progressTitle = isBranch
    ? hasChildren
      ? `Average progress across ${node.children.length} children`
      : 'No children yet — 0%'
    : 'Progress from value'

  return (
    <div
      className={`stage-card${isBranch ? ' stage-card--branch' : ' stage-card--leaf'}${collapsed ? ' stage-card--collapsed' : ''}${depth > 0 ? ' stage-card--nested' : ''}`}
      style={{ '--stage-depth': depth, '--stage-hue': hue }}
    >
      <div className="stage-card__header">
        {isBranch ? (
          <StageIconButton
            icon={collapsed ? 'expand' : 'collapse'}
            label={collapsed ? 'Expand group' : 'Collapse group'}
            variant="toggle"
            className={collapsed ? 'stage-icon-btn--closed' : 'stage-icon-btn--open'}
            onClick={() => setCollapsed((current) => !current)}
            aria-expanded={!collapsed}
          />
        ) : (
          <span className="stage-icon-btn stage-icon-btn--spacer" aria-hidden="true" />
        )}

        <span
          className={`stage-card__progress${progress === 0 ? ' stage-card__progress--zero' : ''}`}
          title={progressTitle}
        >
          {progressLabel}
        </span>

        <div className="stage-card__fields">
          <input
            type="text"
            className={`edition-input edition-input--compact stage-card__input-name${keyError ? ' edition-input--invalid' : ''}`}
            value={node.key}
            placeholder="Name"
            onChange={(event) => patchNode({ key: event.target.value })}
            aria-invalid={Boolean(keyError)}
            aria-label="Stage name"
            aria-describedby={keyError ? `${node.id}-key-error` : undefined}
          />

          {!isBranch ? (
            <input
              type="number"
              className={`edition-input edition-input--compact edition-input--compact-number stage-card__input-value${valueError ? ' edition-input--invalid' : ''}`}
              value={node.value}
              min={rangeMin}
              max={rangeMax}
              step={1}
              placeholder="Value"
              onChange={(event) => patchNode({ value: event.target.value })}
              aria-invalid={Boolean(valueError)}
              aria-label="Stage value"
              aria-describedby={valueError ? `${node.id}-value-error` : undefined}
            />
          ) : null}
        </div>

        {(keyError || valueError) && (
          <div className="stage-card__errors">
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

        <div className="stage-card__actions">
          <StageIconButton
            icon="addItem"
            label="Add sub-item"
            onClick={() => addChild(createLeafNode(rangeMin))}
          />
          <StageIconButton
            icon="addGroup"
            label="Add subgroup"
            onClick={() => addChild(createBranchNode())}
          />
          <StageIconButton
            icon="remove"
            label={`Remove ${node.key || 'stage'}`}
            variant="danger"
            onClick={removeSelf}
          />
        </div>
      </div>

      {isBranch ? (
        <div className={`stage-card__collapse${collapsed ? ' stage-card__collapse--closed' : ''}`}>
          <div className="stage-card__collapse-inner">
            <div className="stage-card__body">
              {hasChildren ? (
                <div className="stage-editor__cards stage-editor__cards--nested">
                  {node.children.map((child) => (
                    <StageNode
                      key={child.id}
                      node={child}
                      depth={depth + 1}
                      hue={hue}
                      rangeMin={rangeMin}
                      rangeMax={rangeMax}
                      fieldErrors={fieldErrors}
                      onChange={childUpdater}
                    />
                  ))}
                </div>
              ) : (
                <p className="stage-card__empty">Empty — add a sub-item or subgroup.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StageEditor({ nodes, onChange, rangeMin, rangeMax, fieldErrors }) {
  const addRoot = (child) => {
    onChange((current) => addChildToTree(current, null, child))
  }

  return (
    <div className="stage-editor">
      <div className="stage-editor__header">
        <h3 className="stage-editor__title">Stages</h3>
        <div className="stage-editor__header-actions">
          <StageIconButton icon="addGroup" label="Add group" onClick={() => addRoot(createBranchNode())} />
          <StageIconButton icon="addItem" label="Add item" onClick={() => addRoot(createLeafNode(rangeMin))} />
        </div>
      </div>

      {nodes.length === 0 ? (
        <p className="stage-editor__empty">No stages yet. Add a group or item to begin.</p>
      ) : (
        <div className="stage-editor__cards">
          {nodes.map((node, index) => (
            <StageNode
              key={node.id}
              node={node}
              depth={0}
              hue={Math.round((22 + index * (360 / Math.max(nodes.length, 1))) % 360)}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              fieldErrors={fieldErrors}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StageEditor
