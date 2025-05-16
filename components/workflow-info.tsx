"use client"

import { useMemo } from "react"
import type { Node, Edge } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkflowInfoProps {
  nodes: Node[]
  edges: Edge[]
}

export default function WorkflowInfo({ nodes, edges }: WorkflowInfoProps) {
  const stats = useMemo(() => {
    // Count nodes by type
    const nodeTypes = nodes.reduce(
      (acc, node) => {
        const type = node.type || "unknown"
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate complexity score (simple heuristic)
    const complexity = Math.round((nodes.length * 0.6 + edges.length * 0.4) * 10) / 10

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      complexity,
    }
  }, [nodes, edges])

  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Workflow Info</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-500">
          <p>No nodes in workflow yet.</p>
          <p className="mt-2">Drag nodes from the library to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Workflow Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Nodes:</div>
          <div className="font-medium">{stats.totalNodes}</div>
          <div>Connections:</div>
          <div className="font-medium">{stats.totalEdges}</div>
          <div>Complexity:</div>
          <div className="font-medium">{stats.complexity}/10</div>
        </div>

        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="text-xs font-medium mb-1">Node Types:</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            {Object.entries(stats.nodeTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
