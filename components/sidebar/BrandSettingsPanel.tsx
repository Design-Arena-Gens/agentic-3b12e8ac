"use client";

import { useId } from "react";
import { availableFonts } from "@/lib/constants";
import type { BrandSettings } from "@/lib/types";

interface BrandSettingsPanelProps {
  settings: BrandSettings;
  onUpdate: (settings: BrandSettings) => void;
}

export function BrandSettingsPanel({ settings, onUpdate }: BrandSettingsPanelProps) {
  const primaryId = useId();
  const secondaryId = useId();
  const accentId = useId();

  const handleChange = <K extends keyof BrandSettings>(key: K, value: BrandSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <section aria-labelledby="brand-settings-heading" className="space-y-4">
      <div>
        <h2 id="brand-settings-heading" className="text-lg font-semibold text-slate-900">
          Brand Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Establish brand foundations so AI-generated outputs stay consistent across visuals, motion,
          and 3D environments.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Primary Color
            <input
              id={primaryId}
              type="color"
              value={settings.primaryColor}
              onChange={(event) => handleChange("primaryColor", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200"
            />
            <span className="text-xs text-slate-500">Used for accents, CTAs, and highlights.</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Secondary Color
            <input
              id={secondaryId}
              type="color"
              value={settings.secondaryColor}
              onChange={(event) => handleChange("secondaryColor", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200"
            />
            <span className="text-xs text-slate-500">Backgrounds, gradients, supporting tone.</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Accent Color
            <input
              id={accentId}
              type="color"
              value={settings.accentColor}
              onChange={(event) => handleChange("accentColor", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200"
            />
            <span className="text-xs text-slate-500">Use sparingly for motion cues and highlights.</span>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Typography
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={settings.fontFamily}
            onChange={(event) => handleChange("fontFamily", event.target.value)}
          >
            {availableFonts.map((font) => (
              <option value={font.value} key={font.value}>
                {font.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-500">
            Select from curated Google Fonts or specify custom families in the field below.
          </span>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Custom Typeface
          <input
            type="text"
            placeholder="e.g. 'Space Grotesk', sans-serif"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            value={settings.fontFamily.startsWith("'Inter'") ? "" : settings.fontFamily}
            onChange={(event) => {
              const value = event.target.value.trim();
              handleChange("fontFamily", value.length ? value : "'Inter', sans-serif");
            }}
          />
          <span className="mt-1 block text-xs text-slate-500">
            Provide fallbacks for web-safe rendering. Uploaded font files coming soon.
          </span>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Brand Signature
          <input
            type="text"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
            placeholder="Enter brand name or tagline"
            value={settings.logoText}
            onChange={(event) => handleChange("logoText", event.target.value)}
          />
          <span className="mt-1 block text-xs text-slate-500">
            Appears on AI-generated mockups and brand package deliverables.
          </span>
        </label>
      </div>
    </section>
  );
}
