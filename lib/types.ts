import type { Node } from "reactflow"

export interface NodeData {
  label: string
  description?: string
  required?: boolean

  // Input node properties
  inputType?: "text" | "voice" | "image" | "multimodal"
  samplePrompt?: string

  // Output node properties
  outputFormat?: "text" | "json" | "markdown" | "html"
  streaming?: boolean

  // LLM node properties
  modelName?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string

  // Memory node properties
  memoryType?: "buffer" | "summary" | "vector" | "window"
  contextWindow?: number
  memoryKey?: string

  // Tool node properties
  toolType?: "web-search" | "calculator" | "database" | "api" | "custom"
  apiEndpoint?: string
  apiKey?: string
  toolDescription?: string

  // RAG node properties
  dataSource?: "vector-db" | "document" | "api" | "database"
  retrievalMethod?: "similarity" | "hybrid" | "mmr"
  topK?: number

  // Conditional node properties
  condition?: string
  trueLabel?: string
  falseLabel?: string

  // Chain node properties
  chainType?: "sequential" | "router" | "map-reduce" | "refine"
  chainConfig?: string

  // Legacy properties (keeping for backward compatibility)
  processType?: string
  processConfig?: string
  code?: string
  codeLanguage?: string
  sampleData?: string
  outputType?: string
}

export type WorkflowNode = Node<NodeData>

export interface Workflow {
  nodes: WorkflowNode[]
  edges: any[]
}
