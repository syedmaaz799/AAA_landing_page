"use client"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl text-center md:text-left">
        <div className="flex items-center justify-center gap-2.5 md:justify-start md:gap-3">
          <img
            src="/brand/nv-logo-updated.png"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className="size-9 shrink-0 object-contain md:size-10"
          />
          <p className="font-brand text-2xl font-bold tracking-tight text-white">
            NeuralVarsity
          </p>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          AI Agents & Automation Master Program
        </p>
        <p className="text-xs text-zinc-500">
          AI Agents & Automation Professional Certificate Program
        </p>
        <a
          href="https://neuralvarsity.ai"
          className="mt-3 inline-block text-sm text-orange-400 hover:text-orange-300"
        >
          neuralvarsity.ai
        </a>
      </div>

      <p className="mx-auto mt-12 max-w-7xl border-t border-white/5 pt-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} NeuralVarsity. All rights reserved.
      </p>
    </footer>
  )
}
