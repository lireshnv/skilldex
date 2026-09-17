"use client";
import { ArrowDown, RotateCcw } from "lucide-react";
import { RevealGroup, RevealItem } from "./reveal";

/** A vertical labeled-node flow, connected by arrows — used for the two
 * "data flows through the system" diagrams. `loop` draws a return arrow
 * from the last step back to the first. */
export function FlowChain({ steps, loop = false, dense = false }: { steps: string[]; loop?: boolean; dense?: boolean }) {
  return (
    <RevealGroup className="mx-auto flex max-w-xs flex-col items-center" stagger={0.08}>
      {steps.map((step, i) => (
        <RevealItem key={step} className="flex flex-col items-center">
          <span className={dense ? "sd-glass rounded-full px-4 py-1.5 text-sm font-medium text-[var(--sd-text)]" : "text-base font-semibold text-[var(--sd-text)] sm:text-lg"}>
            {step}
          </span>
          {i < steps.length - 1 && <ArrowDown className="my-2.5 h-4 w-4 text-[var(--sd-text-faint)]" />}
        </RevealItem>
      ))}
      {loop && (
        <RevealItem className="mt-3 flex items-center gap-2 text-[var(--sd-accent)]">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">feeds back in</span>
        </RevealItem>
      )}
    </RevealGroup>
  );
}
