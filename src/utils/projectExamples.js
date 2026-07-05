const BASE = import.meta.env.BASE_URL

export const PROJECT_EXAMPLES = [
  {
    id: 'basic',
    url: `${BASE}examples/house.yml`,
    fileName: 'house.yml',
  },
  {
    id: 'advanced',
    url: `${BASE}examples/travel.yml`,
    fileName: 'travel.yml',
  },
]

/** @deprecated Use PROJECT_EXAMPLES or getExampleById('basic') */
export const EXAMPLE_URL = PROJECT_EXAMPLES[0].url

/** @deprecated Use PROJECT_EXAMPLES or getExampleById('advanced') */
export const TRAVEL_EXAMPLE_URL = PROJECT_EXAMPLES[1].url

export const TEMPLATE_URL = `${BASE}examples/template.yml`

export function getExampleById(id) {
  if (id === '1') {
    return PROJECT_EXAMPLES[0]
  }

  return PROJECT_EXAMPLES.find((example) => example.id === id) ?? null
}

export function resolveExampleFromSearchParam(param) {
  if (!param) {
    return null
  }

  return getExampleById(param)
}
