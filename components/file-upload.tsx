"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadWorkflowFile } from "@/lib/actions/file-actions"
import { Loader2 } from "lucide-react"
import type { FileMetadata } from "@/lib/blob-storage"

interface FileUploadProps {
  workflowId?: number
  nodeId?: string
  executionId?: number
  onSuccess?: (file: FileMetadata) => void
  onError?: (error: Error) => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
}

export default function FileUpload({
  workflowId,
  nodeId,
  executionId,
  onSuccess,
  onError,
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className = "",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size
      if (maxSize && file.size > maxSize) {
        alert(`File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`)
        e.target.value = ""
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const fileMetadata = await uploadWorkflowFile(formData, workflowId, nodeId, executionId)

      if (fileMetadata) {
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        onSuccess?.(fileMetadata)
      } else {
        throw new Error("Failed to upload file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      onError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="file-upload">Select a file</Label>
        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload File"
        )}
      </Button>
    </div>
  )
}
