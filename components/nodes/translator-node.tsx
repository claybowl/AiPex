"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Globe } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const TranslatorNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-emerald-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-500">
          <Globe className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Translator"}</div>
          <div className="text-xs text-gray-500">{data.description || "Translate text between languages"}</div>
        </div>
      </div>

      {data.sourceLanguage && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">From: {data.sourceLanguage}</div>}
      {data.targetLanguage && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">To: {data.targetLanguage}</div>}
      {data.model && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Model: {data.model}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="translated"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-500"
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

TranslatorNode.displayName = "TranslatorNode"
