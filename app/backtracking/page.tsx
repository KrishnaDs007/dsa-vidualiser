import { BacktrackingView } from '@/components/backtracking/BacktrackingView'
import {
  BACKTRACKING_PSEUDOCODE,
  isBacktrackingAlgorithmId
} from '@/engine/backtracking'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function BacktrackingPage({
  searchParams
}: {
  searchParams: { algo?: string }
}) {
  const initialAlgo = isBacktrackingAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'subsets'
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(
    BACKTRACKING_PSEUDOCODE
  )

  return (
    <BacktrackingView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
    />
  )
}
