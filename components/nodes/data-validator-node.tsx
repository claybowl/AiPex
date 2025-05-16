"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { CheckCircle } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const DataValidatorNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-lime-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-lime-100 text-lime-500">
          <CheckCircle className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Data Validator"}</div>
          <div className="text-xs text-gray-500">{data.description || "Validate data against schema"}</div>
        </div>
      </div>

      {data.schemaType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.schemaType}</div>}
      {data.validationLevel && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Level: {data.validationLevel}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-lime-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="valid"
        style={{ left: "25%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="invalid"
        style={{ left: "75%" }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  )
})

DataValidatorNode.displayName = "DataValidatorNode"
