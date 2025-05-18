"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { FileMetadata } from "@/lib/blob-storage"

interface FileViewerProps {
  file: FileMetadata | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FileViewer({ file, open, onOpenChange }: FileViewerProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (file) {
      setLoading(false)
    }
  }, [file])

  if (!file) {
    return null
  }

  const renderFilePreview = () => {
    if (loading) {
      return <Skeleton className="w-full h-[300px]" />
    }

    if (file.contentType.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.filename}
            className="max-h-[500px] max-w-full object-contain"
            onLoad={() => setLoading(false)}
          />
        </div>
      )
    }

    if (file.contentType.startsWith("video/")) {
      return (
        <video src={file.url} controls className="w-full max-h-[500px]" onLoadedData={() => setLoading(false)}>
          Your browser does not support the video tag.
        </video>
      )
    }

    if (file.contentType === "application/pdf") {
      return (
        <iframe
          src={`${file.url}#toolbar=0&navpanes=0`}
          className="w-full h-[500px]"
          title={file.filename}
          onLoad={() => setLoading(false)}
        />
      )
    }

    if (file.contentType.startsWith("text/") || file.contentType === "application/json") {
      return (
        <div className="border rounded p-4 bg-gray-50 overflow-auto h-[300px] font-mono text-sm">
          <p>Text preview not available in this view.</p>
          <p>Please download the file to view its contents.</p>
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Preview not available for this file type.</p>
        <p className="text-gray-500 text-sm mt-2">{file.contentType}</p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{file.filename}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderFilePreview()}</div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" asChild>
            <a href={file.url} download={file.filename}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
