import type React from "react"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata = {
  title: "MADshop - Smart Shopping with Price Tracking",
  description: "Shop from Amazon, Flipkart, Myntra with exclusive deals and price tracking",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
