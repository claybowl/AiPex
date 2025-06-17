"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type Node,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Save, Upload, Play, BookTemplate, StopCircle, Trash2, Lightbulb } from "lucide-react"
import NodeLibrary from "./node-library"
import NodeConfigPanel from "./node-config-panel"
import CustomEdge from "./custom-edge"

// Original nodes
import { InputNode } from "./nodes/input-node"
import { OutputNode } from "./nodes/output-node"
import { LLMNode } from "./nodes/llm-node"
import { MemoryNode } from "./nodes/memory-node"
import { ToolNode } from "./nodes/tool-node"
import { RAGNode } from "./nodes/rag-node"
import { ConditionalNode } from "./nodes/conditional-node"
import { ChainNode } from "./nodes/chain-node"
import { RestApiNode } from "./nodes/rest-api-node"
import { CsvUploadNode } from "./nodes/csv-upload-node"
import { DbPullNode } from "./nodes/db-pull-node"
import { WebhookNode } from "./nodes/webhook-node"
import { JsonConverterNode } from "./nodes/json-converter-node"
import { TextCleaningNode } from "./nodes/text-cleaning-node"
import { EmbeddingNode } from "./nodes/embedding-node"
import { DataEnrichmentNode } from "./nodes/data-enrichment-node"
import { LoopNode } from "./nodes/loop-node"
import { ErrorHandlerNode } from "./nodes/error-handler-node"
import { MlModelNode } from "./nodes/ml-model-node"
import { EmbeddingSearchNode } from "./nodes/embedding-search-node"
import { AgentNode } from "./nodes/agent-node"
import { EmailNode } from "./nodes/email-node"
import { SlackNode } from "./nodes/slack-node"
import { DashboardNode } from "./nodes/dashboard-node"
import { DbWriteNode } from "./nodes/db-write-node"
import { LoggingNode } from "./nodes/logging-node"

// New nodes - Trigger & Scheduler
import { ScheduledTriggerNode } from "./nodes/scheduled-trigger-node"
import { FileWatcherNode } from "./nodes/file-watcher-node"
import { EmailTriggerNode } from "./nodes/email-trigger-node"

// New nodes - Data Enrichment & Preprocessing
import { LanguageDetectorNode } from "./nodes/language-detector-node"
import { EntityRecognizerNode } from "./nodes/entity-recognizer-node"
import { SentimentAnalysisNode } from "./nodes/sentiment-analysis-node"
import { SummarizationNode } from "./nodes/summarization-node"
import { TranslatorNode } from "./nodes/translator-node"

// New nodes - Advanced Model & Agent Helpers
import { ChainOfThoughtNode } from "./nodes/chain-of-thought-node"
import { ToolSelectorNode } from "./nodes/tool-selector-node"
import { BatchInferenceNode } from "./nodes/batch-inference-node"

// New nodes - Integrations & Actions
import { GoogleSheetsNode } from "./nodes/google-sheets-node"
import { TwilioSmsNode } from "./nodes/twilio-sms-node"
import { GoogleCalendarNode } from "./nodes/google-calendar-node"
import { SlackReactionNode } from "./nodes/slack-reaction-node"
import { S3UploaderNode } from "./nodes/s3-uploader-node"

// New nodes - Utility & DevOps
import { CacheNode } from "./nodes/cache-node"
import { ErrorNotifierNode } from "./nodes/error-notifier-node"
import { DataValidatorNode } from "./nodes/data-validator-node"

// New nodes - File Operations
import { FileUploadNode } from "./nodes/file-upload-node"
import { FileDownloadNode } from "./nodes/file-download-node"
import { FileProcessorNode } from "./nodes/file-processor-node"

import { generateNodeId, createNode } from "@/lib/workflow-utils"
import type { WorkflowNode } from "@/lib/types"
import WorkflowInfo from "./workflow-info"
import ExecuteDialog from "./execute-dialog"
import { useSampleWorkflow } from "./sample-workflow"
import SaveWorkflowDialog from "./save-workflow-dialog"

// Import workflow execution engine
import { abortWorkflowExecution, type ExecutionContext } from "@/lib/workflow-executor"
import { ensureExecutorsRegistered } from "@/lib/node-executors"

// Import API key dialog
import ApiKeyDialog from "./api-key-dialog"
import { useSearchParams } from "next/navigation"
import { getWorkflow } from "@/lib/api"

const nodeTypes: NodeTypes = {
  // Legacy nodes
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  memory: MemoryNode,
  tool: ToolNode,
  rag: RAGNode,
  conditional: ConditionalNode,
  chain: ChainNode,

  // Data & I/O Connectors
  "rest-api": RestApiNode,
  "csv-upload": CsvUploadNode,
  "db-pull": DbPullNode,
  webhook: WebhookNode,

  // Adapters
  "json-converter": JsonConverterNode,
  "text-cleaning": TextCleaningNode,

  // Processing & Orchestration
  embedding: EmbeddingNode,
  "data-enrichment": DataEnrichmentNode,
  loop: LoopNode,
  "error-handler": ErrorHandlerNode,

  // Model & Agent Wrappers
  "ml-model": MlModelNode,
  "embedding-search": EmbeddingSearchNode,
  agent: AgentNode,

  // Outputs & Actions
  email: EmailNode,
  slack: SlackNode,
  dashboard: DashboardNode,
  "db-write": DbWriteNode,
  logging: LoggingNode,

  // New nodes - Trigger & Scheduler
  "scheduled-trigger": ScheduledTriggerNode,
  "file-watcher": FileWatcherNode,
  "email-trigger": EmailTriggerNode,

  // New nodes - Data Enrichment & Preprocessing
  "language-detector": LanguageDetectorNode,
  "entity-recognizer": EntityRecognizerNode,
  "sentiment-analysis": SentimentAnalysisNode,
  summarization: SummarizationNode,
  translator: TranslatorNode,

  // New nodes - Advanced Model & Agent Helpers
  "chain-of-thought": ChainOfThoughtNode,
  "tool-selector": ToolSelectorNode,
  "batch-inference": BatchInferenceNode,

  // New nodes - Integrations & Actions
  "google-sheets": GoogleSheetsNode,
  "twilio-sms": TwilioSmsNode,
  "google-calendar": GoogleCalendarNode,
  "slack-reaction": SlackReactionNode,
  "s3-uploader": S3UploaderNode,

  // New nodes - Utility & DevOps
  cache: CacheNode,
  "error-notifier": ErrorNotifierNode,
  "data-validator": DataValidatorNode,

  // File Operations
  "file-upload": FileUploadNode,
  "file-download": FileDownloadNode,
  "file-processor": FileProcessorNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// Helper component to wrap the ReactFlow component with keyboard event listeners
const FlowWithKeyboardDelete = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDrop,
  onDragOver,
  onNodeClick,
  onPaneClick,
  onNodeDragStop,
  nodeTypes,
  edgeTypes,
  onDelete,
  children,
}: {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: any
  onEdgesChange: any
  onConnect: any
  onInit: any
  onDrop: any
  onDragOver: any
  onNodeClick: any
  onPaneClick: any
  onNodeDragStop: any
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  onDelete: (nodes: Node[]) => void
  children: React.ReactNode
}) => {
  const reactFlowInstance = useReactFlow()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if Delete or Backspace was pressed
      if (event.key === "Delete" || event.key === "Backspace") {
        // Get selected nodes
        const selectedNodes = nodes.filter((node) => node.selected)
        if (selectedNodes.length > 0) {
          onDelete(selectedNodes)
        }
      }
    },
    [nodes, onDelete],
  )

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown as any} style={{ outline: "none", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: "custom" }}
      >
        {children}
      </ReactFlow>
    </div>
  )
}

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionContext, setExecutionContext] = useState<ExecutionContext | null>(null)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    OPENAI_API_KEY: "",
  })
  const [saveWorkflowDialogOpen, setSaveWorkflowDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const workflowId = searchParams.get("id") ? Number.parseInt(searchParams.get("id")!) : undefined

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [currentWorkflowId, setCurrentWorkflowId] = useState<number | undefined>(workflowId)
  const [currentWorkflowName, setCurrentWorkflowName] = useState("")
  const [currentWorkflowDescription, setCurrentWorkflowDescription] = useState("")

  // Load workflow from database if ID is provided
  useEffect(() => {
    const loadWorkflowFromDb = async () => {
      if (workflowId) {
        try {
          const workflow = await getWorkflow(workflowId)
          if (workflow) {
            setNodes(workflow.nodes)
            setEdges(workflow.edges)
            setCurrentWorkflowId(workflowId)
            setCurrentWorkflowName(workflow.name || "")
            setCurrentWorkflowDescription(workflow.description || "")

            toast({
              title: "Workflow loaded",
              description: `Loaded workflow "${workflow.name || "Untitled"}" from database`,
            })
          }
        } catch (error) {
          console.error("Error loading workflow from database:", error)
          toast({
            title: "Error loading workflow",
            description: "Failed to load workflow from database",
            variant: "destructive",
          })
        }
      }
    }

    loadWorkflowFromDb()
  }, [workflowId, setNodes, setEdges])

  // Get sample workflow
  const sampleWorkflow = useSampleWorkflow()

  // Load workflow if workflowId is present
  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflowId) {
        try {
          const workflow = await getWorkflow(workflowId)
          if (workflow) {
            setNodes(workflow.nodes as any)
            setEdges(workflow.edges as any)
            toast({
              title: "Workflow loaded",
              description: "Your workflow has been loaded successfully",
            })
          } else {
            toast({
              title: "Workflow not found",
              description: "No workflow found with the given ID",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error loading workflow:", error)
          toast({
            title: "Error loading workflow",
            description: "Failed to load the workflow",
            variant: "destructive",
          })
        }
      }
    }

    loadWorkflow()
  }, [workflowId])

  // Ensure all node executors are registered
  useEffect(() => {
    ensureExecutorsRegistered()
  }, [])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: "custom" }, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      if (reactFlowBounds && reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode = createNode({
          type,
          position,
          id: generateNodeId(type),
        })

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Handle node drag stop - check if node was dragged outside the flow area
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (reactFlowWrapper.current) {
        const flowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const nodeElement = event.target as HTMLElement
        const nodePos = nodeElement.getBoundingClientRect()

        // Check if the node is mostly outside the flow area
        const isOutsideX = nodePos.left > flowBounds.right || nodePos.right < flowBounds.left
        const isOutsideY = nodePos.top > flowBounds.bottom || nodePos.bottom < flowBounds.top

        if (isOutsideX || isOutsideY) {
          // Node was dragged outside - delete it
          deleteNodes([node])

          toast({
            title: "Node deleted",
            description: "Node was removed by dragging it off the canvas",
          })
        }
      }
    },
    [reactFlowWrapper],
  )

  // Function to delete nodes and their connected edges
  const deleteNodes = useCallback(
    (nodesToDelete: Node[]) => {
      if (nodesToDelete.length === 0) return

      // Get IDs of nodes to delete
      const nodeIds = nodesToDelete.map((node) => node.id)

      // Remove the nodes
      setNodes((nodes) => nodes.filter((node) => !nodeIds.includes(node.id)))

      // Remove edges connected to these nodes
      setEdges((edges) => edges.filter((edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)))

      // If the selected node is being deleted, clear the selection
      if (selectedNode && nodeIds.includes(selectedNode.id)) {
        setSelectedNode(null)
      }
    },
    [setNodes, setEdges, selectedNode],
  )

  // Button handler for deleting the currently selected node
  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      deleteNodes([selectedNode])
      toast({
        title: "Node deleted",
        description: "Selected node was removed",
      })
    } else {
      toast({
        title: "No node selected",
        description: "Select a node to delete",
        variant: "destructive",
      })
    }
  }, [selectedNode, deleteNodes])

  const saveWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      })
      return
    }

    // Open the save dialog
    setSaveDialogOpen(true)
  }

  const loadWorkflow = () => {
    // Create a file input element
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".json"

    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const { nodes: savedNodes, edges: savedEdges } = JSON.parse(content)

          // Validate the workflow structure
          if (!Array.isArray(savedNodes) || !Array.isArray(savedEdges)) {
            throw new Error("Invalid workflow structure")
          }

          setNodes(savedNodes)
          setEdges(savedEdges)

          // Also save to localStorage as a backup
          localStorage.setItem("workflow", content)

          toast({
            title: "Workflow loaded",
            description: "Your workflow has been loaded successfully",
          })
        } catch (error) {
          console.error("Error loading workflow:", error)
          toast({
            title: "Error loading workflow",
            description: "The selected file is not a valid workflow JSON",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    // Trigger the file input click
    fileInput.click()
  }

  const loadFromLocalStorage = () => {
    const savedWorkflow = localStorage.getItem("workflow")

    if (!savedWorkflow) {
      toast({
        title: "No saved workflow",
        description: "There is no workflow saved in your browser",
        variant: "destructive",
      })
      return
    }

    try {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedWorkflow)
      setNodes(savedNodes)
      setEdges(savedEdges)
      toast({
        title: "Workflow loaded",
        description: "Your workflow has been loaded from browser storage",
      })
    } catch (error) {
      toast({
        title: "Error loading workflow",
        description: "There was an error loading your workflow from browser storage",
        variant: "destructive",
      })
    }
  }

  const loadSampleWorkflow = () => {
    setNodes(sampleWorkflow.nodes)
    setEdges(sampleWorkflow.edges)
    toast({
      title: "Sample workflow loaded",
      description: "A sample AI workflow has been loaded",
    })
  }

  const createSimpleChatWorkflow = () => {
    // Create an input node
    const inputNode = createNode({
      type: "input",
      position: { x: 100, y: 200 },
      id: generateNodeId("input"),
    })

    // Create an LLM node
    const llmNode = createNode({
      type: "llm",
      position: { x: 400, y: 200 },
      id: generateNodeId("llm"),
    })

    // Update node data with custom values
    inputNode.data = {
      ...inputNode.data,
      label: "Chat Input",
      description: "Starting point for user queries",
      inputType: "text",
      samplePrompt: "Hello, how can I help you today?",
    }

    llmNode.data = {
      ...llmNode.data,
      label: "AI Response",
      description: "Generate AI response",
      modelName: "gpt-4o",
      systemPrompt: "You are a helpful AI assistant.",
      temperature: 0.7,
    }

    // Set the nodes
    setNodes([inputNode, llmNode])

    // Create an edge to connect the nodes
    const newEdge = {
      id: "input-to-llm",
      source: inputNode.id,
      sourceHandle: "default",
      target: llmNode.id,
      targetHandle: "variables",
      type: "custom",
    }

    setEdges([newEdge])

    toast({
      title: "Simple chat workflow created",
      description: "A basic input → LLM workflow has been created",
    })
  }

  const executeWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to execute",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      })
      return
    }

    // Check if we need API keys
    const needsOpenAI = nodes.some((node) => ["llm", "embedding", "embedding-search"].includes(node.type || ""))

    if (needsOpenAI && !apiKeys.OPENAI_API_KEY) {
      setApiKeyDialogOpen(true)
      return
    }

    // Open the execute dialog
    setExecuteDialogOpen(true)
  }

  // Add the actual execution function
  const performExecution = async () => {
    setIsExecuting(true)
    toast({
      title: "Executing workflow",
      description: "Your workflow is being executed",
    })

    try {
      // Update node styles to show execution status
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            executionStatus: "pending",
          },
        })),
      )

      // Execute the workflow
      const context = await executeWorkflow(
        nodes,
        edges,
        // Node update callback
        (nodeId, status, data) => {
          // Update node status in UI
          setNodes((nodes) =>
            nodes.map((node) => {
              if (node.id === nodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    executionStatus: status,
                    executionData: data,
                  },
                }
              }
              return node
            }),
          )
        },
        // Workflow complete callback
        (context) => {
          setExecutionContext(context)
          setIsExecuting(false)
          toast({
            title: "Workflow executed",
            description: "Your workflow has been executed successfully",
          })
        },
        // Initial inputs
        {
          // Add any global inputs here
          ...apiKeys,
        },
      )
    } catch (error) {
      console.error("Error executing workflow:", error)
      setIsExecuting(false)
      toast({
        title: "Execution error",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  const stopExecution = () => {
    if (executionContext) {
      abortWorkflowExecution(executionContext)
      setIsExecuting(false)
      toast({
        title: "Execution stopped",
        description: "Workflow execution has been aborted",
      })
    }
  }

  const handleApiKeySave = (keys: Record<string, string>) => {
    setApiKeys(keys)
    setApiKeyDialogOpen(false)
    // If we were trying to execute, continue with execution
    if (executeDialogOpen) {
      performExecution()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Node Library Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Node Library</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <NodeLibrary />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <FlowWithKeyboardDelete
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onDelete={deleteNodes}
            >
              <Background />
              <Controls />
              <MiniMap />

              {/* Empty state */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Your workflow is empty
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Drag nodes from the library to get started</p>
                    <Button
                      onClick={loadSampleWorkflow}
                      className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Load Sample Workflow
                    </Button>
                  </div>
                </div>
              )}

              <Panel position="top-left" className="bg-white dark:bg-gray-800 bg-opacity-90 p-2 rounded shadow m-2">
                <WorkflowInfo nodes={nodes} edges={edges} />
              </Panel>
              <Panel position="top-right">
                <div className="flex gap-2">
                  <Button onClick={saveWorkflow} size="sm" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={loadWorkflow} size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                  <Button onClick={loadFromLocalStorage} size="sm" variant="outline" className="text-xs">
                    Load from Browser
                  </Button>
                  <Button onClick={loadSampleWorkflow} size="sm" variant="outline">
                    <BookTemplate className="h-4 w-4 mr-2" />
                    Sample
                  </Button>
                  <Button onClick={createSimpleChatWorkflow} size="sm" variant="outline" className="text-xs">
                    Create Chat Flow
                  </Button>
                  {selectedNode && (
                    <Button onClick={handleDeleteSelected} size="sm" variant="outline" className="bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  {isExecuting ? (
                    <Button onClick={stopExecution} size="sm" variant="destructive">
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button onClick={executeWorkflow} size="sm" variant="default">
                      <Play className="h-4 w-4 mr-2" />
                      Execute
                    </Button>
                  )}
                </div>
              </Panel>

              {/* Add a help panel with keyboard shortcuts */}
              <Panel
                position="bottom-left"
                className="bg-white dark:bg-gray-800 bg-opacity-80 p-2 rounded shadow text-xs"
              >
                <div>
                  <strong>Keyboard Shortcuts:</strong>
                  <div>Delete/Backspace: Delete selected node</div>
                  <div>Tip: Drag nodes off canvas to delete them</div>
                </div>
              </Panel>
            </FlowWithKeyboardDelete>
          </ReactFlowProvider>
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
          <NodeConfigPanel
            node={selectedNode as WorkflowNode}
            updateNodeData={updateNodeData}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}

      <ExecuteDialog
        open={executeDialogOpen}
        onOpenChange={setExecuteDialogOpen}
        onConfirm={performExecution}
        nodeCount={nodes.length}
      />

      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
        onSave={handleApiKeySave}
        initialKeys={apiKeys}
      />
      <SaveWorkflowDialog
        open={saveWorkflowDialogOpen}
        onOpenChange={setSaveWorkflowDialogOpen}
        nodes={nodes}
        edges={edges}
      />
      <SaveWorkflowDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        workflow={{ nodes, edges }}
        currentWorkflowId={currentWorkflowId}
        currentWorkflowName={currentWorkflowName}
        currentWorkflowDescription={currentWorkflowDescription}
      />
    </div>
  )
}
