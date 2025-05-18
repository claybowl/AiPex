import { NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import { getWorkflowFiles, saveFileMetadata } from "@/lib/actions/file-actions"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const workflowId = formData.get("workflowId") ? Number(formData.get("workflowId")) : undefined
    const nodeId = formData.get("nodeId") as string | undefined
    const executionId = formData.get("executionId") ? Number(formData.get("executionId")) : undefined

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique pathname
    const folderPath = workflowId
      ? `workflows/${workflowId}${nodeId ? `/nodes/${nodeId}` : ""}${executionId ? `/executions/${executionId}` : ""}`
      : "uploads"

    // Sanitize filename
    const sanitizedFilename = file.name.replace(/[^\w\s.-]/g, "_")
    const pathname = `${folderPath}/${Date.now()}-${sanitizedFilename}`

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Create file metadata
    const fileMetadata = {
      id: pathname.split("/").pop()?.split("-")[0] || Date.now().toString(),
      url: blob.url,
      pathname: blob.pathname,
      filename: sanitizedFilename,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date(),
      workflowId,
      nodeId,
      executionId,
    }

    // Save metadata to database
    await saveFileMetadata(fileMetadata)

    return NextResponse.json(fileMetadata)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get("workflowId") ? Number(searchParams.get("workflowId")) : undefined
    const nodeId = searchParams.get("nodeId") || undefined
    const executionId = searchParams.get("executionId") ? Number(searchParams.get("executionId")) : undefined
    const prefix = searchParams.get("prefix") || undefined

    if (workflowId) {
      // Get files from database
      const files = await getWorkflowFiles(workflowId)
      return NextResponse.json({ files })
    } else if (prefix) {
      // List files from Blob storage
      const { blobs } = await list({ prefix })
      return NextResponse.json({ files: blobs })
    } else {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
