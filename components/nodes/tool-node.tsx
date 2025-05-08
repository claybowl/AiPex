"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Settings } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const ToolNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-500">
          <Settings className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Tool"}</div>
          <div className="text-xs text-gray-500">{data.description || "External tool or API call"}</div>
        </div>
      </div>

      {data.toolType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Tool: {data.toolType}</div>}
      {data.apiEndpoint && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">API: {data.apiEndpoint}</div>}

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-orange-500" />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
    </div>
  )
})

ToolNode.displayName = "ToolNode"
