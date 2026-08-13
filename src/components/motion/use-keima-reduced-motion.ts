"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function useKeimaReducedMotion(target?: RefObject<HTMLElement | null>) {
  const motionReduced = useReducedMotion();
  const [mediaReduced, setMediaReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const updatePreference = () => setMediaReduced(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const reducedMotion = Boolean(motionReduced || mediaReduced);

  useEffect(() => {
    target?.current?.setAttribute("data-reduced-motion", String(reducedMotion));
  }, [reducedMotion, target]);

  return reducedMotion;
}
