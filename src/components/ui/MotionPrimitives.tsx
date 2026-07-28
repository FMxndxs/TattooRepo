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
