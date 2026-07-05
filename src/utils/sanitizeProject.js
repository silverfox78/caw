import { dump as dumpYaml } from 'js-yaml'
import { parseRange } from './stageAnalysis.js'
import { normalizeStages } from './stageNormalize.js'

function trimRangeValue(range) {
  if (typeof range === 'string') {
    return range.trim()
  }

  if (range == null) {
    return range
  }

  return String(range).trim()
}

export function normalizeProjectDocument(doc) {
  const range = parseRange(doc.range)

  return {
    name: String(doc.name).trim(),
    range: trimRangeValue(doc.range),
    stages: normalizeStages(doc.stages, range.min),
  }
}

export function formatProjectSource(doc) {
  const normalized = normalizeProjectDocument(doc)
  const yaml = dumpYaml(normalized, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  })

  return yaml
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n')
}

export function sanitizeProjectDocument(doc) {
  const normalized = normalizeProjectDocument(doc)
  const yaml = formatProjectSource(normalized)

  return { doc: normalized, yaml }
}
