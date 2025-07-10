"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Brain,
  GitBranch,
  Zap,
  FileOutput,
  Search,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Plus
} from "lucide-react"

// NEW: Simplified Prompt-Based Nodes
const simpleNodeCategories = [
  {
    id: "simple-nodes",
    name: "🚀 New: AI-Powered Simple Nodes",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-teal-400",
    description: "Business-friendly workflow nodes powered by AI",
    featured: true,
    nodes: [
      {
        type: "input",
        label: "Input",
        description: "Receive data or trigger workflows",
        icon: <Upload className="h-4 w-4" />,
        businessDescription: "Where your workflow starts - describe what data comes in",
        examples: [
          "I receive customer support emails",
          "Users upload CSV files with sales data",
          "Webhook notifications from CRM"
        ],
        cost: "$0.01",
        simple: true
      },
      {
        type: "process",
        label: "AI Process",
        description: "AI-powered data analysis and processing",
        icon: <Brain className="h-4 w-4" />,
        businessDescription: "Let AI analyze, transform, or understand your data",
        examples: [
          "Analyze customer sentiment from messages",
          "Extract key information from documents",
          "Classify tickets by urgency and department"
        ],
        cost: "$0.02",
        simple: true
      },
      {
        type: "decision",
        label: "Smart Decision",
        description: "AI-powered conditional routing",
        icon: <GitBranch className="h-4 w-4" />,
        businessDescription: "Split your workflow based on intelligent conditions",
        examples: [
          "If customer is angry, escalate to manager",
          "If order value > $1000, require approval",
          "If document contains PII, secure handling"
        ],
        cost: "$0.015",
        simple: true
      },
      {
        type: "action",
        label: "Smart Action",
        description: "AI-powered actions and integrations",
        icon: <Zap className="h-4 w-4" />,
        businessDescription: "Take action - send emails, update databases, notify teams",
        examples: [
          "Send personalized email to customer",
          "Update customer record in CRM",
          "Post alert in Slack channel"
        ],
        cost: "$0.03",
        simple: true
      },
      {
        type: "output",
        label: "Output",
        description: "Format and deliver final results",
        icon: <FileOutput className="h-4 w-4" />,
        businessDescription: "How your workflow ends - format and deliver results",
        examples: [
          "Generate summary report in PDF",
          "Export results to CSV file",
          "Send formatted response to user"
        ],
        cost: "$0.01",
        simple: true
      }
    ]
  }
]

// Legacy complex nodes (collapsed by default)
const legacyNodeCategories = [
  {
    id: "legacy-notice",
    name: "⚠️ Legacy Complex Nodes",
    icon: <ChevronRight className="h-4 w-4" />,
    color: "text-gray-400",
    description: "47 technical nodes - use Simple Nodes above for easier workflows",
    legacy: true,
    nodes: []
  }
]

interface NodeLibraryProps {
  onAddNode?: (nodeType: string) => void
}

export default function NodeLibrary({ onAddNode }: NodeLibraryProps = {}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["simple-nodes"]), // Start with simple nodes expanded
  )
  const [showLegacy, setShowLegacy] = useState(false)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNodeClick = (nodeType: string) => {
    if (onAddNode) {
      onAddNode(nodeType)
    }
  }

  const allCategories = [...simpleNodeCategories, ...legacyNodeCategories]
  
  const filteredCategories = allCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node: any) =>
          node.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.businessDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.nodes.length > 0 || category.legacy)

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="font-semibold text-lg flex items-center text-white mb-3">
          <Sparkles className="h-5 w-5 mr-2 text-teal-400" />
          Node Library
        </h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 text-sm"
          />
        </div>
        
        {/* Quick Start Banner */}
        <div className="bg-teal-900/20 p-3 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-200">✨ New Simplified Workflow Builder</span>
          </div>
          <p className="text-xs text-teal-300/80">
            Create workflows using simple English descriptions. No technical knowledge required!
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="node-category mb-3">
            <button
              onClick={() => category.legacy ? setShowLegacy(!showLegacy) : toggleCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                category.featured 
                  ? 'bg-teal-900/30 hover:bg-teal-900/40 border border-teal-700'
                  : category.legacy
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center">
                <span className={`mr-2 ${category.color}`}>{category.icon}</span>
                <div className="text-left">
                  <h3 className={`font-medium text-sm ${
                    category.featured ? 'text-teal-200' : 'text-white'
                  }`}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className={`text-xs ${
                      category.featured ? 'text-teal-300/80' : 'text-slate-400'
                    }`}>
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              {(expandedCategories.has(category.id) || (category.legacy && showLegacy)) ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {(expandedCategories.has(category.id) || (category.legacy && showLegacy)) && (
              <div className={`mt-2 space-y-2 ${
                category.legacy ? 'pl-0' : 'pl-0'
              }`}>
                {category.legacy && showLegacy ? (
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="text-xs text-slate-400 mb-2">
                      These are the original 47 complex nodes requiring technical configuration.
                      We recommend using the Simple Nodes above instead.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-slate-400 border-slate-600 hover:bg-slate-700"
                      onClick={() => setShowLegacy(false)}
                    >
                      Hide Legacy Nodes
                    </Button>
                  </div>
                ) : (
                  category.nodes.map((node: any) => (
                    <div
                      key={node.type}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        node.simple 
                          ? 'bg-slate-800 border-slate-600 hover:bg-slate-750 hover:border-teal-600'
                          : 'bg-slate-800 border-slate-600 hover:bg-slate-750'
                      }`}
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type)}
                      onClick={() => handleNodeClick(node.type)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${node.simple ? 'bg-teal-900/30' : 'bg-slate-700'}`}>
                          <span className={node.simple ? 'text-teal-400' : category.color}>
                            {node.icon}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-white">{node.label}</h4>
                            {node.simple && (
                              <Badge 
                                variant="outline" 
                                className="text-xs text-teal-400 border-teal-400"
                              >
                                {node.cost}/run
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-slate-300 mb-2">
                            {node.businessDescription || node.description}
                          </p>
                          
                          {node.examples && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="h-3 w-3 text-yellow-400" />
                                <span className="text-xs text-slate-400">Examples:</span>
                              </div>
                              {node.examples.slice(0, 2).map((example: string, index: number) => (
                                <div key={index} className="text-xs text-slate-400 pl-4 border-l-2 border-slate-600">
                                  "{example}"
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {node.simple && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs text-teal-400 border-teal-400">
                                AI-Powered
                              </Badge>
                              <span className="text-xs text-slate-400">Click to add</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {/* Workflow Tips */}
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 mx-2 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-200">Quick Workflow Guide</span>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>1. Start with an <strong>Input</strong> node</div>
            <div>2. Add <strong>AI Process</strong> nodes for analysis</div>
            <div>3. Use <strong>Smart Decision</strong> for branching</div>
            <div>4. Add <strong>Smart Action</strong> for results</div>
            <div>5. End with an <strong>Output</strong> node</div>
          </div>
        </div>
      </div>
    </div>
  )
}
