"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

export default function SimpleWorkflowBuilder() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadFull, setLoadFull] = useState(false)

  useEffect(() => {
    // Check if we can load reactflow
    const checkReactFlow = async () => {
      try {
        // Try to import reactflow
        await import("reactflow")
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading reactflow:", error)
        setIsLoading(false)
      }
    }

    checkReactFlow()
  }, [])

  const handleLoadFullBuilder = () => {
    setLoadFull(true)
  }

  if (loadFull) {
    // Dynamically import the full workflow builder
    const FullWorkflowBuilder = dynamic(() => import("./workflow-builder"), {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ),
    })

    return <FullWorkflowBuilder />
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Workflow Builder</h1>

      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center max-w-md">
            Build and run AI agent workflows with a visual drag-and-drop interface.
          </p>
          <Button onClick={handleLoadFullBuilder} size="lg">
            Launch Workflow Builder
          </Button>
        </div>
      )}
    </div>
  )
}
