import type { Node } from "reactflow"

export interface NodeData {
  label: string
  description?: string
  required?: boolean

  // Common properties
  inputs?: string[]
  outputs?: string[]
  parameters?: Record<string, any>

  // Trigger & Scheduler Nodes
  // Scheduled Trigger
  schedule?: string
  timezone?: string
  lastRun?: string
  nextRun?: string

  // File Watcher
  watchPath?: string
  filePattern?: string
  includeSubfolders?: boolean
  s3Bucket?: string
  s3Prefix?: string

  // Email Inbound Trigger
  emailAddress?: string
  emailSubjectFilter?: string
  emailFromFilter?: string
  includeAttachments?: boolean

  // REST API Connector
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  url?: string
  headers?: Record<string, string>
  body?: string
  authentication?: {
    type: "none" | "basic" | "bearer" | "oauth2"
    credentials?: Record<string, string>
  }

  // CSV/Excel Upload
  fileType?: "csv" | "excel"
  delimiter?: string
  hasHeader?: boolean
  sheetName?: string

  // Database Pull
  connectionString?: string
  query?: string
  dbType?: "postgresql" | "mysql" | "mongodb"

  // Webhook Listener
  webhookPath?: string
  responseTemplate?: string

  // JSON-to-Tabular
  jsonPath?: string
  flattenNested?: boolean

  // Text Cleaning
  cleaningOperations?: ("lowercase" | "remove_punctuation" | "remove_stopwords" | "stemming" | "lemmatization")[]
  customRegex?: string

  // Data Enrichment & Preprocessing
  // Language Detector
  confidenceThreshold?: number
  supportedLanguages?: string[]

  // Named-Entity Recognizer
  entityTypes?: ("person" | "organization" | "location" | "date" | "money" | "percent" | "time" | "custom")[]
  nerModel?: string

  // Sentiment & Tone Analysis
  sentimentScale?: "binary" | "five-point" | "continuous"
  aspectsToAnalyze?: string[]

  // Summarization Node
  maxSummaryLength?: number
  summaryType?: "extractive" | "abstractive"
  summaryModel?: string

  // Translator
  sourceLanguage?: string
  targetLanguage?: string
  translationModel?: string
  preserveFormatting?: boolean

  // Embedding Generation
  embeddingModel?: string
  dimensions?: number
  batchSize?: number

  // Data Enrichment
  enrichmentSource?: string
  enrichmentKey?: string

  // Conditional Router
  condition?: string
  trueLabel?: string
  falseLabel?: string

  // Loop Processor
  loopType?: "for-each" | "while" | "do-while"
  maxIterations?: number

  // Error Handler
  errorTypes?: string[]
  retryCount?: number
  fallbackValue?: string

  // Advanced Model & Agent Helpers
  // Chain-of-Thought Debugger
  debugSteps?: boolean
  logIntermediateSteps?: boolean
  visualizeThinking?: boolean

  // Tool-Selector Node
  availableTools?: string[]
  selectionStrategy?: "llm" | "rule-based" | "ml"
  toolDescriptions?: Record<string, string>

  // Batch Inference
  batchSize?: number
  parallelism?: number
  timeoutPerBatch?: number

  // LLM Prompt
  modelName?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  promptTemplate?: string

  // ML Model
  mlModelType?: "classification" | "regression" | "clustering"
  mlModelEndpoint?: string
  mlModelParameters?: Record<string, any>

  // Embeddings Search
  vectorStore?: string
  similarityMetric?: "cosine" | "euclidean" | "dot"
  topK?: number

  // Stateful Agent
  agentType?: string
  memoryType?: "buffer" | "summary" | "vector" | "window"
  contextWindow?: number
  memoryKey?: string

  // Integrations & Actions
  // Google Sheets Updater
  spreadsheetId?: string
  sheetName?: string
  updateRange?: string
  updateType?: "append" | "update" | "upsert"

  // Twilio SMS
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioFromNumber?: string
  twilioToNumber?: string
  smsMessage?: string
  waitForReply?: boolean

  // Google Calendar Event Creator
  calendarId?: string
  eventTitle?: string
  eventDescription?: string
  eventStart?: string
  eventEnd?: string
  attendees?: string[]

  // Slack Reaction & Threader
  slackToken?: string
  slackChannel?: string
  slackThreadTs?: string
  slackReactions?: string[]

  // S3 Uploader
  s3BucketName?: string
  s3ObjectKey?: string
  s3Region?: string
  s3ContentType?: string
  s3ACL?: string

  // Email Send
  smtpServer?: string
  emailFrom?: string
  emailTo?: string
  emailSubject?: string
  emailBody?: string

  // Slack Message
  slackWebhook?: string
  slackMessage?: string

  // Dashboard Update
  dashboardUrl?: string
  dashboardPayload?: string

  // Database Write
  writeConnectionString?: string
  writeTable?: string
  writeOperation?: "insert" | "update" | "upsert" | "delete"

  // Utility & DevOps
  // Cache & Rate-Limiter
  cacheExpiration?: number
  cacheKey?: string
  requestsPerMinute?: number
  rateLimitBehavior?: "queue" | "error" | "drop"

  // Error Notifier
  notificationChannels?: ("email" | "slack" | "webhook")[]
  errorSeverityLevels?: ("info" | "warning" | "error" | "critical")[]
  includeStackTrace?: boolean

  // Data Validator
  validationSchema?: string
  validationRules?: Record<string, string>
  onValidationFailure?: "error" | "warn" | "route"

  // Logging & Monitoring
  logLevel?: "debug" | "info" | "warning" | "error"
  metricName?: string
  metricValue?: number

  // Legacy properties (keeping for backward compatibility)
  inputType?: string
  samplePrompt?: string
  outputFormat?: string
  streaming?: boolean
  dataSource?: string
  retrievalMethod?: string
  chainType?: string
  chainConfig?: string
  toolType?: string
  apiEndpoint?: string
  toolDescription?: string
  processType?: string
  processConfig?: string
  code?: string
  codeLanguage?: string
  sampleData?: string
  outputType?: string
}

export type WorkflowNode = Node<NodeData>

export interface Workflow {
  nodes: WorkflowNode[]
  edges: any[]
}

// Schema for n8n compatibility
export interface N8nNodeSchema {
  name: string
  type: string
  icon: string
  inputs: string[]
  outputs: string[]
  parameters: {
    [key: string]: {
      type: string
      default?: any
      description?: string
      options?: any[]
      required?: boolean
    }
  }
  execute: () => void
}
