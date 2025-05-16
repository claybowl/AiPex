import type { Node } from "reactflow"
import type { NodeData } from "../types"
import type { ExecutionContext, NodeExecutor } from "../workflow-executor"
import { registerNodeExecutor } from "../workflow-executor"

export const LlmExecutor: NodeExecutor = {
  async execute(
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ): Promise<void> {
    try {
      // Extract node configuration
      const {
        modelName = "gpt-4o",
        temperature = 0.7,
        maxTokens = 1000,
        systemPrompt = "You are a helpful AI assistant.",
        promptTemplate = "{{input}}",
      } = node.data

      // Get input variables
      const variables = context.inputs.variables || {}

      // Process prompt template with variables
      let prompt = promptTemplate
      for (const [key, value] of Object.entries(variables)) {
        prompt = prompt.replace(new RegExp(`{{${key}}}`, "g"), String(value))
      }

      // If no variables were provided, use the default input
      if (prompt === promptTemplate && context.inputs.input) {
        prompt = context.inputs.input
      }

      if (!prompt) {
        throw new Error("No prompt provided for LLM")
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "running", {
          message: `Generating text with model ${modelName}`,
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
        })
      }

      // Call OpenAI API for text generation
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY || context.metadata.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
        signal: context.abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      // Process the streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullText = ""
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true })

        // Process complete lines
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const json = JSON.parse(data)
              const content = json.choices[0]?.delta?.content || ""
              if (content) {
                fullText += content

                // Update with streaming content
                if (onUpdate) {
                  onUpdate(node.id, "running", {
                    message: "Generating text...",
                    streamingContent: content,
                    partialText: fullText,
                  })
                }
              }
            } catch (e) {
              console.error("Error parsing JSON from stream:", e)
            }
          }
        }
      }

      // Store the generated text in node outputs
      context.nodeOutputs[node.id] = {
        default: fullText,
        response: fullText,
        model: modelName,
      }

      // Update status
      if (onUpdate) {
        onUpdate(node.id, "completed", {
          message: `Text generation completed`,
          text: fullText,
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
registerNodeExecutor("llm", LlmExecutor)
