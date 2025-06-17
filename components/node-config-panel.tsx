"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Settings, Code, Database, MessageSquare } from "lucide-react"

interface NodeConfigPanelProps {
  selectedNode: any
  onUpdateNode: (nodeId: string, updates: any) => void
  onClose: () => void
}

export function NodeConfigPanel({ selectedNode, onUpdateNode, onClose }: NodeConfigPanelProps) {
  const [config, setConfig] = useState(selectedNode?.data || {})

  if (!selectedNode) return null

  const handleSave = () => {
    onUpdateNode(selectedNode.id, config)
    onClose()
  }

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "llm":
        return <MessageSquare className="w-4 h-4" />
      case "code":
        return <Code className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-50 overflow-y-auto">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {getNodeIcon(selectedNode.data?.type)}
            <CardTitle className="text-lg">{selectedNode.data?.label || "Node Configuration"}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-label">Node Label</Label>
              <Input
                id="node-label"
                value={config.label || ""}
                onChange={(e) => handleConfigChange("label", e.target.value)}
                placeholder="Enter node label"
              />
            </div>

            <div>
              <Label htmlFor="node-description">Description</Label>
              <Input
                id="node-description"
                value={config.description || ""}
                onChange={(e) => handleConfigChange("description", e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>

          <Separator />

          {/* Type-specific Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Node Settings</h3>

            {selectedNode.data?.type === "llm" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={config.model || "gpt-3.5-turbo"}
                    onChange={(e) => handleConfigChange("model", e.target.value)}
                    placeholder="Model name"
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature || 0.7}
                    onChange={(e) => handleConfigChange("temperature", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={config.maxTokens || 1000}
                    onChange={(e) => handleConfigChange("maxTokens", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {selectedNode.data?.type === "code" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={config.language || "javascript"}
                    onChange={(e) => handleConfigChange("language", e.target.value)}
                    placeholder="Programming language"
                  />
                </div>
              </div>
            )}

            {selectedNode.data?.type === "database" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="connection-string">Connection String</Label>
                  <Input
                    id="connection-string"
                    value={config.connectionString || ""}
                    onChange={(e) => handleConfigChange("connectionString", e.target.value)}
                    placeholder="Database connection string"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="query">Query</Label>
                  <Input
                    id="query"
                    value={config.query || ""}
                    onChange={(e) => handleConfigChange("query", e.target.value)}
                    placeholder="SQL query"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
