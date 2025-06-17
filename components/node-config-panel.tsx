"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkflowNode } from "@/lib/types"

interface NodeConfigPanelProps {
  node: WorkflowNode
  updateNodeData: (nodeId: string, data: any) => void
  onClose: () => void
}

export default function NodeConfigPanel({ node, updateNodeData, onClose }: NodeConfigPanelProps) {
  const [localData, setLocalData] = useState({ ...node.data })

  const handleChange = (key: string, value: any) => {
    setLocalData((prev) => ({
      ...prev,
      [key]: value,
    }))
    updateNodeData(node.id, { [key]: value })
  }

  const renderInputFields = () => {
    switch (node.type) {
      case "input":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inputType" className="text-foreground">
                Input Type
              </Label>
              <Select value={localData.inputType || "text"} onValueChange={(value) => handleChange("inputType", value)}>
                <SelectTrigger id="inputType" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="samplePrompt" className="text-foreground">
                Sample Prompt
              </Label>
              <Textarea
                id="samplePrompt"
                value={localData.samplePrompt || ""}
                onChange={(e) => handleChange("samplePrompt", e.target.value)}
                placeholder="What can you help me with today?"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )

      case "output":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outputFormat" className="text-foreground">
                Output Format
              </Label>
              <Select
                value={localData.outputFormat || "text"}
                onValueChange={(value) => handleChange("outputFormat", value)}
              >
                <SelectTrigger id="outputFormat" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="streaming"
                checked={localData.streaming !== undefined ? localData.streaming : true}
                onCheckedChange={(checked) => handleChange("streaming", checked)}
              />
              <Label htmlFor="streaming" className="text-foreground">
                Enable Streaming
              </Label>
            </div>
          </div>
        )

      case "llm":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modelName" className="text-foreground">
                Model Name
              </Label>
              <Select
                value={localData.modelName || "gpt-4o"}
                onValueChange={(value) => handleChange("modelName", value)}
              >
                <SelectTrigger id="modelName" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
                  <SelectItem value="mistral-large">Mistral Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-foreground">
                Temperature
              </Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={localData.temperature || 0.7}
                onChange={(e) => handleChange("temperature", Number.parseFloat(e.target.value))}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens" className="text-foreground">
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                value={localData.maxTokens || 1000}
                onChange={(e) => handleChange("maxTokens", Number.parseInt(e.target.value))}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt" className="text-foreground">
                System Prompt
              </Label>
              <Textarea
                id="systemPrompt"
                value={localData.systemPrompt || ""}
                onChange={(e) => handleChange("systemPrompt", e.target.value)}
                className="h-32 bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="You are a helpful AI assistant."
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">Configure the {node.type} node settings here.</p>
          </div>
        )
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-card-foreground">Configure {node.data.label}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="label" className="text-foreground">
            Node Label
          </Label>
          <Input
            id="label"
            value={localData.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            className="bg-background border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={localData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe what this node does"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="required"
            checked={localData.required || false}
            onCheckedChange={(checked) => handleChange("required", checked)}
          />
          <Label htmlFor="required" className="text-foreground">
            Required Node
          </Label>
        </div>

        <div className="border-t border-border my-4"></div>

        {renderInputFields()}
      </CardContent>
    </Card>
  )
}
