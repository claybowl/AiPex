"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
          <>
            <div className="space-y-2">
              <Label htmlFor="inputType">Input Type</Label>
              <Select value={localData.inputType || "text"} onValueChange={(value) => handleChange("inputType", value)}>
                <SelectTrigger id="inputType">
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="samplePrompt">Sample Prompt</Label>
              <Textarea
                id="samplePrompt"
                value={localData.samplePrompt || ""}
                onChange={(e) => handleChange("samplePrompt", e.target.value)}
                placeholder="What can you help me with today?"
              />
            </div>
          </>
        )

      case "output":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select
                value={localData.outputFormat || "text"}
                onValueChange={(value) => handleChange("outputFormat", value)}
              >
                <SelectTrigger id="outputFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="streaming">Enable Streaming</Label>
            </div>
          </>
        )

      case "llm":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Select
                value={localData.modelName || "gpt-4o"}
                onValueChange={(value) => handleChange("modelName", value)}
              >
                <SelectTrigger id="modelName">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={localData.temperature || 0.7}
                onChange={(e) => handleChange("temperature", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                value={localData.maxTokens || 1000}
                onChange={(e) => handleChange("maxTokens", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={localData.systemPrompt || ""}
                onChange={(e) => handleChange("systemPrompt", e.target.value)}
                className="h-32"
                placeholder="You are a helpful AI assistant."
              />
            </div>
          </>
        )

      case "memory":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="memoryType">Memory Type</Label>
              <Select
                value={localData.memoryType || "buffer"}
                onValueChange={(value) => handleChange("memoryType", value)}
              >
                <SelectTrigger id="memoryType">
                  <SelectValue placeholder="Select memory type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buffer">Buffer Memory</SelectItem>
                  <SelectItem value="summary">Summary Memory</SelectItem>
                  <SelectItem value="vector">Vector Memory</SelectItem>
                  <SelectItem value="window">Window Memory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contextWindow">Context Window</Label>
              <Input
                id="contextWindow"
                type="number"
                min="1"
                value={localData.contextWindow || 10}
                onChange={(e) => handleChange("contextWindow", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memoryKey">Memory Key</Label>
              <Input
                id="memoryKey"
                value={localData.memoryKey || "chat_history"}
                onChange={(e) => handleChange("memoryKey", e.target.value)}
              />
            </div>
          </>
        )

      case "tool":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="toolType">Tool Type</Label>
              <Select
                value={localData.toolType || "web-search"}
                onValueChange={(value) => handleChange("toolType", value)}
              >
                <SelectTrigger id="toolType">
                  <SelectValue placeholder="Select tool type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-search">Web Search</SelectItem>
                  <SelectItem value="calculator">Calculator</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(localData.toolType === "api" || localData.toolType === "custom") && (
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={localData.apiEndpoint || ""}
                  onChange={(e) => handleChange("apiEndpoint", e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="toolDescription">Tool Description</Label>
              <Textarea
                id="toolDescription"
                value={localData.toolDescription || ""}
                onChange={(e) => handleChange("toolDescription", e.target.value)}
                placeholder="Describe what this tool does"
              />
            </div>
          </>
        )

      case "rag":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source</Label>
              <Select
                value={localData.dataSource || "vector-db"}
                onValueChange={(value) => handleChange("dataSource", value)}
              >
                <SelectTrigger id="dataSource">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vector-db">Vector Database</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retrievalMethod">Retrieval Method</Label>
              <Select
                value={localData.retrievalMethod || "similarity"}
                onValueChange={(value) => handleChange("retrievalMethod", value)}
              >
                <SelectTrigger id="retrievalMethod">
                  <SelectValue placeholder="Select retrieval method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="similarity">Similarity Search</SelectItem>
                  <SelectItem value="hybrid">Hybrid Search</SelectItem>
                  <SelectItem value="mmr">MMR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topK">Top K Results</Label>
              <Input
                id="topK"
                type="number"
                min="1"
                value={localData.topK || 3}
                onChange={(e) => handleChange("topK", Number.parseInt(e.target.value))}
              />
            </div>
          </>
        )

      case "conditional":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={localData.condition || ""}
                onChange={(e) => handleChange("condition", e.target.value)}
                placeholder="contains(input, 'weather')"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trueLabel">True Path Label</Label>
              <Input
                id="trueLabel"
                value={localData.trueLabel || "Yes"}
                onChange={(e) => handleChange("trueLabel", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="falseLabel">False Path Label</Label>
              <Input
                id="falseLabel"
                value={localData.falseLabel || "No"}
                onChange={(e) => handleChange("falseLabel", e.target.value)}
              />
            </div>
          </>
        )

      case "chain":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="chainType">Chain Type</Label>
              <Select
                value={localData.chainType || "sequential"}
                onValueChange={(value) => handleChange("chainType", value)}
              >
                <SelectTrigger id="chainType">
                  <SelectValue placeholder="Select chain type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="map-reduce">Map-Reduce</SelectItem>
                  <SelectItem value="refine">Refine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chainConfig">Chain Configuration (JSON)</Label>
              <Textarea
                id="chainConfig"
                value={localData.chainConfig || ""}
                onChange={(e) => handleChange("chainConfig", e.target.value)}
                className="h-32"
                placeholder='{"steps": ["llm", "tool", "output"]}'
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Configure {node.data.label}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="label">Node Label</Label>
          <Input id="label" value={localData.label || ""} onChange={(e) => handleChange("label", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={localData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe what this node does"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="required"
            checked={localData.required || false}
            onCheckedChange={(checked) => handleChange("required", checked)}
          />
          <Label htmlFor="required">Required Node</Label>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {renderInputFields()}
      </div>
    </div>
  )
}
