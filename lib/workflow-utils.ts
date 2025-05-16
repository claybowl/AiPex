import type { Node, XYPosition } from "reactflow"
import type { NodeData } from "./types"

let nodeIdCounter = 0

export const generateNodeId = (type: string): string => {
  nodeIdCounter++
  return `${type}-${nodeIdCounter}`
}

export const createNode = ({
  type,
  position,
  id,
}: {
  type: string
  position: XYPosition
  id: string
}): Node<NodeData> => {
  const baseNode = {
    id,
    type,
    position,
    data: {
      label: getDefaultLabel(type),
      description: getDefaultDescription(type),
    },
  }

  switch (type) {
    case "input":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          inputType: "text",
          samplePrompt: "What can you help me with today?",
        },
      }
    case "output":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          outputFormat: "text",
          streaming: true,
        },
      }
    case "llm":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          modelName: "gpt-4o",
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: "You are a helpful AI assistant.",
        },
      }
    case "memory":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          memoryType: "buffer",
          contextWindow: 10,
          memoryKey: "chat_history",
        },
      }
    case "tool":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          toolType: "web-search",
          toolDescription: "Search the web for information",
        },
      }
    case "rag":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          dataSource: "vector-db",
          retrievalMethod: "similarity",
          topK: 3,
        },
      }
    case "conditional":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          condition: "contains(input, 'weather')",
          trueLabel: "Yes",
          falseLabel: "No",
        },
      }
    case "chain":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          chainType: "sequential",
          chainConfig: '{"steps": ["llm", "tool", "output"]}',
        },
      }
    default:
      return baseNode
  }
}

const getDefaultLabel = (type: string): string => {
  switch (type) {
    case "input":
      return "User Input"
    case "output":
      return "Response"
    case "llm":
      return "LLM"
    case "memory":
      return "Memory"
    case "tool":
      return "Tool"
    case "rag":
      return "RAG"
    case "conditional":
      return "Conditional"
    case "chain":
      return "Chain"
    default:
      return "Node"
  }
}

const getDefaultDescription = (type: string): string => {
  switch (type) {
    case "input":
      return "Starting point for user queries"
    case "output":
      return "Final agent response"
    case "llm":
      return "Language model processing"
    case "memory":
      return "Store conversation history"
    case "tool":
      return "External tool or API call"
    case "rag":
      return "Retrieval Augmented Generation"
    case "conditional":
      return "Conditional branching"
    case "chain":
      return "Combine multiple steps"
    default:
      return "Workflow node"
  }
}
