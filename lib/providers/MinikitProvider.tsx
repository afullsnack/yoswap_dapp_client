"use client"

import { MiniKitProvider } from "@coinbase/onchainkit/minikit"
import { ReactNode } from "react"
import { base } from "wagmi/chains"
import { env } from "@/env.mjs"

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {children}
    </MiniKitProvider>
  )
}
