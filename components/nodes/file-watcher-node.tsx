"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { FolderOpen } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const FileWatcherNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-500">
          <FolderOpen className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "File Watcher"}</div>
          <div className="text-xs text-gray-500">{data.description || "Watch for new files"}</div>
        </div>
      </div>

      {data.watchPath && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">Path: {data.watchPath}</div>
      )}
      {data.filePattern && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Pattern: {data.filePattern}</div>}

      <Handle
        type="source"
        position={Position.Bottom}
        id="file"
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

FileWatcherNode.displayName = "FileWatcherNode"
