'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export default function SignupPage() {
  const router = useRouter()
  const signup = useAuthStore((state) => state.signup)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (signup(name, email, password)) {
      router.push('/dashboard')
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <section>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Build Your Library
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Create account</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-foreground/75">
          Your dashboard starts with sorting visualizers and grows with every
          custom code complexity analysis you save.
        </p>
      </section>

      <form
        className="bg-[hsl(var(--surface-container-low))] p-8"
        onSubmit={onSubmit}
      >
        <Field label="Name" onChange={setName} type="text" value={name} />
        <Field label="Email" onChange={setEmail} type="email" value={email} />
        <Field
          label="Password"
          minLength={6}
          onChange={setPassword}
          type="password"
          value={password}
        />

        <Button className="mt-9 w-full" type="submit">
          Sign Up <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="font-semibold text-primary" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type,
  minLength
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type: string
  minLength?: number
}) {
  return (
    <>
      <label className="mt-8 block first:mt-0 text-sm font-bold uppercase tracking-[0.16em]">
        {label}
      </label>
      <input
        className="mt-3 w-full border-b-2 border-[hsl(var(--surface-container-highest))] bg-transparent px-0 py-3 text-base outline-none ring-0 focus:border-primary"
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </>
  )
}
