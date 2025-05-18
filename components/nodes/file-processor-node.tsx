"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { FileText } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const FileProcessorNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  // Get execution status and data
  const executionStatus = data.executionStatus || "idle"
  const executionData = data.executionData || {}

  // Determine border color based on execution status
  let borderColorClass = "border-purple-500"
  if (executionStatus === "running") borderColorClass = "border-yellow-500"
  else if (executionStatus === "completed") borderColorClass = "border-green-500"
  else if (executionStatus === "error") borderColorClass = "border-red-500"

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderColorClass} min-w-[180px]`}>
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-500">
          <FileText className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "File Processor"}</div>
          <div className="text-xs text-gray-500">{data.description || "Process file contents"}</div>
        </div>
      </div>

      {data.processorType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.processorType}</div>}
      {data.options && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Options: {JSON.stringify(data.options)}</div>
      )}

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
          {executionStatus === "running" && "Processing..."}
          {executionStatus === "completed" && "Processing complete"}
          {executionStatus === "error" && `Error: ${executionData.error || "Processing failed"}`}
          {executionStatus === "pending" && "Pending"}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="file"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="result"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
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

FileProcessorNode.displayName = "FileProcessorNode"
