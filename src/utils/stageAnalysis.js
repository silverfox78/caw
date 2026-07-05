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

import { normalizeStages } from './stageNormalize.js'
import {
  applyShareMetrics,
  parseWeightedStageKey,
  resolveSiblingWeights,
  weightedAverage,
} from './stageWeights.js'

function finalizeNode(rawKey, node, range) {
  const { key, weight } = parseWeightedStageKey(rawKey)

  if (typeof node === 'number' && Number.isFinite(node)) {
    const progress = valueToProgress(node, range)
    return { key, label: formatLabel(key), progress, weight, isLeaf: true, children: [] }
  }

  if (typeof node === 'string') {
    const trimmed = node.trim()
    const numeric = trimmed === '' ? range.min : Number(trimmed)
    const value = Number.isFinite(numeric) ? numeric : range.min
    const progress = valueToProgress(value, range)
    return { key, label: formatLabel(key), progress, weight, isLeaf: true, children: [] }
  }

  if (node == null || typeof node !== 'object' || Array.isArray(node)) {
    const progress = valueToProgress(range.min, range)
    return { key, label: formatLabel(key), progress, weight, isLeaf: true, children: [] }
  }

  const children = Object.entries(node).map(([childKey, childNode]) =>
    finalizeNode(childKey, childNode, range),
  )

  const weights = resolveSiblingWeights(children)
  const progress =
    children.length > 0
      ? weightedAverage(
          children.map((child) => child.progress),
          weights,
        )
      : valueToProgress(range.min, range)

  return { key, label: formatLabel(key), progress, weight, isLeaf: false, children }
}

export function annotateShares(nodes, parentShare = 100) {
  return applyShareMetrics(nodes, parentShare)
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
  const stages = normalizeStages(doc.stages, range.min)
  const roots = Object.entries(stages).map(([key, node]) =>
    finalizeNode(key, node, range),
  )
  const annotatedRoots = annotateShares(roots)

  const weights = resolveSiblingWeights(annotatedRoots)
  const overall =
    annotatedRoots.length > 0
      ? weightedAverage(
          annotatedRoots.map((root) => root.progress),
          weights,
        )
      : 0

  return { error: null, roots: annotatedRoots, overall, range }
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
  if (!roots.length) {
    return []
  }

  const weights = resolveSiblingWeights(roots)
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1
  let angle = 0

  return roots.map((root, index) => {
    const sliceAngle = (weights[index] / totalWeight) * 360
    const colors = pickSegmentColors(index, roots.length)

    const segment = {
      key: root.key,
      label: root.label,
      progress: root.progress,
      weight: weights[index],
      color: colors.color,
      colorProgress: colors.colorProgress,
      startAngle: angle,
      endAngle: angle + sliceAngle,
    }

    angle += sliceAngle
    return segment
  })
}
