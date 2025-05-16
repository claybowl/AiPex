import type { Node, XYPosition } from "reactflow"
import type { NodeData } from "./types"

let nodeIdCounter = 0

export const generateNodeId = (type: string): string => {
  nodeIdCounter++
  return `${type}-${nodeIdCounter}`
}

export const createNode = ({
  type,
  position,
  id,
}: {
  type: string
  position: XYPosition
  id: string
}): Node<NodeData> => {
  const baseNode = {
    id,
    type,
    position,
    data: {
      label: getDefaultLabel(type),
      description: getDefaultDescription(type),
    },
  }

  switch (type) {
    // Trigger & Scheduler Nodes
    case "scheduled-trigger":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          schedule: "0 * * * *", // Every hour
          timezone: "UTC",
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          inputs: [],
          outputs: ["trigger"],
          parameters: {
            schedule: { type: "string", default: "0 * * * *" },
            timezone: { type: "string", default: "UTC" },
          },
        },
      }
    case "file-watcher":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          watchPath: "/path/to/watch",
          filePattern: "*.csv",
          includeSubfolders: true,
          inputs: [],
          outputs: ["file", "error"],
          parameters: {
            watchPath: { type: "string", default: "/path/to/watch" },
            filePattern: { type: "string", default: "*.csv" },
            includeSubfolders: { type: "boolean", default: true },
          },
        },
      }
    case "email-trigger":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          emailAddress: "workflow@example.com",
          emailSubjectFilter: "",
          emailFromFilter: "",
          includeAttachments: true,
          inputs: [],
          outputs: ["email", "attachments", "error"],
          parameters: {
            emailAddress: { type: "string", default: "workflow@example.com" },
            emailSubjectFilter: { type: "string", default: "" },
            emailFromFilter: { type: "string", default: "" },
            includeAttachments: { type: "boolean", default: true },
          },
        },
      }

    // Data & I/O Connectors
    case "rest-api":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          method: "GET",
          url: "https://api.example.com/data",
          headers: { "Content-Type": "application/json" },
          authentication: { type: "none" },
          inputs: ["trigger"],
          outputs: ["data", "error"],
          parameters: {
            method: { type: "string", default: "GET" },
            url: { type: "string", default: "https://api.example.com/data" },
            headers: { type: "object", default: { "Content-Type": "application/json" } },
            authentication: { type: "object", default: { type: "none" } },
          },
        },
      }
    case "csv-upload":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          fileType: "csv",
          delimiter: ",",
          hasHeader: true,
          inputs: ["file"],
          outputs: ["data", "error"],
          parameters: {
            fileType: { type: "string", default: "csv" },
            delimiter: { type: "string", default: "," },
            hasHeader: { type: "boolean", default: true },
          },
        },
      }
    case "db-pull":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          dbType: "postgresql",
          connectionString: "postgresql://user:password@localhost:5432/database",
          query: "SELECT * FROM table LIMIT 100",
          inputs: ["query"],
          outputs: ["data", "error"],
          parameters: {
            dbType: { type: "string", default: "postgresql" },
            connectionString: { type: "string", default: "postgresql://user:password@localhost:5432/database" },
            query: { type: "string", default: "SELECT * FROM table LIMIT 100" },
          },
        },
      }
    case "webhook":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          webhookPath: "/webhook/incoming",
          responseTemplate: '{"status": "success"}',
          inputs: [],
          outputs: ["payload", "error"],
          parameters: {
            webhookPath: { type: "string", default: "/webhook/incoming" },
            responseTemplate: { type: "string", default: '{"status": "success"}' },
          },
        },
      }

    // Adapters
    case "json-converter":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          jsonPath: "$.data",
          flattenNested: true,
          inputs: ["json"],
          outputs: ["table", "error"],
          parameters: {
            jsonPath: { type: "string", default: "$.data" },
            flattenNested: { type: "boolean", default: true },
          },
        },
      }
    case "text-cleaning":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          cleaningOperations: ["lowercase", "remove_punctuation", "remove_stopwords"],
          customRegex: "",
          inputs: ["text"],
          outputs: ["cleaned_text", "error"],
          parameters: {
            cleaningOperations: {
              type: "array",
              default: ["lowercase", "remove_punctuation", "remove_stopwords"],
              options: ["lowercase", "remove_punctuation", "remove_stopwords", "stemming", "lemmatization"],
            },
            customRegex: { type: "string", default: "" },
          },
        },
      }

    // Data Enrichment & Preprocessing
    case "language-detector":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          confidenceThreshold: 0.7,
          supportedLanguages: ["en", "es", "fr", "de", "zh", "ja", "ko", "ru", "ar"],
          inputs: ["text"],
          outputs: ["detected_language", "error"],
          parameters: {
            confidenceThreshold: { type: "number", default: 0.7 },
            supportedLanguages: {
              type: "array",
              default: ["en", "es", "fr", "de", "zh", "ja", "ko", "ru", "ar"],
            },
          },
        },
      }
    case "entity-recognizer":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          entityTypes: ["person", "organization", "location", "date"],
          nerModel: "en_core_web_sm",
          inputs: ["text"],
          outputs: ["entities", "error"],
          parameters: {
            entityTypes: {
              type: "array",
              default: ["person", "organization", "location", "date"],
              options: ["person", "organization", "location", "date", "money", "percent", "time", "custom"],
            },
            nerModel: { type: "string", default: "en_core_web_sm" },
          },
        },
      }
    case "sentiment-analysis":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          sentimentScale: "five-point",
          aspectsToAnalyze: ["overall", "service", "price", "quality"],
          inputs: ["text"],
          outputs: ["sentiment", "error"],
          parameters: {
            sentimentScale: {
              type: "string",
              default: "five-point",
              options: ["binary", "five-point", "continuous"],
            },
            aspectsToAnalyze: {
              type: "array",
              default: ["overall", "service", "price", "quality"],
            },
          },
        },
      }
    case "summarization":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          maxSummaryLength: 200,
          summaryType: "abstractive",
          summaryModel: "gpt-4o",
          inputs: ["text"],
          outputs: ["summary", "error"],
          parameters: {
            maxSummaryLength: { type: "number", default: 200 },
            summaryType: {
              type: "string",
              default: "abstractive",
              options: ["extractive", "abstractive"],
            },
            summaryModel: { type: "string", default: "gpt-4o" },
          },
        },
      }
    case "translator":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          sourceLanguage: "auto",
          targetLanguage: "en",
          translationModel: "google-translate",
          preserveFormatting: true,
          inputs: ["text"],
          outputs: ["translated_text", "error"],
          parameters: {
            sourceLanguage: { type: "string", default: "auto" },
            targetLanguage: { type: "string", default: "en" },
            translationModel: { type: "string", default: "google-translate" },
            preserveFormatting: { type: "boolean", default: true },
          },
        },
      }
    case "embedding":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          embeddingModel: "text-embedding-ada-002",
          dimensions: 1536,
          batchSize: 100,
          inputs: ["text"],
          outputs: ["embeddings", "error"],
          parameters: {
            embeddingModel: { type: "string", default: "text-embedding-ada-002" },
            dimensions: { type: "number", default: 1536 },
            batchSize: { type: "number", default: 100 },
          },
        },
      }
    case "data-enrichment":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          enrichmentSource: "company-api",
          enrichmentKey: "domain",
          inputs: ["data"],
          outputs: ["enriched_data", "error"],
          parameters: {
            enrichmentSource: { type: "string", default: "company-api" },
            enrichmentKey: { type: "string", default: "domain" },
          },
        },
      }

    // Processing & Orchestration
    case "conditional":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          condition: "data.value > 10",
          trueLabel: "Yes",
          falseLabel: "No",
          inputs: ["data"],
          outputs: ["true", "false"],
          parameters: {
            condition: { type: "string", default: "data.value > 10" },
            trueLabel: { type: "string", default: "Yes" },
            falseLabel: { type: "string", default: "No" },
          },
        },
      }
    case "loop":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          loopType: "for-each",
          maxIterations: 100,
          inputs: ["items"],
          outputs: ["item", "completed", "error"],
          parameters: {
            loopType: {
              type: "string",
              default: "for-each",
              options: ["for-each", "while", "do-while"],
            },
            maxIterations: { type: "number", default: 100 },
          },
        },
      }
    case "error-handler":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          errorTypes: ["API", "Database", "Timeout"],
          retryCount: 3,
          fallbackValue: '{"status": "error", "fallback": true}',
          inputs: ["operation"],
          outputs: ["result", "error"],
          parameters: {
            errorTypes: {
              type: "array",
              default: ["API", "Database", "Timeout"],
            },
            retryCount: { type: "number", default: 3 },
            fallbackValue: { type: "string", default: '{"status": "error", "fallback": true}' },
          },
        },
      }

    // Model & Agent Wrappers
    case "llm":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          modelName: "gpt-4o",
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: "You are a helpful AI assistant.",
          promptTemplate: "Answer the following question: {{question}}",
          inputs: ["variables"],
          outputs: ["response", "error"],
          parameters: {
            modelName: { type: "string", default: "gpt-4o" },
            temperature: { type: "number", default: 0.7 },
            maxTokens: { type: "number", default: 1000 },
            systemPrompt: { type: "string", default: "You are a helpful AI assistant." },
            promptTemplate: { type: "string", default: "Answer the following question: {{question}}" },
          },
        },
      }
    case "ml-model":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          mlModelType: "classification",
          mlModelEndpoint: "https://api.example.com/model/predict",
          mlModelParameters: { version: "1.0" },
          inputs: ["features"],
          outputs: ["prediction", "error"],
          parameters: {
            mlModelType: {
              type: "string",
              default: "classification",
              options: ["classification", "regression", "clustering"],
            },
            mlModelEndpoint: { type: "string", default: "https://api.example.com/model/predict" },
            mlModelParameters: { type: "object", default: { version: "1.0" } },
          },
        },
      }
    case "embedding-search":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          vectorStore: "pinecone",
          similarityMetric: "cosine",
          topK: 5,
          inputs: ["query_embedding"],
          outputs: ["results", "error"],
          parameters: {
            vectorStore: { type: "string", default: "pinecone" },
            similarityMetric: {
              type: "string",
              default: "cosine",
              options: ["cosine", "euclidean", "dot"],
            },
            topK: { type: "number", default: 5 },
          },
        },
      }
    case "agent":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          agentType: "conversational",
          memoryType: "buffer",
          contextWindow: 10,
          memoryKey: "chat_history",
          inputs: ["input", "context"],
          outputs: ["response", "error"],
          parameters: {
            agentType: { type: "string", default: "conversational" },
            memoryType: {
              type: "string",
              default: "buffer",
              options: ["buffer", "summary", "vector", "window"],
            },
            contextWindow: { type: "number", default: 10 },
            memoryKey: { type: "string", default: "chat_history" },
          },
        },
      }

    // Advanced Model & Agent Helpers
    case "cot-debugger":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          debugSteps: true,
          logIntermediateSteps: true,
          visualizeThinking: true,
          inputs: ["llm_input"],
          outputs: ["llm_output", "debug_info", "error"],
          parameters: {
            debugSteps: { type: "boolean", default: true },
            logIntermediateSteps: { type: "boolean", default: true },
            visualizeThinking: { type: "boolean", default: true },
          },
        },
      }
    case "tool-selector":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          availableTools: ["search", "calculator", "weather", "database"],
          selectionStrategy: "llm",
          toolDescriptions: {
            search: "Search the web for information",
            calculator: "Perform mathematical calculations",
            weather: "Get weather information for a location",
            database: "Query a database for information",
          },
          inputs: ["query"],
          outputs: ["selected_tool", "error"],
          parameters: {
            availableTools: {
              type: "array",
              default: ["search", "calculator", "weather", "database"],
            },
            selectionStrategy: {
              type: "string",
              default: "llm",
              options: ["llm", "rule-based", "ml"],
            },
            toolDescriptions: {
              type: "object",
              default: {
                search: "Search the web for information",
                calculator: "Perform mathematical calculations",
                weather: "Get weather information for a location",
                database: "Query a database for information",
              },
            },
          },
        },
      }
    case "batch-inference":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          batchSize: 50,
          parallelism: 5,
          timeoutPerBatch: 30000,
          inputs: ["records"],
          outputs: ["results", "error"],
          parameters: {
            batchSize: { type: "number", default: 50 },
            parallelism: { type: "number", default: 5 },
            timeoutPerBatch: { type: "number", default: 30000 },
          },
        },
      }

    // Integrations & Actions
    case "google-sheets":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
          sheetName: "Sheet1",
          updateRange: "A:Z",
          updateType: "append",
          inputs: ["data"],
          outputs: ["updated", "error"],
          parameters: {
            spreadsheetId: { type: "string", default: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" },
            sheetName: { type: "string", default: "Sheet1" },
            updateRange: { type: "string", default: "A:Z" },
            updateType: {
              type: "string",
              default: "append",
              options: ["append", "update", "upsert"],
            },
          },
        },
      }
    case "twilio-sms":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          twilioAccountSid: "AC123456789",
          twilioAuthToken: "auth_token",
          twilioFromNumber: "+15551234567",
          twilioToNumber: "+15557654321",
          smsMessage: "Hello from your workflow!",
          waitForReply: false,
          inputs: ["message_data"],
          outputs: ["sent", "reply", "error"],
          parameters: {
            twilioAccountSid: { type: "string", default: "AC123456789" },
            twilioAuthToken: { type: "string", default: "auth_token" },
            twilioFromNumber: { type: "string", default: "+15551234567" },
            twilioToNumber: { type: "string", default: "+15557654321" },
            smsMessage: { type: "string", default: "Hello from your workflow!" },
            waitForReply: { type: "boolean", default: false },
          },
        },
      }
    case "google-calendar":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          calendarId: "primary",
          eventTitle: "Meeting",
          eventDescription: "Scheduled by workflow",
          eventStart: "",
          eventEnd: "",
          attendees: [],
          inputs: ["event_data"],
          outputs: ["created", "error"],
          parameters: {
            calendarId: { type: "string", default: "primary" },
            eventTitle: { type: "string", default: "Meeting" },
            eventDescription: { type: "string", default: "Scheduled by workflow" },
            eventStart: { type: "string", default: "" },
            eventEnd: { type: "string", default: "" },
            attendees: { type: "array", default: [] },
          },
        },
      }
    case "slack-reaction":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          slackToken: "xoxb-your-token",
          slackChannel: "#general",
          slackThreadTs: "",
          slackReactions: ["thumbsup", "white_check_mark"],
          inputs: ["message_data"],
          outputs: ["posted", "error"],
          parameters: {
            slackToken: { type: "string", default: "xoxb-your-token" },
            slackChannel: { type: "string", default: "#general" },
            slackThreadTs: { type: "string", default: "" },
            slackReactions: { type: "array", default: ["thumbsup", "white_check_mark"] },
          },
        },
      }
    case "s3-uploader":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          s3BucketName: "my-bucket",
          s3ObjectKey: "uploads/{{filename}}",
          s3Region: "us-east-1",
          s3ContentType: "application/octet-stream",
          s3ACL: "private",
          inputs: ["file_data"],
          outputs: ["uploaded", "error"],
          parameters: {
            s3BucketName: { type: "string", default: "my-bucket" },
            s3ObjectKey: { type: "string", default: "uploads/{{filename}}" },
            s3Region: { type: "string", default: "us-east-1" },
            s3ContentType: { type: "string", default: "application/octet-stream" },
            s3ACL: { type: "string", default: "private" },
          },
        },
      }
    case "email":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          smtpServer: "smtp.example.com:587",
          emailFrom: "workflow@example.com",
          emailTo: "recipient@example.com",
          emailSubject: "Workflow Notification",
          emailBody: "This is an automated message from your workflow.",
          inputs: ["data"],
          outputs: ["sent", "error"],
          parameters: {
            smtpServer: { type: "string", default: "smtp.example.com:587" },
            emailFrom: { type: "string", default: "workflow@example.com" },
            emailTo: { type: "string", default: "recipient@example.com" },
            emailSubject: { type: "string", default: "Workflow Notification" },
            emailBody: { type: "string", default: "This is an automated message from your workflow." },
          },
        },
      }
    case "slack":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          slackWebhook: "https://hooks.slack.com/services/XXX/YYY/ZZZ",
          slackChannel: "#notifications",
          slackMessage: "Workflow update: {{message}}",
          inputs: ["data"],
          outputs: ["sent", "error"],
          parameters: {
            slackWebhook: { type: "string", default: "https://hooks.slack.com/services/XXX/YYY/ZZZ" },
            slackChannel: { type: "string", default: "#notifications" },
            slackMessage: { type: "string", default: "Workflow update: {{message}}" },
          },
        },
      }
    case "dashboard":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          dashboardUrl: "https://dashboard.example.com/api/update",
          dashboardPayload: '{"widget": "{{widget}}", "value": {{value}}}',
          inputs: ["data"],
          outputs: ["updated", "error"],
          parameters: {
            dashboardUrl: { type: "string", default: "https://dashboard.example.com/api/update" },
            dashboardPayload: { type: "string", default: '{"widget": "{{widget}}", "value": {{value}}}' },
          },
        },
      }
    case "db-write":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          dbType: "postgresql",
          writeConnectionString: "postgresql://user:password@localhost:5432/database",
          writeTable: "results",
          writeOperation: "insert",
          inputs: ["data"],
          outputs: ["result", "error"],
          parameters: {
            dbType: { type: "string", default: "postgresql" },
            writeConnectionString: { type: "string", default: "postgresql://user:password@localhost:5432/database" },
            writeTable: { type: "string", default: "results" },
            writeOperation: {
              type: "string",
              default: "insert",
              options: ["insert", "update", "upsert", "delete"],
            },
          },
        },
      }

    // Utility & DevOps
    case "cache-limiter":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          cacheExpiration: 3600,
          cacheKey: "{{request.url}}",
          requestsPerMinute: 60,
          rateLimitBehavior: "queue",
          inputs: ["request"],
          outputs: ["response", "error"],
          parameters: {
            cacheExpiration: { type: "number", default: 3600 },
            cacheKey: { type: "string", default: "{{request.url}}" },
            requestsPerMinute: { type: "number", default: 60 },
            rateLimitBehavior: {
              type: "string",
              default: "queue",
              options: ["queue", "error", "drop"],
            },
          },
        },
      }
    case "error-notifier":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          notificationChannels: ["email", "slack"],
          errorSeverityLevels: ["error", "critical"],
          includeStackTrace: true,
          inputs: ["error"],
          outputs: ["notified"],
          parameters: {
            notificationChannels: {
              type: "array",
              default: ["email", "slack"],
              options: ["email", "slack", "webhook"],
            },
            errorSeverityLevels: {
              type: "array",
              default: ["error", "critical"],
              options: ["info", "warning", "error", "critical"],
            },
            includeStackTrace: { type: "boolean", default: true },
          },
        },
      }
    case "data-validator":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          validationSchema:
            '{"type": "object", "required": ["name", "email"], "properties": {"name": {"type": "string"}, "email": {"type": "string", "format": "email"}}}',
          validationRules: {
            email: "isEmail",
            phone: "matches(/^\\+?[0-9]{10,15}$/)",
          },
          onValidationFailure: "route",
          inputs: ["data"],
          outputs: ["valid", "invalid", "error"],
          parameters: {
            validationSchema: {
              type: "string",
              default:
                '{"type": "object", "required": ["name", "email"], "properties": {"name": {"type": "string"}, "email": {"type": "string", "format": "email"}}}',
            },
            validationRules: {
              type: "object",
              default: {
                email: "isEmail",
                phone: "matches(/^\\+?[0-9]{10,15}$/)",
              },
            },
            onValidationFailure: {
              type: "string",
              default: "route",
              options: ["error", "warn", "route"],
            },
          },
        },
      }
    case "logging":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          logLevel: "info",
          metricName: "workflow_execution",
          metricValue: 1,
          inputs: ["data"],
          outputs: ["logged"],
          parameters: {
            logLevel: {
              type: "string",
              default: "info",
              options: ["debug", "info", "warning", "error"],
            },
            metricName: { type: "string", default: "workflow_execution" },
            metricValue: { type: "number", default: 1 },
          },
        },
      }

    // Legacy nodes
    case "input":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          inputType: "text",
          samplePrompt: "What can you help me with today?",
        },
      }
    case "output":
      return {
        ...baseNode,
        data: {
          ...baseNode.data,
          outputFormat: "text",
          streaming: true,
        },
      }
    default:
      return baseNode
  }
}

const getDefaultLabel = (type: string): string => {
  switch (type) {
    // Trigger & Scheduler Nodes
    case "scheduled-trigger":
      return "Scheduled Trigger"
    case "file-watcher":
      return "File Watcher"
    case "email-trigger":
      return "Email Inbound Trigger"

    // Data & I/O Connectors
    case "rest-api":
      return "REST API"
    case "csv-upload":
      return "CSV/Excel Upload"
    case "db-pull":
      return "Database Pull"
    case "webhook":
      return "Webhook Listener"

    // Adapters
    case "json-converter":
      return "JSON-to-Tabular"
    case "text-cleaning":
      return "Text Cleaning"

    // Data Enrichment & Preprocessing
    case "language-detector":
      return "Language Detector"
    case "entity-recognizer":
      return "Named-Entity Recognizer"
    case "sentiment-analysis":
      return "Sentiment Analysis"
    case "summarization":
      return "Summarization"
    case "translator":
      return "Translator"
    case "embedding":
      return "Embedding Generation"
    case "data-enrichment":
      return "Data Enrichment"

    // Processing & Orchestration
    case "conditional":
      return "Conditional Router"
    case "loop":
      return "Loop Processor"
    case "error-handler":
      return "Error Handler"

    // Advanced Model & Agent Helpers
    case "cot-debugger":
      return "Chain-of-Thought Debugger"
    case "tool-selector":
      return "Tool Selector"
    case "batch-inference":
      return "Batch Inference"

    // Model & Agent Wrappers
    case "llm":
      return "LLM Prompt"
    case "ml-model":
      return "ML Model"
    case "embedding-search":
      return "Embeddings Search"
    case "agent":
      return "Stateful Agent"

    // Integrations & Actions
    case "google-sheets":
      return "Google Sheets"
    case "twilio-sms":
      return "Twilio SMS"
    case "google-calendar":
      return "Google Calendar"
    case "slack-reaction":
      return "Slack Reaction"
    case "s3-uploader":
      return "S3 Uploader"
    case "email":
      return "Email Send"
    case "slack":
      return "Slack Message"
    case "dashboard":
      return "Dashboard Update"
    case "db-write":
      return "Database Write"

    // Utility & DevOps
    case "cache-limiter":
      return "Cache & Rate-Limiter"
    case "error-notifier":
      return "Error Notifier"
    case "data-validator":
      return "Data Validator"
    case "logging":
      return "Logging & Monitoring"

    // Legacy nodes
    case "input":
      return "User Input"
    case "output":
      return "Response"
    case "memory":
      return "Memory"
    case "tool":
      return "Tool"
    case "rag":
      return "RAG"
    case "chain":
      return "Chain"

    default:
      return "Node"
  }
}

const getDefaultDescription = (type: string): string => {
  switch (type) {
    // Trigger & Scheduler Nodes
    case "scheduled-trigger":
      return "Run workflow on schedule"
    case "file-watcher":
      return "Watch for new files"
    case "email-trigger":
      return "Trigger on email receipt"

    // Data & I/O Connectors
    case "rest-api":
      return "Connect to REST API endpoints"
    case "csv-upload":
      return "Import data from CSV/Excel files"
    case "db-pull":
      return "Query data from PostgreSQL"
    case "webhook":
      return "Listen for incoming webhooks"

    // Adapters
    case "json-converter":
      return "Convert JSON to tabular format"
    case "text-cleaning":
      return "Clean and tokenize text data"

    // Data Enrichment & Preprocessing
    case "language-detector":
      return "Auto-detect text language"
    case "entity-recognizer":
      return "Extract entities from text"
    case "sentiment-analysis":
      return "Analyze text sentiment"
    case "summarization":
      return "Condense long documents"
    case "translator":
      return "Translate text to target language"
    case "embedding":
      return "Generate vector embeddings"
    case "data-enrichment":
      return "Enrich data with external sources"

    // Processing & Orchestration
    case "conditional":
      return "Route based on conditions"
    case "loop":
      return "Process items in a loop"
    case "error-handler":
      return "Handle errors in the workflow"

    // Advanced Model & Agent Helpers
    case "cot-debugger":
      return "Expose LLM reasoning steps"
    case "tool-selector":
      return "Dynamically pick tools"
    case "batch-inference":
      return "Process records in batch"

    // Model & Agent Wrappers
    case "llm":
      return "Process with language models"
    case "ml-model":
      return "Classification/Regression model"
    case "embedding-search":
      return "Search vector embeddings"
    case "agent":
      return "Agent with memory management"

    // Integrations & Actions
    case "google-sheets":
      return "Update Google Sheets"
    case "twilio-sms":
      return "Send SMS messages"
    case "google-calendar":
      return "Create calendar events"
    case "slack-reaction":
      return "Post to Slack with reactions"
    case "s3-uploader":
      return "Upload files to S3"
    case "email":
      return "Send emails via SMTP"
    case "slack":
      return "Send messages to Slack"
    case "dashboard":
      return "Update dashboard via HTTP"
    case "db-write":
      return "Write data to PostgreSQL"

    // Utility & DevOps
    case "cache-limiter":
      return "Cache responses and limit rates"
    case "error-notifier":
      return "Notify on workflow failures"
    case "data-validator":
      return "Validate data with schemas"
    case "logging":
      return "Log events and metrics"

    // Legacy nodes
    case "input":
      return "Starting point for user queries"
    case "output":
      return "Final agent response"
    case "memory":
      return "Store conversation history"
    case "tool":
      return "External tool or API call"
    case "rag":
      return "Retrieval Augmented Generation"
    case "conditional":
      return "Conditional branching"
    case "chain":
      return "Combine multiple steps"

    default:
      return "Workflow node"
  }
}
