"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Filter } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const RAGNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-teal-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-500">
          <Filter className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "RAG"}</div>
          <div className="text-xs text-gray-500">{data.description || "Retrieval Augmented Generation"}</div>
        </div>
      </div>

      {data.dataSource && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Source: {data.dataSource}</div>}
      {data.retrievalMethod && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Method: {data.retrievalMethod}</div>
      )}

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-teal-500" />
    </div>
  )
})

RAGNode.displayName = "RAGNode"
