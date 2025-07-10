"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileOutput, MessageSquare, Eye, EyeOff, CheckCircle, FileText } from "lucide-react"
import { SimpleNodeData } from "@/lib/types"

interface OutputNodeProps {
  data: SimpleNodeData
  id: string
  selected: boolean
}

export function OutputNode({ data, id, selected }: OutputNodeProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [prompt, setPrompt] = useState(data.prompt || "")

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    // Update the node data
    data.prompt = value
  }

  const getPlaceholderText = () => {
    return `Describe how you want to format and deliver the final results...

Examples:
• Generate a summary report in PDF format
• Export the processed data to a CSV file
• Send a formatted response back to the user
• Create a JSON output with all the extracted information
• Format results for display in a dashboard`
  }

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#10b981', border: '2px solid #0f172a' }}
      />
      
      <Card className={`min-w-[320px] max-w-[420px] bg-gradient-to-br from-emerald-950 to-slate-800 border-emerald-600/50 shadow-lg ${selected ? 'ring-2 ring-emerald-400 shadow-emerald-400/20' : ''} transition-all duration-200 hover:shadow-xl hover:border-emerald-500/50`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-emerald-900/20 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <div className="p-1.5 rounded-lg bg-emerald-900/30 border border-emerald-700/50">
              <FileOutput className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold">{data.label || 'Output'}</span>
            <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400 ml-auto mr-2">
              Final Result
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
              Output Format:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-sm focus:border-emerald-500 transition-colors"
            />
          </div>
          
          {/* Output Processing Indicator */}
          {prompt && (
            <div className="bg-emerald-900/20 p-2 rounded border border-emerald-700/30">
              <div className="flex items-center gap-1 text-xs text-emerald-300">
                <CheckCircle className="h-3 w-3" />
                <span>AI will format and structure the output for optimal delivery</span>
              </div>
            </div>
          )}
          
          {/* Output Format Options */}
          <div className="bg-slate-800/20 p-2 rounded border border-slate-600">
            <div className="text-xs text-slate-300 mb-1 font-medium">Supported Formats:</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                📄 PDF
              </Badge>
              <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                📊 CSV
              </Badge>
              <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                📋 JSON
              </Badge>
              <Badge variant="outline" className="text-xs text-purple-400 border-purple-400">
                📧 Email
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
                  className="bg-slate-800/50 border-slate-600 text-white text-sm focus:border-emerald-500"
                  placeholder="Node label"
                />
              </div>
              
              {data.extractedVariables && data.extractedVariables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-300">Output Components:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.extractedVariables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-emerald-900/30 text-emerald-200 border-emerald-700">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Output Information */}
              <div className="bg-slate-800/30 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                  <FileText className="h-3 w-3 text-emerald-400" />
                  <span>Output Formatter</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>💰 Cost: ${data.estimatedCost || 0.01}/run</span>
                  <span>⚡ Latency: {data.estimatedLatency || 300}ms</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Workflow Completion Indicator */}
          <div className="bg-emerald-900/20 p-2 rounded border border-emerald-700/30">
            <div className="flex items-center gap-1 text-xs text-emerald-300">
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">Workflow End Point</span>
            </div>
            <div className="text-xs text-emerald-300/80 mt-1">
              This node completes your workflow and delivers final results
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* No output handle since this is the final node */}
    </>
  )
}