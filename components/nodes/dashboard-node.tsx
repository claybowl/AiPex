"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { BarChart3 } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const DashboardNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-lime-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-lime-100 text-lime-500">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Dashboard Update"}</div>
          <div className="text-xs text-gray-500">{data.description || "Update dashboard via HTTP"}</div>
        </div>
      </div>

      {data.dashboardUrl && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">
          URL: {data.dashboardUrl.length > 25 ? data.dashboardUrl.substring(0, 25) + "..." : data.dashboardUrl}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-lime-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="updated"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-lime-500"
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

DashboardNode.displayName = "DashboardNode"
