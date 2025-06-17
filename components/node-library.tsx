"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Database,
  GitBranch,
  Mail,
  Globe,
  FileSpreadsheet,
  Webhook,
  FileJsonIcon as Json,
  Text,
  VideoIcon as Vector,
  Building2,
  IterationCcw,
  AlertTriangle,
  MessageSquare,
  Brain,
  Search,
  MemoryStickIcon as Memory,
  Slack,
  BarChart3,
  Gauge,
  Clock,
  FolderOpen,
  Languages,
  Tag,
  ThumbsUp,
  FileText,
  Lightbulb,
  Wrench,
  Layers,
  Table,
  MessageCircle,
  Calendar,
  Upload,
  CheckCircle,
  Bell,
  Download,
  ChevronDown,
  ChevronRight,
  Boxes,
} from "lucide-react"

const nodeCategories = [
  {
    id: "triggers",
    name: "Triggers & Schedulers",
    icon: <Clock className="h-4 w-4" />,
    color: "text-green-500",
    nodes: [
      {
        type: "scheduled-trigger",
        label: "Scheduled Trigger",
        description: "Run workflow on schedule",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        type: "file-watcher",
        label: "File Watcher",
        description: "Watch for new files",
        icon: <FolderOpen className="h-4 w-4" />,
      },
      {
        type: "email-trigger",
        label: "Email Inbound Trigger",
        description: "Trigger on incoming emails",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        type: "webhook",
        label: "Webhook Listener",
        description: "Listen for incoming webhooks",
        icon: <Webhook className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "io",
    name: "Data & I/O Connectors",
    icon: <Globe className="h-4 w-4" />,
    color: "text-blue-500",
    nodes: [
      {
        type: "rest-api",
        label: "REST API",
        description: "Connect to REST API endpoints",
        icon: <Globe className="h-4 w-4" />,
      },
      {
        type: "csv-upload",
        label: "CSV/Excel Upload",
        description: "Import data from CSV/Excel files",
        icon: <FileSpreadsheet className="h-4 w-4" />,
      },
      {
        type: "db-pull",
        label: "Database Pull",
        description: "Query data from PostgreSQL",
        icon: <Database className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "adapters",
    name: "Adapters & Preprocessing",
    icon: <Wrench className="h-4 w-4" />,
    color: "text-purple-500",
    nodes: [
      {
        type: "json-converter",
        label: "JSON-to-Tabular",
        description: "Convert JSON to tabular format",
        icon: <Json className="h-4 w-4" />,
      },
      {
        type: "text-cleaning",
        label: "Text Cleaning",
        description: "Clean and tokenize text data",
        icon: <Text className="h-4 w-4" />,
      },
      {
        type: "language-detector",
        label: "Language Detector",
        description: "Auto-detect text language",
        icon: <Languages className="h-4 w-4" />,
      },
      {
        type: "entity-recognizer",
        label: "Named-Entity Recognizer",
        description: "Extract entities from text",
        icon: <Tag className="h-4 w-4" />,
      },
      {
        type: "sentiment-analysis",
        label: "Sentiment Analysis",
        description: "Analyze text sentiment",
        icon: <ThumbsUp className="h-4 w-4" />,
      },
      {
        type: "summarization",
        label: "Summarization",
        description: "Condense long documents",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        type: "translator",
        label: "Translator",
        description: "Translate text to target language",
        icon: <Languages className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "processing",
    name: "Processing & Orchestration",
    icon: <Layers className="h-4 w-4" />,
    color: "text-orange-500",
    nodes: [
      {
        type: "embedding",
        label: "Embedding Generation",
        description: "Generate vector embeddings",
        icon: <Vector className="h-4 w-4" />,
      },
      {
        type: "data-enrichment",
        label: "Data Enrichment",
        description: "Enrich data with external sources",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        type: "conditional",
        label: "Conditional Router",
        description: "Route based on conditions",
        icon: <GitBranch className="h-4 w-4" />,
      },
      {
        type: "loop",
        label: "Loop Processor",
        description: "Process items in a loop",
        icon: <IterationCcw className="h-4 w-4" />,
      },
      {
        type: "error-handler",
        label: "Error Handler",
        description: "Handle errors in the workflow",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "models",
    name: "Model & Agent Wrappers",
    icon: <Brain className="h-4 w-4" />,
    color: "text-pink-500",
    nodes: [
      {
        type: "llm",
        label: "LLM Prompt",
        description: "Process with language models",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        type: "ml-model",
        label: "ML Model",
        description: "Classification/Regression model",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        type: "embedding-search",
        label: "Embeddings Search",
        description: "Search vector embeddings",
        icon: <Search className="h-4 w-4" />,
      },
      {
        type: "agent",
        label: "Stateful Agent",
        description: "Agent with memory management",
        icon: <Memory className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "advanced-models",
    name: "Advanced Model & Agent Helpers",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-yellow-500",
    nodes: [
      {
        type: "chain-of-thought",
        label: "Chain-of-Thought Debugger",
        description: "Expose LLM reasoning steps",
        icon: <Lightbulb className="h-4 w-4" />,
      },
      {
        type: "tool-selector",
        label: "Tool Selector",
        description: "Dynamically pick tools",
        icon: <Wrench className="h-4 w-4" />,
      },
      {
        type: "batch-inference",
        label: "Batch Inference",
        description: "Process records in batch",
        icon: <Layers className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "integrations",
    name: "Integrations & Actions",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "text-cyan-500",
    nodes: [
      {
        type: "google-sheets",
        label: "Google Sheets",
        description: "Update Google Sheets",
        icon: <Table className="h-4 w-4" />,
      },
      {
        type: "twilio-sms",
        label: "Twilio SMS",
        description: "Send SMS messages",
        icon: <MessageCircle className="h-4 w-4" />,
      },
      {
        type: "google-calendar",
        label: "Google Calendar",
        description: "Create calendar events",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        type: "slack-reaction",
        label: "Slack Reaction",
        description: "Post to Slack with reactions",
        icon: <Slack className="h-4 w-4" />,
      },
      {
        type: "s3-uploader",
        label: "S3 Uploader",
        description: "Upload files to S3",
        icon: <Upload className="h-4 w-4" />,
      },
      {
        type: "email",
        label: "Email Send",
        description: "Send emails via SMTP",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        type: "slack",
        label: "Slack Message",
        description: "Send messages to Slack",
        icon: <Slack className="h-4 w-4" />,
      },
      {
        type: "dashboard",
        label: "Dashboard Update",
        description: "Update dashboard via HTTP",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        type: "db-write",
        label: "Database Write",
        description: "Write data to PostgreSQL",
        icon: <Database className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "utility",
    name: "Utility & DevOps",
    icon: <Gauge className="h-4 w-4" />,
    color: "text-gray-500",
    nodes: [
      {
        type: "cache",
        label: "Cache & Rate-Limiter",
        description: "Cache responses and limit rates",
        icon: <Database className="h-4 w-4" />,
      },
      {
        type: "error-notifier",
        label: "Error Notifier",
        description: "Notify on workflow failures",
        icon: <Bell className="h-4 w-4" />,
      },
      {
        type: "data-validator",
        label: "Data Validator",
        description: "Validate data with schemas",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        type: "logging",
        label: "Logging & Monitoring",
        description: "Log events and metrics",
        icon: <Gauge className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "files",
    name: "File Operations",
    icon: <Upload className="h-4 w-4" />,
    color: "text-indigo-500",
    nodes: [
      {
        type: "file-upload",
        label: "File Upload",
        description: "Upload files to storage",
        icon: <Upload className="h-4 w-4" />,
      },
      {
        type: "file-download",
        label: "File Download",
        description: "Download files from storage",
        icon: <Download className="h-4 w-4" />,
      },
      {
        type: "file-processor",
        label: "File Processor",
        description: "Process file contents",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
]

export default function NodeLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["triggers", "io", "adapters", "processing", "models"]),
  )

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

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.nodes.length > 0)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-lg flex items-center text-gray-900 dark:text-gray-100 mb-3">
          <Boxes className="h-5 w-5 mr-2 text-blue-500" />
          Node Library
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="node-category mb-2">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className={`mr-2 ${category.color}`}>{category.icon}</span>
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{category.name}</h3>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedCategories.has(category.id) && (
              <div className="mt-1 pl-6 space-y-1">
                {category.nodes.map((node) => (
                  <Button
                    key={node.type}
                    variant="ghost"
                    className="node-item w-full justify-start text-left h-auto py-2 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 border border-transparent"
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                  >
                    <span className={`mr-2 ${category.color}`}>{node.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{node.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{node.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center justify-center">
            <ChevronDown className="h-4 w-4 mr-1" />
            Scroll for more nodes
          </div>
        </div>
      </div>
    </div>
  )
}
