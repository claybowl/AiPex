import { NextResponse } from "next/server"
import { getWorkflow } from "@/lib/actions/workflow-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const workflow = await getWorkflow(id)
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error("Error fetching workflow:", error)
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 })
  }
}
