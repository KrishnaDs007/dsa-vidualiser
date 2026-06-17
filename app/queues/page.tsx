import { QueuesView } from '@/components/queues/QueuesView'
import {
  QUEUE_PSEUDOCODE,
  isQueueAlgorithmId
} from '@/engine/queues'
import { parseArrayParam } from '@/lib/array'
import { highlightCodeSamplesByAlgo } from '@/lib/codeSamples'

export default async function QueuesPage({
  searchParams
}: {
  searchParams: { algo?: string; values?: string }
}) {
  const initialAlgo = isQueueAlgorithmId(searchParams.algo)
    ? searchParams.algo
    : 'enqueue'
  const initialValues = parseArrayParam(searchParams.values || '12, 24, 36, 48')
  const highlightedCodeByAlgo = await highlightCodeSamplesByAlgo(QUEUE_PSEUDOCODE)

  return (
    <QueuesView
      highlightedCodeByAlgo={highlightedCodeByAlgo}
      initialAlgo={initialAlgo}
      initialValues={initialValues}
    />
  )
}
