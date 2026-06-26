"use client"

import { motion, AnimatePresence } from "framer-motion"

type LoadingScreenProps = {
  visible: boolean
  progress: number
}

export function LoadingScreen({ visible, progress }: LoadingScreenProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303]"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading NeuralVarsity"
        >
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              filter: [
                "drop-shadow(0 0 24px rgba(255,140,0,0.18))",
                "drop-shadow(0 0 42px rgba(255,140,0,0.34))",
                "drop-shadow(0 0 24px rgba(255,140,0,0.18))",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[min(42vw,11rem)]"
          >
            {/* Native img preserves PNG transparency; Next/Image can flatten alpha to black */}
            <img
              src="/brand/nv-logo-updated.png"
              alt="NeuralVarsity"
              width={1311}
              height={1280}
              decoding="async"
              fetchPriority="high"
              className="h-auto w-full object-contain"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 text-xs font-medium tracking-[0.32em] text-zinc-500 uppercase"
          >
            NeuralVarsity
          </motion.p>

          <p className="mt-3 text-sm text-zinc-400">
            Preparing your experience… {percent}%
          </p>

          <div className="mt-5 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF8C00] to-[#F97316]"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
