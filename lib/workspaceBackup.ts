import type { SavedAnalysis } from '@/store/authStore'

const MAX_BACKUP_ANALYSES = 10

export interface WorkspaceBackup {
  version: 1
  exportedAt: string
  analyses: SavedAnalysis[]
}

export function createWorkspaceBackup(analyses: SavedAnalysis[]): WorkspaceBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    analyses: analyses.slice(0, MAX_BACKUP_ANALYSES)
  }
}

export function serializeWorkspaceBackup(analyses: SavedAnalysis[]) {
  return JSON.stringify(createWorkspaceBackup(analyses), null, 2)
}

export function parseWorkspaceBackup(json: string): SavedAnalysis[] {
  const parsed = JSON.parse(json) as Partial<WorkspaceBackup>

  if (parsed.version !== 1 || !Array.isArray(parsed.analyses)) {
    throw new Error('Unsupported workspace backup format.')
  }

  return parsed.analyses
    .filter(isSavedAnalysis)
    .map((analysis) => ({
      ...analysis,
      updatedAt: analysis.updatedAt ?? analysis.createdAt
    }))
    .slice(0, MAX_BACKUP_ANALYSES)
}

function isSavedAnalysis(value: unknown): value is SavedAnalysis {
  if (!value || typeof value !== 'object') return false

  const item = value as Partial<SavedAnalysis>
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.timeComplexity === 'string' &&
    typeof item.spaceComplexity === 'string' &&
    typeof item.createdAt === 'string'
  )
}
