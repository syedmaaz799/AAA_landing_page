"use client"

import "./custom-cursor.css"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const CURSOR_SIZE = 16
const CURSOR_OFFSET = CURSOR_SIZE / 2

const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, [role="button"], [data-cursor-hide]'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const touchQuery = window.matchMedia("(hover: none)")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateTouch = () => setIsTouchDevice(touchQuery.matches)
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches)

    updateTouch()
    updateMotion()

    touchQuery.addEventListener("change", updateTouch)
    motionQuery.addEventListener("change", updateMotion)

    return () => {
      touchQuery.removeEventListener("change", updateTouch)
      motionQuery.removeEventListener("change", updateMotion)
    }
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    document.body.classList.add("custom-cursor-enabled")

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })

      const target = document.elementFromPoint(event.clientX, event.clientY)
      setIsHovering(!!target?.closest(INTERACTIVE_SELECTOR))
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.classList.remove("custom-cursor-enabled")
    }
  }, [isTouchDevice])

  if (isTouchDevice) {
    return null
  }

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden="true"
      animate={{
        x: mousePosition.x - CURSOR_OFFSET,
        y: mousePosition.y - CURSOR_OFFSET,
        scale: isHovering ? 1.8 : 1,
        opacity: isHovering ? 0.8 : 1,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.1,
        ease: "easeOut",
        scale: { duration: 0.2 },
        opacity: { duration: 0.2 },
      }}
    />
  )
}
