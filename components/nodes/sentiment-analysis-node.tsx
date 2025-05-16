"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { ThumbsUp } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const SentimentAnalysisNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-rose-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-500">
          <ThumbsUp className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Sentiment Analysis"}</div>
          <div className="text-xs text-gray-500">{data.description || "Analyze text sentiment"}</div>
        </div>
      </div>

      {data.analysisType && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.analysisType}</div>}
      {data.model && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-rose-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sentiment"
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

SentimentAnalysisNode.displayName = "SentimentAnalysisNode"
