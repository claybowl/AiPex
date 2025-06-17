"use client"

import { useMemo } from "react"
import type { Node, Edge } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

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
      <Card className="w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center text-gray-900 dark:text-gray-100">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Workflow Info
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span>Nodes</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span>Connections</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Last Run</span>
              <span className="font-medium">Never</span>
            </div>
          </div>
          <p className="mt-3 text-center">Drag nodes from the library to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center text-gray-900 dark:text-gray-100">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          Workflow Info
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4 space-y-2">
        <div className="text-xs space-y-2">
          <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Nodes</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.totalNodes}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Connections</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.totalEdges}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Complexity</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{stats.complexity}/10</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500 dark:text-gray-400">Last Run</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Never</span>
          </div>
        </div>

        {Object.keys(stats.nodeTypes).length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
            <div className="text-xs font-medium mb-2 text-gray-900 dark:text-gray-100">Node Types:</div>
            <div className="space-y-1 text-xs">
              {Object.entries(stats.nodeTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize text-gray-500 dark:text-gray-400">{type}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
