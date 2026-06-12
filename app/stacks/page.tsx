import { codeToHtml } from 'shiki'
import { StacksView } from '@/components/stacks/StacksView'
import {
  STACK_PSEUDOCODE,
  isStackAlgorithmId
} from '@/engine/stacks'
import { parseArrayParam } from '@/lib/array'

export default async function StacksPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isStackAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'push'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(STACK_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof STACK_PSEUDOCODE, string>

  return (
    <StacksView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
