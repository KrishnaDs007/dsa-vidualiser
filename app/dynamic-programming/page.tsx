import { DpView } from '@/components/dynamic-programming/DpView'
import {
  DP_ALGORITHMS,
  DP_PSEUDOCODE,
  isDpAlgorithmId
} from '@/engine/dynamicProgramming'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

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
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(DP_PSEUDOCODE)

  return (
    <DpView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialSize={initialSize}
    />
  )
}
