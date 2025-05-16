"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Building2 } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const DataEnrichmentNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-emerald-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-500">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Data Enrichment"}</div>
          <div className="text-xs text-gray-500">{data.description || "Enrich data with external sources"}</div>
        </div>
      </div>

      {data.enrichmentSource && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Source: {data.enrichmentSource}</div>
      )}
      {data.enrichmentKey && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Key: {data.enrichmentKey}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="enriched_data"
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

DataEnrichmentNode.displayName = "DataEnrichmentNode"
