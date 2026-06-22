"use client"

import type { SimpleIcon } from "simple-icons"
import {
  siAnthropic,
  siCursor,
  siDeepseek,
  siGithub,
  siGooglegemini,
  siGooglesheets,
  siMake,
  siN8n,
  siPerplexity,
  siSupabase,
  siZapier,
} from "simple-icons"
import {
  Braces,
  Cpu,
  GitBranch,
  Layers,
  Network,
  Sparkles,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ToolIconConfig =
  | { type: "simple"; icon: SimpleIcon }
  | { type: "lucide"; icon: LucideIcon; color: string }
  | { type: "custom"; color: string; render: () => React.ReactNode }

const OPENAI_PATH =
  "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .742 7.097 5.98 5.98 0 0 0 .511 4.911 6.051 6.051 0 0 0 6.515 2.899A5.985 5.985 0 0 0 13.94 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.427-3.073zM13.94 22.008a4.484 4.484 0 0 1-2.816-1.006l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.516 4.516 0 0 1-4.554 4.46zM3.605 18.066a4.499 4.499 0 0 1-.542-3.025l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.135-1.884zM2.34 7.896a4.485 4.485 0 0 1 2.365-1.972V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.755a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.168a.077.077 0 0 1-.038-.056V6.074a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"

const VSCODE_PATH =
  "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-3.776 14.786l-10.086-7.44 3.892-3.892 7.194 5.062z"

const BUBBLE_PATH =
  "M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L0 24l5.216-2.284A11.958 11.958 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"

function CustomSvg({
  path,
  color,
  className,
}: {
  path: string
  color: string
  className?: string
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={cn("size-6 shrink-0", className)}
      fill={color}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

function SimpleIconSvg({
  icon,
  className,
}: {
  icon: SimpleIcon
  className?: string
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={cn("size-6 shrink-0", className)}
      fill={`#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  )
}

export const TOOL_ICON_MAP: Record<string, ToolIconConfig> = {
  ChatGPT: {
    type: "custom",
    color: "#10A37F",
    render: () => <CustomSvg path={OPENAI_PATH} color="#10A37F" />,
  },
  Claude: { type: "simple", icon: siAnthropic },
  Gemini: { type: "simple", icon: siGooglegemini },
  DeepSeek: { type: "simple", icon: siDeepseek },
  Dify: {
    type: "custom",
    color: "#155EEF",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#155EEF] text-xs font-bold text-white">
        D
      </span>
    ),
  },
  n8n: { type: "simple", icon: siN8n },
  Flowise: {
    type: "custom",
    color: "#3B82F6",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 text-[10px] font-bold text-white">
        F
      </span>
    ),
  },
  LangFlow: {
    type: "custom",
    color: "#6366F1",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-[9px] font-bold text-white">
        LF
      </span>
    ),
  },
  CrewAI: {
    type: "custom",
    color: "#FF5A5F",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#FF5A5F] text-[9px] font-bold text-white">
        CA
      </span>
    ),
  },
  "BuildMyAgent.io": {
    type: "lucide",
    icon: Sparkles,
    color: "#3FA9FF",
  },
  Emergent: {
    type: "lucide",
    icon: Layers,
    color: "#8B5CF6",
  },
  Bubble: {
    type: "custom",
    color: "#0D0D0D",
    render: () => <CustomSvg path={BUBBLE_PATH} color="#2563EB" />,
  },
  Zapier: { type: "simple", icon: siZapier },
  Make: { type: "simple", icon: siMake },
  Supabase: { type: "simple", icon: siSupabase },
  OpenClaw: {
    type: "lucide",
    icon: GitBranch,
    color: "#22C55E",
  },
  MCP: {
    type: "lucide",
    icon: Network,
    color: "#A855F7",
  },
  Lovable: {
    type: "custom",
    color: "#EC4899",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-[10px] font-bold text-white">
        L
      </span>
    ),
  },
  Perplexity: { type: "simple", icon: siPerplexity },
  NotebookLM: {
    type: "custom",
    color: "#4285F4",
    render: () => (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#4285F4] text-[8px] font-bold text-white">
        NLM
      </span>
    ),
  },
  "Cursor AI": { type: "simple", icon: siCursor },
  GitHub: { type: "simple", icon: siGithub },
  OpenRouter: {
    type: "lucide",
    icon: Workflow,
    color: "#64748B",
  },
  "Google Sheets API": { type: "simple", icon: siGooglesheets },
  "REST APIs": {
    type: "lucide",
    icon: Braces,
    color: "#3FA9FF",
  },
  Webhooks: {
    type: "lucide",
    icon: Webhook,
    color: "#06B6D4",
  },
  "VS Code": {
    type: "custom",
    color: "#007ACC",
    render: () => <CustomSvg path={VSCODE_PATH} color="#007ACC" />,
  },
}

export function ToolLogo({
  name,
  className,
  glowing = false,
}: {
  name: string
  className?: string
  glowing?: boolean
}) {
  const config = TOOL_ICON_MAP[name]

  if (!config) {
    return (
      <Cpu
        className={cn("size-6 shrink-0 text-sky-400", className)}
        aria-hidden="true"
      />
    )
  }

  const wrapperClass = cn(
    "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-all duration-300",
    glowing && "shadow-[0_0_20px_-2px_rgba(63,169,255,0.5)]",
    className
  )

  if (config.type === "simple") {
    return (
      <div className={wrapperClass}>
        <SimpleIconSvg icon={config.icon} />
      </div>
    )
  }

  if (config.type === "lucide") {
    const Icon = config.icon
    return (
      <div className={wrapperClass}>
        <Icon className="size-5" style={{ color: config.color }} aria-hidden="true" />
      </div>
    )
  }

  return <div className={wrapperClass}>{config.render()}</div>
}

export function ToolMarqueeCard({ name }: { name: string }) {
  return (
    <div className="tool-marquee-card group flex h-20 shrink-0 items-center gap-3 rounded-[20px] border border-white/[0.08] bg-white/[0.04] px-5 backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:border-sky-500/40 hover:shadow-[0_0_32px_-4px_rgba(63,169,255,0.45)]">
      <ToolLogo name={name} glowing className="group-hover:scale-110" />
      <span className="text-sm font-medium whitespace-nowrap text-zinc-300 transition-colors group-hover:text-sky-100">
        {name}
      </span>
    </div>
  )
}
