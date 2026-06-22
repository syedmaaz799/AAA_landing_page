"use client"

import { useEffect, useState } from "react"

function useParticleCount() {
  const [count, setCount] = useState(14)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setCount(5)
      else if (w < 1024) setCount(8)
      else setCount(14)
    }
    update()
    window.addEventListener("resize", update, { passive: true })
    return () => window.removeEventListener("resize", update)
  }, [])

  return count
}

export function HeroParticles() {
  const count = useParticleCount()

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="hero-particle absolute rounded-full bg-sky-400/50"
          style={{
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            left: `${8 + ((i * 19) % 84)}%`,
            top: `${6 + ((i * 27) % 88)}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        />
      ))}

      <div className="hero-light-streak absolute top-1/4 left-1/4 h-px w-1/3 rotate-12 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
      <div className="hero-light-streak absolute top-1/2 right-1/4 h-px w-1/4 -rotate-6 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
    </div>
  )
}
