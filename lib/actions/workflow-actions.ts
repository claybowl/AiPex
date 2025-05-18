"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import type { Workflow } from "@/lib/types"

export type SaveWorkflowResult = {
  success: boolean
  message: string
  workflowId?: number
}

export type WorkflowListItem = {
  id: number
  name: string
  description: string | null
  updated_at: string
  is_public: boolean
}

// Save a workflow to the database
export async function saveWorkflow(
  name: string,
  description: string,
  workflowData: Workflow,
  workflowId?: number,
  userId?: string,
): Promise<SaveWorkflowResult> {
  try {
    let result

    if (workflowId) {
      // Update existing workflow
      result = await query(
        `UPDATE workflows 
         SET name = $1, description = $2, data = $3, updated_at = CURRENT_TIMESTAMP, user_id = $4
         WHERE id = $5
         RETURNING id`,
        [name, description, JSON.stringify(workflowData), userId || null, workflowId],
      )
    } else {
      // Create new workflow
      result = await query(
        `INSERT INTO workflows (name, description, data, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [name, description, JSON.stringify(workflowData), userId || null],
      )
    }

    const id = result[0]?.id

    revalidatePath("/workflows")

    return {
      success: true,
      message: workflowId ? "Workflow updated successfully" : "Workflow saved successfully",
      workflowId: id,
    }
  } catch (error) {
    console.error("Error saving workflow:", error)
    return {
      success: false,
      message: `Error saving workflow: ${(error as Error).message}`,
    }
  }
}

// Get a workflow by ID
export async function getWorkflow(id: number): Promise<Workflow | null> {
  try {
    const result = await query("SELECT data FROM workflows WHERE id = $1", [id])

    if (result.length === 0) {
      return null
    }

    return result[0].data as Workflow
  } catch (error) {
    console.error("Error getting workflow:", error)
    return null
  }
}

// Get all workflows (with optional user filter)
export async function getWorkflows(userId?: string): Promise<WorkflowListItem[]> {
  try {
    const sql = `
      SELECT id, name, description, updated_at, is_public
      FROM workflows
      WHERE ($1::varchar IS NULL OR user_id = $1)
      ORDER BY updated_at DESC
    `

    const result = await query(sql, [userId || null])
    return result as WorkflowListItem[]
  } catch (error) {
    console.error("Error getting workflows:", error)
    return []
  }
}

// Delete a workflow
export async function deleteWorkflow(id: number): Promise<boolean> {
  try {
    await query("DELETE FROM workflows WHERE id = $1", [id])
    revalidatePath("/workflows")
    return true
  } catch (error) {
    console.error("Error deleting workflow:", error)
    return false
  }
}

// Record workflow execution
export async function recordWorkflowExecution(
  workflowId: number,
  status: string,
  inputData: any,
  outputData?: any,
  errorMessage?: string,
  executionTimeMs?: number,
): Promise<number | null> {
  try {
    const result = await query(
      `INSERT INTO workflow_executions 
       (workflow_id, status, input_data, output_data, error_message, execution_time_ms, started_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING id`,
      [workflowId, status, JSON.stringify(inputData), JSON.stringify(outputData), errorMessage, executionTimeMs],
    )

    return result[0]?.id
  } catch (error) {
    console.error("Error recording workflow execution:", error)
    return null
  }
}

// Update workflow execution status
export async function updateWorkflowExecutionStatus(
  executionId: number,
  status: string,
  outputData?: any,
  errorMessage?: string,
  executionTimeMs?: number,
): Promise<boolean> {
  try {
    await query(
      `UPDATE workflow_executions
       SET status = $1, output_data = $2, error_message = $3, 
           execution_time_ms = $4, completed_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [status, JSON.stringify(outputData), errorMessage, executionTimeMs, executionId],
    )

    return true
  } catch (error) {
    console.error("Error updating workflow execution:", error)
    return false
  }
}

// Get execution history for a workflow
export async function getWorkflowExecutionHistory(workflowId: number, limit = 10): Promise<any[]> {
  try {
    const result = await query(
      `SELECT id, started_at, completed_at, status, input_data, output_data, 
              error_message, execution_time_ms
       FROM workflow_executions
       WHERE workflow_id = $1
       ORDER BY started_at DESC
       LIMIT $2`,
      [workflowId, limit],
    )

    return result
  } catch (error) {
    console.error("Error getting workflow execution history:", error)
    return []
  }
}
