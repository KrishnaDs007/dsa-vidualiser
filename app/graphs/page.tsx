import { codeToHtml } from 'shiki'
import { GraphView } from '@/components/graphs/GraphView'
import {
  GRAPH_PSEUDOCODE,
  isGraphAlgorithmId
} from '@/engine/graphs'

export default async function GraphsPage({
  searchParams
}: {
  searchParams: { algo?: string; start?: string }
}) {
  const initialAlgo = isGraphAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'bfs'
  const initialStartId = searchParams.start ?? 'a'
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(GRAPH_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof GRAPH_PSEUDOCODE, string>

  return (
    <GraphView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialStartId={initialStartId}
    />
  )
}
