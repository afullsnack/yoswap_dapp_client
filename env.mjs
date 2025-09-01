import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
  },
  client: {
    NEXT_PUBLIC_CDP_CLIENT_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    NEXT_PUBLIC_CDP_CLIENT_API_KEY: process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY || process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  },
})
