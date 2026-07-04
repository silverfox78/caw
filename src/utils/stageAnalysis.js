export function parseRange(rangeValue) {
  if (rangeValue == null) {
    return { min: 0, max: 5 }
  }

  const text = String(rangeValue).trim()

  if (text.includes('..')) {
    const [minRaw, maxRaw] = text.split('..')
    const min = Number(minRaw)
    const max = Number(maxRaw)
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return { min, max: max >= min ? max : min }
    }
  }

  const single = Number(text)
  if (Number.isFinite(single)) {
    return { min: 0, max: single }
  }

  return { min: 0, max: 5 }
}

export function valueToProgress(value, range) {
  const { min, max } = range
  const fallback = min

  if (max === min) {
    return typeof value === 'number' && value >= max ? 100 : 0
  }

  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  const clamped = Math.min(max, Math.max(min, numeric))

  return ((clamped - min) / (max - min)) * 100
}

function finalizeNode(key, node, range) {
  if (typeof node === 'number') {
    const progress = valueToProgress(node, range)
    return { key, label: formatLabel(key), progress, isLeaf: true, children: [] }
  }

  if (node == null || typeof node !== 'object' || Array.isArray(node)) {
    const progress = valueToProgress(range.min, range)
    return { key, label: formatLabel(key), progress, isLeaf: true, children: [] }
  }

  const children = Object.entries(node).map(([childKey, childNode]) =>
    finalizeNode(childKey, childNode, range),
  )

  const progress =
    children.length > 0
      ? children.reduce((sum, child) => sum + child.progress, 0) / children.length
      : valueToProgress(range.min, range)

  return { key, label: formatLabel(key), progress, isLeaf: false, children }
}

export function formatLabel(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatPercent(value) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1)
}

export function analyzeProject(doc) {
  if (!doc || typeof doc !== 'object') {
    return { error: 'Invalid project document.', roots: [], overall: 0, range: parseRange() }
  }

  if (!doc.stages || typeof doc.stages !== 'object' || Array.isArray(doc.stages)) {
    return {
      error: 'The YAML must include a `stages` object.',
      roots: [],
      overall: 0,
      range: parseRange(doc.range),
    }
  }

  const range = parseRange(doc.range)
  const roots = Object.entries(doc.stages).map(([key, node]) =>
    finalizeNode(key, node, range),
  )

  const overall =
    roots.length > 0
      ? roots.reduce((sum, root) => sum + root.progress, 0) / roots.length
      : 0

  return { error: null, roots, overall, range }
}

function pickSegmentColors(index, total) {
  const hue = (22 + index * (360 / Math.max(total, 1))) % 360

  return {
    color: `hsl(${hue} 38% 34%)`,
    colorProgress: `hsl(${hue} 58% 22%)`,
  }
}

export function buildChartSegments(roots) {
  const count = roots.length || 1
  const sliceAngle = 360 / count

  return roots.map((root, index) => {
    const colors = pickSegmentColors(index, count)

    return {
      key: root.key,
      label: root.label,
      progress: root.progress,
      color: colors.color,
      colorProgress: colors.colorProgress,
      startAngle: index * sliceAngle,
      endAngle: (index + 1) * sliceAngle,
    }
  })
}
