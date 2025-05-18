"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { getWorkflows, deleteWorkflow, type WorkflowListItem } from "@/lib/actions/workflow-actions"
import { Edit, Trash2, Play } from "lucide-react"

export default function WorkflowList() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWorkflows = async () => {
      setLoading(true)
      try {
        const data = await getWorkflows()
        setWorkflows(data)
      } catch (error) {
        console.error("Error loading workflows:", error)
        toast({
          title: "Error loading workflows",
          description: "Failed to load your workflows. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadWorkflows()
  }, [])

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this workflow?")) {
      return
    }

    try {
      const success = await deleteWorkflow(id)
      if (success) {
        setWorkflows(workflows.filter((w) => w.id !== id))
        toast({
          title: "Workflow deleted",
          description: "The workflow has been deleted successfully",
        })
      } else {
        toast({
          title: "Error deleting workflow",
          description: "Failed to delete the workflow. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast({
        title: "Error deleting workflow",
        description: `An unexpected error occurred: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No workflows found</h3>
        <p className="text-gray-500 mt-2">Create your first workflow to get started</p>
        <Button className="mt-4" onClick={() => router.push("/builder")}>
          Create Workflow
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workflows.map((workflow) => (
        <Link href={`/workflows/${workflow.id}`} key={workflow.id} passHref>
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              <CardDescription>Last updated: {new Date(workflow.updated_at).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600">{workflow.description || "No description provided"}</p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/builder?id=${workflow.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => handleDelete(workflow.id, e)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button size="sm" variant="default" asChild>
                <Link href={`/workflows/${workflow.id}/run`}>
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
