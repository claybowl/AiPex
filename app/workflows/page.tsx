import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import WorkflowList from "@/components/workflow-list"

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workflows</h1>
        <Button asChild>
          <Link href="/builder">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Link>
        </Button>
      </div>

      <WorkflowList />
    </div>
  )
}
