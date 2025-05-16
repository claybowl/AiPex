"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Webhook } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const WebhookNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-500">
          <Webhook className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Webhook Listener"}</div>
          <div className="text-xs text-gray-500">{data.description || "Listen for incoming webhooks"}</div>
        </div>
      </div>

      {data.webhookPath && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Path: {data.webhookPath}</div>}

      <Handle
        type="source"
        position={Position.Bottom}
        id="payload"
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

WebhookNode.displayName = "WebhookNode"
