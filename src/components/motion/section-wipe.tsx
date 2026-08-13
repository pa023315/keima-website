"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

type SectionWipeProps = {
  children: ReactNode;
};

const fullyRevealed = "inset(0 0 0 0%)";

export function SectionWipe({ children }: SectionWipeProps) {
  const target = useRef<HTMLDivElement>(null);
  const reducedMotion = useKeimaReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "start 35%"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 0 0 100%)", fullyRevealed],
  );

  useEffect(() => {
    target.current?.setAttribute("data-motion-ready", "true");
  }, []);

  return (
    <div
      ref={target}
      className="section-wipe"
      data-motion-ready="false"
      data-reduced-motion={String(reducedMotion)}
    >
      <motion.div
        className="section-wipe-content"
        style={
          {
            "--section-wipe-clip": reducedMotion ? fullyRevealed : clipPath,
          } as MotionStyle
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
