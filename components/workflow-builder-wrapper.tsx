"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"

// Create a loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

export default function WorkflowBuilderWrapper() {
  // Use state to track if we're in the browser
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only load the component client-side
  const WorkflowBuilder = isClient
    ? dynamic(() => import("./workflow-builder"), {
        ssr: false,
        loading: () => <LoadingSpinner />,
      })
    : () => <LoadingSpinner />

  return <Suspense fallback={<LoadingSpinner />}>{isClient ? <WorkflowBuilder /> : <LoadingSpinner />}</Suspense>
}
