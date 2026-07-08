import React from "react";
import { Link } from "react-router-dom";
import { Download, Wifi, Calculator, Printer, MonitorSmartphone, MessageCircle, Mail, ArrowRight, Terminal } from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/diarise/kalp-resto/releases/download/v1.0.0-beta/Sapphire-Restaurant-POS-Setup-1.0.0.2.exe";

const WHATSAPP_URL = "https://wa.me/14242790150";
const WHATSAPP_DISPLAY = "+1 424 279 0150";
const EMAIL_DISPLAY = "diarise@gmail.com";

const FEATURES = [
  {
    icon: Wifi,
    color: "text-emerald-400",
    glow: "bg-emerald-500/10 ring-emerald-500/20",
    title: "Autonomie Totale",
    desc: "Fonctionne à 100% hors-ligne sans coupure. Aucune dépendance internet pour encaisser, imprimer ou clôturer la caisse.",
  },
  {
    icon: Calculator,
    color: "text-sky-400",
    glow: "bg-sky-500/10 ring-sky-500/20",
    title: "Comptabilité Auto (SAGE)",
    desc: "Exportation directe des écritures au format SAGE. Vos rapports financiers et écritures comptables prêts en un clic.",
  },
  {
    icon: Printer,
    color: "text-orange-400",
    glow: "bg-orange-500/10 ring-orange-500/20",
    title: "Imprimerie Smart (Cuisine / Bar / Rapports)",
    desc: "Tickets de préparation cuisine et bar, reçus de caisse 58mm et rapports Z de clôture — impression thermique silencieuse native.",
  },
  {
    icon: MonitorSmartphone,
    color: "text-violet-400",
    glow: "bg-violet-500/10 ring-violet-500/20",
    title: "Interface Tactile",
    desc: "Layout app-natif avec clavier virtuel personnalisé, navigation gestuelle et affichage optimisé pour écrans tactiles POS.",
  },
];

const STATS = [
  { value: "100%", label: "Hors-ligne" },
  { value: "<1s", label: "Encaissement" },
  { value: "80mm", label: "Thermique Natif" },
  { value: "24/7", label: "Support Direct" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 antialiased overflow-x-hidden">
      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-600/15 blur-[130px]" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-[#0B0F19]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">SAPPHIRE POS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/terminal"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-slate-300 text-sm font-medium hover:text-white transition-colors"
            >
              Accéder au terminal
            </Link>
            <a
              href={DOWNLOAD_URL}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0B0F19] text-sm font-semibold hover:bg-slate-200 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Version Production 1.0.0.2 — Déploiement Live
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            La caisse qui pense
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              comme un restaurateur
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Système de point de vente intelligent, ultra-rapide et 100% autonome.
            Encaissez, imprimez et clôturez votre caisse — même sans internet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={DOWNLOAD_URL}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-[#0B0F19] text-base font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-2xl shadow-white/10"
            >
              <Download className="w-5 h-5" />
              Télécharger pour Windows
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base font-semibold hover:bg-white/10 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Contacter le support
            </a>
          </div>

          <p className="text-sm text-slate-500 mt-5">
            Installation en un clic · Windows 10/11 · 100% hors-ligne
          </p>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Une plateforme complète
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Tout ce dont votre restaurant a besoin, dans une seule application native.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative bg-white/[0.03] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.05]"
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${f.glow} ring-1 flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-7 h-7 ${f.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-sky-600/20 via-violet-600/15 to-emerald-600/20 border border-white/10 p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sky-500/20 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-500/20 blur-[80px]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Prêt à digitaliser votre restaurant ?
              </h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Téléchargez l'application maintenant et activez votre terminal de caisse en quelques minutes.
              </p>
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-[#0B0F19] text-base font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-2xl shadow-black/30"
              >
                <Download className="w-5 h-5" />
                Télécharger — v1.0.0.2
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Parlons de votre projet
            </h2>
            <p className="text-slate-400">
              Notre équipe support est disponible pour vous accompagner dans le déploiement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white/[0.03] rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                <p className="font-semibold text-white truncate">{WHATSAPP_DISPLAY}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-auto shrink-0" />
            </a>

            <a
              href={`mailto:${EMAIL_DISPLAY}`}
              className="group flex items-center gap-4 bg-white/[0.03] rounded-2xl p-6 border border-white/5 hover:border-sky-500/30 hover:bg-white/[0.05] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                <p className="font-semibold text-white truncate">{EMAIL_DISPLAY}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all ml-auto shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-8 px-6 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500">
          © 2026 Sapphire Restaurant POS · Tous droits réservés
        </p>
      </footer>
    </div>
  );
}