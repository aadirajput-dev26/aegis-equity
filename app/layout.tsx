import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SkyVest — Private Markets, Clearly Managed",
  description:
    "Track unlisted and pre-IPO investments, monitor indicative portfolio values, and manage private-market enquiries with SkyVest.",
  keywords: "unlisted shares, pre-IPO, private markets, investment portfolio, unlisted zone",
  openGraph: {
    title: "SkyVest — Private Markets, Clearly Managed",
    description:
      "Track unlisted and pre-IPO investments, monitor indicative portfolio values, and manage private-market enquiries with SkyVest.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  )
}
