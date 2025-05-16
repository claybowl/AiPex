"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Text } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const TextCleaningNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-cyan-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-cyan-100 text-cyan-500">
          <Text className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Text Cleaning"}</div>
          <div className="text-xs text-gray-500">{data.description || "Clean and tokenize text data"}</div>
        </div>
      </div>

      {data.cleaningOperations && data.cleaningOperations.length > 0 && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Operations: {data.cleaningOperations.length}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="cleaned_text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
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

TextCleaningNode.displayName = "TextCleaningNode"
