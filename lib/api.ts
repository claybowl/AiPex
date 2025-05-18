import { getWorkflow as getWorkflowAction } from "@/lib/actions/workflow-actions"

export async function getWorkflow(id: number): Promise<any | null> {
  try {
    return await getWorkflowAction(id)
  } catch (error) {
    console.error("Error fetching workflow:", error)
    return null
  }
}
