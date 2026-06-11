'use client'

import { create } from 'zustand'

export interface SavedAnalysis {
  id: string
  title: string
  language?: string
  code?: string
  timeComplexity: string
  spaceComplexity: string
  createdAt: string
  updatedAt?: string
}

interface User {
  name: string
  email: string
}

interface StoredUser extends User {
  password: string
  analyses: SavedAnalysis[]
}

interface AuthStore {
  user: User | null
  hydrated: boolean
  flash: string | null
  analyses: SavedAnalysis[]
  hydrate: () => void
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
  setFlash: (message: string | null) => void
  saveAnalysis: (
    analysis: Omit<SavedAnalysis, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateAnalysis: (
    id: string,
    analysis: Omit<SavedAnalysis, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  deleteAnalysis: (id: string) => void
  duplicateAnalysis: (id: string) => void
}

const USERS_KEY = 'algo-precision-users'
const SESSION_KEY = 'algo-precision-session'
export const MAX_SAVED_ANALYSES = 10

function readUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(user: StoredUser): User {
  return {
    name: user.name,
    email: user.email
  }
}

function updateStoredAnalyses(
  email: string,
  update: (analyses: SavedAnalysis[]) => SavedAnalysis[]
) {
  const users = readUsers()
  let nextAnalyses: SavedAnalysis[] = []
  const nextUsers = users.map((item) => {
    if (item.email !== email) return item

    nextAnalyses = update(item.analyses ?? []).slice(0, MAX_SAVED_ANALYSES)
    return {
      ...item,
      analyses: nextAnalyses
    }
  })

  writeUsers(nextUsers)
  return nextAnalyses
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  hydrated: false,
  flash: null,
  analyses: [],
  hydrate: () => {
    if (typeof window === 'undefined') return

    const email = window.localStorage.getItem(SESSION_KEY)
    const user = readUsers().find((item) => item.email === email)

    set({
      hydrated: true,
      user: user ? publicUser(user) : null,
      analyses: user?.analyses ?? []
    })
  },
  login: (email, password) => {
    const user = readUsers().find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password
    )

    if (!user) {
      set({ flash: 'We could not find that account. Check your email and password.' })
      return false
    }

    window.localStorage.setItem(SESSION_KEY, user.email)
    set({ user: publicUser(user), analyses: user.analyses, flash: 'Signed in successfully.' })
    return true
  },
  signup: (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()

    if (users.some((item) => item.email === normalizedEmail)) {
      set({ flash: 'An account already exists for that email.' })
      return false
    }

    const user: StoredUser = {
      name: name.trim() || 'Visualizer',
      email: normalizedEmail,
      password,
      analyses: []
    }

    writeUsers([...users, user])
    window.localStorage.setItem(SESSION_KEY, user.email)
    set({ user: publicUser(user), analyses: [], flash: 'Account created. Welcome in.' })
    return true
  },
  logout: () => {
    window.localStorage.removeItem(SESSION_KEY)
    set({ user: null, analyses: [], flash: 'Signed out.' })
  },
  setFlash: (flash) => set({ flash }),
  saveAnalysis: (analysis) => {
    const { user } = get()
    if (!user) {
      set({ flash: 'Please sign in before saving a custom visualizer.' })
      return
    }

    if (get().analyses.length >= MAX_SAVED_ANALYSES) {
      set({
        flash: `You can save up to ${MAX_SAVED_ANALYSES} custom visualizers for now. Delete one before saving another.`
      })
      return
    }

    const nextAnalysis: SavedAnalysis = {
      ...analysis,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const users = readUsers()
    const nextUsers = users.map((item) =>
      item.email === user.email
        ? {
            ...item,
            analyses: [nextAnalysis, ...(item.analyses ?? [])].slice(
              0,
              MAX_SAVED_ANALYSES
            )
          }
        : item
    )

    writeUsers(nextUsers)
    set((state) => ({
      analyses: [nextAnalysis, ...state.analyses].slice(0, MAX_SAVED_ANALYSES),
      flash: 'Custom visualizer saved to your dashboard.'
    }))
  },
  updateAnalysis: (id, analysis) => {
    const { user } = get()
    if (!user) {
      set({ flash: 'Please sign in before updating a custom visualizer.' })
      return
    }

    const updatedAt = new Date().toISOString()
    const nextAnalyses = updateStoredAnalyses(user.email, (analyses) =>
      analyses.map((item) =>
        item.id === id
          ? {
              ...item,
              ...analysis,
              updatedAt
            }
          : item
      )
    )

    set({
      analyses: nextAnalyses,
      flash: 'Custom visualizer updated.'
    })
  },
  deleteAnalysis: (id) => {
    const { user } = get()
    if (!user) {
      set({ flash: 'Please sign in before deleting a custom visualizer.' })
      return
    }

    const nextAnalyses = updateStoredAnalyses(user.email, (analyses) =>
      analyses.filter((item) => item.id !== id)
    )

    set({
      analyses: nextAnalyses,
      flash: 'Custom visualizer deleted.'
    })
  },
  duplicateAnalysis: (id) => {
    const { user, analyses } = get()
    if (!user) {
      set({ flash: 'Please sign in before duplicating a custom visualizer.' })
      return
    }

    if (analyses.length >= MAX_SAVED_ANALYSES) {
      set({
        flash: `You can save up to ${MAX_SAVED_ANALYSES} custom visualizers for now. Delete one before duplicating.`
      })
      return
    }

    const source = analyses.find((item) => item.id === id)
    if (!source) {
      set({ flash: 'That custom visualizer could not be found.' })
      return
    }

    const now = new Date().toISOString()
    const duplicate: SavedAnalysis = {
      ...source,
      id: crypto.randomUUID(),
      title: `${source.title} Copy`,
      createdAt: now,
      updatedAt: now
    }
    const nextAnalyses = updateStoredAnalyses(user.email, (items) => [
      duplicate,
      ...items
    ])

    set({
      analyses: nextAnalyses,
      flash: 'Custom visualizer duplicated.'
    })
  }
}))
