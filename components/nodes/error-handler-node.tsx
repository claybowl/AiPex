"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { AlertTriangle } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const ErrorHandlerNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-red-100 text-red-500">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Error Handler"}</div>
          <div className="text-xs text-gray-500">{data.description || "Handle errors in the workflow"}</div>
        </div>
      </div>

      {data.retryCount !== undefined && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Retry Count: {data.retryCount}</div>
      )}
      {data.errorTypes && data.errorTypes.length > 0 && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Error Types: {data.errorTypes.length}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="operation"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="result"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
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

ErrorHandlerNode.displayName = "ErrorHandlerNode"
