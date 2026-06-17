import { GraphView } from '@/components/graphs/GraphView'
import {
  GRAPH_PSEUDOCODE,
  isGraphAlgorithmId
} from '@/engine/graphs'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function GraphsPage({
  searchParams
}: {
  searchParams: { algo?: string; start?: string }
}) {
  const initialAlgo = isGraphAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'bfs'
  const initialStartId = searchParams.start ?? 'a'
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(GRAPH_PSEUDOCODE)

  return (
    <GraphView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialStartId={initialStartId}
    />
  )
}
