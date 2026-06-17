import { SearchView } from '@/components/search/SearchView'
import {
  SEARCH_PSEUDOCODE,
  isSearchAlgorithmId
} from '@/engine/search'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function SearchPage({
  searchParams
}: {
  searchParams: { algo?: string; arr?: string; target?: string }
}) {
  const initialAlgo = isSearchAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'linear'
  const initialArray = parseArrayParam(searchParams.arr)
  const parsedTarget = Number.parseInt(searchParams.target ?? '', 10)
  const initialTarget = Number.isFinite(parsedTarget)
    ? parsedTarget
    : initialAlgo === 'answer'
      ? 3
      : initialArray[0]
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(SEARCH_PSEUDOCODE)

  return (
    <SearchView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialArray={initialArray}
      initialTarget={initialTarget}
    />
  )
}
