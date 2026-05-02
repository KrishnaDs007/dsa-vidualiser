'use client'

import { Slider } from '@/components/ui/slider'
import { SPEED_STEPS } from '@/lib/constants'
import { usePlaybackStore } from '@/store/playbackStore'

export function SpeedSlider() {
  const speed = usePlaybackStore((state) => state.speed)
  const setSpeed = usePlaybackStore((state) => state.setSpeed)

  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-xs font-medium text-muted-foreground">Speed</span>
      <Slider
        className="w-36"
        max={SPEED_STEPS.length - 1}
        min={0}
        onValueChange={([index]) => setSpeed(SPEED_STEPS[index])}
        step={1}
        value={[SPEED_STEPS.indexOf(speed as (typeof SPEED_STEPS)[number])]}
      />
      <span className="w-10 text-right font-mono text-xs">{speed}x</span>
    </div>
  )
}
