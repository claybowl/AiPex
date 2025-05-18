CREATE TABLE IF NOT EXISTS workflow_files (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  pathname TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  workflow_id INTEGER,
  node_id TEXT,
  execution_id INTEGER,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflow_files_workflow_id ON workflow_files(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_files_node_id ON workflow_files(node_id);
CREATE INDEX IF NOT EXISTS idx_workflow_files_execution_id ON workflow_files(execution_id);
