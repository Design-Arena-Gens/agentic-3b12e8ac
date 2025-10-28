'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ConversationThread } from '@/components/conversation/ConversationThread';
import { PromptComposer } from '@/components/conversation/PromptComposer';
import { CanvasBoard } from '@/components/canvas/CanvasBoard';
import { GenerationControls } from '@/components/sidebar/GenerationControls';
import { SpecializedTools } from '@/components/sidebar/SpecializedTools';
import { BrandSettingsPanel } from '@/components/sidebar/BrandSettingsPanel';
import { EditAssetModal } from '@/components/modals/EditAssetModal';
import { BrandPackageModal } from '@/components/modals/BrandPackageModal';
import type { Asset, AssetType, BrandSettings, GenerationParameters, Message } from '@/lib/types';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Menu, PanelsTopLeft, ShieldCheck, Sparkles } from 'lucide-react';

const defaultParameters: GenerationParameters = {
  style: 'Futuristic',
  lighting: 'Ambient',
  aspectRatio: '16:9',
  duration: 30,
  complexity: 50,
  cameraMotion: 'Static'
};

const defaultBrandSettings: BrandSettings = {
  primaryColor: '#2563eb',
  secondaryColor: '#4f46e5',
  accentColor: '#f97316',
  fontFamily: "'Inter', sans-serif",
  logoText: 'Nova Studio'
};

type ToastPayload = {
  id: string;
  message: string;
  tone: 'success' | 'error' | 'info';
};

export default function Page() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [generationParameters, setGenerationParameters] = useState<GenerationParameters>(
    defaultParameters
  );
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(defaultBrandSettings);
  const [generationCategory, setGenerationCategory] = useState<AssetType>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [isBrandPackageOpen, setIsBrandPackageOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) ?? null,
    [assets, selectedAssetId]
  );

  useEffect(() => {
    setAssets((prev) =>
      prev.map((asset) => ({
        ...asset,
        style: {
          ...asset.style,
          primaryColor: brandSettings.primaryColor,
          secondaryColor: brandSettings.secondaryColor,
          fontFamily: brandSettings.fontFamily
        }
      }))
    );
  }, [brandSettings.primaryColor, brandSettings.secondaryColor, brandSettings.fontFamily]);

  const appendToast = (payload: Omit<ToastPayload, 'id'>) => {
    const toast: ToastPayload = { id: crypto.randomUUID(), ...payload };
    setToasts((prev) => [...prev, toast]);
  };

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 4000)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  const createAssetFromPrompt = (prompt: string): Asset => {
    const now = new Date();
    const baseSize = generationCategory === 'video' ? { width: 420, height: 240 } : { width: 320, height: 320 };
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      type: generationCategory,
      title: `${generationCategory === 'image' ? 'Concept Visual' : generationCategory === 'video' ? 'Motion Draft' : '3D Asset'} ${assets.length + 1}`,
      description: `Response to: “${prompt}”. Styled ${generationParameters.style.toLowerCase()} with ${generationParameters.lighting.toLowerCase()} lighting.`,
      position: {
        x: 120 + (assets.length % 5) * 180,
        y: 120 + Math.floor(assets.length / 5) * 220
      },
      size: baseSize,
      rotation: 0,
      style: {
        primaryColor: brandSettings.primaryColor,
        secondaryColor: brandSettings.secondaryColor,
        fontFamily: brandSettings.fontFamily
      },
      createdAt: now.toISOString(),
      refinementLevel: 55,
      isLocked: false
    };
    return newAsset;
  };

  const handlePromptSubmit = (prompt: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };
    setMessages((previous) => [...previous, userMessage]);
    setIsGenerating(true);

    setTimeout(() => {
      const asset = createAssetFromPrompt(prompt);
      setAssets((prev) => [...prev, asset]);
      setSelectedAssetId(asset.id);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: `Generated a ${asset.type} concept with ${generationParameters.aspectRatio} framing and ${generationParameters.cameraMotion.toLowerCase()} motion guidance.`,
        timestamp: new Date().toISOString(),
        assetId: asset.id
      };
      setMessages((previous) => [...previous, assistantMessage]);
      setIsGenerating(false);
      appendToast({ message: 'New asset added to canvas', tone: 'success' });
    }, 750);
  };

  const updateAsset = (assetId: string, data: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) return asset;
        return {
          ...asset,
          ...data,
          position: data.position ? { ...asset.position, ...data.position } : asset.position,
          size: data.size ? { ...asset.size, ...data.size } : asset.size,
          style: data.style ? { ...asset.style, ...data.style } : asset.style
        };
      })
    );
  };

  const duplicateAsset = (assetId: string) => {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) return;
    const duplicated: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      title: `${asset.title} Copy`,
      position: {
        x: asset.position.x + 40,
        y: asset.position.y + 40
      },
      createdAt: new Date().toISOString(),
      isLocked: false
    };
    setAssets((prev) => [...prev, duplicated]);
    setSelectedAssetId(duplicated.id);
    appendToast({ message: 'Asset duplicated', tone: 'info' });
  };

  const regenerateAsset = (assetId: string) => {
    const current = assets.find((item) => item.id === assetId);
    if (!current) return;
    updateAsset(assetId, {
      createdAt: new Date().toISOString(),
      description: `${current.description.split('\n')[0]}\nRegenerated variant emphasizing ${generationParameters.style.toLowerCase()} aesthetics.`,
      refinementLevel: 65
    });
    appendToast({ message: 'New variation generated', tone: 'success' });
  };

  const refineAsset = (assetId: string) => {
    updateAsset(assetId, {
      refinementLevel: Math.min(100, (assets.find((item) => item.id === assetId)?.refinementLevel ?? 60) + 15),
      description: `${assets.find((item) => item.id === assetId)?.description ?? ''}\nRefinement applied: ${generationParameters.style} detailing.`
    });
    appendToast({ message: 'Asset refinement queued', tone: 'success' });
  };

  const applyBrandStyle = (assetId: string) => {
    updateAsset(assetId, {
      style: {
        primaryColor: brandSettings.primaryColor,
        secondaryColor: brandSettings.secondaryColor,
        fontFamily: brandSettings.fontFamily
      }
    });
    appendToast({ message: 'Brand style re-applied', tone: 'info' });
  };

  const toggleLock = (assetId: string) => {
    const target = assets.find((item) => item.id === assetId);
    const nextLocked = target ? !target.isLocked : true;
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              isLocked: nextLocked
            }
          : asset
      )
    );
    appendToast({ message: nextLocked ? 'Asset locked in place' : 'Asset unlocked', tone: 'info' });
  };

  const deleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    }
    appendToast({ message: 'Asset removed from canvas', tone: 'info' });
  };

  const handleEditApply = (assetId: string, data: Partial<Asset>) => {
    updateAsset(assetId, data);
    appendToast({ message: 'Asset updated', tone: 'success' });
  };

  const exportCanvas = async (format: 'png' | 'jpg' | 'svg') => {
    if (!canvasRef.current) return;
    try {
      const node = canvasRef.current;
      if (format === 'png') {
        const dataUrl = await toPng(node, { pixelRatio: 2 });
        downloadBlob(dataUrl, 'canvas-export.png');
      } else if (format === 'jpg') {
        const dataUrl = await toJpeg(node, { pixelRatio: 2, backgroundColor: '#f0f0f0' });
        downloadBlob(dataUrl, 'canvas-export.jpg');
      } else if (format === 'svg') {
        const dataUrl = await toSvg(node);
        downloadBlob(dataUrl, 'canvas-export.svg');
      }
      appendToast({ message: `Canvas exported as ${format.toUpperCase()}`, tone: 'success' });
    } catch (error) {
      appendToast({ message: 'Export failed. Please try again.', tone: 'error' });
    }
  };

  const exportSelection = async (format: 'png' | 'mp4' | 'glb') => {
    if (!selectedAssetId) {
      appendToast({ message: 'Select an asset to export', tone: 'info' });
      return;
    }
    if (format !== 'png') {
      appendToast({
        message: `${format.toUpperCase()} exports are in beta. We will notify you when ready.`,
        tone: 'info'
      });
      return;
    }
    const node = document.getElementById(`asset-${selectedAssetId}`);
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      downloadBlob(dataUrl, `asset-${selectedAssetId}.png`);
      appendToast({ message: 'Asset exported as PNG', tone: 'success' });
    } catch (error) {
      appendToast({ message: 'Unable to export selection', tone: 'error' });
    }
  };

  const downloadBlob = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const activeEditAsset = editAssetId ? assets.find((asset) => asset.id === editAssetId) ?? null : null;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="h-6 w-6 text-slate-700" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2 text-slate-900">
            <PanelsTopLeft className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold">Design Agent Studio</p>
              <p className="text-xs text-slate-500">AI-native co-creation workspace</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Brand-aware AI active
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Accessibility compliant
          </span>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-1.5 font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary focus-visible:focus-ring"
            onClick={() => setIsBrandPackageOpen(true)}
          >
            Generate Brand Package
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-80 max-w-full transform bg-white px-5 py-6 shadow-xl transition lg:static lg:z-auto lg:flex lg:w-[360px] lg:transform-none lg:rounded-3xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex h-full flex-col gap-8 overflow-y-auto pr-2 scrollbar-thin">
            <GenerationControls
              selectedCategory={generationCategory}
              onSelectCategory={(category) => {
                setGenerationCategory(category);
                appendToast({ message: `${category.toUpperCase()} mode activated`, tone: 'info' });
              }}
              parameters={generationParameters}
              onChangeParameters={setGenerationParameters}
            />
            <BrandSettingsPanel settings={brandSettings} onUpdate={setBrandSettings} />
            <SpecializedTools />
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden"
            role="presentation"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <section className="flex flex-1 flex-col gap-6">
          <CanvasBoard
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            onUpdateAsset={updateAsset}
            onDuplicateAsset={duplicateAsset}
            onRegenerateAsset={regenerateAsset}
            onRefineAsset={refineAsset}
            onDeleteAsset={deleteAsset}
            onRequestEdit={(assetId) => setEditAssetId(assetId)}
            onApplyStyle={applyBrandStyle}
            onToggleLock={toggleLock}
            onExportCanvas={exportCanvas}
            onExportSelection={exportSelection}
            canvasRef={canvasRef}
          />

          <section className="flex min-h-[320px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm lg:h-[360px]">
            <ConversationThread messages={messages} />
            <div className="border-t border-slate-100 p-4">
              <PromptComposer isGenerating={isGenerating} onSubmit={handlePromptSubmit} />
            </div>
          </section>
        </section>
      </main>

      <EditAssetModal
        asset={activeEditAsset}
        isOpen={Boolean(activeEditAsset)}
        onClose={() => setEditAssetId(null)}
        onApply={handleEditApply}
      />

      <BrandPackageModal
        isOpen={isBrandPackageOpen}
        onClose={() => setIsBrandPackageOpen(false)}
        brandSettings={brandSettings}
      />

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.tone === 'success'
                ? 'bg-emerald-500'
                : toast.tone === 'error'
                ? 'bg-red-500'
                : 'bg-primary'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
