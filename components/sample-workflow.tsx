"use client"

import { useEffect } from "react"
import { useNodesState, useEdgesState } from "reactflow"
import { createNode, generateNodeId } from "@/lib/workflow-utils"

// Sample workflow that demonstrates the new node types
export function useSampleWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    // Create nodes for the sample workflow
    const webhookNode = createNode({
      type: "webhook",
      position: { x: 100, y: 100 },
      id: generateNodeId("webhook"),
    })

    const textCleaningNode = createNode({
      type: "text-cleaning",
      position: { x: 100, y: 250 },
      id: generateNodeId("text-cleaning"),
    })

    const embeddingNode = createNode({
      type: "embedding",
      position: { x: 100, y: 400 },
      id: generateNodeId("embedding"),
    })

    const embeddingSearchNode = createNode({
      type: "embedding-search",
      position: { x: 400, y: 400 },
      id: generateNodeId("embedding-search"),
    })

    const llmNode = createNode({
      type: "llm",
      position: { x: 400, y: 550 },
      id: generateNodeId("llm"),
    })

    const conditionalNode = createNode({
      type: "conditional",
      position: { x: 400, y: 700 },
      id: generateNodeId("conditional"),
    })

    const emailNode = createNode({
      type: "email",
      position: { x: 250, y: 850 },
      id: generateNodeId("email"),
    })

    const slackNode = createNode({
      type: "slack",
      position: { x: 550, y: 850 },
      id: generateNodeId("slack"),
    })

    // Update node data with custom values
    webhookNode.data = {
      ...webhookNode.data,
      label: "Incoming Request",
      description: "Listen for incoming data",
      webhookPath: "/api/data-processor",
    }

    textCleaningNode.data = {
      ...textCleaningNode.data,
      label: "Clean Text",
      description: "Preprocess incoming text",
      cleaningOperations: ["lowercase", "remove_punctuation", "remove_stopwords"],
    }

    embeddingNode.data = {
      ...embeddingNode.data,
      label: "Generate Embeddings",
      description: "Convert text to vector embeddings",
      embeddingModel: "text-embedding-3-large",
      dimensions: 1536,
    }

    embeddingSearchNode.data = {
      ...embeddingSearchNode.data,
      label: "Search Knowledge Base",
      description: "Find relevant information",
      vectorStore: "pinecone",
      topK: 3,
    }

    llmNode.data = {
      ...llmNode.data,
      label: "Generate Response",
      description: "Create AI response",
      modelName: "gpt-4o",
      systemPrompt: "You are a helpful assistant that provides accurate information based on the retrieved context.",
      promptTemplate:
        "Question: {{question}}\n\nContext: {{context}}\n\nAnswer the question based on the context provided.",
    }

    conditionalNode.data = {
      ...conditionalNode.data,
      label: "Check Confidence",
      description: "Route based on confidence score",
      condition: "data.confidence > 0.8",
      trueLabel: "High Confidence",
      falseLabel: "Low Confidence",
    }

    emailNode.data = {
      ...emailNode.data,
      label: "Send Email",
      description: "Send high confidence responses",
      emailSubject: "AI Response (High Confidence)",
      emailBody: "Here is the AI-generated response with high confidence: {{response}}",
    }

    slackNode.data = {
      ...slackNode.data,
      label: "Send to Review",
      description: "Send low confidence for review",
      slackChannel: "#ai-review",
      slackMessage: "Low confidence response needs review: {{response}}",
    }

    // Set the nodes
    setNodes([
      webhookNode,
      textCleaningNode,
      embeddingNode,
      embeddingSearchNode,
      llmNode,
      conditionalNode,
      emailNode,
      slackNode,
    ])

    // Create edges to connect the nodes
    const newEdges = [
      {
        id: "webhook-to-cleaning",
        source: webhookNode.id,
        sourceHandle: "payload",
        target: textCleaningNode.id,
        targetHandle: "text",
        type: "custom",
      },
      {
        id: "cleaning-to-embedding",
        source: textCleaningNode.id,
        sourceHandle: "cleaned_text",
        target: embeddingNode.id,
        targetHandle: "text",
        type: "custom",
      },
      {
        id: "embedding-to-search",
        source: embeddingNode.id,
        sourceHandle: "embeddings",
        target: embeddingSearchNode.id,
        targetHandle: "query_embedding",
        type: "custom",
      },
      {
        id: "search-to-llm",
        source: embeddingSearchNode.id,
        sourceHandle: "results",
        target: llmNode.id,
        targetHandle: "variables",
        type: "custom",
      },
      {
        id: "llm-to-conditional",
        source: llmNode.id,
        sourceHandle: "response",
        target: conditionalNode.id,
        targetHandle: "data",
        type: "custom",
      },
      {
        id: "conditional-to-email",
        source: conditionalNode.id,
        sourceHandle: "true",
        target: emailNode.id,
        targetHandle: "data",
        type: "custom",
      },
      {
        id: "conditional-to-slack",
        source: conditionalNode.id,
        sourceHandle: "false",
        target: slackNode.id,
        targetHandle: "data",
        type: "custom",
      },
    ]

    setEdges(newEdges)
  }, [setNodes, setEdges])

  return { nodes, edges, onNodesChange, onEdgesChange }
}
