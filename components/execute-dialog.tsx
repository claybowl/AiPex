"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ExecuteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  nodeCount: number
}

export default function ExecuteDialog({ open, onOpenChange, onConfirm, nodeCount }: ExecuteDialogProps) {
  const [executing, setExecuting] = useState(false)

  const handleConfirm = () => {
    setExecuting(true)
    // Simulate execution delay
    setTimeout(() => {
      setExecuting(false)
      onOpenChange(false)
      onConfirm()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Execute AI Agent Workflow</DialogTitle>
          <DialogDescription>
            You are about to execute a workflow with {nodeCount} nodes. This will process the workflow from input to
            output nodes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500">In a production environment, this would:</p>
          <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
            <li>Process user input through the defined workflow</li>
            <li>Execute LLM calls with the specified parameters</li>
            <li>Call external tools and APIs as configured</li>
            <li>Generate responses based on the workflow logic</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={executing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={executing}>
            {executing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              "Execute Workflow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
