import { StacksView } from '@/components/stacks/StacksView'
import {
  STACK_PSEUDOCODE,
  isStackAlgorithmId
} from '@/engine/stacks'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function StacksPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isStackAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'push'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(STACK_PSEUDOCODE)

  return (
    <StacksView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
