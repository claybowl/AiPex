"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Lightbulb } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const ChainOfThoughtNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-500">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Chain-of-Thought Debugger"}</div>
          <div className="text-xs text-gray-500">{data.description || "Expose LLM reasoning steps"}</div>
        </div>
      </div>

      {data.model && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}
      {data.detailLevel && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Detail Level: {data.detailLevel}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="prompt"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="reasoning"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="result"
        style={{ left: "75%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
    </div>
  )
})

ChainOfThoughtNode.displayName = "ChainOfThoughtNode"
