"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, Eye, EyeOff, Cpu, Zap } from "lucide-react"
import { SimpleNodeData } from "@/lib/types"

interface ProcessNodeProps {
  data: SimpleNodeData
  id: string
  selected: boolean
}

export function ProcessNode({ data, id, selected }: ProcessNodeProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [prompt, setPrompt] = useState(data.prompt || "")

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    // Update the node data
    data.prompt = value
  }

  const getPlaceholderText = () => {
    return `Describe what you want the AI to do with the input...

Examples:
• Analyze the customer's message and determine their sentiment
• Extract key information from the uploaded document
• Classify the support ticket by urgency and department
• Generate a personalized response based on the customer's history`
  }

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#10b981', border: '2px solid #0f172a' }}
      />
      
      <Card className={`min-w-[320px] max-w-[420px] bg-gradient-to-br from-blue-950 to-slate-800 border-blue-600/50 shadow-lg ${selected ? 'ring-2 ring-blue-400 shadow-blue-400/20' : ''} transition-all duration-200 hover:shadow-xl hover:border-blue-500/50`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-900/20 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <div className="p-1.5 rounded-lg bg-blue-900/30 border border-blue-700/50">
              <Brain className="h-4 w-4 text-blue-400" />
            </div>
            <span className="font-semibold">{data.label || 'Process'}</span>
            <Badge variant="outline" className="text-xs text-blue-400 border-blue-400 ml-auto mr-2">
              AI Processing
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 h-6 w-6 hover:bg-slate-700"
            >
              {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              AI Instructions:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-sm focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* AI Processing Indicator */}
          {prompt && (
            <div className="bg-blue-900/20 p-2 rounded border border-blue-700/30">
              <div className="flex items-center gap-1 text-xs text-blue-300">
                <Cpu className="h-3 w-3 animate-pulse" />
                <span>OpenAI will analyze and process this data intelligently</span>
              </div>
            </div>
          )}
          
          {showDetails && (
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-slate-300">Label:</label>
                <Input
                  value={data.label}
                  onChange={(e) => data.label = e.target.value}
                  className="bg-slate-800/50 border-slate-600 text-white text-sm focus:border-blue-500"
                  placeholder="Node label"
                />
              </div>
              
              {data.extractedVariables && data.extractedVariables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-300">AI Generated Outputs:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.extractedVariables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-900/30 text-blue-200 border-blue-700">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Model Information */}
              <div className="bg-slate-800/30 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span>OpenAI GPT-4 Processing</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>💰 Cost: ${data.estimatedCost || 0.02}/run</span>
                  <span>⚡ Latency: {data.estimatedLatency || 1500}ms</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#10b981', border: '2px solid #0f172a' }}
      />
    </>
  )
}