"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Clock,
  Eye,
  Mail,
  Webhook,
  Globe,
  FileSpreadsheet,
  Database,
  Shuffle,
  Type,
  Languages,
  Tag,
  Heart,
  FileText,
  ImportIcon as Translate,
  Zap,
  Plus,
  GitBranch,
  RotateCcw,
  AlertTriangle,
  MessageSquare,
  Brain,
  Search,
  Users,
  Lightbulb,
  Wrench,
  Layers,
  Calendar,
  MessageCircle,
  Hash,
  UploadIcon as S3UploaderIcon,
  Send,
  BarChart3,
  Save,
  Shield,
  Bell,
  CheckCircle,
  Activity,
  FileUp,
  FileDown,
  Cog,
} from "lucide-react"

interface NodeType {
  type: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const nodeCategories: Record<string, { title: string; nodes: NodeType[] }> = {
  "triggers-schedulers": {
    title: "Triggers & Schedulers",
    nodes: [
      {
        type: "scheduled-trigger",
        label: "Scheduled Trigger",
        description: "Run workflow on repeats",
        icon: <Clock className="h-4 w-4" />,
        color: "bg-sky-500",
      },
      {
        type: "file-watcher",
        label: "File Watcher",
        description: "Watch for new files",
        icon: <Eye className="h-4 w-4" />,
        color: "bg-sky-500",
      },
      {
        type: "email-trigger",
        label: "Email Inbound Trigger",
        description: "Trigger on email receipt",
        icon: <Mail className="h-4 w-4" />,
        color: "bg-sky-500",
      },
      {
        type: "webhook",
        label: "Webhook Listener",
        description: "Listen for incoming webhooks",
        icon: <Webhook className="h-4 w-4" />,
        color: "bg-sky-500",
      },
    ],
  },
  "data-io": {
    title: "Data & I/O Connectors",
    nodes: [
      {
        type: "rest-api",
        label: "REST API",
        description: "Connect to REST API endpoints",
        icon: <Globe className="h-4 w-4" />,
        color: "bg-emerald-500",
      },
      {
        type: "csv-upload",
        label: "CSV/Excel Upload",
        description: "Import data from CSV/Excel",
        icon: <FileSpreadsheet className="h-4 w-4" />,
        color: "bg-emerald-500",
      },
      {
        type: "db-pull",
        label: "Database Pull",
        description: "Query data from PostgreSQL",
        icon: <Database className="h-4 w-4" />,
        color: "bg-emerald-500",
      },
    ],
  },
  "adapters-preprocessing": {
    title: "Adapters & Preprocessing",
    nodes: [
      {
        type: "json-converter",
        label: "JSON-to-Tabular",
        description: "Convert JSON to tabular format",
        icon: <Shuffle className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "text-cleaning",
        label: "Text Cleaning",
        description: "Clean and tokenize text data",
        icon: <Type className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "language-detector",
        label: "Language Detector",
        description: "Auto-detect text language",
        icon: <Languages className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "entity-recognizer",
        label: "Named-Entity Recognizer",
        description: "Extract entities from text",
        icon: <Tag className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "sentiment-analysis",
        label: "Sentiment Analysis",
        description: "Analyze text sentiment",
        icon: <Heart className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "summarization",
        label: "Summarization",
        description: "Condense long documents",
        icon: <FileText className="h-4 w-4" />,
        color: "bg-violet-500",
      },
      {
        type: "translator",
        label: "Translator",
        description: "Translate text to target language",
        icon: <Translate className="h-4 w-4" />,
        color: "bg-violet-500",
      },
    ],
  },
  "processing-orchestration": {
    title: "Processing & Orchestration",
    nodes: [
      {
        type: "embedding",
        label: "Embedding Generation",
        description: "Generate vector embeddings",
        icon: <Zap className="h-4 w-4" />,
        color: "bg-fuchsia-500",
      },
      {
        type: "data-enrichment",
        label: "Data Enrichment",
        description: "Enrich data with external sources",
        icon: <Plus className="h-4 w-4" />,
        color: "bg-fuchsia-500",
      },
      {
        type: "conditional",
        label: "Conditional Router",
        description: "Route based on conditions",
        icon: <GitBranch className="h-4 w-4" />,
        color: "bg-fuchsia-500",
      },
      {
        type: "loop",
        label: "Loop Processor",
        description: "Process items in a loop",
        icon: <RotateCcw className="h-4 w-4" />,
        color: "bg-fuchsia-500",
      },
      {
        type: "error-handler",
        label: "Error Handler",
        description: "Handle errors in workflow",
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "bg-fuchsia-500",
      },
    ],
  },
  "model-agent": {
    title: "Model & Agent Wrappers",
    nodes: [
      {
        type: "llm",
        label: "LLM Prompt",
        description: "Process with language models",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "bg-pink-500",
      },
      {
        type: "ml-model",
        label: "ML Model",
        description: "Classification/Regression model",
        icon: <Brain className="h-4 w-4" />,
        color: "bg-pink-500",
      },
      {
        type: "embedding-search",
        label: "Embeddings Search",
        description: "Search vector embeddings",
        icon: <Search className="h-4 w-4" />,
        color: "bg-pink-500",
      },
      {
        type: "agent",
        label: "Stateful Agent",
        description: "Agent with memory management",
        icon: <Users className="h-4 w-4" />,
        color: "bg-pink-500",
      },
    ],
  },
  "advanced-helpers": {
    title: "Advanced Model & Agent Helpers",
    nodes: [
      {
        type: "cot-debugger",
        label: "Chain-of-Thought Debugger",
        description: "Expose LLM reasoning steps",
        icon: <Lightbulb className="h-4 w-4" />,
        color: "bg-cyan-500",
      },
      {
        type: "tool-selector",
        label: "Tool Selector",
        description: "Dynamically pick tools",
        icon: <Wrench className="h-4 w-4" />,
        color: "bg-cyan-500",
      },
      {
        type: "batch-inference",
        label: "Batch Inference",
        description: "Process records in batch",
        icon: <Layers className="h-4 w-4" />,
        color: "bg-cyan-500",
      },
    ],
  },
  "integrations-actions": {
    title: "Integrations & Actions",
    nodes: [
      {
        type: "google-sheets",
        label: "Google Sheets",
        description: "Update Google Sheets",
        icon: <FileSpreadsheet className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "twilio-sms",
        label: "Twilio SMS",
        description: "Send SMS messages",
        icon: <MessageCircle className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "google-calendar",
        label: "Google Calendar",
        description: "Create calendar events",
        icon: <Calendar className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "slack-reaction",
        label: "Slack Reaction",
        description: "Post to Slack with reactions",
        icon: <Hash className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "s3-uploader",
        label: "S3 Uploader",
        description: "Upload files to S3",
        icon: <S3UploaderIcon className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "email-send",
        label: "Email Send",
        description: "Send emails via SMTP",
        icon: <Send className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "slack-message",
        label: "Slack Message",
        description: "Send messages to Slack",
        icon: <MessageCircle className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "dashboard-update",
        label: "Dashboard Update",
        description: "Update dashboard via HTTP",
        icon: <BarChart3 className="h-4 w-4" />,
        color: "bg-amber-500",
      },
      {
        type: "db-write",
        label: "Database Write",
        description: "Write data to PostgreSQL",
        icon: <Save className="h-4 w-4" />,
        color: "bg-amber-500",
      },
    ],
  },
  "utility-devops": {
    title: "Utility & DevOps",
    nodes: [
      {
        type: "cache-limiter",
        label: "Cache & Rate-Limiter",
        description: "Cache responses and limit rates",
        icon: <Shield className="h-4 w-4" />,
        color: "bg-slate-500",
      },
      {
        type: "error-notifier",
        label: "Error Notifier",
        description: "Notify on workflow failures",
        icon: <Bell className="h-4 w-4" />,
        color: "bg-slate-500",
      },
      {
        type: "data-validator",
        label: "Data Validator",
        description: "Validate data with schemas",
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-slate-500",
      },
      {
        type: "logging",
        label: "Logging & Monitoring",
        description: "Log events and metrics",
        icon: <Activity className="h-4 w-4" />,
        color: "bg-slate-500",
      },
    ],
  },
  "file-operations": {
    title: "File Operations",
    nodes: [
      {
        type: "file-upload",
        label: "File Upload",
        description: "Upload a file",
        icon: <FileUp className="h-4 w-4" />,
        color: "bg-teal-500",
      },
      {
        type: "file-download",
        label: "File Download",
        description: "Download a file",
        icon: <FileDown className="h-4 w-4" />,
        color: "bg-teal-500",
      },
      {
        type: "file-processor",
        label: "File Processor",
        description: "Process file content",
        icon: <Cog className="h-4 w-4" />,
        color: "bg-teal-500",
      },
    ],
  },
}

export default function EnhancedNodeLibrary({
  onAddNodeByClick, // Renamed for clarity, though not strictly necessary
}: {
  onAddNodeByClick: (type: string, label: string, description: string, color: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, node: NodeType) => {
    const nodeInfo = {
      type: node.type,
      label: node.label,
      description: node.description,
      color: node.color,
    }
    event.dataTransfer.setData("application/json", JSON.stringify(nodeInfo))
    event.dataTransfer.effectAllowed = "copy"
  }

  const filteredCategories = Object.entries(nodeCategories).reduce(
    (acc, [key, category]) => {
      const filteredNodes = category.nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (filteredNodes.length > 0) {
        acc[key] = { ...category, nodes: filteredNodes }
      }
      return acc
    },
    {} as typeof nodeCategories,
  )

  return (
    <div className="w-80 border-r border-border bg-card dark:bg-slate-800 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3 text-foreground dark:text-slate-200">Node Library</h2>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-input dark:border-slate-600 bg-background dark:bg-slate-700 rounded-md text-sm text-foreground dark:text-slate-300 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-sky-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={Object.keys(nodeCategories)} className="w-full">
          {Object.entries(filteredCategories).map(([key, category]) => (
            <AccordionItem key={key} value={key} className="border-b border-border dark:border-slate-700">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-foreground dark:text-slate-300 hover:bg-muted/50 dark:hover:bg-slate-700/50">
                {category.title}
              </AccordionTrigger>
              <AccordionContent className="pb-2 bg-background dark:bg-slate-800">
                <div className="space-y-1 px-2">
                  {category.nodes.map((node) => (
                    <Button
                      key={node.type + node.label} // Ensure unique key if types can repeat
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50 dark:hover:bg-slate-700/50 cursor-grab"
                      onClick={() => onAddNodeByClick(node.type, node.label, node.description, node.color)}
                      draggable={true} // Make the button draggable
                      onDragStart={(e) => handleDragStart(e, node)} // Handle drag start
                    >
                      <div className="flex items-start gap-3 w-full pointer-events-none">
                        {" "}
                        {/* pointer-events-none for children */}
                        <div className={`p-1.5 rounded ${node.color} text-white flex-shrink-0`}>{node.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground dark:text-slate-200 truncate">
                            {node.label}
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5 line-clamp-2">
                            {node.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {Object.keys(filteredCategories).length === 0 && searchTerm && (
          <div className="p-8 text-center text-muted-foreground dark:text-slate-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No nodes found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border dark:border-slate-700 text-xs text-muted-foreground dark:text-slate-400">
        Node Tips:
        <ul className="list-disc list-inside mt-1">
          <li>Drag or click nodes onto the canvas.</li>
          <li>Click to select/configure.</li>
          <li>Press Delete/Backspace to remove.</li>
        </ul>
      </div>
    </div>
  )
}
export { nodeCategories }
