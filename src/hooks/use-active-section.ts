"use client";

import { useEffect, useState } from "react";

export const sectionIds = ["home", "about", "approach", "in-motion", "profile", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useEffect(() => {
    const ratios = new Map<SectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (sectionIds.includes(entry.target.id as SectionId)) {
            ratios.set(entry.target.id as SectionId, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        }

        const mostVisible = sectionIds.reduce<SectionId | null>((current, id) => {
          if ((ratios.get(id) ?? 0) <= 0) return current;
          if (current === null || (ratios.get(id) ?? 0) > (ratios.get(current) ?? 0)) return id;
          return current;
        }, null);

        if (mostVisible) setActiveSection(mostVisible);
      },
      {
        rootMargin: "-30% 0px -55%",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
