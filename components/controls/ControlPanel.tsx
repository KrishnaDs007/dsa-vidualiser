'use client'

import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SpeedSlider } from '@/components/controls/SpeedSlider'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { usePlaybackStore } from '@/store/playbackStore'

export function ControlPanel() {
  const currentStep = useAlgorithmStore((state) => state.currentStep)
  const totalSteps = useAlgorithmStore((state) => state.totalSteps)
  const nextStep = useAlgorithmStore((state) => state.nextStep)
  const prevStep = useAlgorithmStore((state) => state.prevStep)
  const reset = useAlgorithmStore((state) => state.reset)
  const setStep = useAlgorithmStore((state) => state.setStep)
  const isPlaying = usePlaybackStore((state) => state.isPlaying)
  const toggle = usePlaybackStore((state) => state.toggle)
  const pause = usePlaybackStore((state) => state.pause)

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[hsl(var(--surface-container-lowest))] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle} size="icon">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          aria-label="Step back"
          disabled={currentStep === 0}
          onClick={() => {
            pause()
            prevStep()
          }}
          size="icon"
          variant="outline"
        >
          <StepBack className="h-4 w-4" />
        </Button>
        <Button
          aria-label="Step forward"
          disabled={currentStep >= totalSteps}
          onClick={() => {
            pause()
            nextStep()
          }}
          size="icon"
          variant="outline"
        >
          <StepForward className="h-4 w-4" />
        </Button>
        <Button
          aria-label="Reset"
          onClick={() => {
            pause()
            reset()
          }}
          size="icon"
          variant="outline"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <span className="ml-auto text-sm font-medium text-muted-foreground">
          {currentStep + 1} / {totalSteps + 1}
        </span>
      </div>

      <input
        aria-label="Timeline"
        className="w-full accent-[hsl(var(--primary))]"
        max={totalSteps}
        min={0}
        onChange={(event) => {
          pause()
          setStep(Number(event.target.value))
        }}
        type="range"
        value={currentStep}
      />

      <SpeedSlider />
    </div>
  )
}
