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

export function findStageRoot(roots, key) {
  if (!key) {
    return null
  }

  return roots.find((root) => root.key === key) ?? null
}

export function parseHslColor(hslString) {
  const match = hslString?.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i)
  if (!match) {
    return { h: 22, s: 38, l: 34 }
  }

  return {
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  }
}

function getNodeMaxDepth(node, currentDepth = 0) {
  if (!node.children?.length) {
    return currentDepth
  }

  return Math.max(...node.children.map((child) => getNodeMaxDepth(child, currentDepth + 1)))
}

export function getStageTreeMaxDepth(stage) {
  if (!stage?.children?.length) {
    return 0
  }

  return Math.max(...stage.children.map((child) => getNodeMaxDepth(child, 0)))
}

export function getDepthTone(stageColor, depth, maxDepth) {
  const { h, s } = parseHslColor(stageColor)
  const startLightness = 44
  const endLightness = 20
  const startSaturation = Math.max(s - 8, 28)
  const endSaturation = Math.min(s + 14, 72)

  if (maxDepth <= 0) {
    return {
      fill: `hsl(${h} ${startSaturation}% ${startLightness}%)`,
      text: `hsl(${h} ${Math.min(startSaturation + 6, 78)}% ${Math.min(startLightness + 18, 88)}%)`,
    }
  }

  const t = depth / maxDepth
  const lightness = startLightness - t * (startLightness - endLightness)
  const saturation = startSaturation + t * (endSaturation - startSaturation)
  const textLightness = Math.min(lightness + 22, 90)

  return {
    fill: `hsl(${h} ${saturation}% ${lightness}%)`,
    text: `hsl(${h} ${Math.min(saturation + 4, 80)}% ${textLightness}%)`,
  }
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
