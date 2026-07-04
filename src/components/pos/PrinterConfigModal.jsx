import React, { useState, useEffect } from "react";
import { X, Printer, RefreshCw, Check } from "lucide-react";
import { getPrinterConfig, setPrinterConfig } from "@/lib/printerConfig";

export default function PrinterConfigModal({ onClose }) {
  const [printers, setPrinters] = useState([]);
  const [config, setConfig] = useState(getPrinterConfig());
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const loadPrinters = async () => {
    setLoading(true);
    try {
      if (window.electronAPI && typeof window.electronAPI.getPrinters === "function") {
        const list = await window.electronAPI.getPrinters();
        setPrinters(list || []);
      } else {
        setPrinters([]);
      }
    } catch {
      setPrinters([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPrinters();
  }, []);

  const handleSave = () => {
    setPrinterConfig(config.kitchen, config.bar, config.caisse);
    setSaved(true);
    setTimeout(() => onClose(), 700);
  };

  const printerName = (p) => p.name || p.displayName || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Printer className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Configuration des Imprimantes</h2>
              <p className="text-xs text-slate-500">Affectez les imprimantes thermiques matérielles</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-slate-800 border-t-slate-400 rounded-full animate-spin" />
            </div>
          ) : printers.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-400 mb-2">Aucune imprimante détectée.</p>
              <p className="text-xs text-slate-500 mb-4">
                Lancez l'application sous Electron pour détecter les imprimantes système.
              </p>
              <button
                onClick={loadPrinters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-600 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualiser
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500">
                  {printers.length} imprimante{printers.length > 1 ? "s" : ""} détectée{printers.length > 1 ? "s" : ""}
                </p>
                <button
                  onClick={loadPrinters}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Actualiser
                </button>
              </div>

              {/* Kitchen Printer */}
              <div className="mb-5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Imprimante Cuisine
                </label>
                <select
                  value={config.kitchen}
                  onChange={(e) => { setConfig({ ...config, kitchen: e.target.value }); setSaved(false); }}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">— Non assignée —</option>
                  {printers.map((p) => {
                    const name = printerName(p);
                    return <option key={name} value={name}>{name}</option>;
                  })}
                </select>
              </div>

              {/* Bar Printer */}
              <div className="mb-5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Imprimante Bar
                </label>
                <select
                  value={config.bar}
                  onChange={(e) => { setConfig({ ...config, bar: e.target.value }); setSaved(false); }}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">— Non assignée —</option>
                  {printers.map((p) => {
                    const name = printerName(p);
                    return <option key={name} value={name}>{name}</option>;
                  })}
                </select>
              </div>

              {/* Caisse / Receipt Printer */}
              <div className="mb-6">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Imprimante Caisse (Reçus)
                </label>
                <select
                  value={config.caisse || ""}
                  onChange={(e) => { setConfig({ ...config, caisse: e.target.value }); setSaved(false); }}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">— Non assignée —</option>
                  {printers.map((p) => {
                    const name = printerName(p);
                    return <option key={name} value={name}>{name}</option>;
                  })}
                </select>
              </div>

              <button
                onClick={handleSave}
                className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500"
              >
                {saved ? (
                  <><Check className="w-5 h-5" /> Enregistré</>
                ) : (
                  "Enregistrer la configuration"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}