"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const timeout = window.setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>(".reveal");

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

      elements.forEach((element) => revealObserver.observe(element));
      observer = revealObserver;
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, []);

  return null;
}