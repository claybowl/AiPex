"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Workflow Builder...</p>
  </div>
)

// Dynamically import the SimpleWorkflowBuilder component itself, which uses ReactFlow
const SimpleWorkflowBuilder = dynamic(() => import("@/components/simple-workflow-builder"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function BuilderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="h-screen w-full">
        <SimpleWorkflowBuilder />
      </div>
    </Suspense>
  )
}
