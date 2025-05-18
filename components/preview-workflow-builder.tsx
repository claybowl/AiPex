"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function PreviewWorkflowBuilder() {
  const [activeTab, setActiveTab] = useState("builder")

  return (
    <div className="container mx-auto p-4">
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Preview Mode</AlertTitle>
        <AlertDescription>
          The full ReactFlow-based workflow builder isn't available in the preview environment. This is a simplified
          preview of what the workflow builder looks like.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Workflow Builder</h1>
        <div className="space-x-2">
          <Button variant="outline">Save</Button>
          <Button>Execute</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Node Library</CardTitle>
                  <CardDescription>Drag nodes to the canvas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">Input Node</div>
                    <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">LLM Node</div>
                    <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">Process Node</div>
                    <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">Output Node</div>
                    <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">File Upload Node</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-2">
              <Card className="h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="mb-4">
                    <img src="/ai-workflow-diagram.png" alt="Workflow Canvas Preview" className="rounded border" />
                  </div>
                  <p className="text-muted-foreground">
                    The actual workflow builder uses ReactFlow to create an interactive canvas.
                    <br />
                    Deploy this project to see the full functionality.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Node Configuration</CardTitle>
                  <CardDescription>Configure selected node</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Node Name</label>
                      <input type="text" className="w-full p-2 border rounded" placeholder="LLM Node" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Model</label>
                      <select className="w-full p-2 border rounded" disabled>
                        <option>GPT-4</option>
                        <option>Claude 3</option>
                        <option>Llama 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Temperature</label>
                      <input type="range" className="w-full" min="0" max="1" step="0.1" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <pre className="bg-gray-100 p-4 rounded overflow-auto h-[600px]">
                {`// Generated workflow code
import { createWorkflow } from "@/lib/workflow";
import { InputNode, LLMNode, OutputNode } from "@/lib/nodes";

export const workflow = createWorkflow({
  name: "Sample Workflow",
  nodes: [
    new InputNode({
      id: "input-1",
      position: { x: 100, y: 200 },
      data: { prompt: "What can you tell me about AI workflows?" }
    }),
    new LLMNode({
      id: "llm-1",
      position: { x: 400, y: 200 },
      data: { model: "gpt-4", temperature: 0.7 }
    }),
    new OutputNode({
      id: "output-1",
      position: { x: 700, y: 200 },
      data: {}
    })
  ],
  edges: [
    { id: "e1-2", source: "input-1", target: "llm-1" },
    { id: "e2-3", source: "llm-1", target: "output-1" }
  ]
});`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Preview</CardTitle>
              <CardDescription>See how your workflow will execute</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded">
                  <h3 className="font-medium">Input</h3>
                  <p className="mt-2">What can you tell me about AI workflows?</p>
                </div>

                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                  <h3 className="font-medium">LLM (GPT-4)</h3>
                  <p className="mt-2">Processing input through GPT-4 with temperature 0.7...</p>
                </div>

                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                  <h3 className="font-medium">Output</h3>
                  <p className="mt-2">
                    AI workflows are automated processes that use artificial intelligence to perform tasks. They
                    typically involve data input, processing through AI models, and producing outputs. These workflows
                    can be used for content generation, data analysis, decision making, and more.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
