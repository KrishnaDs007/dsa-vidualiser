import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DSA Visualizer',
  description: 'Interactive data structures and algorithms visualizer'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
