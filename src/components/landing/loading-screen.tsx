"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Brain } from "lucide-react"

export function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 40px rgba(63,169,255,0.2)",
                "0 0 80px rgba(63,169,255,0.4)",
                "0 0 40px rgba(63,169,255,0.2)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex size-20 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10"
          >
            <Brain className="size-10 text-sky-400" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm tracking-widest text-zinc-500 uppercase"
          >
            NeuralVarsity
          </motion.p>
          <motion.div
            className="mt-4 h-0.5 w-32 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
