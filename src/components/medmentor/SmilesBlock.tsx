"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SmilesBlock — renders a SMILES chemistry string to SVG using RDKit.js (WASM).
 *
 * Loaded lazily. RDKit.js is ~150KB JS + ~7MB wasm, so we only load it when
 * the user actually looks at a chemistry explanation. The wasm is served from
 * /public/rdkit/ (copied from node_modules at setup time).
 */

// Module-level promise so multiple blocks on the same page share one RDKit load.
let rdkitPromise: Promise<unknown> | null = null;

type RDKitMol = {
  get_svg: () => string;
  delete: () => void;
  is_valid: () => boolean;
};

type RDKitModule = {
  get_mol: (smiles: string, details?: string) => RDKitMol | null;
  version: () => string;
};

declare global {
  interface Window {
    initRDKitModule?: () => Promise<RDKitModule>;
  }
}

function loadRDKit(): Promise<RDKitModule> {
  if (!rdkitPromise) {
    rdkitPromise = new Promise((resolve, reject) => {
      if (window.initRDKitModule) {
        window.initRDKitModule().then(resolve).catch(reject);
        return;
      }
      const script = document.createElement("script");
      script.src = "/rdkit/RDKit_minimal.js";
      script.async = true;
      script.onload = () => {
        if (!window.initRDKitModule) {
          reject(new Error("RDKit script loaded but initRDKitModule missing"));
          return;
        }
        window.initRDKitModule().then(resolve).catch(reject);
      };
      script.onerror = () => reject(new Error("Failed to load RDKit script"));
      document.head.appendChild(script);
    });
  }
  return rdkitPromise as Promise<RDKitModule>;
}

export default function SmilesBlock({ smiles }: { smiles: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const RDKit = await loadRDKit();
        if (cancelled) return;

        const mol = RDKit.get_mol(smiles.trim());
        if (!mol || !mol.is_valid()) {
          setError(`Invalid SMILES: ${smiles}`);
          mol?.delete();
          setLoading(false);
          return;
        }

        const svg = mol.get_svg();
        mol.delete();

        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "RDKit render failed");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [smiles]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <p className="text-xs font-mono text-amber-300 mb-2">
          ⚠️ Chemistry diagram failed
        </p>
        <pre className="text-xs text-amber-200/70 whitespace-pre-wrap">
          {smiles}
        </pre>
        <p className="text-[10px] text-amber-200/50 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-cyan-400/20 bg-white/95 p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600 uppercase">
          Chemistry · SMILES
        </span>
        <code className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {smiles.length > 40 ? smiles.slice(0, 40) + "…" : smiles}
        </code>
      </div>
      {loading && (
        <p className="text-xs text-slate-500">Loading RDKit…</p>
      )}
      <div ref={ref} className="smiles-svg flex justify-center" />
    </div>
  );
}
