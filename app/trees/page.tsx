import { codeToHtml } from 'shiki'
import { TreeView } from '@/components/trees/TreeView'
import { BST_PSEUDOCODE, isBstAlgorithmId } from '@/engine/trees'
import { parseArrayParam } from '@/lib/array'

export default async function TreesPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string; target?: string }
}) {
  const initialAlgo = isBstAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'insert'
  const initialValues = parseArrayParam(searchParams.values)
  const parsedTarget = Number.parseInt(searchParams.target ?? '', 10)
  const initialTarget = Number.isFinite(parsedTarget)
    ? parsedTarget
    : initialValues[0]
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(BST_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof BST_PSEUDOCODE, string>

  return (
    <TreeView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialTarget={initialTarget}
      initialValues={initialValues}
    />
  )
}
