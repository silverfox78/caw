function normalizeStageList(items, rangeMin) {
  const result = {}

  for (const item of items) {
    if (item == null) {
      continue
    }

    if (typeof item === 'string') {
      const key = item.trim()
      if (key) {
        result[key] = rangeMin
      }
      continue
    }

    if (typeof item === 'number' && Number.isFinite(item)) {
      continue
    }

    if (Array.isArray(item)) {
      Object.assign(result, normalizeStageList(item, rangeMin))
      continue
    }

    if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        result[key] = normalizeStageNode(value, rangeMin)
      }
    }
  }

  return result
}

function normalizeStageMap(node, rangeMin) {
  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [key, normalizeStageNode(value, rangeMin)]),
  )
}

export function normalizeStageNode(node, rangeMin = 0) {
  if (Array.isArray(node)) {
    return normalizeStageList(node, rangeMin)
  }

  if (typeof node === 'number' && Number.isFinite(node)) {
    return node
  }

  if (typeof node === 'string') {
    const trimmed = node.trim()
    if (trimmed === '') {
      return rangeMin
    }

    const numeric = Number(trimmed)
    return Number.isFinite(numeric) ? numeric : rangeMin
  }

  if (node == null) {
    return rangeMin
  }

  if (typeof node === 'object') {
    return normalizeStageMap(node, rangeMin)
  }

  return rangeMin
}

export function normalizeStages(stages, rangeMin = 0) {
  if (stages == null) {
    return stages
  }

  if (typeof stages !== 'object') {
    return rangeMin
  }

  return normalizeStageNode(stages, rangeMin)
}
