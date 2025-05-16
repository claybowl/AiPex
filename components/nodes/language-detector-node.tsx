"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Languages } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const LanguageDetectorNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <Languages className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Language Detector"}</div>
          <div className="text-xs text-gray-500">{data.description || "Auto-detect text language"}</div>
        </div>
      </div>

      {data.confidenceThreshold && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Confidence Threshold: {data.confidenceThreshold}</div>
      )}
      {data.supportedLanguages && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">
          Languages:{" "}
          {Array.isArray(data.supportedLanguages) ? data.supportedLanguages.join(", ") : data.supportedLanguages}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="text"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="detected"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
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

LanguageDetectorNode.displayName = "LanguageDetectorNode"
