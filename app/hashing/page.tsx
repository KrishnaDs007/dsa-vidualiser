import { HashingView } from '@/components/hashing/HashingView'
import {
  HASH_PSEUDOCODE,
  isHashAlgorithmId
} from '@/engine/hashing'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

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
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(HASH_PSEUDOCODE)

  return (
    <HashingView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialKeys={initialKeys}
      initialTarget={initialTarget}
    />
  )
}
