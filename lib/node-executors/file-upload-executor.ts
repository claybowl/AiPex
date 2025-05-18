import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"
import { uploadFileToBlobStorage } from "../blob-storage"

export const FileUploadExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const {
        acceptedFileTypes = "",
        maxFileSize = 50 * 1024 * 1024, // 50MB default
      } = node.data

      // Get input file
      const file = context.inputs.file

      if (!file) {
        throw new Error("No file provided for upload")
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Uploading file: ${file.name}`,
          progress: 10,
        })
      }

      // Check file size
      if (file.size > maxFileSize) {
        throw new Error(`File size exceeds the limit of ${maxFileSize} bytes`)
      }

      // Check file type if specified
      if (acceptedFileTypes && !acceptedFileTypes.split(",").some((type) => file.type.match(type.trim()))) {
        throw new Error(`File type ${file.type} is not accepted. Allowed types: ${acceptedFileTypes}`)
      }

      // Update progress
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Uploading file: ${file.name}`,
          progress: 30,
        })
      }

      // Upload file to Blob storage
      const workflowId = context.metadata.workflowId
      const executionId = context.metadata.executionId

      const fileMetadata = await uploadFileToBlobStorage(file, workflowId, node.id, executionId)

      // Update progress
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `File uploaded: ${file.name}`,
          progress: 90,
          fileMetadata,
        })
      }

      // Store the result in node outputs
      context.nodeOutputs[node.id] = {
        default: fileMetadata,
        file: fileMetadata,
        url: fileMetadata.url,
        pathname: fileMetadata.pathname,
        filename: fileMetadata.filename,
        contentType: fileMetadata.contentType,
        size: fileMetadata.size,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `File uploaded successfully: ${fileMetadata.filename}`,
          fileMetadata,
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
registerNodeExecutor("file-upload", FileUploadExecutor)
