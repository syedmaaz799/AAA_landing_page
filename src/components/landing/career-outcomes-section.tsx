"use client"

import { useRef } from "react"
import {
  SectionLabel,
  SectionSubtitle,
  SectionTitle,
} from "@/components/landing/motion"
import { CareerOutcomesCarousel } from "@/components/landing/career-outcomes-carousel"
import "./career-outcomes-section.css"

const PARTICLES = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 17 + 4) % 100}%`,
  top: `${(index * 11 + 8) % 100}%`,
  size: 2 + (index % 3),
  delay: `${(index % 8) * 0.55}s`,
  duration: `${4 + (index % 5)}s`,
}))

export function CareerOutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="careers"
      className="career-outcomes-scroll-section relative scroll-mt-28 overflow-hidden border-t border-white/5"
    >
      <div className="career-outcomes-pin-panel flex h-screen w-full flex-col justify-center overflow-hidden px-4 md:px-8 lg:px-12">
        <div className="career-outcomes-ambient pointer-events-none absolute inset-0" />

        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="career-outcomes-particle"
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

        <div className="career-outcomes-pin-content relative z-10 mx-auto flex w-full max-w-[1600px] flex-col justify-center">
          <header className="career-outcomes-header mx-auto mb-[clamp(2rem,6vh,4rem)] max-w-[850px] text-center">
            <SectionLabel>Career Outcomes</SectionLabel>
            <SectionTitle>WHERE THIS PROGRAM CAN TAKE YOU</SectionTitle>
            <SectionSubtitle>
              Master AI Agents and Automation to unlock high-paying,
              future-proof career opportunities across industries.
            </SectionSubtitle>
          </header>

          <CareerOutcomesCarousel sectionRef={sectionRef} />
        </div>
      </div>
    </section>
  )
}
