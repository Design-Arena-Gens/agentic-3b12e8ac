"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { specializedTools } from "@/lib/constants";

export function SpecializedTools() {
  const [openTool, setOpenTool] = useState<string | null>("price-list");

  return (
    <section aria-labelledby="specialized-tools-heading" className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 id="specialized-tools-heading" className="text-lg font-semibold text-slate-900">
          Specialized Tools
        </h2>
      </div>
      <p className="text-sm text-slate-500">
        Guided workflows for frequently requested deliverables. Each tool adapts to your brand
        preferences and automates multi-step design tasks.
      </p>
      <div className="space-y-3">
        {specializedTools.map((tool) => {
          const expanded = openTool === tool.id;
          return (
            <div
              key={tool.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-primary/50 focus-within:shadow"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:focus-ring"
                aria-expanded={expanded}
                aria-controls={`${tool.id}-content`}
                onClick={() => setOpenTool(expanded ? null : tool.id)}
              >
                <span>
                  <span className="text-base font-semibold text-slate-900">{tool.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">
                    AI-guided steps ensure quality and consistency across deliverables.
                  </span>
                </span>
                {expanded ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <div
                id={`${tool.id}-content`}
                role="region"
                aria-labelledby={`${tool.id}-button`}
                className={`grid gap-3 border-t border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 transition-all ${
                  expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {tool.steps.map((step, index) => (
                  <div key={step.heading} className="rounded-xl border border-dashed border-primary/20 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">{step.heading}</h3>
                    <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow focus-visible:focus-ring"
                >
                  Launch {tool.title}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
