"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { VideoIcon as Vector } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const EmbeddingNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-violet-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-violet-100 text-violet-500">
          <Vector className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Embedding Generation"}</div>
          <div className="text-xs text-gray-500">{data.description || "Generate vector embeddings"}</div>
        </div>
      </div>

      {data.embeddingModel && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Model: {data.embeddingModel}</div>}
      {data.dimensions && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Dimensions: {data.dimensions}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-violet-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="embeddings"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-violet-500"
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

EmbeddingNode.displayName = "EmbeddingNode"
