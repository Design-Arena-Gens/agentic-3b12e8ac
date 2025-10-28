"use client";

import type { BrandSettings } from "@/lib/types";

interface BrandPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandSettings: BrandSettings;
}

export function BrandPackageModal({ isOpen, onClose, brandSettings }: BrandPackageModalProps) {
  if (!isOpen) return null;

  const previewCards = [
    {
      title: "Logo Variations",
      description: `Monogram and wordmark lockups featuring ${brandSettings.logoText || "your brand"}.`
    },
    {
      title: "Color System",
      description: `Primary ${brandSettings.primaryColor}, secondary ${brandSettings.secondaryColor}, accent ${brandSettings.accentColor}.`
    },
    {
      title: "Typography Guide",
      description: `Display, heading, and body styles using ${brandSettings.fontFamily}.`
    },
    {
      title: "Social Templates",
      description: "Instagram, LinkedIn, and paid ads with responsive variants."
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-package-title"
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <header className="space-y-2">
          <h2 id="brand-package-title" className="text-2xl font-semibold text-slate-900">
            Brand Package Generated
          </h2>
          <p className="text-sm text-slate-500">
            Customize deliverables before export. The package aligns with your current brand
            settings and prompt context.
          </p>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {previewCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              style={{ fontFamily: brandSettings.fontFamily }}
            >
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              <div
                className="mt-4 h-24 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})`
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus-visible:focus-ring"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow focus-visible:focus-ring"
          >
            Export Package (ZIP)
          </button>
        </div>
      </div>
    </div>
  );
}
