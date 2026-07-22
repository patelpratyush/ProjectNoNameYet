'use client'

import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/hooks/useTheme'

export function Providers({ children }: { children: ReactNode }) {
  useTheme()

  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}
