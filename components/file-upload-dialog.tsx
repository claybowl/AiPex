"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import FileUpload from "./file-upload"
import type { FileMetadata } from "@/lib/blob-storage"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUploaded: (file: FileMetadata) => void
  workflowId?: number
  nodeId?: string
  executionId?: number
  acceptedFileTypes?: string
  maxFileSize?: number
}

export default function FileUploadDialog({
  open,
  onOpenChange,
  onFileUploaded,
  workflowId,
  nodeId,
  executionId,
  acceptedFileTypes,
  maxFileSize,
}: FileUploadDialogProps) {
  const [uploading, setUploading] = useState(false)

  const handleUploadComplete = (file: FileMetadata) => {
    onFileUploaded(file)
    onOpenChange(false)
  }

  const handleUploadError = (error: Error) => {
    console.error("File upload error:", error)
    // Keep the dialog open on error
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to be processed by the workflow. The file will be stored in Vercel Blob storage.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FileUpload
            workflowId={workflowId}
            nodeId={nodeId}
            executionId={executionId}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            accept={acceptedFileTypes}
            maxSize={maxFileSize}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
