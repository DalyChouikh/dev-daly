"use client";

import { useEffect } from "react";

/** Adds bounded motion to existing server HTML without a hidden starting state. */
export function PortfolioMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const viewed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || viewed.has(entry.target)) continue;
          viewed.add(entry.target);
          observer.unobserve(entry.target);
          if (preference.matches || !(entry.target instanceof HTMLElement))
            continue;
          const image = entry.target.dataset.reveal === "image";
          const animation = entry.target.animate(
            image
              ? [
                  { transform: "scale(.985)", opacity: 0.85 },
                  { transform: "none", opacity: 1 },
                ]
              : [
                  { transform: "translateY(18px)", opacity: 0.7 },
                  { transform: "none", opacity: 1 },
                ],
            {
              duration: image ? 650 : 480,
              easing: "cubic-bezier(.22,1,.36,1)",
            },
          );
          animations.add(animation);
          void animation.finished
            .then(() => animations.delete(animation))
            .catch(() => animations.delete(animation));
        }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".portfolio-shell [data-reveal]")
      .forEach((element) => observer.observe(element));
    const stopMotion = () => {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);
  return null;
}
