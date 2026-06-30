import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { activateApp } from "@/lib/activation";

export default function ActivationLock() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activateApp(pin)) {
      window.location.reload();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "#0B0F1A" }}>
      <div
        className={`w-full max-w-md mx-4 rounded-2xl p-8 ${shake ? "animate-pulse" : ""}`}
        style={{ backgroundColor: "#141A2E", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid #1E2740" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#1E2740" }}>
            <Lock className="w-7 h-7" style={{ color: "#3B82F6" }} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">KALPÉ RESTO POS</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Licence non activée. Veuillez contacter l'administrateur.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Code d'activation
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              autoFocus
              placeholder="••••-••••-••••-••••"
              className="w-full h-12 rounded-xl px-4 text-center text-sm font-mono tracking-wider text-white outline-none transition-all"
              style={{ backgroundColor: "#0B0F1A", border: `1px solid ${error ? "#EF4444" : "#1E2740"}` }}
            />
            {error && (
              <p className="text-xs text-red-400 mt-2 text-center">Code d'activation incorrect.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ backgroundColor: "#3B82F6" }}
          >
            <ShieldCheck className="w-4 h-4" />
            Activer la licence
          </button>
        </form>

        <p className="text-[11px] text-slate-600 text-center mt-6">
          © 2024 Kalpé Resto · Tous droits réservés
        </p>
      </div>
    </div>
  );
}