"use client";

import { useRef, type ReactNode } from "react";
import { useCaseReveal } from "./useCaseReveal";

/** Обёртка, внутри которой работают классы появления из CaseUI (rv, rv-words, rv-img, rv-line). */
export function RevealScope({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useCaseReveal(root);
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
