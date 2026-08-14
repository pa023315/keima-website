"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

type HeroMotionProps = {
  children: ReactNode;
};

export function HeroMotion({ children }: HeroMotionProps) {
  const target = useRef<HTMLDivElement>(null);
  const reducedMotion = useKeimaReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const animatedY = useTransform(scrollYProgress, [0, 1], [0, 72]);

  return (
    <motion.div
      ref={target}
      className="hero-motion"
      data-reduced-motion={String(reducedMotion)}
      style={{ y: reducedMotion ? 0 : animatedY }}
    >
      {children}
    </motion.div>
  );
}
