import { codeToHtml } from 'shiki'
import { LinkedListsView } from '@/components/linked-lists/LinkedListsView'
import {
  LINKED_LIST_PSEUDOCODE,
  isLinkedListAlgorithmId
} from '@/engine/linkedLists'
import { parseArrayParam } from '@/lib/array'

export default async function LinkedListsPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isLinkedListAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'reverse'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(LINKED_LIST_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof LINKED_LIST_PSEUDOCODE, string>

  return (
    <LinkedListsView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
