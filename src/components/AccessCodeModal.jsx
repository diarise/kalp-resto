import React, { useState } from "react";
import { X, Lock, Download } from "lucide-react";

const VALID_CODES = ["CLIENT-DAKAR-2026", "DEVELOPER-MASTER"];
const AUTH_KEY = "kalpe_download_authorized";

export function isDownloadAuthorized() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "true" || localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function authorizeDownload() {
  try {
    sessionStorage.setItem(AUTH_KEY, "true");
  } catch {}
}

export default function AccessCodeModal({ open, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    if (VALID_CODES.includes(code.trim())) {
      authorizeDownload();
      setSubmitting(false);
      setCode("");
      onSuccess();
    } else {
      setSubmitting(false);
      setError("Code d'accès invalide. Veuillez contacter le support.");
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-sm w-full mx-4 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">Téléchargement protégé</h2>
          <p className="text-xs text-slate-500 mt-1.5">Entrez votre code d'accès pour télécharger l'application.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError("");
            }}
            placeholder="Code d'accès"
            autoFocus
            className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center tracking-wider"
          />

          {error && (
            <p className="text-xs text-rose-400 mt-2.5 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="w-full mt-4 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500"
          >
            <Download className="w-4 h-4" />
            Déverrouiller le téléchargement
          </button>
        </form>
      </div>
    </div>
  );
}