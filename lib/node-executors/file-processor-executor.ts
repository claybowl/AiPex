import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"

export const FileProcessorExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const { processorType = "text", options = {} } = node.data

      // Get input file
      const fileData = context.inputs.file

      if (!fileData) {
        throw new Error("No file provided for processing")
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Processing file: ${fileData.filename || "unknown"}`,
          progress: 10,
        })
      }

      let result

      // Process the file based on the processor type
      switch (processorType) {
        case "text":
          result = await processTextFile(fileData, options)
          break
        case "csv":
          result = await processCsvFile(fileData, options)
          break
        case "json":
          result = await processJsonFile(fileData, options)
          break
        case "image":
          result = await processImageFile(fileData, options)
          break
        default:
          throw new Error(`Unsupported processor type: ${processorType}`)
      }

      // Update progress
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `File processed: ${fileData.filename || "unknown"}`,
          progress: 90,
          result,
        })
      }

      // Store the result in node outputs
      context.nodeOutputs[node.id] = {
        default: result,
        result,
        processorType,
        originalFile: fileData,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `File processed successfully`,
          result,
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

// Helper function to process text files
async function processTextFile(fileData: any, options: any): Promise<any> {
  try {
    let text

    if (fileData.blob) {
      // If we have a blob, read it as text
      text = await fileData.blob.text()
    } else if (fileData.url) {
      // If we have a URL, fetch the content
      const response = await fetch(fileData.url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }
      text = await response.text()
    } else {
      throw new Error("Invalid file data for text processing")
    }

    // Apply text processing options
    if (options.trim) {
      text = text.trim()
    }

    if (options.toLowerCase) {
      text = text.toLowerCase()
    }

    if (options.toUpperCase) {
      text = text.toUpperCase()
    }

    if (options.splitLines) {
      text = text.split("\n")
    }

    if (options.maxLength && typeof text === "string") {
      text = text.substring(0, options.maxLength)
    }

    return {
      text,
      length: typeof text === "string" ? text.length : text.length,
      type: "text",
    }
  } catch (error) {
    console.error("Error processing text file:", error)
    throw error
  }
}

// Helper function to process CSV files
async function processCsvFile(fileData: any, options: any): Promise<any> {
  try {
    let text

    if (fileData.blob) {
      // If we have a blob, read it as text
      text = await fileData.blob.text()
    } else if (fileData.url) {
      // If we have a URL, fetch the content
      const response = await fetch(fileData.url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }
      text = await response.text()
    } else {
      throw new Error("Invalid file data for CSV processing")
    }

    // Parse CSV
    const delimiter = options.delimiter || ","
    const hasHeader = options.hasHeader !== false

    const lines = text.split("\n").filter((line) => line.trim())
    const header = hasHeader ? lines[0].split(delimiter).map((h: string) => h.trim()) : null
    const rows = (hasHeader ? lines.slice(1) : lines).map((line) =>
      line.split(delimiter).map((cell: string) => cell.trim()),
    )

    // Convert to array of objects if header is available
    let data
    if (header) {
      data = rows.map((row) => {
        const obj: Record<string, string> = {}
        header.forEach((h: string, i: number) => {
          obj[h] = row[i] || ""
        })
        return obj
      })
    } else {
      data = rows
    }

    return {
      data,
      header,
      rowCount: rows.length,
      columnCount: header ? header.length : rows[0] ? rows[0].length : 0,
      type: "csv",
    }
  } catch (error) {
    console.error("Error processing CSV file:", error)
    throw error
  }
}

// Helper function to process JSON files
async function processJsonFile(fileData: any, options: any): Promise<any> {
  try {
    let text

    if (fileData.blob) {
      // If we have a blob, read it as text
      text = await fileData.blob.text()
    } else if (fileData.url) {
      // If we have a URL, fetch the content
      const response = await fetch(fileData.url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }
      text = await response.text()
    } else {
      throw new Error("Invalid file data for JSON processing")
    }

    // Parse JSON
    const json = JSON.parse(text)

    // Apply JSON processing options
    let processedJson = json

    if (options.path) {
      // Extract data from a specific path
      const path = options.path.split(".")
      for (const key of path) {
        if (processedJson && typeof processedJson === "object") {
          processedJson = processedJson[key]
        } else {
          processedJson = undefined
          break
        }
      }
    }

    if (options.flatten && Array.isArray(processedJson)) {
      // Flatten nested arrays
      processedJson = processedJson.flat(options.flattenDepth || 1)
    }

    return {
      data: processedJson,
      type: "json",
      isArray: Array.isArray(processedJson),
      itemCount: Array.isArray(processedJson) ? processedJson.length : null,
    }
  } catch (error) {
    console.error("Error processing JSON file:", error)
    throw error
  }
}

// Helper function to process image files
async function processImageFile(fileData: any, options: any): Promise<any> {
  try {
    // For image processing, we'll just return metadata for now
    // In a real implementation, you might use a library like sharp for image processing

    return {
      url: fileData.url,
      filename: fileData.filename,
      contentType: fileData.contentType,
      size: fileData.size,
      type: "image",
      // Add more image-specific metadata here
    }
  } catch (error) {
    console.error("Error processing image file:", error)
    throw error
  }
}

// Register the executor
registerNodeExecutor("file-processor", FileProcessorExecutor)
