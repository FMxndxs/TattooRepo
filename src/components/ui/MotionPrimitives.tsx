'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

interface LayerRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function LayerReveal({ children, delay = 0, className }: LayerRevealProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? { opacity: 1, y: 0, scaleY: 1 }
          : { opacity: 0, y: 16, scaleY: 0.95 }
      }
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{
        duration: reduced ? 0.12 : 0.5,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerGroup({ children, className, staggerDelay = 0.1 }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: reduced ? 0.08 : 0.45,
                delay: reduced ? 0 : i * staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  )
}

interface PrintLineHoverProps {
  children: React.ReactNode
  className?: string
}

export function PrintLineHover({ children, className }: PrintLineHoverProps) {
  /* Duas “camadas” de extrusão com hover no grupo inteiro — CSS só, previsível e leve */
  return (
    <div className={`group/printlh relative overflow-hidden ${className ?? ''}`}>
      {children}
      <div
        data-testid="print-line"
        aria-hidden
        className="print-line-muted-motion pointer-events-none absolute inset-x-[6%] top-[41%] z-[5] h-[2px] origin-center scale-x-0 opacity-0 transition-[transform,opacity] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/printlh:scale-x-100 group-hover/printlh:opacity-100"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(192,142,255,0.96) 50%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="print-line-muted-motion pointer-events-none absolute inset-x-[17%] top-[58%] z-[5] h-[2px] origin-center scale-x-0 opacity-0 transition-[transform,opacity] duration-[420ms] [transition-delay:90ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/printlh:scale-x-100 group-hover/printlh:opacity-95"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(206,164,255,0.92) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}
