'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { Suspense, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (login(email, password)) {
      router.push(searchParams.get('next') ?? '/dashboard')
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <section>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Account Access
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Sign in</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-foreground/75">
          Save pinned visualizers, keep custom complexity analyses, and return to
          your precision workspace without rebuilding context.
        </p>
      </section>

      <form
        className="bg-[hsl(var(--surface-container-low))] p-8"
        onSubmit={onSubmit}
      >
        <label className="block text-sm font-bold uppercase tracking-[0.16em]">
          Email
        </label>
        <input
          className="mt-3 w-full bg-transparent px-0 py-3 text-base outline-none ring-0 border-b-2 border-[hsl(var(--surface-container-highest))] focus:border-primary"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />

        <label className="mt-8 block text-sm font-bold uppercase tracking-[0.16em]">
          Password
        </label>
        <input
          className="mt-3 w-full bg-transparent px-0 py-3 text-base outline-none ring-0 border-b-2 border-[hsl(var(--surface-container-highest))] focus:border-primary"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />

        <Button className="mt-9 w-full" type="submit">
          Sign In <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{' '}
          <Link className="font-semibold text-primary" href="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  )
}
