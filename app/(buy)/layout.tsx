import { NotificationProvider } from "components/ui/Notification/Notification"
import { Metadata } from "next"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: "YoSwap",
  description: "...",
  icons: {
    icon: [
      { url: "/" },
      { url: "/", sizes: "16x16", type: "image/svg" },
      { url: "/", sizes: "32x32", type: "image/svg" },
    ],
    apple: [{ url: "/" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <NotificationProvider position="top-center" />
    </html>
  )
}
