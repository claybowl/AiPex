"use client"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  EdgeTypes
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Save, Eye, Sparkles, Zap, Upload, Trash2, BarChart3, RotateCcw, MessageSquare, Plus } from "lucide-react"

import NodeLibrary from "./node-library"
import { SimpleNodeComponents } from "./nodes/simple"
import { SimpleNodeType, SimpleNodeData, SimpleWorkflowNode } from "@/lib/types"
import { SimpleWorkflowExecutor } from "@/lib/simple-executor"
import { PromptInferenceEngine } from "@/lib/prompt-inference"
import EnhancedCustomEdge from "./enhanced-custom-edge"
import ApiKeyDialog from "./api-key-dialog"

const nodeTypes = SimpleNodeComponents
const edgeTypes: EdgeTypes = {
  default: EnhancedCustomEdge,
  enhanced: EnhancedCustomEdge,
}

interface SimpleWorkflowBuilderProps {
  workflowId?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

export default function SimpleWorkflowBuilder({ 
  workflowId, 
  initialNodes = [], 
  initialEdges = [] 
}: SimpleWorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [workflowPreview, setWorkflowPreview] = useState<string>("")
  const [workflowName, setWorkflowName] = useState<string>("Untitled Workflow")
  const [isSaving, setIsSaving] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    OPENAI_API_KEY: "",
  })
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  
  const executor = useRef(new SimpleWorkflowExecutor())
  const inferenceEngine = useRef(new PromptInferenceEngine())

  // Add a new node
  const onAddNode = useCallback((nodeType: SimpleNodeType) => {
    if (!reactFlowInstance) return

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
    if (!reactFlowBounds) return

    // Calculate position for new node
    const position = reactFlowInstance.project({
      x: reactFlowBounds.width / 2 - 150,
      y: reactFlowBounds.height / 2 - 50
    })

    const newNode: SimpleWorkflowNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
        prompt: "",
        extractedVariables: [],
        estimatedCost: 0.02,
        estimatedLatency: 1000
      }
    }

    setNodes(nds => nds.concat(newNode as Node))
  }, [reactFlowInstance, setNodes])

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({
      ...params,
      type: 'enhanced',
      animated: true,
      data: { 
        label: 'data',
        type: 'prompt-chain'
      }
    }, eds)),
    [setEdges]
  )

  // Execute the workflow
  const executeWorkflow = async () => {
    if (nodes.length === 0) return
    
    // Check if OpenAI API key is needed and provided
    if (!apiKeys.OPENAI_API_KEY) {
      setApiKeyDialogOpen(true)
      return
    }
    
    setIsExecuting(true)
    setExecutionResult(null)
    
    try {
      const simpleNodes = nodes as SimpleWorkflowNode[]
      
      // Set API key in executor context
      executor.current.setApiKey(apiKeys.OPENAI_API_KEY)
      
      const result = await executor.current.executeWorkflow(simpleNodes, edges)
      setExecutionResult(result)
    } catch (error) {
      console.error('Workflow execution failed:', error)
      setExecutionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsExecuting(false)
    }
  }

  // Generate workflow preview
  const generatePreview = async () => {
    if (nodes.length === 0) {
      setWorkflowPreview("No nodes in workflow")
      return
    }

    let preview = "This workflow will:\n\n"
    
    // Sort nodes by type for logical flow
    const sortedNodes = [...nodes].sort((a, b) => {
      const typeOrder = ['input', 'process', 'decision', 'action', 'output']
      const aIndex = typeOrder.indexOf((a as SimpleWorkflowNode).data.type)
      const bIndex = typeOrder.indexOf((b as SimpleWorkflowNode).data.type)
      return aIndex - bIndex
    })

    sortedNodes.forEach((node, index) => {
      const simpleNode = node as SimpleWorkflowNode
      const step = index + 1
      const prompt = simpleNode.data.prompt || `[${simpleNode.data.type} step not configured]`
      
      preview += `${step}. **${simpleNode.data.label}**: ${prompt}\n\n`
    })

    // Add estimated performance
    const totalCost = nodes.reduce((sum, node) => {
      return sum + ((node as SimpleWorkflowNode).data.estimatedCost || 0.02)
    }, 0)
    
    const maxLatency = Math.max(...nodes.map(node => 
      (node as SimpleWorkflowNode).data.estimatedLatency || 1000
    ))

    preview += `\n**Performance Estimate:**\n`
    preview += `• Cost: ~$${totalCost.toFixed(3)} per run\n`
    preview += `• Time: ~${(maxLatency / 1000).toFixed(1)} seconds\n`

    setWorkflowPreview(preview)
    setShowPreview(true)
  }

  // Create Chat Flow Template
  const createChatFlowTemplate = () => {
    const templateNodes: SimpleWorkflowNode[] = [
      {
        id: 'input-template',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          id: 'input-template',
          type: 'input',
          label: 'Customer Message',
          prompt: 'I receive customer support messages that need to be processed',
          extractedVariables: ['customer_message', 'customer_email'],
          estimatedCost: 0.01,
          estimatedLatency: 200
        }
      },
      {
        id: 'process-template',
        type: 'process',
        position: { x: 450, y: 200 },
        data: {
          id: 'process-template',
          type: 'process',
          label: 'Analyze Sentiment',
          prompt: 'Analyze the customer message sentiment and extract key issues or requests',
          extractedVariables: ['sentiment', 'issue_type', 'urgency'],
          estimatedCost: 0.02,
          estimatedLatency: 1500
        }
      },
      {
        id: 'decision-template',
        type: 'decision',
        position: { x: 800, y: 200 },
        data: {
          id: 'decision-template',
          type: 'decision',
          label: 'Route by Urgency',
          prompt: 'If the issue is urgent or the customer is frustrated, escalate to human agent. Otherwise, generate automated response.',
          extractedVariables: ['route_decision'],
          estimatedCost: 0.015,
          estimatedLatency: 1000
        }
      },
      {
        id: 'action-template',
        type: 'action',
        position: { x: 1150, y: 100 },
        data: {
          id: 'action-template',
          type: 'action',
          label: 'Send Response',
          prompt: 'Generate a helpful, empathetic response to the customer addressing their specific issue',
          extractedVariables: ['response_text'],
          estimatedCost: 0.03,
          estimatedLatency: 2000
        }
      },
      {
        id: 'output-template',
        type: 'output',
        position: { x: 1500, y: 200 },
        data: {
          id: 'output-template',
          type: 'output',
          label: 'Final Response',
          prompt: 'Format the response for delivery and log the interaction',
          extractedVariables: ['formatted_response', 'log_entry'],
          estimatedCost: 0.01,
          estimatedLatency: 300
        }
      }
    ]

    const templateEdges = [
      { id: 'e1-2', source: 'input-template', target: 'process-template', type: 'enhanced', animated: true },
      { id: 'e2-3', source: 'process-template', target: 'decision-template', type: 'enhanced', animated: true },
      { id: 'e3-4', source: 'decision-template', target: 'action-template', type: 'enhanced', animated: true },
      { id: 'e4-5', source: 'action-template', target: 'output-template', type: 'enhanced', animated: true }
    ]

    setNodes(templateNodes as Node[])
    setEdges(templateEdges)
    setWorkflowName("Customer Support Chat Flow")
  }

  // Save workflow
  const saveWorkflow = async () => {
    setIsSaving(true)
    try {
      // Here we would integrate with the existing save system
      // For now, just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving workflow:', { name: workflowName, nodes, edges })
      // TODO: Integrate with saveWorkflow from lib/actions/workflow-actions.ts
    } catch (error) {
      console.error('Failed to save workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Clear workflow
  const clearWorkflow = () => {
    setNodes([])
    setEdges([])
    setWorkflowName("Untitled Workflow")
    setExecutionResult(null)
    setShowPreview(false)
  }

  // Handle API key save
  const handleApiKeySave = (keys: Record<string, string>) => {
    setApiKeys(keys)
    setApiKeyDialogOpen(false)
    // Retry execution after keys are saved
    executeWorkflow()
  }

  const totalCost = nodes.reduce((sum, node) => {
    return sum + ((node as SimpleWorkflowNode).data.estimatedCost || 0.02)
  }, 0)

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-slate-950">
        {/* Node Library Sidebar */}
        <NodeLibrary onAddNode={onAddNode} />
        
        {/* Main Workflow Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-slate-900 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-400" />
                  {workflowName}
                </h2>
                <Badge variant="outline" className="text-teal-400 border-teal-400">
                  {nodes.length} nodes
                </Badge>
                <Badge variant="outline" className="text-slate-400">
                  ~${totalCost.toFixed(3)}/run
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Template Actions */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={createChatFlowTemplate}
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Flow
                </Button>
                
                {/* Workflow Actions */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generatePreview}
                  className="text-teal-400 border-teal-400 hover:bg-teal-400/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={executeWorkflow}
                  disabled={isExecuting || nodes.length === 0}
                  className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                >
                  {isExecuting ? (
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isExecuting ? 'Running...' : 'Execute'}
                </Button>
                
                {/* File Actions */}
                <Button 
                  size="sm" 
                  onClick={saveWorkflow}
                  disabled={isSaving}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isSaving ? (
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-slate-400 border-slate-600 hover:bg-slate-800"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Load
                </Button>
                
                {/* Utility Actions */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearWorkflow}
                  className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
          
          {/* ReactFlow Canvas */}
          <div className="flex-1" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              className="bg-slate-950"
              connectionLineStyle={{ stroke: '#10b981', strokeWidth: 2 }}
              defaultEdgeOptions={{
                style: { stroke: '#10b981', strokeWidth: 2 },
                type: 'enhanced',
                animated: true
              }}
            >
              <Background color="#1e293b" gap={20} size={1} />
              <Controls className="bg-slate-800 border-slate-600" />
              <MiniMap 
                className="bg-slate-800 border-slate-600"
                nodeColor="#10b981"
                maskColor="rgba(0, 0, 0, 0.6)"
              />
            </ReactFlow>
          </div>
        </div>
        
        {/* Right Sidebar - Preview/Results */}
        {(showPreview || executionResult) && (
          <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col">
            {showPreview && (
              <Card className="m-4 bg-slate-800 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-white">
                    <Eye className="h-4 w-4 text-teal-400" />
                    Workflow Preview
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(false)}
                      className="ml-auto p-1 h-6 w-6"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-300 whitespace-pre-line max-h-96 overflow-y-auto">
                    {workflowPreview}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {executionResult && (
              <Card className="m-4 bg-slate-800 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-white">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Execution Results
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExecutionResult(null)}
                      className="ml-auto p-1 h-6 w-6"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Status:</span>
                      <Badge 
                        variant={executionResult.success ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {executionResult.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    
                    {executionResult.success && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Cost:</span>
                          <span className="text-sm text-white">${executionResult.totalCost.toFixed(4)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Time:</span>
                          <span className="text-sm text-white">{(executionResult.totalTime / 1000).toFixed(1)}s</span>
                        </div>
                        
                        {executionResult.finalOutput && (
                          <div>
                            <span className="text-sm text-slate-300">Output:</span>
                            <pre className="text-xs text-slate-400 bg-slate-900 p-2 rounded mt-1 max-h-48 overflow-auto">
                              {JSON.stringify(executionResult.finalOutput, null, 2)}
                            </pre>
                          </div>
                        )}
                      </>
                    )}
                    
                    {executionResult.error && (
                      <div>
                        <span className="text-sm text-red-400">Error:</span>
                        <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded mt-1">
                          {executionResult.error}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* API Key Dialog */}
      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
        onSave={handleApiKeySave}
        initialKeys={apiKeys}
      />
    </ReactFlowProvider>
  )
}
