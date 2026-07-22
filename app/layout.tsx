import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/index.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'FinPilot — Personal finance, clearly planned',
    template: '%s | FinPilot',
  },
  description: 'Track spending, plan budgets, manage debt, and build toward your financial goals.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
