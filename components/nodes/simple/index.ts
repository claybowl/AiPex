// Import all node components
import { InputNode } from './input-node'
import { ProcessNode } from './process-node'
import { DecisionNode } from './decision-node'
import { ActionNode } from './action-node'
import { OutputNode } from './output-node'

// Re-export all components
export { InputNode, ProcessNode, DecisionNode, ActionNode, OutputNode }

// Node type mapping for the workflow builder
export const SimpleNodeComponents = {
  input: InputNode,
  process: ProcessNode,
  decision: DecisionNode,
  action: ActionNode,
  output: OutputNode,
} as const

// Node configurations for the node library
export const SimpleNodeConfigs = {
  input: {
    type: 'input',
    label: 'Input',
    description: 'Receive data or trigger workflows',
    icon: 'Upload',
    color: '#10b981',
    category: 'Input/Output',
    businessDescription: 'Where your workflow starts - describe what data comes in'
  },
  process: {
    type: 'process',
    label: 'Process',
    description: 'AI-powered data processing',
    icon: 'Brain',
    color: '#10b981',
    category: 'AI Processing',
    businessDescription: 'Let AI analyze, transform, or understand your data'
  },
  decision: {
    type: 'decision',
    label: 'Decision',
    description: 'Route workflow based on conditions',
    icon: 'GitBranch',
    color: '#f59e0b',
    category: 'Logic',
    businessDescription: 'Split your workflow based on intelligent conditions'
  },
  action: {
    type: 'action',
    label: 'Action',
    description: 'Perform actions and integrations',
    icon: 'Zap',
    color: '#8b5cf6',
    category: 'Actions',
    businessDescription: 'Take action - send emails, update databases, notify teams'
  },
  output: {
    type: 'output',
    label: 'Output',
    description: 'Final results and responses',
    icon: 'FileOutput',
    color: '#10b981',
    category: 'Input/Output',
    businessDescription: 'How your workflow ends - format and deliver results'
  }
} as const