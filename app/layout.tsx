import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Workflow Builder",
  description: "Build and run AI agent workflows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <header className="border-b">
              <div className="container mx-auto flex h-14 items-center px-4">
                <div className="mr-4 flex">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">AI Workflow Builder</span>
                  </Link>
                </div>
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                  <Link href="/builder" className="text-sm font-medium transition-colors hover:text-primary">
                    Builder
                  </Link>
                  <Link href="/workflows" className="text-sm font-medium transition-colors hover:text-primary">
                    My Workflows
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
