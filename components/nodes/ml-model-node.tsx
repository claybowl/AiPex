"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Brain } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const MlModelNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-pink-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-500">
          <Brain className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "ML Model"}</div>
          <div className="text-xs text-gray-500">{data.description || "Classification/Regression model"}</div>
        </div>
      </div>

      {data.mlModelType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.mlModelType}</div>}
      {data.mlModelEndpoint && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">
          Endpoint:{" "}
          {data.mlModelEndpoint.length > 25 ? data.mlModelEndpoint.substring(0, 25) + "..." : data.mlModelEndpoint}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="features"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-pink-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="prediction"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-pink-500"
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

MlModelNode.displayName = "MlModelNode"
