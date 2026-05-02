'use client'

import { useEffect } from 'react'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { usePlaybackStore } from '@/store/playbackStore'
import { speedToDelay } from '@/lib/constants'

export function usePlayback() {
  const isPlaying = usePlaybackStore((state) => state.isPlaying)
  const speed = usePlaybackStore((state) => state.speed)
  const pause = usePlaybackStore((state) => state.pause)
  const nextStep = useAlgorithmStore((state) => state.nextStep)
  const currentStep = useAlgorithmStore((state) => state.currentStep)
  const totalSteps = useAlgorithmStore((state) => state.totalSteps)

  useEffect(() => {
    if (!isPlaying) return

    if (currentStep >= totalSteps) {
      pause()
      return
    }

    const id = window.setTimeout(nextStep, speedToDelay(speed))
    return () => window.clearTimeout(id)
  }, [currentStep, isPlaying, nextStep, pause, speed, totalSteps])
}
