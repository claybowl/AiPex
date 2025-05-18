import { put, del } from "@vercel/blob"
import { nanoid } from "nanoid"

export interface FileMetadata {
  id: string
  url: string
  pathname: string
  filename: string
  contentType: string
  size: number
  uploadedAt: string
  workflowId?: number
  nodeId?: string
  executionId?: number
}

// Upload a file to Blob storage
export async function uploadFileToBlobStorage(
  file: File,
  workflowId?: number,
  nodeId?: string,
  executionId?: number,
): Promise<FileMetadata> {
  try {
    // Generate a unique ID for the file
    const fileId = nanoid()

    // Create a pathname based on the workflow, node, and execution IDs
    let pathname = `workflow-files/${fileId}`
    if (workflowId) pathname = `workflow-files/workflow-${workflowId}/${fileId}`
    if (nodeId) pathname = `workflow-files/workflow-${workflowId}/node-${nodeId}/${fileId}`
    if (executionId)
      pathname = `workflow-files/workflow-${workflowId}/node-${nodeId}/execution-${executionId}/${fileId}`

    // Add file extension if present
    const fileExtension = file.name.split(".").pop()
    if (fileExtension) {
      pathname = `${pathname}.${fileExtension}`
    }

    // Upload the file to Blob storage
    const blob = await put(pathname, file, {
      access: "public",
    })

    // Return the file metadata
    return {
      id: fileId,
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      workflowId,
      nodeId,
      executionId,
    }
  } catch (error) {
    console.error("Error uploading file to Blob storage:", error)
    throw error
  }
}

// Delete a file from Blob storage
export async function deleteFileFromBlobStorage(pathname: string): Promise<boolean> {
  try {
    await del(pathname)
    return true
  } catch (error) {
    console.error("Error deleting file from Blob storage:", error)
    return false
  }
}

// Get a file from Blob storage
export async function getFileFromBlobStorage(pathname: string): Promise<any | null> {
  try {
    // Fetch the file from Blob storage
    const response = await fetch(pathname)

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const blob = await response.blob()
    const contentType = response.headers.get("content-type") || "application/octet-stream"
    const contentDisposition = response.headers.get("content-disposition") || ""
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
    const filename = filenameMatch ? filenameMatch[1] : pathname.split("/").pop() || "downloaded-file"

    return {
      url: pathname,
      filename: filename,
      contentType: contentType,
      size: blob.size,
      blob: blob,
    }
  } catch (error) {
    console.error("Error getting file from Blob storage:", error)
    return null
  }
}
