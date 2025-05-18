"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Play, StopCircle, ArrowRight } from "lucide-react"
import { getWorkflow, recordWorkflowExecution, updateWorkflowExecutionStatus } from "@/lib/actions/workflow-actions"
import { executeWorkflow, abortWorkflowExecution } from "@/lib/workflow-executor"
import { ensureExecutorsRegistered } from "@/lib/node-executors"
import type { ExecutionContext } from "@/lib/workflow-executor"
import type { Workflow } from "@/lib/types"

interface RunWorkflowPageProps {
  params: {
    id: string
  }
}

export default function RunWorkflowPage({ params }: RunWorkflowPageProps) {
  const router = useRouter()
  const workflowId = Number.parseInt(params.id)

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [executionOutput, setExecutionOutput] = useState<string>("")
  const [executionContext, setExecutionContext] = useState<ExecutionContext | null>(null)
  const [executionId, setExecutionId] = useState<number | null>(null)
  const [executionStartTime, setExecutionStartTime] = useState<number | null>(null)

  useEffect(() => {
    // Ensure all node executors are registered
    ensureExecutorsRegistered()

    const loadWorkflow = async () => {
      if (isNaN(workflowId)) {
        router.push("/workflows")
        return
      }

      try {
        const data = await getWorkflow(workflowId)
        if (data) {
          setWorkflow(data)
        } else {
          toast({
            title: "Workflow not found",
            description: "The requested workflow could not be found",
            variant: "destructive",
          })
          router.push("/workflows")
        }
      } catch (error) {
        console.error("Error loading workflow:", error)
        toast({
          title: "Error loading workflow",
          description: `Failed to load workflow: ${(error as Error).message}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadWorkflow()
  }, [workflowId, router])

  const runWorkflow = async () => {
    if (!workflow) return

    setExecuting(true)
    setExecutionOutput("")
    setExecutionStartTime(Date.now())

    try {
      // Record the execution start in the database
      const execId = await recordWorkflowExecution(workflowId, "running", { userInput })

      setExecutionId(execId)

      // Find input nodes to use as starting points
      const inputNodes = workflow.nodes.filter((node) => node.type === "input")

      // Execute the workflow
      const context = await executeWorkflow(
        workflow.nodes,
        workflow.edges,
        // Node update callback
        (nodeId, status, data) => {
          // Update node status in UI
          console.log(`Node ${nodeId} status: ${status}`, data)

          // If this is an output node, capture its output
          const node = workflow.nodes.find((n) => n.id === nodeId)
          if (node?.type === "output" && status === "completed" && data) {
            setExecutionOutput((prev) => prev + (data.text || JSON.stringify(data, null, 2)) + "\n")
          }
        },
        // Workflow complete callback
        async (context) => {
          setExecutionContext(context)
          setExecuting(false)

          // Calculate execution time
          const executionTime = Date.now() - (executionStartTime || Date.now())

          // Update the execution record in the database
          if (execId) {
            await updateWorkflowExecutionStatus(execId, "completed", context.outputs, undefined, executionTime)
          }

          toast({
            title: "Workflow executed",
            description: "Your workflow has been executed successfully",
          })
        },
        // Initial inputs
        {
          userInput,
        },
      )
    } catch (error) {
      console.error("Error executing workflow:", error)
      setExecuting(false)

      // Update the execution record with the error
      if (executionId) {
        const executionTime = Date.now() - (executionStartTime || Date.now())
        await updateWorkflowExecutionStatus(executionId, "failed", undefined, (error as Error).message, executionTime)
      }

      toast({
        title: "Execution error",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  const stopExecution = () => {
    if (executionContext) {
      abortWorkflowExecution(executionContext)
      setExecuting(false)

      // Update the execution record
      if (executionId) {
        const executionTime = Date.now() - (executionStartTime || Date.now())
        updateWorkflowExecutionStatus(executionId, "aborted", undefined, "Execution aborted by user", executionTime)
      }

      toast({
        title: "Execution stopped",
        description: "Workflow execution has been aborted",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Workflow not found</h2>
          <p className="mt-2">The requested workflow could not be found.</p>
          <Button className="mt-4" asChild>
            <Link href="/workflows">Back to Workflows</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/workflows/${workflowId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Workflow
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{workflow.name || "Untitled Workflow"}</h1>
        <div className="w-32"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Provide input for your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your input here..."
              className="min-h-[200px]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={executing}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            {executing ? (
              <Button variant="destructive" onClick={stopExecution}>
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Execution
              </Button>
            ) : (
              <Button onClick={runWorkflow}>
                <Play className="h-4 w-4 mr-2" />
                Run Workflow
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Results from your workflow execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md min-h-[200px] whitespace-pre-wrap font-mono text-sm">
              {executing && !executionOutput && (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Executing workflow...
                </div>
              )}
              {executionOutput || "Execution output will appear here..."}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => router.push(`/workflows/${workflowId}`)} disabled={executing}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Execution History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
