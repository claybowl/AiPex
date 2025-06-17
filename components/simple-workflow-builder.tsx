"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Download, Upload } from "lucide-react"

export default function SimpleWorkflowBuilder() {
  const [nodes, setNodes] = useState<any[]>([])

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${type} Node` },
    }
    setNodes((prev) => [...prev, newNode])
  }

  const saveWorkflow = () => {
    const workflow = { nodes, edges: [] }
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workflow.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadWorkflow = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const workflow = JSON.parse(e.target?.result as string)
            setNodes(workflow.nodes || [])
          } catch (error) {
            console.error("Error loading workflow:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Workflow Builder</h1>
          <div className="flex gap-2">
            <Button onClick={saveWorkflow} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={loadWorkflow} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node Library */}
        <div className="w-64 bg-white border-r p-4">
          <h2 className="font-semibold mb-4">Node Library</h2>
          <div className="space-y-2">
            {["Input", "LLM", "Output", "Process"].map((type) => (
              <Button
                key={type}
                onClick={() => addNode(type.toLowerCase())}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Simplified Mode
              </CardTitle>
              <CardDescription>ReactFlow is loading. This is a simplified interface for now.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">Current Nodes ({nodes.length}):</h3>
                {nodes.map((node) => (
                  <div key={node.id} className="p-2 bg-gray-100 rounded text-sm">
                    {node.data.label} (ID: {node.id})
                  </div>
                ))}
                {nodes.length === 0 && (
                  <p className="text-gray-500 text-sm">No nodes added yet. Use the node library to add nodes.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
