"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GitBranch, MessageSquare, Eye, EyeOff, Route, Zap } from "lucide-react"
import { SimpleNodeData } from "@/lib/types"

interface DecisionNodeProps {
  data: SimpleNodeData
  id: string
  selected: boolean
}

export function DecisionNode({ data, id, selected }: DecisionNodeProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [prompt, setPrompt] = useState(data.prompt || "")

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    // Update the node data
    data.prompt = value
  }

  const getPlaceholderText = () => {
    return `Describe the decision logic you want the AI to apply...

Examples:
• If the customer is angry or frustrated, escalate to human agent
• If order value is greater than $1000, require manager approval
• If document contains sensitive information, flag for security review
• Route to different departments based on inquiry type`
  }

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#10b981', border: '2px solid #0f172a' }}
      />
      
      <Card className={`min-w-[320px] max-w-[420px] bg-gradient-to-br from-yellow-950 to-slate-800 border-yellow-600/50 shadow-lg ${selected ? 'ring-2 ring-yellow-400 shadow-yellow-400/20' : ''} transition-all duration-200 hover:shadow-xl hover:border-yellow-500/50`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-yellow-900/20 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <div className="p-1.5 rounded-lg bg-yellow-900/30 border border-yellow-700/50">
              <GitBranch className="h-4 w-4 text-yellow-400" />
            </div>
            <span className="font-semibold">{data.label || 'Decision'}</span>
            <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 ml-auto mr-2">
              Smart Routing
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
              Decision Logic:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-sm focus:border-yellow-500 transition-colors"
            />
          </div>
          
          {/* Decision Logic Indicator */}
          {prompt && (
            <div className="bg-yellow-900/20 p-2 rounded border border-yellow-700/30">
              <div className="flex items-center gap-1 text-xs text-yellow-300">
                <Route className="h-3 w-3" />
                <span>AI will evaluate conditions and route workflow accordingly</span>
              </div>
            </div>
          )}
          
          {/* Multiple Output Handles Preview */}
          <div className="bg-slate-800/20 p-2 rounded border border-slate-600">
            <div className="text-xs text-slate-300 mb-1 font-medium">Routing Paths:</div>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                ✓ True Path
              </Badge>
              <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                ✗ False Path
              </Badge>
            </div>
          </div>
          
          {showDetails && (
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-slate-300">Label:</label>
                <Input
                  value={data.label}
                  onChange={(e) => data.label = e.target.value}
                  className="bg-slate-800/50 border-slate-600 text-white text-sm focus:border-yellow-500"
                  placeholder="Node label"
                />
              </div>
              
              {data.extractedVariables && data.extractedVariables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-300">Decision Variables:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.extractedVariables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-yellow-900/30 text-yellow-200 border-yellow-700">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Model Information */}
              <div className="bg-slate-800/30 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span>AI Decision Engine</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>💰 Cost: ${data.estimatedCost || 0.015}/run</span>
                  <span>⚡ Latency: {data.estimatedLatency || 1000}ms</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Multiple output handles for true/false paths */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        style={{ 
          background: '#22c55e', 
          border: '2px solid #0f172a',
          top: '40%'
        }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        style={{ 
          background: '#ef4444', 
          border: '2px solid #0f172a',
          top: '60%'
        }}
      />
    </>
  )
}