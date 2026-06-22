export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Projects", href: "#projects" },
  { label: "Tools", href: "#tools" },
  { label: "Career Outcomes", href: "#careers" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const

export const HERO_HEADLINES = [
  "BUILD AI AGENTS.\nAUTOMATE BUSINESSES.\nBECOME AN AGENTIC AI ENGINEER.",
  "Launch Your Career Into the Age of AI Agents",
  "From Learning AI to Building AI Employees",
  "Master AI Agents & Automation and Build Production-Ready Systems",
] as const

export const HERO_STATS = [
  "80+ Hours Hands-On Learning",
  "20 Live Instructor-Led Sessions",
  "10+ Projects & Assignments",
  "4+ Production-Ready AI Agents",
  "1 Personal AI Employee",
  "Capstone Project",
  "Career Mentorship",
  "No Coding Background Required",
] as const

export const MARQUEE_ROW_1 = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "DeepSeek",
  "Dify",
  "n8n",
  "Flowise",
  "LangFlow",
  "CrewAI",
  "BuildMyAgent.io",
  "Emergent",
] as const

export const MARQUEE_ROW_2 = [
  "Bubble",
  "Zapier",
  "Make",
  "Supabase",
  "OpenClaw",
  "MCP",
  "Lovable",
  "Perplexity",
  "NotebookLM",
  "Cursor AI",
  "GitHub",
  "OpenRouter",
  "REST APIs",
  "Google Sheets API",
  "Webhooks",
  "VS Code",
] as const

export const TOOL_BADGES = [
  "AI Agent Development",
  "Workflow Automation",
  "No-Code Development",
  "Low-Code Development",
  "Multi-Agent Systems",
  "Production Deployment",
  "Business Integrations",
  "Client-Ready Projects",
  "Future-Proof AI Skills",
] as const

export const WHO_SHOULD_JOIN = [
  "Students",
  "Fresh Graduates",
  "Working Professionals",
  "Developers",
  "Software Engineers",
  "Data Analysts",
  "Freelancers",
  "Business Owners",
  "Consultants",
  "Career Switchers",
  "Startup Founders",
  "Non-Tech Professionals",
] as const

export const CURRICULUM = [
  {
    week: "Week 1",
    title: "AI Foundations & Core Concepts",
    topics: [
      "Understanding Foundation Models",
      "Prompt Engineering",
      "System Prompts",
      "Structured Outputs",
      "Context Management",
      "APIs & Tokens",
      "AI Economics",
      "Tool Calling",
      "MCP",
      "Safety",
      "Governance",
      "Guardrails",
    ],
    outcome:
      "Understand modern AI systems and build strong AI foundations.",
  },
  {
    week: "Week 2",
    title: "AI Agents & Intelligent Systems",
    topics: [
      "Conversational AI",
      "Chatbot Design",
      "Memory Systems",
      "RAG Fundamentals",
      "Advanced RAG",
      "Grounded Responses",
      "Dify Applications",
      "Flowise Applications",
      "Custom GPTs",
      "Autonomous Agents",
      "Multi-Step Reasoning",
    ],
    outcome:
      "Build intelligent chatbots and knowledge-powered AI assistants.",
  },
  {
    week: "Week 3",
    title: "Automation & Business Systems",
    topics: [
      "Content Automation Systems",
      "AI Video Creation",
      "Multimodal AI",
      "Workflow Automation with n8n",
      "CRM Automation",
      "Email Automation",
      "Business Integrations",
      "Cross Platform Automation Architecture",
      "Make.com",
      "Zapier",
      "API Integrations",
    ],
    outcome: "Design end-to-end automation workflows and business systems.",
  },
  {
    week: "Week 4",
    title: "Advanced Agents, Deployment & Your AI Employee",
    topics: [
      "Personal AI Employee",
      "Persistent Memory",
      "Long-Term Context",
      "Multi-Agent Collaboration",
      "Agent Orchestration",
      "Production Deployment",
      "System Integrations",
      "Portfolio Development",
      "Capstone Project",
    ],
    outcome:
      "Deploy autonomous AI systems and launch your own AI Employee.",
  },
] as const

export const GRADUATION_BUILDS = [
  "4+ Production-Ready AI Agents",
  "End-to-End Automation Workflows",
  "Deployable AI Applications",
  "Your Own AI Employee",
  "Industry-Grade GitHub Portfolio",
  "NeuralVarsity Certification",
  "AI Business Automation Suite",
] as const

export const CAPABILITIES = [
  "Prompt Engineering",
  "Workflow Automation",
  "AI Agent Building",
  "RAG & Knowledge AI",
  "Production Deployment",
  "Monetization & Freelancing",
  "AI Consulting",
  "Multi-Agent Systems",
  "Business Automation Architecture",
] as const

export const PROJECTS = [
  "AI Customer Support Agent",
  "RAG Knowledge Assistant",
  "Content Automation System",
  "Social Media Automation Engine",
  "Lead Generation Automation System",
  "AI Video Generator",
  "Personal AI Employee",
  "Business Automation Suite",
  "Multi-Agent Collaboration System",
  "Deployment Capstone Project",
] as const

export type PortfolioProjectIcon =
  | "bot"
  | "rag"
  | "sparkles"
  | "share"
  | "target"
  | "video"
  | "brain"
  | "workflow"
  | "network"
  | "rocket"

export type PortfolioProject = {
  number: string
  title: string
  description: string
  icon: PortfolioProjectIcon
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    number: "01",
    title: "AI Customer Support Agent",
    description:
      "Build an intelligent customer support agent capable of handling queries, ticketing, and multilingual conversations.",
    icon: "bot",
  },
  {
    number: "02",
    title: "RAG Knowledge Assistant",
    description:
      "Design a retrieval-augmented assistant that searches documents, cites sources, and answers with grounded accuracy.",
    icon: "rag",
  },
  {
    number: "03",
    title: "Content Automation System",
    description:
      "Automate research, drafting, and publishing workflows that produce consistent content at scale.",
    icon: "sparkles",
  },
  {
    number: "04",
    title: "Social Media Automation Engine",
    description:
      "Create an engine that schedules posts, monitors engagement, and generates platform-ready content automatically.",
    icon: "share",
  },
  {
    number: "05",
    title: "Lead Generation Automation System",
    description:
      "Build a pipeline that captures, qualifies, and nurtures leads with AI-driven outreach and scoring.",
    icon: "target",
  },
  {
    number: "06",
    title: "AI Video Generator",
    description:
      "Produce short-form videos with scripted scenes, voiceovers, and automated editing powered by AI.",
    icon: "video",
  },
  {
    number: "07",
    title: "Personal AI Employee",
    description:
      "Deploy a personal AI worker that manages email, calendar, tasks, and daily business operations.",
    icon: "brain",
  },
  {
    number: "08",
    title: "Business Automation Suite",
    description:
      "Connect CRM, sheets, and APIs into a unified automation suite that runs your business workflows.",
    icon: "workflow",
  },
  {
    number: "09",
    title: "Multi-Agent Collaboration System",
    description:
      "Orchestrate specialized agents that plan, delegate, and collaborate to solve complex multi-step tasks.",
    icon: "network",
  },
  {
    number: "10",
    title: "Deployment Capstone Project",
    description:
      "Ship a production-ready capstone with monitoring, deployment, and a portfolio-ready case study.",
    icon: "rocket",
  },
]

export type CareerOutcomeIcon =
  | "bot"
  | "zap"
  | "layers"
  | "workflow"
  | "briefcase"
  | "network"
  | "building"
  | "laptop"
  | "rocket"
  | "crown"

export type CareerOutcome = {
  title: string
  salary: string
  skills: string[]
  description: string
  icon: CareerOutcomeIcon
}

export const CAREER_OUTCOMES: CareerOutcome[] = [
  {
    title: "AI Agent Developer",
    salary: "₹8–20 LPA",
    skills: ["AI Agents", "LangChain", "Python", "LLMs", "RAG"],
    description:
      "Build and deploy intelligent AI agents capable of reasoning, task execution, and business automation.",
    icon: "bot",
  },
  {
    title: "AI Automation Specialist",
    salary: "₹7–18 LPA",
    skills: ["n8n", "Automation", "APIs", "Business Workflows", "AI Tools"],
    description:
      "Automate repetitive workflows and streamline business operations using modern AI systems.",
    icon: "zap",
  },
  {
    title: "AI Solutions Engineer",
    salary: "₹10–25 LPA",
    skills: ["Python", "Architecture", "APIs", "AI Systems", "Integrations"],
    description:
      "Design and implement end-to-end AI solutions for enterprises and complex business problems.",
    icon: "layers",
  },
  {
    title: "AI Workflow Designer",
    salary: "₹8–16 LPA",
    skills: ["n8n", "Zapier", "Automation", "AI Agents", "Process Design"],
    description:
      "Create intelligent workflows that connect tools, data, and AI agents to improve productivity.",
    icon: "workflow",
  },
  {
    title: "AI Consultant",
    salary: "₹12–30 LPA",
    skills: ["Strategy", "Business Systems", "AI Transformation", "Automation", "Consulting"],
    description:
      "Help organizations adopt AI technologies and build automation strategies for growth.",
    icon: "briefcase",
  },
  {
    title: "Agentic AI Engineer",
    salary: "₹12–35 LPA",
    skills: ["Multi-Agent Systems", "Planning", "Memory", "RAG", "Orchestration"],
    description:
      "Build autonomous AI systems capable of planning, reasoning, and collaborating with multiple agents.",
    icon: "network",
  },
  {
    title: "Automation Architect",
    salary: "₹15–40 LPA",
    skills: ["Enterprise Systems", "Automation Design", "AI Infrastructure", "APIs", "Cloud"],
    description:
      "Architect large-scale automation systems and AI infrastructures for modern businesses.",
    icon: "building",
  },
  {
    title: "AI Freelancer",
    salary: "₹5–25 LPA+",
    skills: ["Automation", "AI Agents", "Prompt Engineering", "Consulting", "Deployment"],
    description:
      "Build and sell AI solutions and automation services to global clients and businesses.",
    icon: "laptop",
  },
  {
    title: "AI Product Builder",
    salary: "₹10–50 LPA+",
    skills: ["SaaS", "AI Agents", "Product Development", "MVPs", "Deployment"],
    description:
      "Launch AI-powered products and applications solving real-world business problems.",
    icon: "rocket",
  },
  {
    title: "Founder of an AI Agency",
    salary: "Unlimited Potential",
    skills: ["Business", "Sales", "AI Automation", "Leadership", "Strategy"],
    description:
      "Start and scale your own AI agency delivering automation and AI transformation services.",
    icon: "crown",
  },
]

export const PROGRAM_DIFFERENTIATORS = [
  "Build Real Projects",
  "Production-Ready Portfolio",
  "Career Mentorship",
  "Industry Tools",
  "Capstone Project",
  "Community Support",
  "Session Recordings",
  "No Coding Background Required",
  "Live Cohort Learning",
  "Peer Network",
  "Freelancing Guidance",
  "Portfolio Reviews",
] as const

export const PROGRAM_INCLUDES = [
  "20 Live Instructor-Led Sessions",
  "80+ Hours Hands-On Learning",
  "10+ Projects & Assignments",
  "AI Business Automation Suite Capstone",
  "Your Own AI Employee",
  "Community Access",
  "Peer Network",
  "Session Recordings",
  "NeuralVarsity Certification",
  "Lifetime Community Access",
  "Career Guidance",
] as const

export const FAQS = [
  {
    q: "Who can join this program?",
    a: "Students, professionals, founders, freelancers, and career switchers — anyone ready to build with AI. No prior AI experience required.",
  },
  {
    q: "Do I need coding knowledge?",
    a: "No. We teach no-code and low-code approaches alongside practical implementation so you can build production systems without heavy engineering.",
  },
  {
    q: "Will I build real projects?",
    a: "Yes. You'll build 10+ hands-on projects including AI agents, automation workflows, and a capstone AI Employee you can showcase to employers and clients.",
  },
  {
    q: "Will I get recordings?",
    a: "Every live session is recorded so you can revisit lessons anytime.",
  },
  {
    q: "Will I receive certification?",
    a: "Yes. Graduates receive the NeuralVarsity AI Agents & Automation Master Program Professional Certificate.",
  },
  {
    q: "Can I freelance after completing this program?",
    a: "Absolutely. You'll learn monetization strategies, portfolio building, and how to deliver client-ready AI automation projects worth ₹15K–₹75K+.",
  },
  {
    q: "Will I build AI Agents and Automations from scratch?",
    a: "Yes — from prompt engineering to multi-agent systems, RAG assistants, n8n workflows, and deployed production applications.",
  },
  {
    q: "Can working professionals attend?",
    a: "Yes. The program is designed for busy professionals with live sessions, recordings, and a focused 4-week structure.",
  },
] as const

export const AGENT_CAPABILITIES = [
  "Plan",
  "Reason",
  "Use Tools",
  "Access Knowledge",
  "Make Decisions",
  "Automate Workflows",
  "Collaborate with Other Agents",
] as const
