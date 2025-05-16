"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Globe, Loader2 } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const RestApiNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  // Get execution status and data
  const executionStatus = data.executionStatus || "idle"
  const executionData = data.executionData || {}

  // Determine border color based on execution status
  let borderColorClass = "border-blue-500"
  if (executionStatus === "running") borderColorClass = "border-yellow-500"
  else if (executionStatus === "completed") borderColorClass = "border-green-500"
  else if (executionStatus === "error") borderColorClass = "border-red-500"

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderColorClass} min-w-[180px]`}>
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-500">
          {executionStatus === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "REST API"}</div>
          <div className="text-xs text-gray-500">{data.description || "Connect to REST API endpoints"}</div>
        </div>
      </div>

      <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Method: {data.method || "GET"}</div>
      {data.url && <div className="mt-1 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">URL: {data.url}</div>}

      {/* Show execution status if available */}
      {executionStatus !== "idle" && (
        <div
          className={`mt-2 text-xs p-1 rounded ${
            executionStatus === "running"
              ? "bg-yellow-100"
              : executionStatus === "completed"
                ? "bg-green-100"
                : executionStatus === "error"
                  ? "bg-red-100"
                  : "bg-gray-100"
          }`}
        >
          {executionStatus === "running" && "Running..."}
          {executionStatus === "completed" && "Completed"}
          {executionStatus === "error" && `Error: ${executionData.error || "Unknown error"}`}
          {executionStatus === "pending" && "Pending"}
        </div>
      )}

      {/* Show execution message if available */}
      {executionData.message && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">{executionData.message}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="trigger"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="data"
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

RestApiNode.displayName = "RestApiNode"
