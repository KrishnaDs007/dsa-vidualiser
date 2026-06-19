import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/AppShell'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://dsa-vidualiser.vercel.app'),
  title: {
    default: 'DSA Visualizer | Interactive Algorithm Learning',
    template: '%s | DSA Visualizer'
  },
  description:
    'Interactive DSA visualizer for sorting, searching, hashing, stacks, queues, linked lists, trees, graphs, dynamic programming, backtracking, greedy algorithms, and custom code complexity analysis.',
  applicationName: 'DSA Visualizer',
  authors: [{ name: 'Krishna Devashish', url: 'https://dsa-vidualiser.vercel.app/' }],
  creator: 'Krishna Devashish',
  publisher: 'Krishna Devashish',
  keywords: [
    'DSA visualizer',
    'algorithm visualizer',
    'data structures',
    'sorting visualizer',
    'graph visualizer',
    'dynamic programming',
    'custom code complexity',
    'time complexity',
    'space complexity'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'DSA Visualizer',
    description:
      'Step through algorithms and custom code complexity with interactive visual states.',
    url: 'https://dsa-vidualiser.vercel.app/',
    siteName: 'DSA Visualizer',
    type: 'website',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'DSA Visualizer icon' }]
  },
  twitter: {
    card: 'summary',
    title: 'DSA Visualizer',
    description:
      'Interactive DSA visualizer with custom code complexity analysis.',
    images: ['/icon.png']
  },
  category: 'education',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7fafc" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#08111f" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
