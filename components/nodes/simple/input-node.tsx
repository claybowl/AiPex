"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, MessageSquare, Eye, EyeOff, Sparkles } from "lucide-react"
import { SimpleNodeData } from "@/lib/types"

interface InputNodeProps {
  data: SimpleNodeData
  id: string
  selected: boolean
}

export function InputNode({ data, id, selected }: InputNodeProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [prompt, setPrompt] = useState(data.prompt || "")

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    // Update the node data
    data.prompt = value
  }

  const getPlaceholderText = () => {
    return `Describe what kind of input this workflow will receive...

Examples:
• I receive customer support emails
• Users upload CSV files with sales data
• I get webhook notifications from my CRM
• Customers fill out a contact form`
  }

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#10b981', visibility: 'hidden' }}
      />
      
      <Card className={`min-w-[320px] max-w-[420px] bg-gradient-to-br from-slate-900 to-slate-800 border-slate-600 shadow-lg ${selected ? 'ring-2 ring-teal-400 shadow-teal-400/20' : ''} transition-all duration-200 hover:shadow-xl hover:border-teal-500/50`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-teal-900/20 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <div className="p-1.5 rounded-lg bg-teal-900/30 border border-teal-700/50">
              <Upload className="h-4 w-4 text-teal-400" />
            </div>
            <span className="font-semibold">{data.label || 'Input'}</span>
            <Badge variant="outline" className="text-xs text-teal-400 border-teal-400 ml-auto mr-2">
              Entry Point
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
              Prompt:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-sm focus:border-teal-500 transition-colors"
            />
          </div>
          
          {/* AI Enhancement Indicator */}
          {prompt && (
            <div className="bg-teal-900/20 p-2 rounded border border-teal-700/30">
              <div className="flex items-center gap-1 text-xs text-teal-300">
                <Sparkles className="h-3 w-3" />
                <span>AI will extract variables and structure data from this input</span>
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
                  className="bg-slate-800/50 border-slate-600 text-white text-sm focus:border-teal-500"
                  placeholder="Node label"
                />
              </div>
              
              {data.extractedVariables && data.extractedVariables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-300">AI Extracted Variables:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.extractedVariables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-teal-900/30 text-teal-200 border-teal-700">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-slate-800/30 p-2 rounded border border-slate-600">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>💰 Cost: ${data.estimatedCost || 0.01}/run</span>
                  <span>⚡ Latency: {data.estimatedLatency || 200}ms</span>
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