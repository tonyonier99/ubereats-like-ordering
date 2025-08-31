'use client'

import { SessionProvider } from "next-auth/react"
import { SWRConfig } from 'swr'

interface ProvidersProps {
  children: React.ReactNode
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher }}>
        {children}
      </SWRConfig>
    </SessionProvider>
  )
}