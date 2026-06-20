"use client";

import { useEffect, useRef } from "react";

export function RevealObserver() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Disconnect previous observer if any
    observerRef.current?.disconnect();

    const elements = document.querySelectorAll(".reveal:not(.visible)");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    observerRef.current = observer;

    return () => observer.disconnect();
  });

  // Also set up a MutationObserver to catch dynamically added .reveal elements
  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
      if (!observerRef.current) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.classList.contains("reveal") && !el.classList.contains("visible")) {
              observerRef.current.observe(el);
            }
            // Also check children
            el.querySelectorAll?.(".reveal:not(.visible)").forEach((child) => {
              observerRef.current?.observe(child);
            });
          }
        }
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => mutationObserver.disconnect();
  }, []);

  return null;
}
