"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Database, FileOutput, GitBranch, Code, Settings, Mail, Filter, Workflow } from "lucide-react"

const nodeTypes = [
  {
    type: "input",
    label: "User Input",
    description: "Starting point for user queries",
    icon: <Database className="h-4 w-4 mr-2" />,
  },
  {
    type: "llm",
    label: "LLM",
    description: "Language model processing",
    icon: <Code className="h-4 w-4 mr-2" />,
  },
  {
    type: "memory",
    label: "Memory",
    description: "Store conversation history",
    icon: <FileOutput className="h-4 w-4 mr-2" />,
  },
  {
    type: "tool",
    label: "Tool",
    description: "External tool or API call",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
  {
    type: "rag",
    label: "RAG",
    description: "Retrieval Augmented Generation",
    icon: <Filter className="h-4 w-4 mr-2" />,
  },
  {
    type: "conditional",
    label: "Conditional",
    description: "Conditional branching",
    icon: <GitBranch className="h-4 w-4 mr-2" />,
  },
  {
    type: "chain",
    label: "Chain",
    description: "Combine multiple steps",
    icon: <Workflow className="h-4 w-4 mr-2" />,
  },
  {
    type: "output",
    label: "Response",
    description: "Final agent response",
    icon: <Mail className="h-4 w-4 mr-2" />,
  },
]

export default function NodeLibrary() {
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex flex-col gap-2">
      {nodeTypes.map((node) => (
        <Button
          key={node.type}
          variant="outline"
          className={`justify-start text-left ${node.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          draggable={!node.disabled}
          onDragStart={(e) => onDragStart(e, node.type)}
          disabled={node.disabled}
        >
          {node.icon}
          <div className="flex flex-col items-start">
            <span>{node.label}</span>
            <span className="text-xs text-gray-500">{node.description}</span>
          </div>
        </Button>
      ))}
      <div className="mt-4 text-xs text-gray-500">Drag and drop nodes onto the canvas to build your workflow</div>
    </div>
  )
}
