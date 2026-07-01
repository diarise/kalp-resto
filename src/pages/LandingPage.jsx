import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VALID_KEYS = ["CLIENT-DAKAR-2026", "DEVELOPER-MASTER"];
const DOWNLOADS = {
  win: "https://github.com/diarise/kalp-resto/releases/download/v1.0.0/Kalpe-Resto-POS-Windows-Installer.zip",
  mac: "/release/Kalpe Resto POS-0.0.0.dmg",
};

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    ),
    bg: "bg-emerald-500/10",
    title: "Autonomie Totale",
    desc: "Fonctionne à 100% hors-ligne sans coupure. Aucune dépendance internet pour encaisser ou imprimer.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4M9 7h6m-6 4h6m-6 4h6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>
    ),
    bg: "bg-blue-500/10",
    title: "Comptabilité Automatique",
    desc: "Exportation directe des écritures au format SAGE. Vos rapports financiers prêts en un clic.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
    ),
    bg: "bg-orange-500/10",
    title: "Impression Thermique Native",
    desc: "Gestion automatique des tickets de caisse et rapports Z en 80mm. Impression silencieuse intégrée.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
    ),
    bg: "bg-purple-500/10",
    title: "Sécurité Totale",
    desc: "Gestion d'accès par code PIN pour serveurs et gérants. Chaque action est tracée et sécurisée.",
  },
];

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
);

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState("code");
  const [inputCode, setInputCode] = useState("");
  const [isError, setIsError] = useState(false);

  const openModal = () => {
    setModalStep("code");
    setInputCode("");
    setIsError(false);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const validateCode = () => {
    if (VALID_KEYS.includes(inputCode.trim().toUpperCase())) {
      setModalStep("platform");
      setIsError(false);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <span className="font-bold tracking-tight">Kalpé Resto</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app" className="px-4 py-2 rounded-lg text-slate-300 text-sm font-medium hover:text-white transition-colors">
              Accéder au terminal
            </Link>
            <button onClick={openModal} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-semibold hover:bg-white transition-colors">
              Télécharger
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6" style={{ background: "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 60%, #020617 100%)" }}>
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Version Écosystème 2026 opérationnelle
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            KALPÉ RESTO POS
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
            Le système de caisse intelligent, ultra-rapide et 100% autonome. Encaisser sans limites, même hors-ligne.
          </p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-100 text-slate-900 text-base font-bold hover:bg-white transition-all active:scale-95 shadow-2xl shadow-slate-100/10">
            <DownloadIcon className="w-5 h-5" />
            Télécharger l'application
          </button>
          <p className="text-sm text-slate-500 mt-4">Windows & macOS · Installation en un clic</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Une plateforme complète</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Prêt à digitaliser votre restaurant ?</h2>
          <p className="text-slate-400 mb-8">Téléchargez l'application et activez votre terminal de caisse en quelques minutes.</p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-100 text-slate-900 text-base font-bold hover:bg-white transition-all active:scale-95">
            <DownloadIcon className="w-5 h-5" />
            Télécharger l'application
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center">
        <p className="text-sm text-slate-500">© 2026 Kalpé Resto · Tous droits réservés</p>
      </footer>

      {/* DOWNLOAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>

          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {modalStep === "code" ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <h2 className="text-lg font-bold">Télécharger sécurisé</h2>
                  <p className="text-sm text-slate-400 mt-1">Entrez votre code d'accès de téléchargement unique.</p>
                </div>

                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value); setIsError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") validateCode(); }}
                  placeholder="XXXX-XXXX-XXXX"
                  autoFocus
                  className="w-full h-12 rounded-xl bg-slate-950 border border-slate-800 text-center text-sm font-mono tracking-wider text-white outline-none focus:border-slate-600 transition-colors"
                />

                {isError && (
                  <div className="mt-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                    <p className="text-sm text-red-400 font-medium">Code invalide. Veuillez contacter l'administrateur.</p>
                  </div>
                )}

                <button onClick={validateCode} className="w-full h-12 mt-4 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-white transition-all active:scale-95">
                  Vérifier l'autorisation
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h2 className="text-lg font-bold">Autorisation accordée</h2>
                  <p className="text-sm text-slate-400 mt-1">Sélectionnez votre système d'exploitation.</p>
                </div>

                <div className="space-y-3">
                  <a href={DOWNLOADS.win} target="_blank" rel="noopener noreferrer" className="w-full h-16 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-base">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
                    Télécharger pour Windows (.exe)
                  </a>
                  <a href={DOWNLOADS.mac} download className="w-full h-16 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-base border border-slate-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Télécharger pour Mac (.dmg)
                  </a>
                </div>

                <p className="text-xs text-slate-500 text-center mt-5">Une fois installé, utilisez votre clé de licence pour activer le terminal de caisse.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}