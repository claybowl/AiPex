// Import all node executors
import "./rest-api-executor"
import "./embedding-executor"
import "./llm-executor"
import "./input-executor"

// Add more imports for other node executors as they are implemented

// Export a function to ensure all executors are registered
export function ensureExecutorsRegistered() {
  // This function doesn't need to do anything,
  // it just ensures the imports are executed
  return true
}
