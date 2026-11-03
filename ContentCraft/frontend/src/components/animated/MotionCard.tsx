import React from 'react'
import { motion, type HTMLMotionProps, type Variants } from 'motion/react'

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 26,
    },
  },
}

export function StaggerContainer({
  children,
  className = '',
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionCard({
  children,
  className = '',
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SpringPress({
  children,
  className = '',
  scale = 0.97,
  ...props
}: HTMLMotionProps<'div'> & { scale?: number }) {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
