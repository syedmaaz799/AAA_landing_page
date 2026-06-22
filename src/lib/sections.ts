export type WorkflowSection = {
  step: number
  label: string
  node: string
  headline: string
  description: string
  frameStart: number
  frameEnd: number
  capabilities: string[]
}

export const TOTAL_FRAMES = 241

export const WORKFLOW_SECTIONS: WorkflowSection[] = [
  {
    step: 1,
    label: "Stage 01 · Intent",
    node: "User Input",
    headline: "Start with a request.",
    description:
      "Every autonomous workflow begins with a clear intent — a question, task, or goal from the user that sets the agent in motion.",
    frameStart: 1,
    frameEnd: 40,
    capabilities: [
      "Natural language intake",
      "Voice & multimodal capture",
      "Context-aware prompts",
    ],
  },
  {
    step: 2,
    label: "Stage 02 · Reasoning",
    node: "LLM",
    headline: "Think through the problem.",
    description:
      "The language model reasons over intent, breaks down complexity, and plans the steps needed to fulfill the request.",
    frameStart: 41,
    frameEnd: 80,
    capabilities: [
      "Chain-of-thought planning",
      "Multi-step decomposition",
      "Decision branching",
    ],
  },
  {
    step: 3,
    label: "Stage 03 · Knowledge",
    node: "RAG",
    headline: "Ground answers in data.",
    description:
      "Retrieval-augmented generation pulls relevant documents, databases, and context so responses stay accurate and up to date.",
    frameStart: 81,
    frameEnd: 120,
    capabilities: [
      "Vector search & embeddings",
      "Document ingestion",
      "Dynamic context windows",
    ],
  },
  {
    step: 4,
    label: "Stage 04 · Action",
    node: "Tools",
    headline: "Execute with real tools.",
    description:
      "Agents call APIs, run code, trigger automations, and interact with external systems to turn plans into outcomes.",
    frameStart: 121,
    frameEnd: 160,
    capabilities: [
      "Function calling",
      "API integrations",
      "Workflow triggers",
    ],
  },
  {
    step: 5,
    label: "Stage 05 · Orchestration",
    node: "Agent Network",
    headline: "Coordinate multiple agents.",
    description:
      "Specialized agents hand off tasks, share state, and collaborate across a network to handle complex workflows end to end.",
    frameStart: 161,
    frameEnd: 200,
    capabilities: [
      "Multi-agent routing",
      "Shared memory & state",
      "Parallel execution",
    ],
  },
  {
    step: 6,
    label: "Stage 06 · Delivery",
    node: "Output",
    headline: "Deliver the result.",
    description:
      "The workflow synthesizes outputs — reports, actions, notifications, or deployed artifacts — and hands them back to the user.",
    frameStart: 201,
    frameEnd: 241,
    capabilities: [
      "Structured responses",
      "Human-in-the-loop review",
      "Production deployment",
    ],
  },
]
