"use client";

import { useId } from "react";
import type { AssetType, GenerationParameters } from "@/lib/types";

interface GenerationControlsProps {
  selectedCategory: AssetType;
  onSelectCategory: (category: AssetType) => void;
  parameters: GenerationParameters;
  onChangeParameters: (parameters: GenerationParameters) => void;
}

const categoryCopy = {
  image: "High-fidelity imagery ideal for concept art, marketing visuals, and rapid variations.",
  video: "Generate motion-first narratives, product teasers, explainers, and cinematic loops.",
  model: "Craft 3D assets ready for AR, product visualization, and interactive experiences."
};

const styles = ["Minimal", "Futuristic", "Organic", "Editorial", "Playful"];
const lightingOptions = ["Soft studio", "Ambient", "High contrast", "Moody", "Natural daylight"];
const aspectRatios = ["1:1", "4:5", "16:9", "21:9", "9:16"];
const cameraMotions = ["Static", "Orbit", "Push-in", "Dolly", "Handheld"];

export function GenerationControls({
  selectedCategory,
  onSelectCategory,
  parameters,
  onChangeParameters
}: GenerationControlsProps) {
  const durationId = useId();
  const complexityId = useId();

  const handleParameterChange = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ) => {
    onChangeParameters({ ...parameters, [key]: value });
  };

  return (
    <section aria-labelledby="generation-controls-heading" className="space-y-6">
      <div>
        <h2 id="generation-controls-heading" className="text-lg font-semibold text-slate-900">
          Generation Modes
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose an asset type to tailor AI outputs. The workspace responds to your selection with
          contextual tools.
        </p>
      </div>

      <div className="grid gap-3" role="radiogroup" aria-label="Generation categories">
        {(
          [
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
            { value: "model", label: "3D Model" }
          ] as Array<{ value: AssetType; label: string }>
        ).map((category) => {
          const isActive = selectedCategory === category.value;
          return (
            <button
              key={category.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelectCategory(category.value)}
              className={`rounded-xl border px-4 py-3 text-left transition focus-visible:focus-ring ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/40"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="text-base font-semibold">{category.label}</span>
                {isActive && <span className="text-xs font-medium">Active</span>}
              </span>
              <span className="mt-2 block text-sm text-slate-500">{categoryCopy[category.value]}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Creative Direction
        </h3>

        <label className="block text-sm font-medium text-slate-700">
          Style
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={parameters.style}
            onChange={(event) => handleParameterChange("style", event.target.value)}
          >
            {styles.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Lighting / Mood
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={parameters.lighting}
            onChange={(event) => handleParameterChange("lighting", event.target.value)}
          >
            {lightingOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Aspect Ratio
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={parameters.aspectRatio}
            onChange={(event) => handleParameterChange("aspectRatio", event.target.value)}
          >
            {aspectRatios.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div>
          <label htmlFor={durationId} className="flex items-center justify-between text-sm font-medium text-slate-700">
            Duration <span className="text-xs text-slate-500">{parameters.duration}s</span>
          </label>
          <input
            id={durationId}
            type="range"
            min={5}
            max={60}
            step={5}
            value={parameters.duration}
            onChange={(event) => handleParameterChange("duration", Number(event.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor={complexityId} className="flex items-center justify-between text-sm font-medium text-slate-700">
            Detail Complexity <span className="text-xs text-slate-500">{parameters.complexity}%</span>
          </label>
          <input
            id={complexityId}
            type="range"
            min={10}
            max={100}
            step={10}
            value={parameters.complexity}
            onChange={(event) => handleParameterChange("complexity", Number(event.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Camera Motion
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={parameters.cameraMotion}
            onChange={(event) => handleParameterChange("cameraMotion", event.target.value)}
          >
            {cameraMotions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
