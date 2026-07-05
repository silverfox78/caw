import { formatPercent, parseRange, valueToProgress } from './stageAnalysis.js'
import {
  computeNodeShare,
  parseWeightedStageKey,
  resolveSiblingWeights,
  validateSiblingWeightTotals,
  weightedAverage,
} from './stageWeights.js'

let nextId = 0

function uid() {
  return crypto.randomUUID?.() ?? `stage-${++nextId}`
}

function nodeToEditNode(key, node) {
  if (typeof node === 'number' && Number.isFinite(node)) {
    return { id: uid(), kind: 'leaf', key, value: node }
  }

  if (node != null && typeof node === 'object' && !Array.isArray(node)) {
    return {
      id: uid(),
      kind: 'branch',
      key,
      children: Object.entries(node).map(([childKey, childNode]) =>
        nodeToEditNode(childKey, childNode),
      ),
    }
  }

  return { id: uid(), kind: 'leaf', key, value: 0 }
}

export function stagesToEditTree(stages) {
  if (!stages || typeof stages !== 'object' || Array.isArray(stages)) {
    return []
  }

  return Object.entries(stages).map(([key, node]) => nodeToEditNode(key, node))
}

export function editTreeToStages(nodes) {
  const result = {}

  for (const node of nodes) {
    const key = node.key.trim()
    if (!key) {
      continue
    }

    if (node.kind === 'leaf') {
      result[key] = Number(node.value)
    } else {
      result[key] = editTreeToStages(node.children)
    }
  }

  return result
}

export function computeEditNodeProgress(node, rangeMin, rangeMax) {
  const range = {
    min: Number(rangeMin),
    max: Number(rangeMax),
  }

  if (node.kind === 'leaf') {
    const value = Number(node.value)
    const numeric = Number.isFinite(value) ? value : range.min
    return valueToProgress(numeric, range)
  }

  if (!node.children?.length) {
    return valueToProgress(range.min, range)
  }

  const weights = resolveSiblingWeights(
    node.children.map((child) => ({ weight: parseWeightedStageKey(child.key).weight })),
  )
  const childProgresses = node.children.map((child) =>
    computeEditNodeProgress(child, rangeMin, rangeMax),
  )

  return weightedAverage(childProgresses, weights)
}

export function computeEditNodeMetrics(node, siblings, rangeMin, rangeMax, parentShare = 100) {
  const progress = computeEditNodeProgress(node, rangeMin, rangeMax)
  const share = computeNodeShare(
    siblings,
    node.id,
    (sibling) => parseWeightedStageKey(sibling.key).weight,
    parentShare,
  )
  const displayProgress = (progress * share) / 100

  return { progress, share, displayProgress }
}

export function createBranchNode() {
  return { id: uid(), kind: 'branch', key: '', children: [] }
}

export function createLeafNode(value = 0) {
  return { id: uid(), kind: 'leaf', key: '', value }
}

function validateStageNodes(nodes, rangeMin, rangeMax, path, fieldErrors, messages) {
  const keys = new Set()
  const weightErrors = validateSiblingWeightTotals(
    nodes,
    (node) => parseWeightedStageKey(node.key).weight,
    path || undefined,
  )

  for (const message of weightErrors) {
    messages.push(message)

    for (const node of nodes) {
      if (parseWeightedStageKey(node.key).weight != null && !fieldErrors[`${node.id}-key`]) {
        fieldErrors[`${node.id}-key`] = 'Weights at this level exceed 100%.'
      }
    }
  }

  for (const node of nodes) {
    const key = parseWeightedStageKey(node.key).key

    if (!key) {
      fieldErrors[`${node.id}-key`] = 'Stage name is required.'
      messages.push('Every stage needs a name.')
      continue
    }

    if (keys.has(key)) {
      fieldErrors[`${node.id}-key`] = 'Duplicate name at this level.'
      messages.push(
        `Duplicate stage name "${key}"${path ? ` under ${path}` : ' at the top level'}.`,
      )
    }

    keys.add(key)

    if (node.kind === 'leaf') {
      const value = Number(node.value)

      if (!Number.isFinite(value)) {
        fieldErrors[`${node.id}-value`] = 'Must be a number.'
        messages.push(`"${key}" must have a numeric value.`)
      } else if (
        Number.isFinite(rangeMin) &&
        Number.isFinite(rangeMax) &&
        (value < rangeMin || value > rangeMax)
      ) {
        fieldErrors[`${node.id}-value`] = `Must be between ${rangeMin} and ${rangeMax}.`
        messages.push(`"${key}" must be within the range (${rangeMin}–${rangeMax}).`)
      }
    } else {
      validateStageNodes(
        node.children,
        rangeMin,
        rangeMax,
        path ? `${path} → ${key}` : key,
        fieldErrors,
        messages,
      )
    }
  }
}

export function validateEditionForm({ name, rangeMin, rangeMax, stageNodes }) {
  const fieldErrors = {}
  const messages = []

  if (!name.trim()) {
    fieldErrors.name = 'Name cannot be empty.'
    messages.push('Name cannot be empty.')
  }

  const min = Number(rangeMin)
  const max = Number(rangeMax)

  if (!Number.isFinite(min) || min < 0) {
    fieldErrors.rangeMin = 'Must be a non-negative number.'
    messages.push('Range lower bound must be a non-negative number.')
  }

  if (!Number.isFinite(max) || max <= 0) {
    fieldErrors.rangeMax = 'Must be a positive number.'
    messages.push('Range upper bound must be a positive number.')
  }

  if (Number.isFinite(min) && Number.isFinite(max) && max <= min) {
    fieldErrors.rangeMax = 'Upper bound must be greater than the lower bound.'
    messages.push('Range upper bound must be greater than the lower bound.')
  }

  validateStageNodes(stageNodes, min, max, '', fieldErrors, messages)

  return {
    valid: messages.length === 0,
    fieldErrors,
    messages: [...new Set(messages)],
  }
}

export function buildDocumentFromForm({ name, rangeMin, rangeMax, stageNodes }) {
  return {
    name: name.trim(),
    range: `${Number(rangeMin)}..${Number(rangeMax)}`,
    stages: editTreeToStages(stageNodes),
  }
}

export function docToFormState(doc) {
  const range = parseRange(doc?.range)

  return {
    name: doc?.name ?? '',
    rangeMin: range.min,
    rangeMax: range.max,
    stageNodes: stagesToEditTree(doc?.stages),
  }
}

export function updateNodeInTree(nodes, id, patch) {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...patch }
    }

    if (node.kind === 'branch') {
      return { ...node, children: updateNodeInTree(node.children, id, patch) }
    }

    return node
  })
}

export function removeNodeFromTree(nodes, id) {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.kind === 'branch'
        ? { ...node, children: removeNodeFromTree(node.children, id) }
        : node,
    )
}

export function addChildToTree(nodes, parentId, child) {
  if (parentId == null) {
    return [...nodes, child]
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      if (node.kind === 'leaf') {
        return {
          id: node.id,
          kind: 'branch',
          key: node.key,
          children: [child],
        }
      }

      return { ...node, children: [...node.children, child] }
    }

    if (node.kind === 'branch') {
      return { ...node, children: addChildToTree(node.children, parentId, child) }
    }

    return node
  })
}
