"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Table } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const GoogleSheetsNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <Table className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "Google Sheets Updater"}</div>
          <div className="text-xs text-gray-500">{data.description || "Update Google Sheets"}</div>
        </div>
      </div>

      {data.spreadsheetId && (
        <div className="mt-2 text-xs bg-gray-100 p-1 rounded truncate max-w-[250px]">
          Sheet ID: {data.spreadsheetId}
        </div>
      )}
      {data.sheetName && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Sheet: {data.sheetName}</div>}
      {data.operation && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Operation: {data.operation}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="data"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="result"
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

GoogleSheetsNode.displayName = "GoogleSheetsNode"
