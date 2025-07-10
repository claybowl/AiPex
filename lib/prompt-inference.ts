import OpenAI from 'openai'
import { SimpleNodeData, SimpleNodeType } from './types'

// Prompt-to-Parameter Inference System
export class PromptInferenceEngine {
  
  // Analyze a business prompt and infer technical parameters
  async inferParameters(prompt: string, nodeType: SimpleNodeType, apiKey?: string): Promise<Record<string, any>> {
    try {
      const systemPrompt = this.buildInferenceSystemPrompt(nodeType)
      
      const openaiApiKey = apiKey || process.env.OPENAI_API_KEY
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key is required but not provided')
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.choices[0]?.message?.content
      return result ? JSON.parse(result) : {}
      
    } catch (error) {
      console.error('Parameter inference failed:', error)
      return {}
    }
  }

  // Extract likely variables from a prompt
  async extractVariables(prompt: string, nodeType: SimpleNodeType, apiKey?: string): Promise<string[]> {
    try {
      const systemPrompt = `You are an AI that analyzes business prompts to identify what data variables will be extracted or used.
      
Analyze the given prompt and identify variable names that would be extracted or used in this step.
Return a JSON array of variable names (lowercase, underscore_separated).
      
Examples:
- "Analyze customer sentiment" -> ["sentiment", "confidence_score"]
- "Extract customer info from email" -> ["customer_name", "email_address", "issue_type"]
- "If customer is premium" -> ["customer_tier", "is_premium"]`
      
      const openaiApiKey = apiKey || process.env.OPENAI_API_KEY
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key is required but not provided')
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 200,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      const responseData = await response.json()
      const result = responseData.choices[0]?.message?.content
      const parsed = result ? JSON.parse(result) : {}
      return parsed.variables || []
      
    } catch (error) {
      console.error('Variable extraction failed:', error)
      return []
    }
  }

  // Estimate cost and latency for a prompt
  async estimatePerformance(prompt: string, nodeType: SimpleNodeType): Promise<{ cost: number; latency: number }> {
    // Simple estimation based on prompt length and node type
    const promptLength = prompt.length
    const complexity = this.calculateComplexity(prompt, nodeType)
    
    // Estimate cost (in dollars)
    const baseCost = {
      input: 0.01,
      process: 0.02,
      decision: 0.015,
      action: 0.03,
      output: 0.01
    }[nodeType] || 0.02
    
    const cost = baseCost * (1 + complexity * 0.5)
    
    // Estimate latency (in milliseconds)
    const baseLatency = {
      input: 200,
      process: 1500,
      decision: 800,
      action: 2000,
      output: 400
    }[nodeType] || 1000
    
    const latency = baseLatency * (1 + complexity * 0.3)
    
    return { cost: Math.round(cost * 100) / 100, latency: Math.round(latency) }
  }

  // Build system prompt for parameter inference
  private buildInferenceSystemPrompt(nodeType: SimpleNodeType): string {
    const basePrompt = `You are an AI that analyzes business prompts and infers the technical parameters needed to implement them.
    
Analyze the user's business prompt and return a JSON object with inferred technical parameters.`
    
    switch (nodeType) {
      case 'input':
        return `${basePrompt}
        
For INPUT nodes, identify:
- inputType: "email", "file", "webhook", "form", "api"
- expectedFormat: "json", "csv", "text", "image"
- validationRules: array of validation requirements
- sources: array of potential data sources

Example: "I receive customer support emails"
Returns: {"inputType": "email", "expectedFormat": "text", "sources": ["email"], "validationRules": ["must_contain_customer_info"]}`
      
      case 'process':
        return `${basePrompt}

For PROCESS nodes, identify:
- analysisType: "sentiment", "classification", "extraction", "summarization", "translation"
- outputFormat: "json", "text", "structured_data"
- confidence: boolean (whether to include confidence scores)
- model: suggested AI model or approach

Example: "Analyze customer sentiment"
Returns: {"analysisType": "sentiment", "outputFormat": "json", "confidence": true, "model": "sentiment_analysis"}`
      
      case 'decision':
        return `${basePrompt}

For DECISION nodes, identify:
- decisionType: "binary", "multi_choice", "threshold", "complex"
- evaluationCriteria: array of criteria to evaluate
- possibleOutcomes: array of possible decision outcomes
- defaultAction: what to do if no condition matches

Example: "If customer is angry, escalate"
Returns: {"decisionType": "binary", "evaluationCriteria": ["sentiment"], "possibleOutcomes": ["escalate", "normal_flow"], "defaultAction": "normal_flow"}`
      
      case 'action':
        return `${basePrompt}

For ACTION nodes, identify:
- actionType: "email", "database", "api_call", "notification", "file_operation"
- integrationNeeded: specific service or system to integrate with
- requiredData: array of data fields needed for the action
- responseExpected: boolean (whether action returns data)

Example: "Send email to customer"
Returns: {"actionType": "email", "integrationNeeded": "email_service", "requiredData": ["recipient", "subject", "body"], "responseExpected": false}`
      
      case 'output':
        return `${basePrompt}

For OUTPUT nodes, identify:
- outputType: "report", "json", "email", "file", "notification", "dashboard_update"
- format: "pdf", "csv", "json", "html", "text"
- recipients: who receives the output
- storage: where the output should be stored or sent

Example: "Generate PDF report"
Returns: {"outputType": "report", "format": "pdf", "recipients": ["user"], "storage": "file_system"}`
      
      default:
        return basePrompt
    }
  }

  // Calculate prompt complexity
  private calculateComplexity(prompt: string, nodeType: SimpleNodeType): number {
    let complexity = 0
    
    // Length factor
    if (prompt.length > 200) complexity += 0.3
    if (prompt.length > 500) complexity += 0.3
    
    // Complexity keywords
    const complexKeywords = [
      'analyze', 'classify', 'extract', 'transform', 'integrate',
      'conditional', 'if-then', 'multiple', 'complex', 'advanced'
    ]
    
    const matches = complexKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)
    ).length
    
    complexity += matches * 0.2
    
    // Node type base complexity
    const nodeComplexity = {
      input: 0.1,
      process: 0.5,
      decision: 0.3,
      action: 0.4,
      output: 0.2
    }[nodeType] || 0.3
    
    return Math.min(complexity + nodeComplexity, 1.0)
  }
}