import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"
import { getFileFromBlobStorage } from "../blob-storage"

export const FileDownloadExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const { fileName = "" } = node.data

      // Get input file info
      const fileInfo = context.inputs.fileInfo
      let fileUrl = ""
      let pathname = ""

      if (typeof fileInfo === "string") {
        // If input is a string, assume it's a URL or pathname
        if (fileInfo.startsWith("http")) {
          fileUrl = fileInfo
        } else {
          pathname = fileInfo
        }
      } else if (fileInfo && typeof fileInfo === "object") {
        // If input is an object, extract URL and pathname
        fileUrl = fileInfo.url || ""
        pathname = fileInfo.pathname || ""
      } else {
        throw new Error("Invalid file information provided")
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Downloading file: ${fileName || pathname || fileUrl}`,
          progress: 10,
        })
      }

      let fileData

      // If we have a pathname, try to get the file from Blob storage
      if (pathname) {
        // Update progress
        if (onUpdate) {
          onUpdate(node.id, "running", {
            message: `Fetching file from storage: ${pathname}`,
            progress: 30,
          })
        }

        fileData = await getFileFromBlobStorage(pathname)

        if (!fileData) {
          throw new Error(`File not found in storage: ${pathname}`)
        }
      } else if (fileUrl) {
        // If we have a URL, fetch the file
        // Update progress
        if (onUpdate) {
          onUpdate(node.id, "running", {
            message: `Fetching file from URL: ${fileUrl}`,
            progress: 30,
          })
        }

        const response = await fetch(fileUrl)

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`)
        }

        const blob = await response.blob()
        const contentType = response.headers.get("content-type") || "application/octet-stream"
        const contentDisposition = response.headers.get("content-disposition") || ""
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        const downloadedFileName = filenameMatch ? filenameMatch[1] : fileName || "downloaded-file"

        fileData = {
          url: fileUrl,
          filename: downloadedFileName,
          contentType,
          size: blob.size,
          blob,
        }
      } else {
        throw new Error("No file URL or pathname provided")
      }

      // Update progress
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `File downloaded: ${fileData.filename}`,
          progress: 90,
          fileData,
        })
      }

      // Store the result in node outputs
      context.nodeOutputs[node.id] = {
        default: fileData,
        file: fileData,
        url: fileData.url,
        filename: fileData.filename,
        contentType: fileData.contentType,
        size: fileData.size,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `File downloaded successfully: ${fileData.filename}`,
          fileData,
        })
      }
    } catch (error) {
      // Handle errors
      const errorMessage = (error as Error).message || "Unknown error"

      // Store error in node outputs
      context.nodeOutputs[node.id] = {
        error: errorMessage,
      }

      // Update error status
      if (onUpdate) {
        onUpdate(node.id, "error", { error: errorMessage })
      }

      // Propagate error
      throw error
    }
  },
}

// Register the executor
registerNodeExecutor("file-download", FileDownloadExecutor)
