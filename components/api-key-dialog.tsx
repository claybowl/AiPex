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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (keys: Record<string, string>) => void
  initialKeys: Record<string, string>
}

export default function ApiKeyDialog({ open, onOpenChange, onSave, initialKeys }: ApiKeyDialogProps) {
  const [keys, setKeys] = useState<Record<string, string>>(initialKeys)

  const handleSave = () => {
    onSave(keys)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Keys Required</DialogTitle>
          <DialogDescription>
            Please enter the API keys needed to execute this workflow. These keys will be stored only in your browser's
            memory and will not be saved to disk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={keys.OPENAI_API_KEY || ""}
              onChange={(e) => setKeys({ ...keys, OPENAI_API_KEY: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Required for LLM, Embedding, and other AI operations. Get your key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                OpenAI's dashboard
              </a>
              .
            </p>
          </div>

          {/* Add more API key inputs as needed */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Keys & Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
