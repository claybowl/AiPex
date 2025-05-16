"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Mail } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const EmailNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-rose-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-500">
          <Mail className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Email Send"}</div>
          <div className="text-xs text-gray-500">{data.description || "Send emails via SMTP"}</div>
        </div>
      </div>

      {data.emailTo && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">To: {data.emailTo}</div>
      )}
      {data.emailSubject && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">
          Subject: {data.emailSubject.length > 25 ? data.emailSubject.substring(0, 25) + "..." : data.emailSubject}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-rose-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sent"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-rose-500"
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

EmailNode.displayName = "EmailNode"
