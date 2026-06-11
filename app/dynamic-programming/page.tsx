import { codeToHtml } from 'shiki'
import { DpView } from '@/components/dynamic-programming/DpView'
import {
  DP_ALGORITHMS,
  DP_PSEUDOCODE,
  isDpAlgorithmId
} from '@/engine/dynamicProgramming'

export default async function DynamicProgrammingPage({
  searchParams
}: {
  searchParams: { algo?: string; size?: string }
}) {
  const initialAlgo = isDpAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'fibonacci'
  const parsedSize = Number.parseInt(searchParams.size ?? '', 10)
  const initialSize = Number.isFinite(parsedSize)
    ? parsedSize
    : DP_ALGORITHMS[initialAlgo].defaultSize
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(DP_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof DP_PSEUDOCODE, string>

  return (
    <DpView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialSize={initialSize}
    />
  )
}
