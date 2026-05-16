"use client";

import { useEffect, useState } from "react";
import {
  ANATOMY_PRESETS,
  isAnatomyPresetId,
  type AnatomyPresetId,
} from "@/lib/medmentor/anatomyPresets";

/**
 * Inline a preset SVG from /public/medmentor/anatomy/ by id so it can be
 * styled by the surrounding dark-theme CSS (no iframe, no <img>).
 */
export default function AnatomyPreset({ name }: { name: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valid = isAnatomyPresetId(name);

  useEffect(() => {
    if (!valid) {
      setError(`Unknown anatomy preset: "${name}"`);
      return;
    }
    const { path } = ANATOMY_PRESETS[name as AnatomyPresetId];
    let cancelled = false;

    fetch(path)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((text) => {
        if (!cancelled) setSvg(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [name, valid]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
        <p className="text-xs font-mono text-amber-300">
          ⚠️ Anatomy preset missing: <code>{name}</code>
        </p>
      </div>
    );
  }

  const label = valid ? ANATOMY_PRESETS[name as AnatomyPresetId].label : "";

  return (
    <figure className="my-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase">
          Anatomy · Preset
        </span>
        <code className="font-mono text-[10px] text-white/40">{name}</code>
      </div>
      <div
        className="anatomy-svg-container flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg ?? "" }}
      />
      {label && (
        <figcaption className="mt-2 text-center text-[11px] text-white/50">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
