"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getReducedMotionSnapshot() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(reducedMotionQuery).matches
  );
}

export function useKeimaReducedMotion() {
  const motionReduced = useReducedMotion();
  const [mediaReduced, setMediaReduced] = useState(getReducedMotionSnapshot);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const updatePreference = () => setMediaReduced(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return Boolean(motionReduced || mediaReduced);
}
