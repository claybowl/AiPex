"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteWorkflowFile } from "@/lib/actions/file-actions"
import { toast } from "@/components/ui/use-toast"
import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  FileJson,
  FileIcon as FilePdf,
  FileVideo,
  FileAudio,
  FileIcon,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react"
import type { FileMetadata } from "@/lib/blob-storage"

interface FilePreviewProps {
  file: FileMetadata
  onDelete?: () => void
  showActions?: boolean
}

export default function FilePreview({ file, onDelete, showActions = true }: FilePreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const getFileIcon = () => {
    const type = file.contentType.toLowerCase()

    if (type.includes("image")) return <ImageIcon className="h-12 w-12" />
    if (type.includes("pdf")) return <FilePdf className="h-12 w-12" />
    if (type.includes("csv") || type.includes("excel") || type.includes("spreadsheet"))
      return <FileSpreadsheet className="h-12 w-12" />
    if (type.includes("json")) return <FileJson className="h-12 w-12" />
    if (type.includes("text") || type.includes("markdown")) return <FileText className="h-12 w-12" />
    if (type.includes("video")) return <FileVideo className="h-12 w-12" />
    if (type.includes("audio")) return <FileAudio className="h-12 w-12" />

    return <FileIcon className="h-12 w-12" />
  }

  const getPreviewContent = () => {
    const type = file.contentType.toLowerCase()

    if (type.includes("image")) {
      return (
        <div className="flex items-center justify-center h-40 bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.filename}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-t-lg">
        {getFileIcon()}
        <p className="mt-2 text-sm text-gray-500">{file.contentType}</p>
      </div>
    )
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this file?")) {
      setIsDeleting(true)

      try {
        const success = await deleteWorkflowFile(file.id)

        if (success) {
          toast({
            title: "File deleted",
            description: "The file has been deleted successfully.",
          })
          onDelete?.()
        } else {
          throw new Error("Failed to delete file")
        }
      } catch (error) {
        console.error("Error deleting file:", error)
        toast({
          title: "Error",
          description: "Failed to delete the file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      {getPreviewContent()}

      <CardContent className="p-4">
        <h3 className="font-medium truncate" title={file.filename}>
          {file.filename}
        </h3>
        <p className="text-sm text-gray-500">{new Date(file.uploadedAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={file.url} download={file.filename}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>

          <Button variant="outline" size="icon" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
