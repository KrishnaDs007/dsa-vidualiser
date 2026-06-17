export const CODE_SAMPLE_LANGUAGES = [
  { id: 'typescript', label: 'TypeScript', shiki: 'typescript' },
  { id: 'javascript', label: 'JavaScript', shiki: 'javascript' },
  { id: 'python', label: 'Python', shiki: 'python' },
  { id: 'java', label: 'Java', shiki: 'java' },
  { id: 'cpp', label: 'C++', shiki: 'cpp' },
  { id: 'c', label: 'C', shiki: 'c' },
  { id: 'csharp', label: 'C#', shiki: 'csharp' }
] as const

export type CodeSampleLanguageId = (typeof CODE_SAMPLE_LANGUAGES)[number]['id']
export type HighlightedCodeSamples = Record<CodeSampleLanguageId, string>
