"use server"

import { revalidatePath } from "next/cache"
import { uploadFileToBlobStorage, deleteFileFromBlobStorage, type FileMetadata } from "@/lib/blob-storage"
import { query } from "@/lib/db"

// Save file metadata to the database
export async function saveFileMetadata(fileMetadata: FileMetadata): Promise<number | null> {
  try {
    const result = await query(
      `INSERT INTO workflow_files 
       (id, url, pathname, filename, content_type, size, uploaded_at, workflow_id, node_id, execution_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        fileMetadata.id,
        fileMetadata.url,
        fileMetadata.pathname,
        fileMetadata.filename,
        fileMetadata.contentType,
        fileMetadata.size,
        fileMetadata.uploadedAt,
        fileMetadata.workflowId || null,
        fileMetadata.nodeId || null,
        fileMetadata.executionId || null,
      ],
    )

    // Check if result is an array with rows
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0]?.id
    }
    return null
  } catch (error) {
    console.error("Error saving file metadata:", error)
    return null
  }
}

// Get file metadata from the database
export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  try {
    const result = await query(
      `SELECT id, url, pathname, filename, content_type as "contentType", size, 
              uploaded_at as "uploadedAt", workflow_id as "workflowId", 
              node_id as "nodeId", execution_id as "executionId"
       FROM workflow_files
       WHERE id = $1`,
      [fileId],
    )

    // Check if result is an array with rows
    if (!result || !result.rows || result.rows.length === 0) {
      return null
    }

    return result.rows[0] as FileMetadata
  } catch (error) {
    console.error("Error getting file metadata:", error)
    return null
  }
}

// Upload a file and save its metadata
export async function uploadWorkflowFile(
  formData: FormData,
  workflowId?: number,
  nodeId?: string,
  executionId?: number,
): Promise<FileMetadata | null> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File size exceeds the 50MB limit")
    }

    // Upload file to Blob storage
    const fileMetadata = await uploadFileToBlobStorage(file, workflowId, nodeId, executionId)

    // Save metadata to database
    await saveFileMetadata(fileMetadata)

    // Revalidate paths that might display this file
    if (workflowId) {
      revalidatePath(`/workflows/${workflowId}`)
    }

    return fileMetadata
  } catch (error) {
    console.error("Error uploading workflow file:", error)
    return null
  }
}

// Get files for a workflow
export async function getWorkflowFiles(workflowId: number): Promise<FileMetadata[]> {
  try {
    const result = await query(
      `SELECT id, url, pathname, filename, content_type as "contentType", size, 
              uploaded_at as "uploadedAt", workflow_id as "workflowId", 
              node_id as "nodeId", execution_id as "executionId"
       FROM workflow_files
       WHERE workflow_id = $1
       ORDER BY uploaded_at DESC`,
      [workflowId],
    )

    // Return empty array if no results
    if (!result || !result.rows) {
      return []
    }

    return result.rows as FileMetadata[]
  } catch (error) {
    console.error("Error getting workflow files:", error)
    return []
  }
}

// Delete a file and its metadata
export async function deleteWorkflowFile(fileId: string): Promise<boolean> {
  try {
    // Get file metadata to get the pathname
    const fileMetadata = await getFileMetadata(fileId)

    if (!fileMetadata) {
      return false
    }

    // Delete from Blob storage
    const deleted = await deleteFileFromBlobStorage(fileMetadata.pathname)

    if (!deleted) {
      return false
    }

    // Delete from database
    await query("DELETE FROM workflow_files WHERE id = $1", [fileId])

    // Revalidate paths
    if (fileMetadata.workflowId) {
      revalidatePath(`/workflows/${fileMetadata.workflowId}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting workflow file:", error)
    return false
  }
}
