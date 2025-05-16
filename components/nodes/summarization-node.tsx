"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { FileText } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const SummarizationNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-cyan-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-cyan-100 text-cyan-500">
          <FileText className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Summarization"}</div>
          <div className="text-xs text-gray-500">{data.description || "Condense text into summaries"}</div>
        </div>
      </div>

      {data.maxLength && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Max Length: {data.maxLength}</div>}
      {data.model && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}
      {data.style && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Style: {data.style}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="summary"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        style={{ left: "75%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  )
})

SummarizationNode.displayName = "SummarizationNode"
