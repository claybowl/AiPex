"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUpload from "@/components/file-upload"
import FileViewer from "@/components/file-viewer"
import { toast } from "@/components/ui/use-toast"
import type { FileMetadata } from "@/lib/blob-storage"

export default function FileWorkflowExample() {
  const [file, setFile] = useState<FileMetadata | null>(null)
  const [processedFile, setProcessedFile] = useState<FileMetadata | null>(null)
  const [fileViewerOpen, setFileViewerOpen] = useState(false)
  const [viewingFile, setViewingFile] = useState<FileMetadata | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleUploadComplete = (uploadedFile: FileMetadata) => {
    setFile(uploadedFile)
    toast({
      title: "File uploaded",
      description: `${uploadedFile.filename} has been uploaded successfully`,
    })
  }

  const handleProcessFile = async () => {
    if (!file) return

    setProcessing(true)
    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a mock processed file
      const processedFile: FileMetadata = {
        ...file,
        id: `processed-${file.id}`,
        pathname: `processed/${file.pathname}`,
        filename: `processed-${file.filename}`,
      }

      setProcessedFile(processedFile)
      toast({
        title: "File processed",
        description: "The file has been processed successfully",
      })
    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "Processing failed",
        description: (error as Error).message || "An error occurred while processing the file",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const viewFile = (fileToView: FileMetadata) => {
    setViewingFile(fileToView)
    setFileViewerOpen(true)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">File Workflow Example</h1>

      <Tabs defaultValue="upload">
        <TabsList className="mb-8">
          <TabsTrigger value="upload">1. Upload File</TabsTrigger>
          <TabsTrigger value="process" disabled={!file}>
            2. Process File
          </TabsTrigger>
          <TabsTrigger value="result" disabled={!processedFile}>
            3. View Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Upload a file to start the workflow</CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <FileUpload
                  workflowId={999} // Example workflow ID
                  nodeId="upload-node"
                  onUploadComplete={handleUploadComplete}
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 font-medium">File uploaded successfully!</p>
                    <p className="text-sm text-green-600 mt-1">
                      {file.filename} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                  <Button onClick={() => viewFile(file)}>View File</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button disabled={!file} onClick={() => document.querySelector('[data-value="process"]')?.click()}>
                Next: Process File
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Process File</CardTitle>
              <CardDescription>Apply processing to the uploaded file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 font-medium">File ready for processing</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {file?.filename} ({(file?.size ? file.size / 1024 : 0).toFixed(2)} KB)
                  </p>
                </div>
                <Button onClick={handleProcessFile} disabled={processing}>
                  {processing ? "Processing..." : "Process File"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={!processedFile}
                onClick={() => document.querySelector('[data-value="result"]')?.click()}
              >
                Next: View Result
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>View the processed file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-purple-700 font-medium">File processed successfully!</p>
                  <p className="text-sm text-purple-600 mt-1">
                    {processedFile?.filename} ({(processedFile?.size ? processedFile.size / 1024 : 0).toFixed(2)} KB)
                  </p>
                </div>
                <Button onClick={() => viewFile(processedFile!)}>View Processed File</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()}>Start Over</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <FileViewer file={viewingFile} open={fileViewerOpen} onOpenChange={setFileViewerOpen} />
    </div>
  )
}
