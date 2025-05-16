"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const nodeCategories = [
  {
    id: "triggers",
    name: "Triggers & Schedulers",
    nodes: [
      {
        type: "scheduled-trigger",
        label: "Scheduled Trigger",
        description: "Run workflow on schedule",
        icon: <Clock className="h-4 w-4 mr-2" />,
      },
      {
        type: "file-watcher",
        label: "File Watcher",
        description: "Watch for new files",
        icon: <FolderOpen className="h-4 w-4 mr-2" />,
      },
      {
        type: "email-trigger",
        label: "Email Inbound Trigger",
        description: "Trigger on incoming emails",
        icon: <Mail className="h-4 w-4 mr-2" />,
      },
      {
        type: "webhook",
        label: "Webhook Listener",
        description: "Listen for incoming webhooks",
        icon: <Webhook className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "io",
    name: "Data & I/O Connectors",
    nodes: [
      {
        type: "rest-api",
        label: "REST API",
        description: "Connect to REST API endpoints",
        icon: <Globe className="h-4 w-4 mr-2" />,
      },
      {
        type: "csv-upload",
        label: "CSV/Excel Upload",
        description: "Import data from CSV/Excel files",
        icon: <FileSpreadsheet className="h-4 w-4 mr-2" />,
      },
      {
        type: "db-pull",
        label: "Database Pull",
        description: "Query data from PostgreSQL",
        icon: <Database className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "adapters",
    name: "Adapters & Preprocessing",
    nodes: [
      {
        type: "json-converter",
        label: "JSON-to-Tabular",
        description: "Convert JSON to tabular format",
        icon: <Json className="h-4 w-4 mr-2" />,
      },
      {
        type: "text-cleaning",
        label: "Text Cleaning",
        description: "Clean and tokenize text data",
        icon: <Text className="h-4 w-4 mr-2" />,
      },
      {
        type: "language-detector",
        label: "Language Detector",
        description: "Auto-detect text language",
        icon: <Languages className="h-4 w-4 mr-2" />,
      },
      {
        type: "entity-recognizer",
        label: "Named-Entity Recognizer",
        description: "Extract entities from text",
        icon: <Tag className="h-4 w-4 mr-2" />,
      },
      {
        type: "sentiment-analysis",
        label: "Sentiment Analysis",
        description: "Analyze text sentiment",
        icon: <ThumbsUp className="h-4 w-4 mr-2" />,
      },
      {
        type: "summarization",
        label: "Summarization",
        description: "Condense long documents",
        icon: <FileText className="h-4 w-4 mr-2" />,
      },
      {
        type: "translator",
        label: "Translator",
        description: "Translate text to target language",
        icon: <Globe className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "processing",
    name: "Processing & Orchestration",
    nodes: [
      {
        type: "embedding",
        label: "Embedding Generation",
        description: "Generate vector embeddings",
        icon: <Vector className="h-4 w-4 mr-2" />,
      },
      {
        type: "data-enrichment",
        label: "Data Enrichment",
        description: "Enrich data with external sources",
        icon: <Building2 className="h-4 w-4 mr-2" />,
      },
      {
        type: "conditional",
        label: "Conditional Router",
        description: "Route based on conditions",
        icon: <GitBranch className="h-4 w-4 mr-2" />,
      },
      {
        type: "loop",
        label: "Loop Processor",
        description: "Process items in a loop",
        icon: <IterationCcw className="h-4 w-4 mr-2" />,
      },
      {
        type: "error-handler",
        label: "Error Handler",
        description: "Handle errors in the workflow",
        icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "models",
    name: "Model & Agent Wrappers",
    nodes: [
      {
        type: "llm",
        label: "LLM Prompt",
        description: "Process with language models",
        icon: <MessageSquare className="h-4 w-4 mr-2" />,
      },
      {
        type: "ml-model",
        label: "ML Model",
        description: "Classification/Regression model",
        icon: <Brain className="h-4 w-4 mr-2" />,
      },
      {
        type: "embedding-search",
        label: "Embeddings Search",
        description: "Search vector embeddings",
        icon: <Search className="h-4 w-4 mr-2" />,
      },
      {
        type: "agent",
        label: "Stateful Agent",
        description: "Agent with memory management",
        icon: <Memory className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "advanced-models",
    name: "Advanced Model & Agent Helpers",
    nodes: [
      {
        type: "chain-of-thought",
        label: "Chain-of-Thought Debugger",
        description: "Expose LLM reasoning steps",
        icon: <Lightbulb className="h-4 w-4 mr-2" />,
      },
      {
        type: "tool-selector",
        label: "Tool Selector",
        description: "Dynamically pick tools",
        icon: <Wrench className="h-4 w-4 mr-2" />,
      },
      {
        type: "batch-inference",
        label: "Batch Inference",
        description: "Process records in batch",
        icon: <Layers className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "integrations",
    name: "Integrations & Actions",
    nodes: [
      {
        type: "google-sheets",
        label: "Google Sheets",
        description: "Update Google Sheets",
        icon: <Table className="h-4 w-4 mr-2" />,
      },
      {
        type: "twilio-sms",
        label: "Twilio SMS",
        description: "Send SMS messages",
        icon: <MessageCircle className="h-4 w-4 mr-2" />,
      },
      {
        type: "google-calendar",
        label: "Google Calendar",
        description: "Create calendar events",
        icon: <Calendar className="h-4 w-4 mr-2" />,
      },
      {
        type: "slack-reaction",
        label: "Slack Reaction",
        description: "Post to Slack with reactions",
        icon: <Slack className="h-4 w-4 mr-2" />,
      },
      {
        type: "s3-uploader",
        label: "S3 Uploader",
        description: "Upload files to S3",
        icon: <Upload className="h-4 w-4 mr-2" />,
      },
      {
        type: "email",
        label: "Email Send",
        description: "Send emails via SMTP",
        icon: <Mail className="h-4 w-4 mr-2" />,
      },
      {
        type: "slack",
        label: "Slack Message",
        description: "Send messages to Slack",
        icon: <Slack className="h-4 w-4 mr-2" />,
      },
      {
        type: "dashboard",
        label: "Dashboard Update",
        description: "Update dashboard via HTTP",
        icon: <BarChart3 className="h-4 w-4 mr-2" />,
      },
      {
        type: "db-write",
        label: "Database Write",
        description: "Write data to PostgreSQL",
        icon: <Database className="h-4 w-4 mr-2" />,
      },
    ],
  },
  {
    id: "utility",
    name: "Utility & DevOps",
    nodes: [
      {
        type: "cache",
        label: "Cache & Rate-Limiter",
        description: "Cache responses and limit rates",
        icon: <Database className="h-4 w-4 mr-2" />,
      },
      {
        type: "error-notifier",
        label: "Error Notifier",
        description: "Notify on workflow failures",
        icon: <Bell className="h-4 w-4 mr-2" />,
      },
      {
        type: "data-validator",
        label: "Data Validator",
        description: "Validate data with schemas",
        icon: <CheckCircle className="h-4 w-4 mr-2" />,
      },
      {
        type: "logging",
        label: "Logging & Monitoring",
        description: "Log events and metrics",
        icon: <Gauge className="h-4 w-4 mr-2" />,
      },
    ],
  },
]

export default function NodeLibrary() {
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex flex-col gap-2">
      <Accordion
        type="multiple"
        defaultValue={[
          "triggers",
          "io",
          "adapters",
          "processing",
          "models",
          "advanced-models",
          "integrations",
          "utility",
        ]}
        className="w-full"
      >
        {nodeCategories.map((category) => (
          <AccordionItem value={category.id} key={category.id}>
            <AccordionTrigger className="text-sm py-2">{category.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pt-2">
                {category.nodes.map((node) => (
                  <Button
                    key={node.type}
                    variant="outline"
                    className="justify-start text-left h-auto py-2"
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                  >
                    {node.icon}
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{node.label}</span>
                      <span className="text-xs text-gray-500">{node.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4 text-xs text-gray-500">Drag and drop nodes onto the canvas to build your workflow</div>
    </div>
  )
}
