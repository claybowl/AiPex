"use client" // Assuming this might be a separate component for clarity, or part of EnhancedWorkflowCanvas

import type React from "react"
import { Card } from "@/components/ui/card"
import { useState, useEffect, useRef, useCallback } from "react"

// Assuming WorkflowNode and getNodeStyling are defined elsewhere or passed as props
// For this example, let's define simplified versions or assume they exist
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

const getNodeStyling = (colorString?: string) => {
  if (!colorString) return { cardBg: "bg-slate-100 dark:bg-slate-700", border: "border-slate-500" }
  const baseColorName = colorString.split("-")[1] || "slate"
  const cardBg = `bg-${baseColorName}-50 dark:bg-${baseColorName}-900/40` // Softer dark bg
  const border = colorString.replace("bg-", "border-")
  return { cardBg, border }
}

export const NodeComponent = ({
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
      return // Don't drag node if clicking on a handle
    }
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    }
    onSelect(node, e)
    e.stopPropagation() // Prevent canvas click if node is clicked
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
    [isDragging, node.id, onMove], // dragStartRef.current is stable
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
          ? "ring-2 ring-sky-500 dark:ring-sky-400 ring-offset-2 ring-offset-background dark:ring-offset-slate-900 z-20" // Increased z-index when selected
          : "z-10" // Default z-index for nodes
      } ${isDragging ? "cursor-grabbing shadow-2xl !z-30" : "hover:shadow-xl"}`} // Highest z-index when dragging
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-48 rounded-lg shadow-md ${cardBg} border-l-4 ${borderColorClass} transition-all duration-150 group-hover:shadow-lg relative`} // Added relative for handles
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
        {/* Input Connection Handle (Left) */}
        <div
          className="connect-handle absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 cursor-crosshair hover:bg-sky-400 dark:hover:bg-sky-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
          onMouseDown={(e) => {
            e.stopPropagation() // Prevent node drag
            onStartConnecting(node.id, "target", e)
          }}
          title="Input"
        />
        {/* Output Connection Handle (Right) */}
        <div
          className="connect-handle absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 cursor-crosshair hover:bg-sky-400 dark:hover:bg-sky-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
          onMouseDown={(e) => {
            e.stopPropagation() // Prevent node drag
            onStartConnecting(node.id, "source", e)
          }}
          title="Output"
        />
      </Card>
    </div>
  )
}
