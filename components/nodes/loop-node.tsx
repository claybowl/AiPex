"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { IterationCcw } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const LoopNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-500">
          <IterationCcw className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Loop Processor"}</div>
          <div className="text-xs text-gray-500">{data.description || "Process items in a loop"}</div>
        </div>
      </div>

      {data.loopType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.loopType}</div>}
      {data.maxIterations && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Max Iterations: {data.maxIterations}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="items"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="item"
        style={{ left: "25%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="completed"
        style={{ left: "50%" }}
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

LoopNode.displayName = "LoopNode"
