import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import { User } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CurveAi AiPex Platform",
  description: "Build and run AI agent workflows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-sm transform rotate-12"></div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">
                      <span className="text-gray-800 dark:text-gray-100">Curve</span>
                      <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Ai</span>
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">AiPex Platform</span>
                  </div>
                </Link>
                <nav className="hidden md:flex space-x-1">
                  <Link
                    href="/builder"
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    Builder
                  </Link>
                  <Link
                    href="/workflows"
                    className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors"
                  >
                    My Workflows
                  </Link>
                  <Link
                    href="/files"
                    className="px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors"
                  >
                    Files
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="hidden md:block">
                  <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
