"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Download } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const FileDownloadNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  // Get execution status and data
  const executionStatus = data.executionStatus || "idle"
  const executionData = data.executionData || {}

  // Determine border color based on execution status
  let borderColorClass = "border-green-500"
  if (executionStatus === "running") borderColorClass = "border-yellow-500"
  else if (executionStatus === "completed") borderColorClass = "border-green-500"
  else if (executionStatus === "error") borderColorClass = "border-red-500"

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderColorClass} min-w-[180px]`}>
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <Download className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "File Download"}</div>
          <div className="text-xs text-gray-500">{data.description || "Download files from storage"}</div>
        </div>
      </div>

      {data.fileUrl && <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate">URL: {data.fileUrl}</div>}
      {data.fileName && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Name: {data.fileName}</div>}

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
          {executionStatus === "running" && "Downloading..."}
          {executionStatus === "completed" && "Download complete"}
          {executionStatus === "error" && `Error: ${executionData.error || "Download failed"}`}
          {executionStatus === "pending" && "Pending"}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="fileInfo"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="file"
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

FileDownloadNode.displayName = "FileDownloadNode"
