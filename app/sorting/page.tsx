import { codeToHtml } from 'shiki'
import { SortingView } from '@/components/sorting/SortingView'
import { PSEUDOCODE, isAlgorithmId } from '@/engine/sorting'
import { parseArrayParam } from '@/lib/array'

export default async function SortingPage({
  searchParams
}: {
  searchParams: { algo?: string; arr?: string }
}) {
  const initialAlgo = isAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'bubble'
  const initialArray = parseArrayParam(searchParams.arr)
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof PSEUDOCODE, string>

  return (
    <SortingView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialArray={initialArray}
    />
  )
}
