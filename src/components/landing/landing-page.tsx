"use client"

import { ModalProvider } from "@/components/modals/ModalProvider"
import { AppLoadingProvider } from "@/components/landing/app-loading-provider"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"
import { WhatsAppFloatButton } from "@/components/landing/whatsapp-float-button"
import {
  WhyProgramSection,
  WhyChooseSection,
  WhoShouldJoinSection,
  ToolsSection,
  CurriculumSection,
  GraduationSection,
  CapabilitiesSection,
  ProjectsSection,
  MarketSection,
  CareerOutcomesSection,
  DifferentiatorsSection,
  IncludesSection,
  PricingSection,
  FAQSection,
  FinalCTASection,
} from "@/components/landing/sections"

export function LandingPage() {
  return (
    <AppLoadingProvider>
      <ModalProvider>
        <Navbar />
        <main className="relative overflow-x-hidden bg-[#030303]">
          <Hero />
          <WhyProgramSection />
          <WhyChooseSection />
          <WhoShouldJoinSection />
          <ToolsSection />
          <CurriculumSection />
          <GraduationSection />
          <CapabilitiesSection />
          <ProjectsSection />
          <MarketSection />
          <CareerOutcomesSection />
          <DifferentiatorsSection />
          <IncludesSection />
          <PricingSection />
          <FAQSection />
          <FinalCTASection />
        </main>
        <Footer />
        <WhatsAppFloatButton />
      </ModalProvider>
    </AppLoadingProvider>
  )
}
