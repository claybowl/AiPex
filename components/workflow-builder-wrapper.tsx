"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the WorkflowBuilder component with no SSR
const WorkflowBuilder = dynamic(() => import("./workflow-builder"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ),
})

export default function WorkflowBuilderWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowBuilder />
    </Suspense>
  )
}
