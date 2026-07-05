import { useTranslation } from 'react-i18next'
import ProgressShareLabel from './ProgressShareLabel.jsx'
import { getDepthTone, getStageTreeMaxDepth } from '../utils/stageAnalysis.js'

function StageTreeNode({ node, depth, maxDepth, stageColor, parentShare }) {
  const tone = getDepthTone(stageColor, depth, maxDepth)
  const displayProgress = node.displayProgress ?? node.progress
  const share = node.share ?? parentShare ?? 100
  const barProgress = share > 0 ? (displayProgress / share) * 100 : node.progress

  return (
    <>
      <div
        className={`stage-tree__row${depth === 0 ? ' stage-tree__row--parent' : ''}`}
        style={{
          paddingLeft: `calc(${depth} * 1.35rem + 1rem)`,
          '--tree-fill': tone.fill,
          '--tree-text': tone.text,
          '--tree-progress': `${barProgress}%`,
        }}
      >
        <span className="stage-tree__label">{node.label}</span>
        <span className="stage-tree__progress">
          <ProgressShareLabel
            progress={node.progress}
            share={share}
            displayProgress={displayProgress}
          />
        </span>
      </div>
      {node.children.map((child) => (
        <StageTreeNode
          key={child.key}
          node={child}
          depth={depth + 1}
          maxDepth={maxDepth}
          stageColor={stageColor}
          parentShare={share}
        />
      ))}
    </>
  )
}

function StageTreeView({ stage, stageColor }) {
  const { t } = useTranslation()

  if (!stage) {
    return <p className="stage-tree__placeholder">{t('state.treeHover')}</p>
  }

  if (!stage.children.length) {
    return (
      <p className="stage-tree__placeholder stage-tree__placeholder--inline">
        {t('state.treeEmpty')}
      </p>
    )
  }

  const maxDepth = getStageTreeMaxDepth(stage)

  return (
    <div className="stage-tree">
      {stage.children.map((child) => (
        <StageTreeNode
          key={child.key}
          node={child}
          depth={0}
          maxDepth={maxDepth}
          stageColor={stageColor}
          parentShare={stage.share ?? 100}
        />
      ))}
    </div>
  )
}

export default StageTreeView
