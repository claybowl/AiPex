"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MemoryStickIcon as Memory } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const AgentNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-fuchsia-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-fuchsia-100 text-fuchsia-500">
          <Memory className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Stateful Agent"}</div>
          <div className="text-xs text-gray-500">{data.description || "Agent with memory management"}</div>
        </div>
      </div>

      {data.agentType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.agentType}</div>}
      {data.memoryType && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Memory: {data.memoryType}</div>}
      {data.contextWindow && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Context Window: {data.contextWindow}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-fuchsia-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="context"
        style={{ left: "75%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-fuchsia-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="response"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-fuchsia-500"
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

AgentNode.displayName = "AgentNode"
