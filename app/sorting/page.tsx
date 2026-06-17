import { SortingView } from '@/components/sorting/SortingView'
import { PSEUDOCODE, isAlgorithmId } from '@/engine/sorting'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function SortingPage({
  searchParams
}: {
  searchParams: { algo?: string; arr?: string }
}) {
  const initialAlgo = isAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'bubble'
  const initialArray = parseArrayParam(searchParams.arr)
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(PSEUDOCODE)

  return (
    <SortingView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialArray={initialArray}
    />
  )
}
