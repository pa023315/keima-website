"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const revealEase = [0.16, 1, 0.3, 1] as const;
const hiddenState = {
  opacity: 0,
  y: 56,
  clipPath: "inset(0 0 112% 0)",
  filter: "blur(10px)",
};
const revealedState = { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" };

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const target = useRef<HTMLDivElement>(null);
  const reducedMotion = useKeimaReducedMotion();
  const [motionReady, setMotionReady] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (reducedMotion || !element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMotionReady(true);
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const revealState = !motionReady || reducedMotion ? undefined : inView ? revealedState : hiddenState;
  const revealStatus = !motionReady ? "unarmed" : inView ? "visible" : "hidden";

  return (
    <div
      ref={target}
      className={["reveal", className].filter(Boolean).join(" ")}
      data-motion-ready={String(motionReady)}
      data-reduced-motion={String(reducedMotion)}
      data-reveal-state={revealStatus}
    >
      <motion.div
        className="reveal-content"
        animate={revealState}
        initial={false}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.95, delay, ease: revealEase }}
      >
        {children}
      </motion.div>
    </div>
  );
}
