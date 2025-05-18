"use client"

import { useState, useEffect } from "react"
import { getWorkflowFiles } from "@/lib/actions/file-actions"
import FilePreview from "./file-preview"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { FileMetadata } from "@/lib/blob-storage"

interface FileListProps {
  workflowId: number
  nodeId?: string
  executionId?: number
  onFileSelect?: (file: FileMetadata) => void
  className?: string
}

export default function FileList({ workflowId, nodeId, executionId, onFileSelect, className = "" }: FileListProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)

  const loadFiles = async () => {
    setLoading(true)
    try {
      const fileList = await getWorkflowFiles(workflowId)

      // Filter by nodeId and executionId if provided
      const filteredFiles = fileList.filter((file) => {
        if (nodeId && file.nodeId !== nodeId) return false
        if (executionId && file.executionId !== executionId) return false
        return true
      })

      setFiles(filteredFiles)
    } catch (error) {
      console.error("Error loading files:", error)
      toast({
        title: "Error loading files",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [workflowId, nodeId, executionId])

  const handleDelete = () => {
    // Reload the file list after deletion
    loadFiles()
  }

  const handleFileClick = (file: FileMetadata) => {
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-4 border-t">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No files found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {files.map((file) => (
        <div key={file.id} className="cursor-pointer" onClick={() => handleFileClick(file)}>
          <FilePreview file={file} onDelete={handleDelete} showActions={true} />
        </div>
      ))}
    </div>
  )
}
