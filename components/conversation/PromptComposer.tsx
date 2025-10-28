"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { suggestionPrompts } from "@/lib/constants";

interface PromptComposerProps {
  isGenerating: boolean;
  onSubmit: (prompt: string) => void;
}

export function PromptComposer({ isGenerating, onSubmit }: PromptComposerProps) {
  const [prompt, setPrompt] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const suggestions = useMemo(() => {
    if (!prompt.trim()) {
      return suggestionPrompts.slice(0, 4);
    }
    return suggestionPrompts.filter((item) =>
      item.toLowerCase().includes(prompt.trim().toLowerCase())
    );
  }, [prompt]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt.trim());
    setPrompt("");
    setHighlightedIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % suggestions.length;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev === null) return suggestions.length - 1;
        return prev === 0 ? suggestions.length - 1 : prev - 1;
      });
    } else if (event.key === "Tab" && highlightedIndex !== null) {
      event.preventDefault();
      setPrompt(suggestions[highlightedIndex]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-lg"
      aria-label="Design prompt composer"
    >
      <label htmlFor="prompt-input" className="text-sm font-medium text-slate-600">
        Describe the visual, motion, or 3D outcome you want to create
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="e.g. Craft a looping hero video for a mindful productivity app with calming colors"
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-800 placeholder:text-slate-400 focus-visible:focus-ring"
        aria-autocomplete="list"
        aria-controls="prompt-suggestions"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Suggestions
          </span>
          <ul
            id="prompt-suggestions"
            role="listbox"
            className="flex flex-wrap gap-2"
            aria-label="Suggested prompts"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion}>
                <button
                  type="button"
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(null)}
                  onClick={() => {
                    setPrompt(suggestion);
                    setHighlightedIndex(index);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition focus-visible:focus-ring ${
                    highlightedIndex === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-lg focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isGenerating}
        >
          {isGenerating && (
            <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          )}
          <span>{isGenerating ? "Generating" : "Send"}</span>
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
