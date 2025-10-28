"use client";

import { useMemo, useRef } from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef
} from "react-zoom-pan-pinch";
import { Rnd } from "react-rnd";
import { ImageIcon, Layers3, Play, Sparkles, Trash2 } from "lucide-react";
import type { Asset } from "@/lib/types";
import classNames from "classnames";

interface CanvasBoardProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string | null) => void;
  onUpdateAsset: (id: string, data: Partial<Asset>) => void;
  onDuplicateAsset: (id: string) => void;
  onRegenerateAsset: (id: string) => void;
  onRefineAsset: (id: string) => void;
  onDeleteAsset: (id: string) => void;
  onRequestEdit: (id: string) => void;
  onApplyStyle: (id: string) => void;
  onToggleLock: (id: string) => void;
  onExportCanvas: (format: "png" | "jpg" | "svg") => void;
  onExportSelection: (format: "png" | "mp4" | "glb") => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const typeIconMap = {
  image: ImageIcon,
  video: Play,
  model: Layers3
};

export function CanvasBoard({
  assets,
  selectedAssetId,
  onSelectAsset,
  onUpdateAsset,
  onDuplicateAsset,
  onRegenerateAsset,
  onRefineAsset,
  onDeleteAsset,
  onRequestEdit,
  onApplyStyle,
  onToggleLock,
  onExportCanvas,
  onExportSelection,
  canvasRef
}: CanvasBoardProps) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) ?? null,
    [assets, selectedAssetId]
  );

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Infinite Canvas</h2>
          <p className="text-xs text-slate-500">
            Pan with spacebar drag or mouse wheel. Zoom using trackpad pinch or Ctrl/Cmd + scroll.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => transformRef.current?.zoomIn()}
              className="rounded-full px-2 py-1 transition hover:bg-white focus-visible:focus-ring"
            >
              +
            </button>
            <span>Zoom</span>
            <button
              type="button"
              onClick={() => transformRef.current?.zoomOut()}
              className="rounded-full px-2 py-1 transition hover:bg-white focus-visible:focus-ring"
            >
              -
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring"
              onClick={() => onExportCanvas("png")}
            >
              Export PNG
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring"
              onClick={() => onExportCanvas("jpg")}
            >
              JPG
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring"
              onClick={() => onExportCanvas("svg")}
            >
              SVG
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <span>Selection</span>
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring"
              onClick={() => onExportSelection("png")}
              disabled={!selectedAsset}
            >
              PNG
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onExportSelection("mp4")}
              disabled={!selectedAsset}
            >
              MP4
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1 transition hover:bg-white focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onExportSelection("glb")}
              disabled={!selectedAsset}
            >
              GLB
            </button>
          </div>
        </div>
      </div>

      <TransformWrapper
        ref={transformRef}
        initialScale={0.9}
        minScale={0.25}
        maxScale={2.5}
        wheel={{ step: 80 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent>
          <div
            ref={canvasRef}
            className="grid-background relative flex h-[1600px] w-[2400px] cursor-grab select-none"
            role="presentation"
            onMouseDown={() => onSelectAsset(null)}
          >
            {assets.map((asset) => {
              const Icon = typeIconMap[asset.type];
              const isSelected = asset.id === selectedAssetId;
              return (
                <Rnd
                  key={asset.id}
                  size={{ width: asset.size.width, height: asset.size.height }}
                  position={{ x: asset.position.x, y: asset.position.y }}
                  onDragStop={(event, data) =>
                    onUpdateAsset(asset.id, {
                      position: { x: data.x, y: data.y }
                    })
                  }
                  onResizeStop={(event, direction, ref, delta, position) =>
                    onUpdateAsset(asset.id, {
                      size: { width: ref.offsetWidth, height: ref.offsetHeight },
                      position: { x: position.x, y: position.y }
                    })
                  }
                  bounds="parent"
                  disableDragging={asset.isLocked}
                  enableResizing={!asset.isLocked}
                >
                  <div
                    id={`asset-${asset.id}`}
                    className={classNames(
                      "group relative h-full w-full cursor-pointer rounded-2xl border border-transparent bg-white shadow transition focus-visible:focus-ring",
                      isSelected ? "border-primary shadow-lg" : "hover:border-primary/40"
                    )}
                    style={{
                      animation: "fade-in 0.4s ease",
                      transform: `rotate(${asset.rotation}deg)`,
                      fontFamily: asset.style.fontFamily
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectAsset(asset.id);
                    }}
                    onFocus={() => onSelectAsset(asset.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectAsset(asset.id);
                      }
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${asset.style.primaryColor}, ${asset.style.secondaryColor})`,
                        opacity: 0.12
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative flex h-full w-full flex-col justify-between rounded-2xl bg-white/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {asset.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(asset.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{asset.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{asset.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-slate-500">
                          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          Refinement {asset.refinementLevel}%
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow focus-visible:focus-ring"
                            onClick={(event) => {
                              event.stopPropagation();
                              onRegenerateAsset(asset.id);
                            }}
                          >
                            Regenerate
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary shadow focus-visible:focus-ring"
                            onClick={(event) => {
                              event.stopPropagation();
                              onRefineAsset(asset.id);
                            }}
                          >
                            Refine
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow focus-visible:focus-ring"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDuplicateAsset(asset.id);
                            }}
                          >
                            Duplicate
                          </button>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-lg">
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRequestEdit(asset.id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDuplicateAsset(asset.id);
                          }}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onApplyStyle(asset.id);
                          }}
                        >
                          Apply Style
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleLock(asset.id);
                          }}
                        >
                          {asset.isLocked ? "Unlock" : "Lock"}
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onUpdateAsset(asset.id, {
                              size: {
                                width: asset.size.width * 1.1,
                                height: asset.size.height * 1.1
                              }
                            });
                          }}
                        >
                          Scale +
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-3 py-1 transition hover:bg-slate-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onUpdateAsset(asset.id, {
                              rotation: asset.rotation + 5
                            });
                          }}
                        >
                          Rotate
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-red-50 px-3 py-1 text-red-600 transition hover:bg-red-100 focus-visible:focus-ring"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteAsset(asset.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </Rnd>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {assets.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-8 py-12 text-center shadow-floating">
            <Sparkles className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Awaiting your creative brief</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Craft a prompt below or drop assets directly onto the canvas. The AI will arrange new
              creations using your brand system.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
