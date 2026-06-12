import { describe, expect, it } from 'vitest'
import {
  createWorkspaceBackup,
  parseWorkspaceBackup,
  serializeWorkspaceBackup
} from '@/lib/workspaceBackup'
import type { SavedAnalysis } from '@/store/authStore'

function analysis(index: number): SavedAnalysis {
  return {
    id: `analysis-${index}`,
    title: `Analysis ${index}`,
    language: 'javascript',
    code: 'for (const item of items) console.log(item)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    createdAt: '2026-06-12T00:00:00.000Z',
    updatedAt: '2026-06-12T00:00:00.000Z'
  }
}

describe('workspace backup', () => {
  it('serializes and parses saved analyses', () => {
    const exported = serializeWorkspaceBackup([analysis(1), analysis(2)])
    const parsed = parseWorkspaceBackup(exported)

    expect(parsed).toHaveLength(2)
    expect(parsed[0].title).toBe('Analysis 1')
  })

  it('limits backup data to 10 analyses', () => {
    const backup = createWorkspaceBackup(
      Array.from({ length: 12 }, (_, index) => analysis(index))
    )

    expect(backup.analyses).toHaveLength(10)
  })

  it('rejects unsupported backup payloads', () => {
    expect(() => parseWorkspaceBackup(JSON.stringify({ version: 2 }))).toThrow()
  })
})
