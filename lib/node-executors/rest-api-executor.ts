import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"

export const RestApiExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const { method = "GET", url = "", headers = {}, body = "" } = node.data

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", { message: `Making ${method} request to ${url}` })
      }

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: context.abortController.signal,
      }

      // Add body for non-GET requests
      if (method !== "GET" && body) {
        options.body = body
      }

      // Make the request
      const response = await fetch(url, options)

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
      }

      // Parse response based on content type
      const contentType = response.headers.get("content-type") || ""
      let data

      if (contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Store the result in node outputs
      context.nodeOutputs[node.id] = {
        default: data,
        data: data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `Request completed with status ${response.status}`,
          data: data,
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
registerNodeExecutor("rest-api", RestApiExecutor)
