import { ArraysStringsView } from '@/components/arrays-strings/ArraysStringsView'
import {
  ARRAY_STRING_PSEUDOCODE,
  isArrayStringAlgorithmId
} from '@/engine/arraysStrings'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function ArraysStringsPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string; target?: string }
}) {
  const initialAlgo = isArrayStringAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'twoPointers'
  const initialValues = parseArrayParam(searchParams.values || '1, 3, 4, 6, 8, 11')
  const parsedTarget = Number.parseInt(searchParams.target ?? '', 10)
  const initialTarget = Number.isFinite(parsedTarget) ? parsedTarget : 10
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(
    ARRAY_STRING_PSEUDOCODE
  )

  return (
    <ArraysStringsView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialTarget={initialTarget}
      initialValues={initialValues}
    />
  )
}
