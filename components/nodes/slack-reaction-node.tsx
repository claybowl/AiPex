"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MessageCircle } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const SlackReactionNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-500">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Slack Reaction"}</div>
          <div className="text-xs text-gray-500">{data.description || "Post to Slack with reactions"}</div>
        </div>
      </div>

      {data.channel && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Channel: {data.channel}</div>}
      {data.threadTs && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Thread: {data.threadTs}</div>}
      {data.reactions && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">
          Reactions: {Array.isArray(data.reactions) ? data.reactions.join(", ") : data.reactions}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="message"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="posted"
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

SlackReactionNode.displayName = "SlackReactionNode"
