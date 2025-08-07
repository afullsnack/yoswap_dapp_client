import "styles/tailwind.css"
import ThemeProviders from "components/ProvidersComponents/ThemeProviders"
import ReduxProvider from "lib/providers/authProvider"
import { MiniKitContextProvider } from "@/lib/providers/MinikitProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniKitContextProvider>
          {/* <ReduxProvider>{children}</ReduxProvider> */}
          {children}
        </MiniKitContextProvider>
      </body>
    </html>
  )
}
