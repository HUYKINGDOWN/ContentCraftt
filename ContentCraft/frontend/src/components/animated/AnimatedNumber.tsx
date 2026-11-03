import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react'

export function AnimatedNumber({
  value,
  duration = 1,
  className = '',
}: {
  value: number
  duration?: number
  className?: string
}) {
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { stiffness: 90, damping: 18, duration })
  const displayVal = useTransform(springVal, (current) => Math.round(current).toLocaleString())
  const hasMounted = useRef(false)

  useEffect(() => {
    // Animate smoothly to the current value
    motionVal.set(value)
    hasMounted.current = true
  }, [value, motionVal])

  return <motion.span className={className}>{displayVal}</motion.span>
}

