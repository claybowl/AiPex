"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Upload } from "lucide-react"
import type { NodeData } from "@/lib/types"

export const S3UploaderNode = memo(({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 min-w-[180px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-500">
          <Upload className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label || "S3 Uploader"}</div>
          <div className="text-xs text-gray-500">{data.description || "Upload files to S3"}</div>
        </div>
      </div>

      {data.bucket && <div className="mt-2 text-xs bg-gray-100 p-1 rounded">Bucket: {data.bucket}</div>}
      {data.keyPrefix && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">Prefix: {data.keyPrefix}</div>}
      {data.acl && <div className="mt-1 text-xs bg-gray-100 p-1 rounded">ACL: {data.acl}</div>}

      <Handle
        type="target"
        position={Position.Top}
        id="file"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="uploaded"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
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

S3UploaderNode.displayName = "S3UploaderNode"
