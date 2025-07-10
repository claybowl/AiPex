# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CurveAi AiPex Platform is a visual AI workflow builder application built with Next.js 14 that enables users to create, manage, and execute AI automation workflows through a drag-and-drop interface. Users can build complex AI agent workflows by connecting different types of nodes (LLMs, tools, data sources, integrations) in a visual graph format.

## Common Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run linting
```

## Architecture Overview

### Core Technology Stack
- **Next.js 14** with App Router and Server Components
- **ReactFlow** for visual workflow editor and graph visualization
- **TypeScript** for type safety
- **Tailwind CSS** with dark mode support
- **Neon Database** (PostgreSQL) with Drizzle ORM
- **Vercel Blob Storage** for file management
- **OpenAI API** for LLM processing

### Key Architectural Components

#### Node System (40+ node types)
The application uses a modular node-based architecture with categories:
- **Trigger Nodes**: Scheduled triggers, file watchers, email triggers
- **AI Processing**: LLM nodes, embeddings, sentiment analysis, translation
- **Data Processing**: Text cleaning, JSON conversion, validation
- **Integration Nodes**: Google Sheets, Slack, Twilio, S3 upload
- **Control Flow**: Conditional routing, loops, error handling

Each node follows a consistent interface pattern in `components/nodes/` with corresponding executors in `lib/node-executors/`.

#### Workflow Execution Engine
- **Topological Sort**: Determines execution order based on node dependencies
- **Execution Context**: Manages state, inputs/outputs, and error handling in `lib/workflow-executor.ts`
- **Real-time Updates**: Progress tracking and status updates during execution

#### Database Schema
```sql
workflows (id, name, description, data, user_id, created_at, updated_at)
workflow_files (id, url, pathname, filename, workflow_id, node_id)
```

### File Structure Patterns

#### Pages & API Routes
- `/app/` - Next.js App Router pages
- `/app/api/workflows/` - Workflow CRUD operations
- `/app/api/files/` - File upload and management
- `/app/builder/` - Visual workflow builder interface

#### Components Organization
- `/components/nodes/` - Individual node type components
- `/components/ui/` - Reusable UI components (shadcn/ui)
- `/lib/node-executors/` - Node execution logic
- `/lib/actions/` - Server Actions for data operations

### Development Patterns

#### Node Development
When adding new nodes:
1. Create component in `components/nodes/[node-name]-node.tsx`
2. Add executor in `lib/node-executors/[node-name]-executor.ts`
3. Export executor in `lib/node-executors/index.ts`
4. Add to node library in `components/node-library.tsx`

#### Workflow Data Flow
- Workflows stored as JSON in database with ReactFlow format
- Node connections define execution dependencies
- Execution context passed between nodes during runtime
- File associations tracked in `workflow_files` table

#### Error Handling
- Comprehensive error handling in workflow execution
- Error nodes for workflow-level error management
- Toast notifications for user feedback
- Abort controllers for workflow cancellation

### Configuration Management

#### Environment Variables
- `DATABASE_URL` - Neon database connection
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `OPENAI_API_KEY` - OpenAI API access

#### Key Configuration Files
- `next.config.mjs` - ReactFlow transpilation settings
- `tailwind.config.ts` - Custom color schemes and workflow styles
- `drizzle.config.ts` - Database configuration

### Testing & Development

#### File Management
- Files uploaded to Vercel Blob storage
- File associations tracked per workflow and node
- Support for CSV, Excel, images, and documents

#### Workflow Builder
- ReactFlow-based visual editor
- Dynamic node configuration panels
- Real-time workflow validation
- Dark/light theme support

### Database Operations

Use Drizzle ORM with type-safe queries. Database schema defined in `lib/schema/`. Server Actions in `lib/actions/` handle CRUD operations.

### Integration Points

#### AI Services
- OpenAI API integration in `lib/node-executors/llm-executor.ts`
- Embedding generation and vector search capabilities
- RAG implementation for document processing

#### External Services
- Google Sheets, Slack, Twilio integrations
- AWS S3 for file storage
- Multiple database connectors (PostgreSQL, MySQL, MongoDB)

### Performance Considerations

- Client-side rendering for interactive ReactFlow components
- Server-side rendering for static content
- Dynamic imports for code splitting
- Optimized ReactFlow configuration for large workflows