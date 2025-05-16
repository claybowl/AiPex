"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Clock } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const ScheduledTriggerNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-500">
          <Clock className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Scheduled Trigger"}</div>
          <div className="text-xs text-gray-500">{data.description || "Run workflow on schedule"}</div>
        </div>
      </div>

      {data.schedule && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Schedule: {data.schedule}</div>}
      {data.timezone && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Timezone: {data.timezone}</div>}
      {data.nextRun && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Next Run: {new Date(data.nextRun).toLocaleString()}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="trigger"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
    </div>
  )
})

ScheduledTriggerNode.displayName = "ScheduledTriggerNode"
