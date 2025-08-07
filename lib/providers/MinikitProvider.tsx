"use client"

import { MiniKitProvider } from "@coinbase/onchainkit/minikit"
import { ReactNode } from "react"
import { base } from "wagmi/chains"
import { env } from "@/env.mjs"

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider apiKey={env.NEXT_PUBLIC_CDP_CLIENT_API_KEY} chain={base}>
      {children}
    </MiniKitProvider>
  )
}
