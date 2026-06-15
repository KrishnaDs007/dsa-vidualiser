import { codeToHtml } from 'shiki'
import { QueuesView } from '@/components/queues/QueuesView'
import {
  QUEUE_PSEUDOCODE,
  isQueueAlgorithmId
} from '@/engine/queues'
import { parseArrayParam } from '@/lib/array'

export default async function QueuesPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isQueueAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'enqueue'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = Object.fromEntries(
    await Promise.all(
      Object.entries(QUEUE_PSEUDOCODE).map(async ([id, code]) => [
        id,
        await codeToHtml(code, {
          lang: 'typescript',
          theme: 'github-light'
        })
      ])
    )
  ) as Record<keyof typeof QUEUE_PSEUDOCODE, string>

  return (
    <QueuesView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
