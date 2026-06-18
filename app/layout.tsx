import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/AppShell'
import './globals.css'

export const metadata: Metadata = {
  title: 'DSA Visualizer',
  description: 'Interactive data structures and algorithms visualizer',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
