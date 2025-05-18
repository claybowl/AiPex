import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"

export default function DeploymentInstructions() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Preview Limitations</AlertTitle>
        <AlertDescription>
          The ReactFlow library is not compatible with the v0 preview environment. Follow the instructions below to
          deploy the full version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Deploying the Full Workflow Builder</CardTitle>
          <CardDescription>Follow these steps to deploy the complete application with ReactFlow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">1. Download the Code</h3>
            <p className="text-muted-foreground">
              Click the "Download Code" button at the top right of this chat to download the complete project.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">2. Install Dependencies</h3>
            <pre className="bg-gray-100 p-3 rounded">npm install</pre>
            <p className="text-muted-foreground mt-1">
              This will install all required dependencies including ReactFlow.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">3. Run the Development Server</h3>
            <pre className="bg-gray-100 p-3 rounded">npm run dev</pre>
            <p className="text-muted-foreground mt-1">
              This will start the development server at http://localhost:3000
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">4. Deploy to Vercel</h3>
            <p className="text-muted-foreground">For the best experience, deploy your application to Vercel:</p>
            <pre className="bg-gray-100 p-3 rounded">npx vercel</pre>
          </div>

          <div className="pt-2">
            <p>Once deployed, you'll have access to the full workflow builder with all features including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Interactive node canvas with ReactFlow</li>
              <li>Drag and drop functionality</li>
              <li>Real-time workflow execution</li>
              <li>File upload and processing</li>
              <li>Integration with AI models</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
