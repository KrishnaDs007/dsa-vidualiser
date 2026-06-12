import { codeToHtml } from 'shiki'
import { HashingView } from '@/components/hashing/HashingView'
import {
  HASH_PSEUDOCODE,
  isHashAlgorithmId
} from '@/engine/hashing'
import { parseArrayParam } from '@/lib/array'

export default async function HashingPage({
  searchParams
}: {
  searchParams: { algo?: string; keys?: string; target?: string }
}) {
  const initialAlgo = isHashAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'insert'
  const initialKeys = parseArrayParam(searchParams.keys || '18, 25, 32, 7, 14, 21')
  const parsedTarget = Number.parseInt(searchParams.target ?? '', 10)
  const initialTarget = Number.isFinite(parsedTarget)
    ? parsedTarget
    : initialKeys[0]
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(HASH_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof HASH_PSEUDOCODE, string>

  return (
    <HashingView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialKeys={initialKeys}
      initialTarget={initialTarget}
    />
  )
}
