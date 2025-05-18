import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">AI Workflow Builder</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Build, save, and execute AI agent workflows with a visual drag-and-drop interface.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/builder">Create New Workflow</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/workflows">View My Workflows</Link>
        </Button>
      </div>
    </div>
  )
}
