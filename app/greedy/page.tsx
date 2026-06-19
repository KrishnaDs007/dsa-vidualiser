import { GreedyView } from '@/components/greedy/GreedyView'
import { GREEDY_PSEUDOCODE, isGreedyAlgorithmId } from '@/engine/greedy'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function GreedyPage({
  searchParams
}: {
  searchParams: { algo?: string }
}) {
  const initialAlgo = isGreedyAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'activitySelection'
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(GREEDY_PSEUDOCODE)

  return (
    <GreedyView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
    />
  )
}
