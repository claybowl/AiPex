"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Mail } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const OutputNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-red-100 text-red-500">
          <Mail className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Response"}</div>
          <div className="text-xs text-gray-500">{data.description || "Final agent response"}</div>
        </div>
      </div>

      {data.outputFormat && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Format: {data.outputFormat}</div>}
      {data.streaming !== undefined && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Streaming: {data.streaming ? "Yes" : "No"}</div>
      )}

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-red-500" />
    </div>
  )
})

OutputNode.displayName = "OutputNode"
