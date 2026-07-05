const REQUIRED_FIELDS = [
  { key: 'name', label: 'name' },
  { key: 'range', label: 'range' },
  { key: 'stages', label: 'stages' },
]

function countTopLevelKey(raw, key) {
  if (!raw) {
    return 0
  }

  const pattern = new RegExp(`^${key}\\s*:`, 'im')
  return raw.split('\n').filter((line) => pattern.test(line)).length
}

function buildFriendlyMessage(missing, duplicates, typeErrors) {
  const parts = []

  if (missing.length) {
    parts.push(`Missing: ${missing.map((key) => `\`${key}\``).join(', ')}`)
  }

  if (duplicates.length) {
    parts.push(
      `Duplicate entries: ${duplicates.map((key) => `\`${key}\``).join(', ')}`,
    )
  }

  if (typeErrors.length) {
    parts.push(...typeErrors)
  }

  return parts
}

import {
  parseWeightedStageKey,
  validateSiblingWeightTotals,
} from './stageWeights.js'

function validateStagesWeightTotals(stages, path = '') {
  if (!stages || typeof stages !== 'object' || Array.isArray(stages)) {
    return []
  }

  const entries = Object.entries(stages)
  const errors = validateSiblingWeightTotals(
    entries,
    ([rawKey]) => parseWeightedStageKey(rawKey).weight,
    path,
  )

  for (const [rawKey, value] of entries) {
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      const { key } = parseWeightedStageKey(rawKey)
      const childPath = path ? `${path} → ${key}` : key
      errors.push(...validateStagesWeightTotals(value, childPath))
    }
  }

  return errors
}

export function validateProjectDocument(doc, raw = '') {
  const missing = []
  const duplicates = []
  const typeErrors = []

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return {
      valid: false,
      missing: REQUIRED_FIELDS.map((field) => field.key),
      duplicates: [],
      typeErrors: ['The file must be a YAML object with project fields at the top level.'],
      errors: ['The file must be a YAML object with project fields at the top level.'],
      summary: 'This file is not a valid project document.',
    }
  }

  for (const field of REQUIRED_FIELDS) {
    const occurrences = countTopLevelKey(raw, field.key)

    if (occurrences > 1) {
      duplicates.push(field.key)
    }

    if (!(field.key in doc) || doc[field.key] === null || doc[field.key] === undefined) {
      missing.push(field.key)
    }
  }

  if (!missing.includes('name') && (typeof doc.name !== 'string' || !doc.name.trim())) {
    typeErrors.push('`name` must be a non-empty text value.')
  }

  if (!missing.includes('range') && (doc.range === '' || doc.range == null)) {
    typeErrors.push('`range` must define the progress scale (for example `0..5`).')
  }

  if (
    !missing.includes('stages') &&
    (doc.stages === null || typeof doc.stages !== 'object')
  ) {
    typeErrors.push('`stages` must be a nested map or list of stage entries.')
  }

  if (
    !missing.includes('stages') &&
    doc.stages != null &&
    typeof doc.stages === 'object' &&
    !Array.isArray(doc.stages)
  ) {
    typeErrors.push(...validateStagesWeightTotals(doc.stages))
  }

  // Stage leaves without a numeric value, list items (`- item`), and null entries are allowed and normalized to 0.

  const errors = buildFriendlyMessage(missing, duplicates, typeErrors)
  const valid = missing.length === 0 && duplicates.length === 0 && typeErrors.length === 0

  return {
    valid,
    missing,
    duplicates,
    typeErrors,
    errors,
    summary: valid
      ? null
      : 'There is a problem with the file format. A valid project needs `name`, `range`, and `stages` exactly once at the top level.',
  }
}

export {
  EXAMPLE_URL,
  getExampleById,
  PROJECT_EXAMPLES,
  resolveExampleFromSearchParam,
  TEMPLATE_URL,
  TRAVEL_EXAMPLE_URL,
} from './projectExamples.js'
