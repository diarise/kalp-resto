import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const whatsappNumber = "14242790150";
  const emailAddress = "diarise@gmail.com";
  const downloadUrl = "https://github.com/diarise/kalp-resto/releases/download/v1.0.0-beta/Sapphire-Restaurant-POS-Setup-1.0.0.2.exe";

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Premium Ambient Background Mesh Glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Global Navigation Bar */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-[#060913]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-black text-xl tracking-tighter">K</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              KALPÉ <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">RESTO</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/terminal" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
              Démo
            </Link>
            <a 
              href={downloadUrl}
              className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              Télécharger
            </a>
          </div>
        </div>
      </nav>

      {/* High-Converting Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-indigo-300 uppercase">Écosystème 2026 prêt pour déploiement</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.12]">
          La caisse qui pense <br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            comme un restaurateur
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
          Système de point de vente intelligent, ultra-rapide et 100% autonome. Encaissez, gérez vos livraisons et clôturez votre caisse en toute sérénité — même sans connexion internet.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a 
            href={downloadUrl}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-base font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/20 text-center group"
          >
            Télécharger pour Windows
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank" 
            rel="noreferrer"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-base font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-center"
          >
            Contacter le support
          </a>
        </div>
        
        {/* Quick Trust Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20 pt-10 border-t border-slate-900/60">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Hors-ligne fonctionnel</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">&lt; 1s</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Vitesse d'encaissement</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">80mm</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Impression Native</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">24/7</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Assistance directe</div>
          </div>
        </div>
      </header>

      {/* Main Core Features Matrix Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Une plateforme complète</h2>
          <p className="text-slate-500 mt-2">Tout ce dont votre restaurant a besoin, dans une seule application native ultra-légère.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl hover:border-slate-800 transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5 5 0 00-4.591-2.82A1 1 0 0022 13V15z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Autonomie Totale</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Fonctionne à 100% sans coupure. Aucune dépendance internet requise pour encaisser, imprimer ou clôturer la caisse en fin de journée.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl hover:border-slate-800 transition-all">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comptabilité Auto (SAGE)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Exportation directe de vos ventes au format comptable standard SAGE. Vos rapports financiers et écritures sont prêts en un seul clic.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl hover:border-slate-800 transition-all">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-14V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3h6z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Imprimerie Smart (Cuisine / Bar / Livraisons)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Routage intelligent des tickets de préparation vers la cuisine ou le bar sans doublons. Gestion optimisée des reçus clients et rapports de caisse.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-2xl hover:border-slate-800 transition-all">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interface Tactile</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Parfaitement adapté aux écrans tactiles professionnels. Navigation fluide, clavier de saisie virtuelle réactif intégré de manière native.</p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        <div className="bg-gradient-to-b from-indigo-950/20 to-slate-950/40 border border-indigo-500/10 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-sm">
          <h2 className="text-3xl font-extrabold text-white mb-4">Prêt à digitaliser votre restaurant ?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Téléchargez l'application maintenant et activez votre terminal de caisse autonome en quelques minutes.
          </p>
          <a 
            href={downloadUrl}
            className="inline-block bg-white hover:bg-slate-100 text-slate-950 text-base font-bold px-8 py-3.5 rounded-xl transition-all shadow-md"
          >
            Télécharger l'application
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-6 pb-24 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">Parlons de votre projet</h2>
        <p className="text-slate-500 text-sm mb-8">Notre équipe support est disponible pour vous accompagner dans le déploiement matériel et logiciel.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between bg-slate-900/50 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">WA</div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">WhatsApp</div>
                <div className="text-sm font-semibold text-white mt-0.5">+1 424 279 0150</div>
              </div>
            </div>
            <span className="text-slate-600 font-bold">→</span>
          </a>

          <a 
            href={`mailto:${emailAddress}`}
            className="flex items-center justify-between bg-slate-900/50 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center font-bold">@</div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Direct</div>
                <div className="text-sm font-semibold text-white mt-0.5">{emailAddress}</div>
              </div>
            </div>
            <span className="text-slate-600 font-bold">→</span>
          </a>
        </div>
      </section>

      {/* Footer Ecosystem Copyright */}
      <footer className="border-t border-slate-950 bg-[#04060d] py-8 text-center text-xs text-slate-600 relative z-10">
        <p>© 2026 Kalpé Resto • Tous droits réservés.</p>
      </footer>
      
    </div>
  );
}