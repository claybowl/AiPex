"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, FileLineChartIcon as FlowChart, List } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gray-900 dark:text-gray-100">Curve</span>
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Ai</span>
          <span className="text-gray-900 dark:text-gray-100 ml-2">AiPex Platform</span>
        </h1>
        <p className="text-xl text-gray-600">Build, test, and deploy AI workflows with a visual interface</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FlowChart className="mr-2 h-5 w-5" />
              Workflow Builder
            </CardTitle>
            <CardDescription>Create and edit AI workflows visually</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Drag and drop nodes to create complex AI workflows. Connect LLMs, tools, and data sources.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/builder">
                Open Builder <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2 h-5 w-5" />
              Saved Workflows
            </CardTitle>
            <CardDescription>View and manage your saved workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Access your saved workflows, run them, share them, or make modifications.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/workflows">
                View Workflows <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              File Operations
            </CardTitle>
            <CardDescription>Manage files used in your workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Upload, view, and manage files that are used in your AI workflows.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/files">
                Manage Files <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
