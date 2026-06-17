import { LinkedListsView } from '@/components/linked-lists/LinkedListsView'
import {
  LINKED_LIST_PSEUDOCODE,
  isLinkedListAlgorithmId
} from '@/engine/linkedLists'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function LinkedListsPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isLinkedListAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'reverse'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(
    LINKED_LIST_PSEUDOCODE
  )

  return (
    <LinkedListsView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
