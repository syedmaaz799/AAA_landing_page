"use client"

import { memo, useMemo } from "react"
import {
  Bot,
  Brain,
  Database,
  Network,
  Rocket,
  Search,
  Share2,
  Sparkles,
  Target,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import {
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
  type PortfolioProjectIcon,
} from "@/lib/landing-data"
import {
  FadeUp,
  SectionLabel,
  SectionSubtitle,
  SectionTitle,
} from "@/components/landing/motion"

const ICON_MAP: Record<PortfolioProjectIcon, LucideIcon> = {
  bot: Bot,
  rag: Database,
  sparkles: Sparkles,
  share: Share2,
  target: Target,
  video: Video,
  brain: Brain,
  workflow: Workflow,
  network: Network,
  rocket: Rocket,
}

const FLOAT_CLASS = [
  "projects-float-1",
  "projects-float-2",
  "projects-float-3",
  "projects-float-4",
  "projects-float-5",
] as const

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 19 + 6) % 100}%`,
  top: `${(index * 13 + 10) % 100}%`,
  size: 2 + (index % 2),
  delay: `${(index % 6) * 0.6}s`,
}))

const ProjectCard = memo(function ProjectCard({
  project,
  floatIndex,
}: {
  project: PortfolioProject
  floatIndex: number
}) {
  const Icon = ICON_MAP[project.icon]
  const floatClass = FLOAT_CLASS[floatIndex % FLOAT_CLASS.length]

  return (
    <article
      className={`projects-showcase-card group ${floatClass}`}
      style={{ flex: "0 0 auto" }}
    >
      <div className="projects-showcase-card-inner">
        <header className="projects-showcase-header">
          <p className="projects-showcase-label">PROJECT {project.number}</p>
          <div className="projects-showcase-icon">
            {project.icon === "rag" ? (
              <div className="relative flex items-center justify-center">
                <Database className="size-[22px] text-sky-300" aria-hidden="true" />
                <Search
                  className="absolute -right-0.5 -bottom-0.5 size-3 text-cyan-200"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <Icon className="size-[22px] text-sky-300" aria-hidden="true" />
            )}
          </div>
        </header>

        <div className="projects-showcase-title-wrap">
          <h3 className="projects-showcase-title">{project.title}</h3>
        </div>

        <div className="projects-showcase-desc-wrap">
          <p className="projects-showcase-desc">{project.description}</p>
        </div>
      </div>
    </article>
  )
})

function ProjectsMarquee() {
  const trackItems = useMemo(
    () => [...PORTFOLIO_PROJECTS, ...PORTFOLIO_PROJECTS],
    []
  )

  return (
    <div className="projects-showcase-viewport relative">
      <div className="projects-showcase-fade projects-showcase-fade-left" />
      <div className="projects-showcase-fade projects-showcase-fade-right" />
      <div className="projects-showcase-track">
        {trackItems.map((project, index) => (
          <ProjectCard
            key={`${project.number}-${index}`}
            project={project}
            floatIndex={index}
          />
        ))}
      </div>
    </div>
  )
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="projects-showcase-section relative w-full overflow-hidden border-t border-white/5 bg-[#02040b] pt-[120px] pb-[120px]"
    >
      <div className="projects-showcase-ambient pointer-events-none absolute inset-0" />
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="projects-showcase-star pointer-events-none absolute rounded-full bg-[rgba(124,200,255,0.45)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
        <FadeUp>
          <SectionLabel>PROJECT PORTFOLIO</SectionLabel>
          <SectionTitle>BUILD REAL AI PRODUCTS.</SectionTitle>
          <SectionSubtitle>
            Create production-ready AI systems, intelligent automations, and
            portfolio projects that employers and clients actually care about.
          </SectionSubtitle>
        </FadeUp>

        <div className="mt-14">
          <ProjectsMarquee />
        </div>

        <p className="projects-showcase-hint mt-6 hidden text-center text-sm text-zinc-500 md:block">
          Scroll horizontally to explore projects
        </p>
      </div>
    </section>
  )
}
