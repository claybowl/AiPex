"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { FileSpreadsheet } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const CsvUploadNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <FileSpreadsheet className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "CSV/Excel Upload"}</div>
          <div className="text-xs text-gray-500">{data.description || "Import data from CSV/Excel files"}</div>
        </div>
      </div>

      <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Type: {data.fileType || "csv"}</div>
      {data.hasHeader !== undefined && (
        <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Has Header: {data.hasHeader ? "Yes" : "No"}</div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="file"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="data"
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

CsvUploadNode.displayName = "CsvUploadNode"
