"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const frame = window.requestAnimationFrame(() => {
      const elements = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");

      if (!elements.length) return;

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add("is-visible");
        } else {
          revealObserver.observe(element);
        }
      });
      observer = revealObserver;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}