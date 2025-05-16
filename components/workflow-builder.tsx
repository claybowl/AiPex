"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
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
} from "reactflow"
import "reactflow/dist/style.css"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Save, Upload, Play, BookTemplate } from "lucide-react"
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

import { generateNodeId, createNode } from "@/lib/workflow-utils"
import type { WorkflowNode } from "@/lib/types"
import WorkflowInfo from "./workflow-info"
import ExecuteDialog from "./execute-dialog"
import { useSampleWorkflow } from "./sample-workflow"

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
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false)

  // Get sample workflow
  const sampleWorkflow = useSampleWorkflow()

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

  const saveWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      })
      return
    }

    const workflow = {
      nodes,
      edges,
    }

    // Save to localStorage as before (as a backup)
    const workflowString = JSON.stringify(workflow)
    localStorage.setItem("workflow", workflowString)

    // Create a Blob with the workflow data
    const blob = new Blob([workflowString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element to trigger the download
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-agent-workflow-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()

    // Clean up
    URL.revokeObjectURL(url)
    document.body.removeChild(link)

    toast({
      title: "Workflow saved",
      description: "Your workflow has been saved as a JSON file",
    })
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

  const executeWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to execute",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      })
      return
    }

    // Open the execute dialog instead of immediately executing
    setExecuteDialogOpen(true)
  }

  // Add the actual execution function
  const performExecution = () => {
    toast({
      title: "Executing workflow",
      description: "Your workflow is being executed (simulation only in this MVP)",
    })

    // In a real implementation, we would traverse the graph and execute each node
    // For the MVP, we'll just simulate execution with a success message
    setTimeout(() => {
      toast({
        title: "Workflow executed",
        description: "Your workflow has been executed successfully",
      })
    }, 2000)
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-gray-200 p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Node Library</h2>
        <NodeLibrary />
        <div className="mt-6">
          <WorkflowInfo nodes={nodes} edges={edges} />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
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
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultEdgeOptions={{ type: "custom" }}
            >
              <Background />
              <Controls />
              <MiniMap />
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
                  <Button onClick={executeWorkflow} size="sm" variant="default">
                    <Play className="h-4 w-4 mr-2" />
                    Execute
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 border-l border-gray-200 p-4 bg-gray-50">
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
    </div>
  )
}
