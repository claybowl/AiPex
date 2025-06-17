"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save, Upload, Play, BookTemplate, StopCircle, Trash2, MousePointer2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import EnhancedNodeLibrary, { nodeCategories as allNodeCategories } from "./enhanced-node-library"

interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    color?: string
    [key: string]: any
  }
  selected?: boolean
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

const getNodeStyling = (colorString?: string) => {
  if (!colorString) return { cardBg: "bg-slate-50 dark:bg-slate-700", border: "border-slate-500" }
  const baseColorName = colorString.split("-")[1]
  const cardBg = `bg-${baseColorName}-50 dark:bg-${baseColorName}-900/30`
  const border = colorString.replace("bg-", "border-")
  return { cardBg, border }
}

const NodeComponent = ({
  node,
  onSelect,
  onMove,
  isSelected,
  onStartConnecting,
}: {
  node: WorkflowNode
  onSelect: (node: WorkflowNode, event: React.MouseEvent) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  isSelected: boolean
  onStartConnecting: (nodeId: string, handleType: "source" | "target", event: React.MouseEvent) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const { cardBg, border: borderColorClass } = getNodeStyling(node.data.color)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".connect-handle")) {
      return
    }
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    }
    onSelect(node, e)
    e.stopPropagation()
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      const newPosition = {
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }
      onMove(node.id, newPosition)
    },
    [isDragging, node.id, onMove],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      className={`absolute cursor-grab select-none transition-shadow duration-150 group ${
        isSelected
          ? "ring-2 ring-sky-500 dark:ring-sky-400 ring-offset-2 ring-offset-background dark:ring-offset-slate-900 z-10"
          : "z-1"
      } ${isDragging ? "cursor-grabbing shadow-2xl" : "hover:shadow-xl"}`}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-48 rounded-lg shadow-md ${cardBg} border-l-4 ${borderColorClass} transition-all duration-150 group-hover:shadow-lg`}
      >
        <div className="p-3">
          <div className="text-sm font-semibold text-foreground dark:text-slate-200 truncate" title={node.data.label}>
            {node.data.label}
          </div>
          {node.data.description && (
            <div
              className="text-xs text-muted-foreground dark:text-slate-400 mt-1 line-clamp-2"
              title={node.data.description}
            >
              {node.data.description}
            </div>
          )}
        </div>
        <div
          className="connect-handle absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 cursor-crosshair hover:bg-sky-400 dark:hover:bg-sky-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
          onMouseDown={(e) => {
            e.stopPropagation()
            onStartConnecting(node.id, "target", e)
          }}
          title="Input"
        />
        <div
          className="connect-handle absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 cursor-crosshair hover:bg-sky-400 dark:hover:bg-sky-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
          onMouseDown={(e) => {
            e.stopPropagation()
            onStartConnecting(node.id, "source", e)
          }}
          title="Output"
        />
      </Card>
    </div>
  )
}

const NodeConfigPanel = ({
  node,
  onUpdate,
  onClose,
}: {
  node: WorkflowNode | null
  onUpdate: (id: string, data: any) => void
  onClose: () => void
}) => {
  if (!node) return null
  const handleFieldChange = (field: string, value: string) => {
    onUpdate(node.id, { ...node.data, [field]: value })
  }
  return (
    <div className="w-80 border-l border-border dark:border-slate-700 bg-card dark:bg-slate-800 overflow-y-auto h-full">
      <div className="p-4 border-b border-border dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground dark:text-slate-200">Node Configuration</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground dark:text-slate-300">Label</label>
          <input
            type="text"
            value={node.data.label}
            onChange={(e) => handleFieldChange("label", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-input dark:border-slate-600 bg-background dark:bg-slate-700 rounded-md text-foreground dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground dark:text-slate-300">Description</label>
          <textarea
            value={node.data.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            rows={3}
            className="w-full mt-1 px-3 py-2 border border-input dark:border-slate-600 bg-background dark:bg-slate-700 rounded-md text-foreground dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-sky-500 resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground dark:text-slate-300">Type</label>
          <div className="mt-1 px-3 py-2 bg-muted dark:bg-slate-700 rounded-md text-sm text-muted-foreground dark:text-slate-400">
            {node.type}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground dark:text-slate-300">ID</label>
          <div className="mt-1 px-3 py-2 bg-muted dark:bg-slate-700 rounded-md text-sm text-muted-foreground dark:text-slate-400 font-mono break-all">
            {node.id}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EnhancedWorkflowCanvas() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [edges, setEdges] = useState<WorkflowEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [connecting, setConnecting] = useState<{
    fromNodeId: string
    fromHandleType: "source" | "target"
    mousePosition: { x: number; y: number }
  } | null>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const NODE_WIDTH = 192
  const NODE_APPROX_HALF_HEIGHT = 35
  const HANDLE_OFFSET_X = 12

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCanvasOffset({ x: rect.left, y: rect.top })
    }
    const updateOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasOffset({ x: rect.left, y: rect.top })
      }
    }
    window.addEventListener("resize", updateOffset)
    return () => window.removeEventListener("resize", updateOffset)
  }, [])

  const generateId = (prefix = "node_") => `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addNode = useCallback(
    (type: string, label: string, description: string, color: string, position?: { x: number; y: number }) => {
      const defaultPosition = {
        x: (canvasRef.current?.clientWidth || 800) / 2 - NODE_WIDTH / 2 + (Math.random() * 100 - 50),
        y: (canvasRef.current?.clientHeight || 600) / 2 - NODE_APPROX_HALF_HEIGHT + (Math.random() * 100 - 50),
      }
      const newNode: WorkflowNode = {
        id: generateId(),
        type,
        position: position || defaultPosition,
        data: { label, description, color },
      }
      setNodes((prev) => [...prev, newNode])
      toast({ title: "Node added", description: `${newNode.data.label} node added.` })
    },
    [],
  )

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const nodeDataString = event.dataTransfer.getData("application/json")
    if (!nodeDataString) return
    try {
      const nodeInfo = JSON.parse(nodeDataString)
      if (canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const x = event.clientX - canvasRect.left - NODE_WIDTH / 2
        const y = event.clientY - canvasRect.top - NODE_APPROX_HALF_HEIGHT
        addNode(nodeInfo.type, nodeInfo.label, nodeInfo.description, nodeInfo.color, { x, y })
      }
    } catch (e) {
      console.error("Drop error:", e)
      toast({ title: "Drop Error", variant: "destructive" })
    }
  }

  const moveNode = useCallback((id: string, position: { x: number; y: number }) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, position } : node)))
  }, [])

  const selectNode = useCallback((node: WorkflowNode, event: React.MouseEvent) => {
    event.stopPropagation()
    setNodes((prev) => prev.map((n) => ({ ...n, selected: n.id === node.id })))
    setSelectedNode(node)
  }, [])

  const updateNodeData = useCallback(
    (id: string, data: any) => {
      setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)))
      if (selectedNode?.id === id)
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...data } } : null))
    },
    [selectedNode],
  )

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id))
      setEdges((prev) => prev.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
      setSelectedNode(null)
      toast({ title: "Node Deleted" })
    }
  }, [selectedNode])

  const saveWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "Nothing to save", variant: "destructive" })
      return
    }
    const workflow = { nodes, edges }
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "workflow.json"
    link.click()
    URL.revokeObjectURL(url)
    toast({ title: "Workflow Saved" })
  }, [nodes, edges])

  const loadWorkflow = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const content = ev.target?.result as string
          const workflow = JSON.parse(content)
          if (workflow.nodes && workflow.edges) {
            setNodes(workflow.nodes)
            setEdges(workflow.edges)
            setSelectedNode(null)
            toast({ title: "Workflow Loaded" })
          }
        } catch (err) {
          toast({ title: "Load Error", variant: "destructive" })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const createSampleWorkflow = useCallback(() => {
    const inputNodeInfo = allNodeCategories["data-io"]?.nodes.find((n) => n.type === "rest-api") || {
      type: "input",
      label: "Input",
      description: "Data input",
      color: "bg-sky-500",
    }
    const llmNodeInfo = allNodeCategories["model-agent"]?.nodes.find((n) => n.type === "llm") || {
      type: "llm",
      label: "LLM",
      description: "LLM Processing",
      color: "bg-pink-500",
    }
    const outputNodeInfo = {
      type: "output-display",
      label: "Output Display",
      description: "Show results",
      color: "bg-amber-500",
    }
    const sampleNodes: WorkflowNode[] = [
      { id: generateId(), type: inputNodeInfo.type, position: { x: 100, y: 200 }, data: { ...inputNodeInfo } },
      { id: generateId(), type: llmNodeInfo.type, position: { x: 400, y: 200 }, data: { ...llmNodeInfo } },
      { id: generateId(), type: outputNodeInfo.type, position: { x: 700, y: 200 }, data: { ...outputNodeInfo } },
    ]
    setNodes(sampleNodes)
    setEdges([
      { id: generateId("edge_"), source: sampleNodes[0].id, target: sampleNodes[1].id },
      { id: generateId("edge_"), source: sampleNodes[1].id, target: sampleNodes[2].id },
    ])
    toast({ title: "Sample Workflow Created" })
  }, [])

  const executeWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "Nothing to execute", variant: "destructive" })
      return
    }
    setIsExecuting(true)
    toast({ title: "Executing..." })
    setTimeout(() => {
      setIsExecuting(false)
      toast({ title: "Execution Complete" })
    }, 2000)
  }, [nodes])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedNode(null)
      setNodes((prev) => prev.map((n) => ({ ...n, selected: false })))
    }
  }, [])

  const handleStartConnecting = useCallback(
    (nodeId: string, handleType: "source" | "target", event: React.MouseEvent) => {
      event.stopPropagation()
      setConnecting({
        fromNodeId: nodeId,
        fromHandleType: handleType,
        mousePosition: { x: event.clientX, y: event.clientY },
      })
    },
    [],
  )

  const handleMouseMoveConnecting = useCallback(
    (event: MouseEvent) => {
      if (connecting) {
        setConnecting((prev) => (prev ? { ...prev, mousePosition: { x: event.clientX, y: event.clientY } } : null))
      }
    },
    [connecting],
  )

  const handleMouseUpConnecting = useCallback(() => {
    if (connecting) {
      const { fromNodeId, fromHandleType, mousePosition } = connecting
      const targetElement = document.elementFromPoint(mousePosition.x, mousePosition.y)
      const targetNodeWrapper = targetElement?.closest("[data-node-id]")
      const targetNodeId = targetNodeWrapper?.getAttribute("data-node-id")

      if (targetNodeId && targetNodeId !== fromNodeId) {
        const sourceId = fromHandleType === "source" ? fromNodeId : targetNodeId
        const targetId = fromHandleType === "source" ? targetNodeId : fromNodeId
        const edgeExists = edges.some((e) => e.source === sourceId && e.target === targetId)

        if (!edgeExists) {
          setEdges((prev) => [...prev, { id: generateId("edge_"), source: sourceId, target: targetId }])
          toast({ title: "Connection Made" })
        } else {
          toast({ title: "Connection Exists", variant: "default" })
        }
      }
      setConnecting(null)
    }
  }, [connecting, edges])

  useEffect(() => {
    if (connecting) {
      document.addEventListener("mousemove", handleMouseMoveConnecting)
      document.addEventListener("mouseup", handleMouseUpConnecting)
      return () => {
        document.removeEventListener("mousemove", handleMouseMoveConnecting)
        document.removeEventListener("mouseup", handleMouseUpConnecting)
      }
    }
  }, [connecting, handleMouseMoveConnecting, handleMouseUpConnecting])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedNode) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")
          deleteSelectedNode()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedNode, deleteSelectedNode])

  const getEdgePath = (sourceNode: WorkflowNode, targetNode: WorkflowNode) => {
    const sourceX = sourceNode.position.x + NODE_WIDTH - HANDLE_OFFSET_X
    const sourceY = sourceNode.position.y + NODE_APPROX_HALF_HEIGHT
    const targetX = targetNode.position.x + HANDLE_OFFSET_X
    const targetY = targetNode.position.y + NODE_APPROX_HALF_HEIGHT

    const dx = Math.abs(sourceX - targetX)
    const curveFactor = dx * 0.6

    return `M ${sourceX} ${sourceY} C ${sourceX + curveFactor} ${sourceY}, ${targetX - curveFactor} ${targetY}, ${targetX} ${targetY}`
  }

  const getConnectingPath = () => {
    if (!connecting) return ""
    const sourceNode = nodes.find((n) => n.id === connecting.fromNodeId)
    if (!sourceNode) return ""

    const sourceX =
      sourceNode.position.x + (connecting.fromHandleType === "source" ? NODE_WIDTH - HANDLE_OFFSET_X : HANDLE_OFFSET_X)
    const sourceY = sourceNode.position.y + NODE_APPROX_HALF_HEIGHT
    const targetX = connecting.mousePosition.x - canvasOffset.x
    const targetY = connecting.mousePosition.y - canvasOffset.y

    const dx = Math.abs(sourceX - targetX)
    const curveFactor = dx * 0.6

    if (connecting.fromHandleType === "source") {
      return `M ${sourceX} ${sourceY} C ${sourceX + curveFactor} ${sourceY}, ${targetX - curveFactor} ${targetY}, ${targetX} ${targetY}`
    } else {
      return `M ${targetX} ${targetY} C ${targetX + curveFactor} ${targetY}, ${sourceX - curveFactor} ${sourceY}, ${sourceX} ${sourceY}`
    }
  }

  return (
    <div className="flex h-full w-full bg-background dark:bg-slate-900">
      <EnhancedNodeLibrary onAddNodeByClick={addNode} />
      <div className="flex-1 flex flex-col relative">
        <div className="border-b border-border dark:border-slate-700 bg-card dark:bg-slate-800/50 p-3">
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              onClick={saveWorkflow}
              size="sm"
              variant="outline"
              className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button
              onClick={loadWorkflow}
              size="sm"
              variant="outline"
              className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              <Upload className="h-4 w-4 mr-2" /> Load
            </Button>
            <Button
              onClick={createSampleWorkflow}
              size="sm"
              variant="outline"
              className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              <BookTemplate className="h-4 w-4 mr-2" /> Sample
            </Button>
            {selectedNode && (
              <Button onClick={deleteSelectedNode} size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
              </Button>
            )}
            <div className="flex-grow" />
            {isExecuting ? (
              <Button onClick={() => setIsExecuting(false)} size="sm" variant="destructive">
                <StopCircle className="h-4 w-4 mr-2" /> Stop
              </Button>
            ) : (
              <Button
                onClick={executeWorkflow}
                size="sm"
                variant="default"
                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white"
              >
                <Play className="h-4 w-4 mr-2" /> Execute
              </Button>
            )}
            <div className="ml-auto text-sm text-muted-foreground dark:text-slate-400 hidden sm:block">
              Nodes: {nodes.length} | Edges: {edges.length}
            </div>
          </div>
        </div>
        <div
          ref={canvasRef}
          className="flex-1 relative bg-slate-100 dark:bg-slate-800/30 overflow-auto"
          onClick={handleCanvasClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
            <defs>
              <pattern id="grid-enhanced" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" className="fill-slate-300 dark:fill-slate-700/60 opacity-50" />
              </pattern>
              <marker
                id="arrowhead-enhanced"
                markerWidth="12"
                markerHeight="9"
                refX="10"
                refY="4.5"
                orient="auto"
                className="fill-slate-500 dark:fill-slate-400"
              >
                <path d="M0,0 L12,4.5 L0,9 Z" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-enhanced)" />
          </svg>

          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 5 }}>
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source)
              const targetNode = nodes.find((n) => n.id === edge.target)
              if (!sourceNode || !targetNode) return null
              return (
                <path
                  key={edge.id}
                  d={getEdgePath(sourceNode, targetNode)}
                  className="stroke-slate-400 dark:stroke-slate-500/80"
                  strokeWidth="3.5"
                  fill="none"
                  markerEnd="url(#arrowhead-enhanced)"
                  style={{ transition: "d 0.1s ease-out" }}
                />
              )
            })}
            {connecting && (
              <path
                d={getConnectingPath()}
                className="stroke-sky-500 dark:stroke-sky-400"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="6 6"
                markerEnd="url(#arrowhead-enhanced)"
              />
            )}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              data-node-id={node.id}
              style={{
                zIndex: node.selected || nodes.find((n) => n.id === connecting?.fromNodeId)?.id === node.id ? 25 : 20,
              }}
            >
              <NodeComponent
                node={node}
                onSelect={selectNode}
                onMove={moveNode}
                isSelected={node.selected || false}
                onStartConnecting={handleStartConnecting}
              />
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground dark:text-slate-500 max-w-md p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <MousePointer2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2 font-medium">Workflow Canvas</p>
                <p className="text-sm mb-4">
                  Drag nodes from the library or click "Sample" to get started. Connect nodes by dragging from their
                  output (right) to input (left) handles.
                </p>
                <Button
                  onClick={createSampleWorkflow}
                  variant="outline"
                  size="sm"
                  className="pointer-events-auto dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <BookTemplate className="h-4 w-4 mr-2" /> Create Sample
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedNode && (
        <NodeConfigPanel node={selectedNode} onUpdate={updateNodeData} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  )
}
