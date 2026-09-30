"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

export function RouteProgress() {
  const reducedMotion = useKeimaReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <div
      className="route-progress"
      data-testid="route-progress"
      data-reduced-motion={String(reducedMotion)}
      aria-hidden="true"
    >
      <motion.span style={{ scaleY: reducedMotion ? 1 : scaleY }} />
    </div>
  );
}
