"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Database } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const CacheNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-sky-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-500">
          <Database className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Cache & Rate-Limiter"}</div>
          <div className="text-xs text-gray-500">{data.description || "Cache responses and limit rates"}</div>
        </div>
      </div>

      {data.ttl && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">TTL: {data.ttl} seconds</div>}
      {data.rateLimit && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Rate Limit: {data.rateLimit}/min</div>}
      {data.cacheKey && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Cache Key: {data.cacheKey}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="request"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-sky-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="response"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-sky-500"
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

CacheNode.displayName = "CacheNode"
