"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Layers } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const BatchInferenceNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-500">
          <Layers className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Batch Inference"}</div>
          <div className="text-xs text-gray-500">{data.description || "Process multiple items at once"}</div>
        </div>
      </div>

      {data.batchSize && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Batch Size: {data.batchSize}</div>}
      {data.model && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}
      {data.concurrency && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Concurrency: {data.concurrency}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="items"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="results"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
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

BatchInferenceNode.displayName = "BatchInferenceNode"
