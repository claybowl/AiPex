import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"

export const InputExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const { samplePrompt = "", inputType = "text" } = node.data

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", { message: "Processing input" })
      }

      // Use sample prompt as input if no specific input is provided
      const inputText = context.inputs.userInput || samplePrompt || "Hello, how can I help you today?"

      // Store the input in node outputs
      context.nodeOutputs[node.id] = {
        default: inputText,
        text: inputText,
        type: inputType,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: "Input processed",
          text: inputText,
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
registerNodeExecutor("input", InputExecutor)
