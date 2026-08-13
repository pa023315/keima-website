"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const revealEase = [0.22, 1, 0.36, 1] as const;
const revealedState = { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" };

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const target = useRef<HTMLDivElement>(null);
  const reducedMotion = useKeimaReducedMotion();
  const motionInView = useInView(target, { once: true, amount: 0.25 });
  const [nativeInView, setNativeInView] = useState(false);
  const isInView = motionInView || nativeInView;

  useEffect(() => {
    const element = target.current;
    if (reducedMotion || !element || typeof IntersectionObserver === "undefined") return;
    const revealFallback = window.setTimeout(() => setNativeInView(true), 800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        window.clearTimeout(revealFallback);
        setNativeInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => {
      window.clearTimeout(revealFallback);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <motion.div
      ref={target}
      className={className}
      data-reduced-motion={String(reducedMotion)}
      animate={reducedMotion || !isInView ? undefined : revealedState}
      initial={
        reducedMotion ? false : { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" }
      }
      whileInView={
        reducedMotion ? undefined : revealedState
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  );
}
