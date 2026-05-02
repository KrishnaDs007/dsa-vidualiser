import { create } from 'zustand'

interface PlaybackStore {
  isPlaying: boolean
  speed: number
  play: () => void
  pause: () => void
  toggle: () => void
  setSpeed: (speed: number) => void
}

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  isPlaying: false,
  speed: 1,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed })
}))
