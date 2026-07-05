const WEIGHT_PREFIX_PATTERN = /^\((\d+(?:\.\d+)?)\)\s*(.+)$/

export function parseWeightedStageKey(rawKey) {
  const text = String(rawKey ?? '').trim()
  const match = text.match(WEIGHT_PREFIX_PATTERN)

  if (!match) {
    return { key: text, weight: null }
  }

  const weight = Number(match[1])
  const key = match[2].trim()

  if (!Number.isFinite(weight) || weight < 0 || weight > 100 || !key) {
    return { key: text, weight: null }
  }

  return { key, weight }
}

export function resolveSiblingWeights(nodes) {
  if (!nodes.length) {
    return []
  }

  const explicitWeights = nodes.map((node) =>
    typeof node.weight === 'number' && Number.isFinite(node.weight) ? node.weight : null,
  )
  const totalExplicit = explicitWeights.reduce((sum, weight) => sum + (weight ?? 0), 0)
  const missingCount = explicitWeights.filter((weight) => weight == null).length

  if (totalExplicit === 0 && missingCount === nodes.length) {
    const evenShare = 100 / nodes.length
    return nodes.map(() => evenShare)
  }

  let resolved = explicitWeights

  if (missingCount > 0) {
    const remaining = Math.max(0, 100 - totalExplicit)
    const fallbackWeight = remaining / missingCount
    resolved = explicitWeights.map((weight) => weight ?? fallbackWeight)
  }

  const totalResolved = resolved.reduce((sum, weight) => sum + weight, 0)

  if (totalResolved > 0 && totalResolved !== 100) {
    const scale = 100 / totalResolved
    resolved = resolved.map((weight) => weight * scale)
  }

  return resolved
}

export function weightedAverage(values, weights) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  if (totalWeight <= 0) {
    return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)
  }

  return values.reduce((sum, value, index) => sum + value * weights[index], 0) / totalWeight
}

export function applyShareMetrics(nodes, parentShare = 100) {
  if (!nodes.length) {
    return []
  }

  const weights = resolveSiblingWeights(nodes)

  return nodes.map((node, index) => {
    const share = (parentShare * weights[index]) / 100
    const displayProgress = (node.progress * share) / 100
    const children = node.children?.length ? applyShareMetrics(node.children, share) : []

    return { ...node, share, displayProgress, children }
  })
}

export function computeNodeShare(siblings, nodeId, getWeight, parentShare = 100) {
  const weights = resolveSiblingWeights(
    siblings.map((sibling) => ({ weight: getWeight(sibling) })),
  )
  const index = siblings.findIndex((sibling) => sibling.id === nodeId)
  const weight = weights[index >= 0 ? index : 0] ?? 100 / Math.max(siblings.length, 1)

  return (parentShare * weight) / 100
}

export function sumExplicitWeights(items, getWeight) {
  return items.reduce((sum, item) => {
    const weight = getWeight(item)

    if (typeof weight === 'number' && Number.isFinite(weight)) {
      return sum + weight
    }

    return sum
  }, 0)
}

export function hasAnyExplicitWeight(items, getWeight) {
  return items.some((item) => {
    const weight = getWeight(item)
    return typeof weight === 'number' && Number.isFinite(weight)
  })
}

export function validateSiblingWeightTotals(items, getWeight, path = '') {
  if (!items.length || !hasAnyExplicitWeight(items, getWeight)) {
    return []
  }

  const total = sumExplicitWeights(items, getWeight)

  if (total > 100.0001) {
    const rounded = Math.round(total * 10) / 10
    const location = path ? `under ${path}` : 'at the top level'

    return [
      `Stage weights ${location} add up to ${rounded}% and must not exceed 100%.`,
    ]
  }

  return []
}
