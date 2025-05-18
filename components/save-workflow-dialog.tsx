"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { saveWorkflow } from "@/lib/actions/workflow-actions"

interface SaveWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: any
  currentWorkflowId?: number
  currentWorkflowName?: string
  currentWorkflowDescription?: string
}

export default function SaveWorkflowDialog({
  open,
  onOpenChange,
  workflow,
  currentWorkflowId,
  currentWorkflowName = "",
  currentWorkflowDescription = "",
}: SaveWorkflowDialogProps) {
  const router = useRouter()
  const [name, setName] = useState(currentWorkflowName)
  const [description, setDescription] = useState(currentWorkflowDescription)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your workflow",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const result = await saveWorkflow(name, description, workflow, currentWorkflowId)

      if (result.success) {
        toast({
          title: "Workflow saved",
          description: result.message,
        })

        // If this is a new workflow, redirect to the workflow page
        if (!currentWorkflowId && result.workflowId) {
          router.push(`/workflows/${result.workflowId}`)
        }

        onOpenChange(false)
      } else {
        toast({
          title: "Error saving workflow",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error saving workflow",
        description: `An unexpected error occurred: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentWorkflowId ? "Update Workflow" : "Save Workflow"}</DialogTitle>
          <DialogDescription>
            {currentWorkflowId
              ? "Update your workflow with a new name and description."
              : "Save your workflow to the database for future use."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My AI Workflow" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : currentWorkflowId ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
