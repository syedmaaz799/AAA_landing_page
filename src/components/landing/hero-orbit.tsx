"use client"

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion } from "framer-motion"
import { Brain, Network, Sparkles } from "lucide-react"
import { ToolLogo } from "@/components/landing/tool-logos"
import { cn } from "@/lib/utils"

const revealEase = [0.22, 1, 0.36, 1] as const

type ViewportMode = "desktop" | "tablet" | "mobile"

type OrbitRingConfig = {
  id: "inner" | "middle" | "outer"
  radius: number
  duration: number
  direction: "cw" | "ccw"
  category: string
  phaseOffset: number
  tools: readonly string[]
}

type UniverseSizing = {
  planetSize: number
  moonSize: number
  logoPx: number
  labelClass: string
  parallaxStrength: number
}

const DESKTOP_RINGS: OrbitRingConfig[] = [
  {
    id: "inner",
    radius: 190,
    duration: 40,
    direction: "cw",
    category: "AI Model",
    phaseOffset: -90,
    tools: ["ChatGPT", "Claude", "Gemini", "DeepSeek"],
  },
  {
    id: "middle",
    radius: 290,
    duration: 70,
    direction: "ccw",
    category: "Agent Framework",
    phaseOffset: -67.5,
    tools: [
      "Dify",
      "Flowise",
      "LangFlow",
      "CrewAI",
      "BuildMyAgent.io",
      "OpenClaw",
      "Emergent",
      "MCP",
    ],
  },
  {
    id: "outer",
    radius: 390,
    duration: 100,
    direction: "cw",
    category: "Automation & Apps",
    phaseOffset: -64.3,
    tools: [
      "n8n",
      "Zapier",
      "Bubble",
      "Supabase",
      "NotebookLM",
      "Perplexity",
      "Cursor AI",
    ],
  },
]

const TABLET_RINGS: OrbitRingConfig[] = DESKTOP_RINGS.map((ring) => ({
  ...ring,
  radius: Math.round(ring.radius * 0.82),
}))

const MOBILE_RINGS: OrbitRingConfig[] = [
  {
    id: "inner",
    radius: 108,
    duration: 40,
    direction: "cw",
    category: "AI Model",
    phaseOffset: -90,
    tools: ["ChatGPT", "Claude", "Gemini", "DeepSeek"],
  },
  {
    id: "outer",
    radius: 172,
    duration: 100,
    direction: "ccw",
    category: "AI Ecosystem",
    phaseOffset: -60,
    tools: ["Dify", "Flowise", "n8n", "Zapier", "Supabase", "Cursor AI"],
  },
]

const SIZING: Record<ViewportMode, UniverseSizing> = {
  desktop: {
    planetSize: 280,
    moonSize: 80,
    logoPx: 32,
    labelClass: "text-sm font-semibold leading-snug text-white/85",
    parallaxStrength: 18,
  },
  tablet: {
    planetSize: 240,
    moonSize: 72,
    logoPx: 28,
    labelClass: "text-[13px] font-semibold leading-snug text-white/85",
    parallaxStrength: 14,
  },
  mobile: {
    planetSize: 200,
    moonSize: 60,
    logoPx: 24,
    labelClass: "text-xs font-semibold leading-snug text-white/85",
    parallaxStrength: 10,
  },
}

const LABEL_HEIGHT = 44
const UNIVERSE_PADDING = 24

const PLANET_PARTICLES = Array.from({ length: 100 }, (_, index) => ({
  left: `${(index * 19 + 3) % 100}%`,
  top: `${(index * 13 + 7) % 100}%`,
  size: 2 + (index % 3),
  delay: `${(index % 14) * 0.35}s`,
  duration: `${10 + (index % 7)}s`,
}))

const MOBILE_PARTICLES = PLANET_PARTICLES.slice(0, 36)

function getFloatConfig(seed: number) {
  return {
    y: [0, -8, 0],
    x: [0, seed % 2 === 0 ? 3 : -3, 0],
    rotate: [-1, 1, -1],
    duration: 6 + (seed % 4),
    delay: (seed % 10) * 0.45,
  }
}

function toolAngle(index: number, total: number, phaseOffset: number) {
  return (360 / total) * index + phaseOffset
}

function useViewportMode() {
  const [mode, setMode] = useState<ViewportMode>("desktop")

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 1024) setMode("mobile")
      else if (w < 1280) setMode("tablet")
      else setMode("desktop")
    }
    update()
    window.addEventListener("resize", update, { passive: true })
    return () => window.removeEventListener("resize", update)
  }, [])

  return mode
}

function useUniverseScale(
  containerRef: React.RefObject<HTMLDivElement | null>,
  extent: number,
  enabled: boolean
) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const update = () => {
      const el = containerRef.current
      if (!el) return
      const { width, height } = el.getBoundingClientRect()
      const needed = extent * 2
      const next = Math.min(width / needed, height / needed, 1)
      setScale(next > 0 ? next : 1)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef, extent, enabled])

  return scale
}

function useParallaxTilt(enabled: boolean) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const handleMove = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (!enabled) return
      if (rafRef.current !== null) return

      rafRef.current = requestAnimationFrame(() => {
        const dx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const dy = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
        setTilt({
          x: Math.max(-6, Math.min(6, -dy * 6)),
          y: Math.max(-6, Math.min(6, dx * 6)),
        })
        rafRef.current = null
      })
    },
    [enabled]
  )

  const reset = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { tilt, handleMove, reset }
}

function PlanetSurface() {
  return (
    <div className="jupyter-planet-surface absolute inset-0 overflow-hidden rounded-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 300"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="jupyter-planet-base" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(124,200,255,0.35)" />
            <stop offset="45%" stopColor="rgba(63,169,255,0.2)" />
            <stop offset="100%" stopColor="rgba(2,8,20,0.85)" />
          </radialGradient>
          <filter id="jupyter-planet-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              seed="8"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.08
                      0.7 0.3 0 0 0.04
                      0 0 0.2 0 0
                      0 0 0 0.35 0"
            />
          </filter>
          <linearGradient id="jupyter-energy-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(124,200,255,0)" />
            <stop offset="50%" stopColor="rgba(124,200,255,0.35)" />
            <stop offset="100%" stopColor="rgba(124,200,255,0)" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="148" fill="url(#jupyter-planet-base)" />
        <circle
          cx="150"
          cy="150"
          r="148"
          fill="rgba(63,169,255,0.08)"
          filter="url(#jupyter-planet-noise)"
        />
        <ellipse cx="118" cy="112" rx="42" ry="28" fill="rgba(63,169,255,0.18)" />
        <ellipse cx="188" cy="168" rx="36" ry="22" fill="rgba(42,130,220,0.16)" />
        <ellipse cx="142" cy="198" rx="28" ry="18" fill="rgba(124,200,255,0.12)" />
        <circle cx="96" cy="156" r="8" fill="rgba(20,8,0,0.45)" />
        <circle cx="204" cy="118" r="6" fill="rgba(20,8,0,0.4)" />
        <path
          d="M40 150 Q150 130 260 150"
          stroke="url(#jupyter-energy-line)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M60 190 Q150 170 240 188"
          stroke="url(#jupyter-energy-line)"
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
      </svg>
      <div className="jupyter-planet-shimmer absolute inset-0 rounded-full" />
    </div>
  )
}

const JupyterPlanet = memo(function JupyterPlanet({
  size,
  tilt,
  entranceDelay = 0,
  iconSize,
}: {
  size: number
  tilt: { x: number; y: number }
  entranceDelay?: number
  iconSize: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: entranceDelay, ease: revealEase }}
      className="jupyter-planet-wrap pointer-events-none absolute top-1/2 left-1/2 z-50"
      style={{
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="jupyter-planet-outer-glow" />
      <div className="jupyter-planet-atmosphere jupyter-planet-atmosphere-1" />
      <div className="jupyter-planet-atmosphere jupyter-planet-atmosphere-2" />
      <div className="jupyter-planet-atmosphere jupyter-planet-atmosphere-3" />

      <div
        className="jupyter-planet relative overflow-hidden rounded-full border border-cyan-400/15 backdrop-blur-[20px]"
        style={{ width: size, height: size }}
      >
        <div className="jupyter-planet-rotator absolute inset-0">
          <PlanetSurface />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="jupyter-planet-core relative flex items-center justify-center">
            <Brain
              size={iconSize}
              className="jupyter-planet-brain text-[#7CC8FF]"
              strokeWidth={1.25}
            />
            <Sparkles
              size={Math.round(iconSize * 0.26)}
              className="absolute -top-1 -right-2 text-cyan-300/80"
              strokeWidth={1.5}
            />
            <Network
              size={Math.round(iconSize * 0.26)}
              className="absolute -bottom-1 -left-2 text-sky-300/70"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
})

const OrbitMoon = memo(function OrbitMoon({
  name,
  category,
  index,
  parallax,
  entranceDelay,
  paused,
  sizing,
}: {
  name: string
  category: string
  index: number
  parallax: { x: number; y: number }
  entranceDelay: number
  paused: boolean
  sizing: UniverseSizing
}) {
  const float = getFloatConfig(index)
  const displayName = name.replace(".io", "")
  const depth = 1 + (index % 3) * 0.12

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: entranceDelay, ease: revealEase }}
      className="pointer-events-auto"
      style={{
        transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
      }}
    >
      <div
        className="relative"
        style={{
          width: sizing.moonSize,
          height: sizing.moonSize,
          marginLeft: -(sizing.moonSize / 2),
          marginTop: -(sizing.moonSize / 2),
        }}
      >
        <motion.div
          animate={{ y: float.y, x: float.x }}
          transition={{
            duration: float.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: float.delay,
          }}
          className="group absolute inset-0"
        >
          <motion.div
            animate={{ rotate: float.rotate }}
            transition={{
              duration: float.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: float.delay,
            }}
            className={cn("jupyter-moon", paused && "jupyter-paused")}
            style={{ width: sizing.moonSize, height: sizing.moonSize }}
          >
            <ToolLogo
              name={name}
              className={cn(
                "!rounded-lg !bg-transparent !p-0",
                sizing.logoPx === 32 && "!size-8",
                sizing.logoPx === 28 && "!size-7",
                sizing.logoPx === 24 && "!size-6"
              )}
            />
          </motion.div>

          <div className="jupyter-moon-tooltip pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-xl border border-cyan-400/25 bg-black/90 px-3 py-2 text-center shadow-[0_0_40px_rgba(63,169,255,0.3)] backdrop-blur-xl">
              <p className="text-xs font-semibold text-white">{displayName}</p>
              <p className="text-[10px] text-sky-200/80">{category}</p>
            </div>
          </div>
        </motion.div>

        <span
          className={cn(
            "jupyter-moon-label pointer-events-none absolute top-full left-1/2 mt-2.5 max-w-[90px] -translate-x-1/2 text-center break-words whitespace-normal",
            sizing.labelClass
          )}
        >
          {displayName}
        </span>
      </div>
    </motion.div>
  )
})

function OrbitRingTrack({
  ring,
  paused,
  indexOffset,
  tilt,
  entranceDelay,
  sizing,
  zIndex,
}: {
  ring: OrbitRingConfig
  paused: boolean
  indexOffset: number
  tilt: { x: number; y: number }
  entranceDelay: number
  sizing: UniverseSizing
  zIndex: number
}) {
  const rotatorClass = `jupyter-orbit-rotator-${ring.id}`
  const counterClass = `jupyter-orbit-counter-${ring.id}`
  const parallax = {
    x: tilt.y * (sizing.parallaxStrength / 6),
    y: tilt.x * (-sizing.parallaxStrength / 6),
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: entranceDelay, ease: revealEase }}
        className="jupyter-orbit-track pointer-events-none absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: ring.radius * 2,
          height: ring.radius * 2,
          transform: "translate(-50%, -50%)",
          zIndex,
        }}
      />

      <div
        className="pointer-events-none absolute top-1/2 left-1/2"
        style={{
          width: ring.radius * 2,
          height: ring.radius * 2,
          transform: "translate(-50%, -50%)",
          zIndex: zIndex + 1,
        }}
      >
        <div
          className={cn(
            "relative h-full w-full",
            rotatorClass,
            paused && "jupyter-paused"
          )}
        >
          {ring.tools.map((name, index) => {
            const angle = toolAngle(index, ring.tools.length, ring.phaseOffset)

            return (
              <div
                key={name}
                className="absolute top-1/2 left-1/2 h-0 w-0"
                style={{
                  transform: `rotate(${angle}deg) translateY(-${ring.radius}px)`,
                }}
              >
                <div className={cn(counterClass, paused && "jupyter-paused")}>
                  <div
                    className="jupyter-orbit-upright"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <OrbitMoon
                      name={name}
                      category={ring.category}
                      index={indexOffset + index}
                      parallax={parallax}
                      entranceDelay={entranceDelay + 0.08 + index * 0.08}
                      paused={paused}
                      sizing={sizing}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

const UniverseAmbience = memo(function UniverseAmbience({
  particles,
  paused,
  entranceDelay,
}: {
  particles: typeof PLANET_PARTICLES
  paused: boolean
  entranceDelay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: entranceDelay, ease: revealEase }}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-visible",
        paused && "jupyter-paused"
      )}
      aria-hidden="true"
    >
      <div className="jupyter-streak jupyter-streak-a hero-light-streak absolute top-[22%] left-[2%] h-px w-[48%] -rotate-6 bg-gradient-to-r from-transparent via-sky-500/25 to-transparent opacity-[0.15] blur-[30px]" />
      <div className="jupyter-streak jupyter-streak-b hero-light-streak absolute right-[0%] bottom-[24%] h-px w-[44%] rotate-5 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-[0.15] blur-[30px]" />
      {particles.map((particle, index) => (
        <span
          key={index}
          className="jupyter-particle absolute rounded-full bg-[rgba(124,200,255,0.35)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </motion.div>
  )
})

function JupyterUniverse({
  rings,
  sizing,
  particles,
  paused,
  isDesktop,
}: {
  rings: OrbitRingConfig[]
  sizing: UniverseSizing
  particles: typeof PLANET_PARTICLES
  paused: boolean
  isDesktop: boolean
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const maxRadius = Math.max(...rings.map((ring) => ring.radius))
  const extent =
    maxRadius + sizing.moonSize / 2 + LABEL_HEIGHT + UNIVERSE_PADDING
  const scale = useUniverseScale(stageRef, extent, isDesktop)
  const { tilt, handleMove, reset } = useParallaxTilt(isDesktop)

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!stageRef.current) return
      handleMove(
        event.clientX,
        event.clientY,
        stageRef.current.getBoundingClientRect()
      )
    },
    [handleMove]
  )

  let toolIndex = 0
  const iconSize = Math.round(sizing.planetSize * 0.25)

  return (
    <div
      ref={stageRef}
      className={cn(
        "jupyter-universe-stage relative flex h-full w-full items-center justify-center bg-transparent",
        isDesktop ? "hidden lg:flex" : "flex lg:hidden"
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <div
        className="jupyter-universe relative"
        style={{
          width: extent * 2,
          height: extent * 2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <UniverseAmbience
          particles={particles}
          paused={paused}
          entranceDelay={0.48}
        />

        {rings.map((ring, ringIndex) => {
          const offset = toolIndex
          toolIndex += ring.tools.length
          return (
            <OrbitRingTrack
              key={ring.id}
              ring={ring}
              paused={paused}
              indexOffset={offset}
              tilt={tilt}
              entranceDelay={0.16 + ringIndex * 0.08}
              sizing={sizing}
              zIndex={10 + ringIndex}
            />
          )
        })}

        <JupyterPlanet
          size={sizing.planetSize}
          tilt={tilt}
          entranceDelay={0}
          iconSize={iconSize}
        />
      </div>
    </div>
  )
}

function UniversePlaceholder({ planetSize }: { planetSize: number }) {
  return (
    <div className="relative hidden h-full w-full items-center justify-center bg-transparent lg:flex">
      <div
        className="jupyter-planet flex items-center justify-center rounded-full border border-cyan-400/15"
        style={{ width: planetSize, height: planetSize }}
      >
        <Brain size={70} className="text-[#7CC8FF]" strokeWidth={1.25} />
      </div>
    </div>
  )
}

export const HeroOrbit = memo(function HeroOrbit() {
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const mode = useViewportMode()

  const rings = useMemo(() => {
    if (mode === "mobile") return MOBILE_RINGS
    if (mode === "tablet") return TABLET_RINGS
    return DESKTOP_RINGS
  }, [mode])

  const sizing = SIZING[mode]
  const particles = mode === "mobile" ? MOBILE_PARTICLES : PLANET_PARTICLES

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "120px" }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [mounted])

  if (!mounted) {
    return <UniversePlaceholder planetSize={280} />
  }

  return (
    <div
      ref={containerRef}
      className="jupyter-universe-section relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent"
    >
      <JupyterUniverse
        rings={rings}
        sizing={sizing}
        particles={particles}
        paused={!inView}
        isDesktop
      />
      <JupyterUniverse
        rings={rings}
        sizing={sizing}
        particles={particles}
        paused={false}
        isDesktop={false}
      />
    </div>
  )
})
