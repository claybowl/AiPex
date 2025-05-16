import type { Edge, Node } from "reactflow"
import type { NodeData } from "./types"

// Define execution context that will be passed between nodes
export interface ExecutionContext {
  inputs: Record<string, any>
  outputs: Record<string, any>
  nodeOutputs: Record<string, Record<string, any>>
  errors: Record<string, Error>
  status: Record<string, "pending" | "running" | "completed" | "error">
  metadata: Record<string, any>
  abortController: AbortController
}

// Define node executor interface
export interface NodeExecutor {
  execute: (
    node: Node<NodeData>,
    context: ExecutionContext,
    onUpdate?: (nodeId: string, status: string, data?: any) => void,
  ) => Promise<void>
}

// Create a registry of node executors
const nodeExecutors: Record<string, NodeExecutor> = {}

// Register a node executor
export function registerNodeExecutor(nodeType: string, executor: NodeExecutor): void {
  nodeExecutors[nodeType] = executor
}

// Get a node executor
export function getNodeExecutor(nodeType: string): NodeExecutor | undefined {
  return nodeExecutors[nodeType]
}

// Create a topological sort function to determine execution order
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  // Create a map of node id to node
  const nodeMap = new Map<string, Node>()
  nodes.forEach((node) => nodeMap.set(node.id, node))

  // Create a map of node id to its dependencies (incoming edges)
  const dependencies = new Map<string, Set<string>>()
  nodes.forEach((node) => dependencies.set(node.id, new Set()))

  // Create a map of node id to its dependents (outgoing edges)
  const dependents = new Map<string, string[]>()
  nodes.forEach((node) => dependents.set(node.id, []))

  // Populate dependencies and dependents
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      dependencies.get(edge.target)?.add(edge.source)
      dependents.get(edge.source)?.push(edge.target)
    }
  })

  // Find nodes with no dependencies (starting nodes)
  const startNodes: Node[] = []
  dependencies.forEach((deps, nodeId) => {
    if (deps.size === 0) {
      const node = nodeMap.get(nodeId)
      if (node) startNodes.push(node)
    }
  })

  // If no start nodes, there might be a cycle or empty graph
  if (startNodes.length === 0) {
    if (nodes.length > 0) {
      console.warn("Possible cycle detected in workflow graph")
      return nodes // Return all nodes as a fallback
    }
    return [] // Empty graph
  }

  // Perform topological sort
  const visited = new Set<string>()
  const sorted: Node[] = []

  function visit(node: Node) {
    if (visited.has(node.id)) return
    visited.add(node.id)

    // Visit all dependents
    const nodeChildren = dependents.get(node.id) || []
    for (const childId of nodeChildren) {
      const childNode = nodeMap.get(childId)
      if (childNode) visit(childNode)
    }

    // Add current node to sorted list
    sorted.unshift(node)
  }

  // Visit all start nodes
  startNodes.forEach(visit)

  // If not all nodes were visited, there might be disconnected subgraphs
  if (sorted.length < nodes.length) {
    console.warn("Disconnected nodes detected in workflow graph")
    // Add remaining nodes
    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        sorted.push(node)
      }
    })
  }

  return sorted
}

// Execute a workflow
export async function executeWorkflow(
  nodes: Node<NodeData>[],
  edges: Edge[],
  onNodeUpdate?: (nodeId: string, status: string, data?: any) => void,
  onWorkflowComplete?: (context: ExecutionContext) => void,
  initialInputs: Record<string, any> = {},
): Promise<ExecutionContext> {
  // Create execution context
  const context: ExecutionContext = {
    inputs: initialInputs,
    outputs: {},
    nodeOutputs: {},
    errors: {},
    status: {},
    metadata: {},
    abortController: new AbortController(),
  }

  // Initialize node statuses
  nodes.forEach((node) => {
    context.status[node.id] = "pending"
  })

  try {
    // Sort nodes in execution order
    const sortedNodes = topologicalSort(nodes, edges)

    // Create a map of edges by source node and handle
    const edgeMap = new Map<string, Edge[]>()
    edges.forEach((edge) => {
      const key = edge.source
      if (!edgeMap.has(key)) {
        edgeMap.set(key, [])
      }
      edgeMap.get(key)?.push(edge)
    })

    // Execute nodes in order
    for (const node of sortedNodes) {
      // Skip if workflow was aborted
      if (context.abortController.signal.aborted) {
        break
      }

      // Update node status
      context.status[node.id] = "running"
      if (onNodeUpdate) {
        onNodeUpdate(node.id, "running")
      }

      try {
        // Get node executor
        const executor = getNodeExecutor(node.type || "")
        if (!executor) {
          throw new Error(`No executor found for node type: ${node.type}`)
        }

        // Prepare node inputs from connected nodes
        const nodeInputs: Record<string, any> = {}

        // Find all edges where this node is the target
        edges.forEach((edge) => {
          if (edge.target === node.id) {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            if (sourceNode && context.nodeOutputs[sourceNode.id]) {
              // If source handle is specified, use that specific output
              if (edge.sourceHandle) {
                nodeInputs[edge.targetHandle || "default"] = context.nodeOutputs[sourceNode.id][edge.sourceHandle]
              } else {
                // Otherwise use the default output
                nodeInputs[edge.targetHandle || "default"] = context.nodeOutputs[sourceNode.id]["default"]
              }
            }
          }
        })

        // Add global inputs
        Object.assign(nodeInputs, context.inputs)

        // Initialize node outputs
        context.nodeOutputs[node.id] = {}

        // Execute node
        await executor.execute(
          node,
          {
            ...context,
            inputs: nodeInputs,
          },
          onNodeUpdate,
        )

        // Update node status
        context.status[node.id] = "completed"
        if (onNodeUpdate) {
          onNodeUpdate(node.id, "completed", context.nodeOutputs[node.id])
        }

        // Propagate outputs to connected nodes
        const outgoingEdges = edgeMap.get(node.id) || []
        for (const edge of outgoingEdges) {
          if (edge.target) {
            // If we have a specific source handle, use that output
            const outputKey = edge.sourceHandle || "default"
            const output = context.nodeOutputs[node.id][outputKey]

            // Store in the context for the target node to access
            if (output !== undefined) {
              if (!context.nodeOutputs[edge.source]) {
                context.nodeOutputs[edge.source] = {}
              }
              context.nodeOutputs[edge.source][outputKey] = output
            }
          }
        }
      } catch (error) {
        // Handle node execution error
        context.status[node.id] = "error"
        context.errors[node.id] = error as Error
        if (onNodeUpdate) {
          onNodeUpdate(node.id, "error", { error: (error as Error).message })
        }

        // Don't break the workflow, continue with next node
        console.error(`Error executing node ${node.id}:`, error)
      }
    }

    // Call workflow complete callback
    if (onWorkflowComplete) {
      onWorkflowComplete(context)
    }

    return context
  } catch (error) {
    console.error("Error executing workflow:", error)
    throw error
  }
}

// Abort workflow execution
export function abortWorkflowExecution(context: ExecutionContext): void {
  context.abortController.abort()
}
