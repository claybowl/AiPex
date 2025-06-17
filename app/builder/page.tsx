import EnhancedWorkflowCanvas from "@/components/enhanced-workflow-canvas" // Corrected import

export default function BuilderPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {" "}
      {/* Ensure full viewport and no overflow issues */}
      <EnhancedWorkflowCanvas />
    </div>
  )
}
