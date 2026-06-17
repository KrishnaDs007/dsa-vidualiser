import { codeToHtml } from 'shiki'
import {
  CODE_SAMPLE_LANGUAGES,
  type CodeSampleLanguageId,
  type HighlightedCodeSamples
} from '@/lib/codeSampleLanguages'
export type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

export async function highlightCodeSamplesByAlgo<T extends string>(
  pseudocodeByAlgo: Record<T, string>
): Promise<Record<T, HighlightedCodeSamples>> {
  const entries = await Promise.all(
    (Object.entries(pseudocodeByAlgo) as [T, string][]).map(async ([id, code]) => [
      id,
      await highlightCodeSamples(code)
    ])
  )

  return Object.fromEntries(entries) as Record<T, HighlightedCodeSamples>
}

async function highlightCodeSamples(code: string): Promise<HighlightedCodeSamples> {
  const samples = buildCodeSamples(code)
  const entries = await Promise.all(
    CODE_SAMPLE_LANGUAGES.map(async (language) => [
      language.id,
      await codeToHtml(samples[language.id], {
        lang: language.shiki,
        theme: 'github-light'
      })
    ])
  )

  return Object.fromEntries(entries) as HighlightedCodeSamples
}

function buildCodeSamples(code: string): Record<CodeSampleLanguageId, string> {
  return {
    typescript: code,
    javascript: toJavaScript(code),
    python: toCommentedSample(code, '#', 'Python-style sample'),
    java: toCommentedSample(code, '//', 'Java-style sample'),
    cpp: toCommentedSample(code, '//', 'C++-style sample'),
    c: toCommentedSample(code, '//', 'C-style sample'),
    csharp: toCommentedSample(code, '//', 'C#-style sample')
  }
}

function toJavaScript(code: string) {
  return code
    .replace(/: number\[\]/g, '')
    .replace(/: number/g, '')
    .replace(/: string/g, '')
    .replace(/\): [A-Za-z0-9_<>\[\] |]+ \{/g, ') {')
}

function toCommentedSample(code: string, marker: '#' | '//', title: string) {
  const commentedCode = code
    .split('\n')
    .map((line) => `${marker} ${line}`)
    .join('\n')

  return `${marker} ${title}
${marker} This project uses one generator engine for the visual frames.
${marker} Translate the same steps into the selected language while keeping
${marker} the comparisons, pointer moves, table updates, and return values.

${commentedCode}`
}
