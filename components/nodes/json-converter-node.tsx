"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { FileJsonIcon as Json } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const JsonConverterNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-500">
          <Json className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "JSON-to-Tabular"}</div>
          <div className="text-xs text-gray-500">{data.description || "Convert JSON to tabular format"}</div>
        </div>
      </div>

      {data.jsonPath && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Path: {data.jsonPath}</div>}
      {data.flattenNested !== undefined && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Flatten: {data.flattenNested ? "Yes" : "No"}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="json"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="table"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-500"
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

JsonConverterNode.displayName = "JsonConverterNode"
