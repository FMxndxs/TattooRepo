'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

interface LayerRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function LayerReveal({ children, delay = 0, className }: LayerRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, scaleY: 0.95 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
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

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * staggerDelay, ease: [0.22, 1, 0.36, 1] }}
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
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {children}
      <motion.div
        data-testid="print-line"
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent pointer-events-none"
        style={{ top: '50%' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </div>
  )
}
