import { NextResponse } from "next/server"
import { getWorkflows } from "@/lib/actions/workflow-actions"

export async function GET() {
  try {
    const workflows = await getWorkflows()
    return NextResponse.json(workflows)
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}
