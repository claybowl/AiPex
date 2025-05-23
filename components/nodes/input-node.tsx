"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Database } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const InputNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <Database className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "User Input"}</div>
          <div className="text-xs text-gray-500">{data.description || "Starting point for user queries"}</div>
        </div>
      </div>

      {data.inputType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.inputType}</div>}
      {data.samplePrompt && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate max-w-[200px]">Example: {data.samplePrompt}</div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
    </div>
  )
})

InputNode.displayName = "InputNode"
