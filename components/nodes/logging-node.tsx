"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Gauge } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const LoggingNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500">
          <Gauge className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Logging & Monitoring"}</div>
          <div className="text-xs text-gray-500">{data.description || "Log events and metrics"}</div>
        </div>
      </div>

      {data.logLevel && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Level: {data.logLevel}</div>}
      {data.metricName && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Metric: {data.metricName}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="logged"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-500"
      />
    </div>
  )
})

LoggingNode.displayName = "LoggingNode"
