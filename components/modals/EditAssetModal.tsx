"use client";

import type { Asset } from "@/lib/types";

interface EditAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (assetId: string, changes: Partial<Asset>) => void;
}

export function EditAssetModal({ asset, isOpen, onClose, onApply }: EditAssetModalProps) {
  if (!isOpen || !asset) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onApply(asset.id, {
      description: formData.get("description")?.toString() ?? asset.description,
      title: formData.get("title")?.toString() ?? asset.title
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-asset-title"
      className="modal-backdrop fixed inset-0 z-40 flex items-center justify-center px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg space-y-4 rounded-3xl bg-white px-6 py-6 shadow-2xl"
      >
        <div className="space-y-2">
          <h2 id="edit-asset-title" className="text-xl font-semibold text-slate-900">
            Edit {asset.title}
          </h2>
          <p className="text-sm text-slate-500">
            Fine-tune narrative details, metadata, or styling notes. Additional editing features for
            motion and 3D assets arrive soon.
          </p>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Asset Name
          <input
            name="title"
            defaultValue={asset.title}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            name="description"
            defaultValue={asset.description}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:focus-ring"
          />
        </label>
        <fieldset className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Advanced controls (coming soon)
          </legend>
          <p className="text-xs text-primary/80">
            Trim sequences, adjust materials, and apply AI-driven relighting once the toolchain is
            connected to your render pipeline.
          </p>
        </fieldset>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus-visible:focus-ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow focus-visible:focus-ring"
          >
            Apply Changes
          </button>
        </div>
      </form>
    </div>
  );
}
