import { codeToHtml } from 'shiki'
import { SearchView } from '@/components/search/SearchView'
import {
  SEARCH_PSEUDOCODE,
  isSearchAlgorithmId
} from '@/engine/search'
import { parseArrayParam } from '@/lib/array'

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
    : initialArray[0]
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(SEARCH_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof SEARCH_PSEUDOCODE, string>

  return (
    <SearchView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialArray={initialArray}
      initialTarget={initialTarget}
    />
  )
}
