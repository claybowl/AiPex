"use client"

import dynamic from "next/dynamic"

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

// Use dynamic import with no SSR for the workflow builder
const WorkflowBuilderWrapper = dynamic(() => import("@/components/workflow-builder-wrapper"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function BuilderClient() {
  return <WorkflowBuilderWrapper />
}
