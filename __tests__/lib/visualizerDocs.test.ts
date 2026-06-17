import { describe, expect, it } from 'vitest'
import { filterVisualizerDocs, VISUALIZER_DOCS } from '@/lib/visualizerDocs'

describe('visualizer docs search', () => {
  it('returns all docs for an empty query', () => {
    expect(filterVisualizerDocs('')).toHaveLength(VISUALIZER_DOCS.length)
  })

  it('matches docs by algorithm, category, pattern, and complexity text', () => {
    expect(filterVisualizerDocs('prefix range')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'arrays-strings-prefixSum' })
      ])
    )
    expect(filterVisualizerDocs('priority queue')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'graphs-dijkstra' })
      ])
    )
  })
})
