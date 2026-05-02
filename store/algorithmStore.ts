import { create } from 'zustand'
import { SORT_ALGORITHMS, type AlgorithmId } from '@/engine/sorting'
import type { SortStep } from '@/engine/types'
import { DEFAULT_ARRAY } from '@/lib/array'
import { clamp } from '@/lib/utils'

interface AlgorithmStore {
  algorithm: AlgorithmId
  inputArray: number[]
  frames: SortStep[]
  currentStep: number
  totalSteps: number
  setAlgorithm: (id: AlgorithmId) => void
  setInputArray: (array: number[]) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

function materialize(id: AlgorithmId, inputArray: number[]) {
  return Array.from(SORT_ALGORITHMS[id].run(inputArray))
}

const initialFrames = materialize('bubble', DEFAULT_ARRAY)

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  algorithm: 'bubble',
  inputArray: DEFAULT_ARRAY,
  frames: initialFrames,
  currentStep: 0,
  totalSteps: initialFrames.length - 1,
  setAlgorithm: (algorithm) =>
    set((state) => {
      const frames = materialize(algorithm, state.inputArray)
      return {
        algorithm,
        frames,
        currentStep: 0,
        totalSteps: frames.length - 1
      }
    }),
  setInputArray: (inputArray) =>
    set((state) => {
      const frames = materialize(state.algorithm, inputArray)
      return {
        inputArray,
        frames,
        currentStep: 0,
        totalSteps: frames.length - 1
      }
    }),
  setStep: (step) =>
    set((state) => ({
      currentStep: clamp(step, 0, state.totalSteps)
    })),
  nextStep: () => {
    const { currentStep, totalSteps } = get()
    set({ currentStep: clamp(currentStep + 1, 0, totalSteps) })
  },
  prevStep: () => {
    const { currentStep } = get()
    set({ currentStep: clamp(currentStep - 1, 0, get().totalSteps) })
  },
  reset: () => set({ currentStep: 0 })
}))
