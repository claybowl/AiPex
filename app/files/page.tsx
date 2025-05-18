"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileList from "@/components/file-list"
import FileUpload from "@/components/file-upload"
import { toast } from "@/components/ui/use-toast"
import type { FileMetadata } from "@/lib/blob-storage"

export default function FilesPage() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number>(1) // Default to workflow ID 1 for testing
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)

  const handleFileSelect = (file: FileMetadata) => {
    setSelectedFile(file)
    toast({
      title: "File selected",
      description: `Selected file: ${file.filename}`,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">File Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Files for Workflow #{selectedWorkflowId}</CardTitle>
            </CardHeader>
            <CardContent>
              <FileList workflowId={selectedWorkflowId} onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload New File</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                workflowId={selectedWorkflowId}
                onSuccess={() => {
                  toast({
                    title: "File uploaded",
                    description: "Your file has been uploaded successfully.",
                  })
                }}
              />
            </CardContent>
          </Card>

          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle>Selected File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedFile.filename}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedFile.contentType}
                  </p>
                  <p>
                    <strong>Size:</strong> {Math.round(selectedFile.size / 1024)} KB
                  </p>
                  <div className="pt-2">
                    <Button asChild className="w-full">
                      <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
