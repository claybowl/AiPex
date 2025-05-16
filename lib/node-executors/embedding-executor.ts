import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"

export const EmbeddingExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const { embeddingModel = "text-embedding-3-large", dimensions = 1536 } = node.data

      // Get input text
      const inputText = context.inputs.text || ""

      if (!inputText) {
        throw new Error("No input text provided for embedding generation")
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Generating embeddings with model ${embeddingModel}`,
          text: inputText.substring(0, 100) + (inputText.length > 100 ? "..." : ""),
        })
      }

      // Call OpenAI API for embeddings
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY || context.metadata.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: inputText,
          model: embeddingModel,
          dimensions: dimensions,
        }),
        signal: context.abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()

      // Store the embeddings in node outputs
      context.nodeOutputs[node.id] = {
        default: data.data[0].embedding,
        embeddings: data.data[0].embedding,
        model: embeddingModel,
        dimensions: dimensions,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `Embeddings generated successfully`,
          dimensions: dimensions,
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
registerNodeExecutor("embedding", EmbeddingExecutor)
