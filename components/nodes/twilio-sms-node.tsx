"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MessageSquare } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const TwilioSmsNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-red-100 text-red-500">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Twilio SMS"}</div>
          <div className="text-xs text-gray-500">{data.description || "Send SMS messages"}</div>
        </div>
      </div>

      {data.toNumber && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">To: {data.toNumber}</div>}
      {data.fromNumber && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">From: {data.fromNumber}</div>}
      {data.waitForReply !== undefined && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Wait for Reply: {data.waitForReply ? "Yes" : "No"}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="message"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sent"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
      {data.waitForReply && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="reply"
          style={{ left: "50%" }}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-red-500"
        />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        style={{ left: data.waitForReply ? "75%" : "75%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  )
})

TwilioSmsNode.displayName = "TwilioSmsNode"
