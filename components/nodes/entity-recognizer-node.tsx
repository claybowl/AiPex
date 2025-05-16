"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Tag } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const EntityRecognizerNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-500">
          <Tag className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Named-Entity Recognizer"}</div>
          <div className="text-xs text-gray-500">{data.description || "Extract entities from text"}</div>
        </div>
      </div>

      {data.entityTypes && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">
          Entity Types: {Array.isArray(data.entityTypes) ? data.entityTypes.join(", ") : data.entityTypes}
        </div>
      )}
      {data.model && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="entities"
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

EntityRecognizerNode.displayName = "EntityRecognizerNode"
