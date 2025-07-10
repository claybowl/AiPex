"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare, Eye, EyeOff, Send, Activity } from "lucide-react"
import { SimpleNodeData } from "@/lib/types"

interface ActionNodeProps {
  data: SimpleNodeData
  id: string
  selected: boolean
}

export function ActionNode({ data, id, selected }: ActionNodeProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [prompt, setPrompt] = useState(data.prompt || "")

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    // Update the node data
    data.prompt = value
  }

  const getPlaceholderText = () => {
    return `Describe what action you want the AI to take...

Examples:
• Send a personalized email response to the customer
• Update the customer record in our CRM system
• Post an alert to the #support Slack channel
• Create a ticket in Jira with the extracted information
• Send an SMS notification via Twilio`
  }

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#10b981', border: '2px solid #0f172a' }}
      />
      
      <Card className={`min-w-[320px] max-w-[420px] bg-gradient-to-br from-purple-950 to-slate-800 border-purple-600/50 shadow-lg ${selected ? 'ring-2 ring-purple-400 shadow-purple-400/20' : ''} transition-all duration-200 hover:shadow-xl hover:border-purple-500/50`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-900/20 to-transparent">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <div className="p-1.5 rounded-lg bg-purple-900/30 border border-purple-700/50">
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            <span className="font-semibold">{data.label || 'Action'}</span>
            <Badge variant="outline" className="text-xs text-purple-400 border-purple-400 ml-auto mr-2">
              Smart Action
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
              Action Instructions:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 text-sm focus:border-purple-500 transition-colors"
            />
          </div>
          
          {/* Action Execution Indicator */}
          {prompt && (
            <div className="bg-purple-900/20 p-2 rounded border border-purple-700/30">
              <div className="flex items-center gap-1 text-xs text-purple-300">
                <Send className="h-3 w-3" />
                <span>AI will execute this action with intelligent parameter selection</span>
              </div>
            </div>
          )}
          
          {/* Integration Preview */}
          <div className="bg-slate-800/20 p-2 rounded border border-slate-600">
            <div className="text-xs text-slate-300 mb-1 font-medium">Available Integrations:</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                📧 Email
              </Badge>
              <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                💬 Slack
              </Badge>
              <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                📊 CRM
              </Badge>
              <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                📱 SMS
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
                  className="bg-slate-800/50 border-slate-600 text-white text-sm focus:border-purple-500"
                  placeholder="Node label"
                />
              </div>
              
              {data.extractedVariables && data.extractedVariables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-300">Action Results:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.extractedVariables.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-900/30 text-purple-200 border-purple-700">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Integration Information */}
              <div className="bg-slate-800/30 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                  <Activity className="h-3 w-3 text-purple-400" />
                  <span>AI Action Executor</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>💰 Cost: ${data.estimatedCost || 0.03}/run</span>
                  <span>⚡ Latency: {data.estimatedLatency || 2000}ms</span>
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