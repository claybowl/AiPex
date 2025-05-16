"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Database } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const DbPullNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-500">
          <Database className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Database Pull"}</div>
          <div className="text-xs text-gray-500">{data.description || "Query data from PostgreSQL"}</div>
        </div>
      </div>

      <div className="mt-2 text-xs bg-gray-100 p-1 rounded">DB: {data.dbType || "postgresql"}</div>
      {data.query && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">
          Query: {data.query.length > 30 ? data.query.substring(0, 30) + "..." : data.query}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="query"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
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

DbPullNode.displayName = "DbPullNode"
