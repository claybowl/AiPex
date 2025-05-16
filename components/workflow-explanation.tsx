"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkflowExplanation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Data Processing Workflow</CardTitle>
        <CardDescription>A sample workflow demonstrating the new node types</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          This workflow demonstrates how to build an AI-powered data processing pipeline that receives data via a
          webhook, processes it using various AI components, and routes the response based on confidence.
        </p>

        <div className="space-y-2">
          <h3 className="font-medium">Workflow Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>
              <span className="font-medium">Webhook Listener</span>: Receives incoming data requests at{" "}
              <code>/api/data-processor</code>
            </li>
            <li>
              <span className="font-medium">Text Cleaning</span>: Preprocesses the text by lowercasing, removing
              punctuation and stopwords
            </li>
            <li>
              <span className="font-medium">Embedding Generation</span>: Converts the cleaned text into vector
              embeddings using the text-embedding-3-large model
            </li>
            <li>
              <span className="font-medium">Vector Search</span>: Searches a Pinecone vector database for the top 3
              similar entries
            </li>
            <li>
              <span className="font-medium">LLM Processing</span>: Generates a response using GPT-4o based on the
              retrieved context
            </li>
            <li>
              <span className="font-medium">Conditional Routing</span>: Routes the response based on confidence score
            </li>
            <li>
              <span className="font-medium">Output Actions</span>: Sends high-confidence responses via email and
              low-confidence responses to Slack for review
            </li>
          </ol>
        </div>

        <p>
          This workflow demonstrates how to combine data processing, AI models, and output actions to create a complete
          AI agent that can process requests and respond appropriately.
        </p>
      </CardContent>
    </Card>
  )
}
