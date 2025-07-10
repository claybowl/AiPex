import OpenAI from 'openai'
import { SimpleWorkflowNode, SimpleNodeData, ExecutionContext, PromptChainResult } from './types'

// Simple Workflow Executor - Chain of Prompting
export class SimpleWorkflowExecutor {
  private context: ExecutionContext
  private abortController: AbortController

  constructor() {
    this.context = {
      variables: {},
      previousOutputs: {},
      currentStep: 0,
      totalSteps: 0,
      metadata: {
        startTime: Date.now(),
        currentTime: Date.now(),
        costs: [],
        errors: []
      }
    }
    this.abortController = new AbortController()
  }

  // Set API key for the executor
  setApiKey(apiKey: string): void {
    this.context.metadata.OPENAI_API_KEY = apiKey
  }

  // Execute a simple workflow using chain-of-prompting
  async executeWorkflow(
    nodes: SimpleWorkflowNode[],
    edges: any[],
    initialInput?: any
  ): Promise<PromptChainResult> {
    try {
      // Reset context
      this.context.variables = { ...initialInput }
      this.context.previousOutputs = {}
      this.context.currentStep = 0
      this.context.totalSteps = nodes.length
      this.context.metadata.startTime = Date.now()

      // Build execution order using topological sort
      const executionOrder = this.buildExecutionOrder(nodes, edges)
      
      // Execute nodes in order
      for (const nodeId of executionOrder) {
        if (this.abortController.signal.aborted) {
          throw new Error('Execution aborted')
        }

        const node = nodes.find(n => n.id === nodeId)
        if (!node) continue

        this.context.currentStep++
        this.context.metadata.currentTime = Date.now()

        // Execute the node
        const result = await this.executeNode(node)
        
        // Store the result
        this.context.previousOutputs[nodeId] = result
        
        // Extract variables if specified
        if (node.data.extractedVariables) {
          this.extractVariables(result, node.data.extractedVariables)
        }

        // Handle decision nodes
        if (node.data.type === 'decision') {
          const nextPath = this.evaluateDecision(result, node.data)
          if (nextPath) {
            console.log(`Decision node routed to: ${nextPath}`)
          }
        }
      }

      // Calculate final results
      const finalNode = nodes.find(n => n.data.type === 'output')
      const finalOutput = finalNode ? this.context.previousOutputs[finalNode.id] : null
      
      return {
        success: true,
        finalOutput,
        extractedVariables: this.context.variables,
        executionPath: executionOrder,
        totalCost: this.context.metadata.costs.reduce((sum, cost) => sum + cost.cost, 0),
        totalTime: Date.now() - this.context.metadata.startTime
      }

    } catch (error) {
      return {
        success: false,
        finalOutput: null,
        extractedVariables: this.context.variables,
        executionPath: [],
        totalCost: this.context.metadata.costs.reduce((sum, cost) => sum + cost.cost, 0),
        totalTime: Date.now() - this.context.metadata.startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Execute a single node using OpenAI
  private async executeNode(node: SimpleWorkflowNode): Promise<any> {
    const { data } = node
    
    // Build the prompt with context
    const prompt = this.buildPromptWithContext(data.prompt, data.type)
    
    // Create system prompt based on node type
    const systemPrompt = this.buildSystemPrompt(data.type, data)
    
    // Get API key from context or environment
    const apiKey = process.env.OPENAI_API_KEY || this.context.metadata?.OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required but not provided. Please set OPENAI_API_KEY environment variable or provide it in the workflow context.')
    }
    
    try {
      // Make direct API call instead of using OpenAI client
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.choices[0]?.message?.content
      const parsedResult = result ? JSON.parse(result) : {}
      
      // Calculate cost (approximate)
      const cost = this.calculateCost(responseData.usage)
      this.context.metadata.costs.push({ nodeId: node.id, cost })
      
      return parsedResult
      
    } catch (error) {
      this.context.metadata.errors.push({
        nodeId: node.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  // Build system prompt based on node type
  private buildSystemPrompt(nodeType: string, data: SimpleNodeData): string {
    const basePrompt = `You are an AI assistant helping execute a business workflow. Your task is to process the user's request and return a structured JSON response.`
    
    switch (nodeType) {
      case 'input':
        return `${basePrompt} You are processing input data. Extract and structure the relevant information. Return a JSON object with the processed data and any extracted variables.`
      
      case 'process':
        return `${basePrompt} You are analyzing and processing data. Perform the requested analysis and return a JSON object with your findings, insights, and any extracted information.`
      
      case 'decision':
        return `${basePrompt} You are making decisions based on the provided data. Evaluate the conditions and return a JSON object with your decision, reasoning, and the chosen path.`
      
      case 'action':
        return `${basePrompt} You are preparing to execute an action. Determine the specific parameters and configuration needed. Return a JSON object with the action details and any required data.`
      
      case 'output':
        return `${basePrompt} You are formatting final output. Structure the data in the requested format. Return a JSON object with the formatted output and any summary information.`
      
      default:
        return basePrompt
    }
  }

  // Build prompt with context from previous nodes
  private buildPromptWithContext(userPrompt: string, nodeType: string): string {
    let contextPrompt = userPrompt
    
    // Add available variables
    if (Object.keys(this.context.variables).length > 0) {
      contextPrompt += `

Available variables:
${JSON.stringify(this.context.variables, null, 2)}`
    }
    
    // Add previous outputs
    if (Object.keys(this.context.previousOutputs).length > 0) {
      contextPrompt += `

Previous step outputs:
${JSON.stringify(this.context.previousOutputs, null, 2)}`
    }
    
    return contextPrompt
  }

  // Extract variables from AI response
  private extractVariables(result: any, variableNames: string[]): void {
    for (const variableName of variableNames) {
      if (result && result[variableName] !== undefined) {
        this.context.variables[variableName] = result[variableName]
      }
    }
  }

  // Evaluate decision node
  private evaluateDecision(result: any, nodeData: SimpleNodeData): string | null {
    // For now, return a simple binary decision
    if (result && result.decision) {
      return result.decision === true || result.decision === 'true' ? 'true' : 'false'
    }
    return null
  }

  // Build execution order using topological sort
  private buildExecutionOrder(nodes: SimpleWorkflowNode[], edges: any[]): string[] {
    // Simple implementation - sort by node type order: input -> process -> decision -> action -> output
    const typeOrder = ['input', 'process', 'decision', 'action', 'output']
    
    return nodes
      .sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.data.type)
        const bIndex = typeOrder.indexOf(b.data.type)
        return aIndex - bIndex
      })
      .map(node => node.id)
  }

  // Calculate approximate cost
  private calculateCost(usage: any): number {
    if (!usage) return 0.02 // Default cost
    
    // GPT-4 Turbo pricing (approximate)
    const inputCost = (usage.prompt_tokens || 0) * 0.00001
    const outputCost = (usage.completion_tokens || 0) * 0.00003
    
    return inputCost + outputCost
  }

  // Abort execution
  public abort(): void {
    this.abortController.abort()
  }

  // Get current context
  public getContext(): ExecutionContext {
    return { ...this.context }
  }
}