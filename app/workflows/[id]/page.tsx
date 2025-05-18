import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getWorkflow, getWorkflowExecutionHistory } from "@/lib/actions/workflow-actions"
import { ArrowLeft, Edit, Play, Clock } from "lucide-react"

interface WorkflowDetailPageProps {
  params: {
    id: string
  }
}

async function WorkflowDetail({ params }: WorkflowDetailPageProps) {
  const workflowId = Number.parseInt(params.id)

  if (isNaN(workflowId)) {
    notFound()
  }

  const workflow = await getWorkflow(workflowId)

  if (!workflow) {
    notFound()
  }

  // Get execution history
  const executionHistory = await getWorkflowExecutionHistory(workflowId)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/workflows">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Workflows
            </Link>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/builder?id=${workflowId}`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit Workflow
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/workflows/${workflowId}/run`}>
              <Play className="h-4 w-4 mr-1" />
              Run Workflow
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{workflow.name || "Untitled Workflow"}</CardTitle>
          <CardDescription>{workflow.description || "No description provided"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Nodes</h3>
              <p className="text-2xl font-bold">{workflow.nodes.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Connections</h3>
              <p className="text-2xl font-bold">{workflow.edges.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="executions">
        <TabsList>
          <TabsTrigger value="executions">Execution History</TabsTrigger>
          <TabsTrigger value="json">JSON Data</TabsTrigger>
        </TabsList>
        <TabsContent value="executions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Execution History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {executionHistory.length === 0 ? (
                <p className="text-center py-6 text-gray-500">
                  No execution history available. Run this workflow to see results here.
                </p>
              ) : (
                <div className="space-y-4">
                  {executionHistory.map((execution) => (
                    <Card key={execution.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Execution #{execution.id}</p>
                            <p className="text-sm text-gray-500">
                              Started: {new Date(execution.started_at).toLocaleString()}
                            </p>
                            {execution.completed_at && (
                              <p className="text-sm text-gray-500">
                                Completed: {new Date(execution.completed_at).toLocaleString()}
                              </p>
                            )}
                            {execution.execution_time_ms && (
                              <p className="text-sm text-gray-500">
                                Duration: {(execution.execution_time_ms / 1000).toFixed(2)}s
                              </p>
                            )}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              execution.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : execution.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : execution.status === "running"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {execution.status}
                          </div>
                        </div>

                        {execution.error_message && (
                          <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                            {execution.error_message}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow JSON Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(workflow, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function WorkflowDetailPage(props: WorkflowDetailPageProps) {
  return (
    <Suspense fallback={<WorkflowDetailSkeleton />}>
      <WorkflowDetail {...props} />
    </Suspense>
  )
}

function WorkflowDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12 mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-10 w-64" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48 mt-1" />
                      <Skeleton className="h-4 w-48 mt-1" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
