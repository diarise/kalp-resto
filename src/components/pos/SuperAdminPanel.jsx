import React, { useState } from "react";
import { ShieldAlert, Trash2, Database, AlertTriangle, CheckCircle, Printer, ChefHat, Wine, Receipt } from "lucide-react";
import { offlineTransaction } from "@/lib/offlineDB";
import { getPrinterConfig } from "@/lib/printerConfig";

export default function SuperAdminPanel({ onOpenPrinterConfig }) {
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState(null);

  const config = getPrinterConfig();

  const handleResetDatabase = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer TOUTES les données de test ?\n\nCette action effacera définitivement :\n• Toutes les transactions encaissées\n• Tous les tickets de livraison\n• L'historique des commandes\n\nLe système sera réinitialisé à 0 CFA."
    );
    if (!confirmed) return;

    setResetting(true);
    setResetResult(null);
    try {
      await offlineTransaction.clearAll();
      // Clear all local POS state
      localStorage.removeItem("kalpe_tables");
      localStorage.removeItem("kalpe_kitchen_orders");
      localStorage.removeItem("kalpe_bar_orders");
      localStorage.removeItem("kalpe_delivery_orders");

      setResetResult({ success: true, message: "Base de données réinitialisée avec succès. Le système est prêt pour la production." });
    } catch (e) {
      setResetResult({ success: false, message: "Erreur lors de la réinitialisation: " + (e.message || "inconnue") });
    }
    setResetting(false);
  };

  const printerTargets = [
    { id: "kitchen", label: "Imprimante Cuisine", icon: ChefHat, desc: "Routing tickets de préparation cuisine", value: config.kitchen },
    { id: "bar", label: "Imprimante Bar", icon: Wine, desc: "Routing tickets boissons & chichas", value: config.bar },
    { id: "caisse", label: "Imprimante Caisse", icon: Receipt, desc: "Reçus, factures & clôtures", value: config.caisse },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Zone Technique</h2>
            <p className="text-sm text-slate-500">Super Admin — Administration système & configuration matériel</p>
          </div>
        </div>

        {/* Printer Configuration Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Printer className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Configuration Tri-Cible des Imprimantes</h3>
                <p className="text-xs text-slate-500">Affectation des destinations matérielles pour le routing print-silent</p>
              </div>
            </div>
            <button
              onClick={onOpenPrinterConfig}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-95"
              style={{ backgroundColor: "#0096D6" }}
            >
              <Printer className="w-4 h-4" />
              Configurer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {printerTargets.map((target) => {
              const Icon = target.icon;
              const isAssigned = target.value && target.value !== "";
              return (
                <div
                  key={target.id}
                  className={`rounded-xl border p-4 ${
                    isAssigned
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-slate-800/50 border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${isAssigned ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{target.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{target.desc}</p>
                  <p className={`text-sm font-semibold truncate ${isAssigned ? "text-emerald-400" : "text-slate-600"}`}>
                    {isAssigned ? target.value : "— Non assignée —"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-300">Zone Dangereuse</h3>
              <p className="text-xs text-red-400/70">Actions irréversibles — à utiliser avec précaution</p>
            </div>
          </div>

          <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <Database className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-100">Réinitialiser la Base de Données</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supprime définitivement toutes les transactions, tickets de livraison, commandes cuisine/bar,
                  et réinitialise les tables. Le système repasse à 0 CFA pour le lancement en production.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetDatabase}
              disabled={resetting}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {resetting ? "Réinitialisation en cours..." : "Réinitialiser la Base de Données"}
            </button>

            {resetResult && (
              <div
                className={`mt-4 flex items-start gap-2 p-3 rounded-lg ${
                  resetResult.success
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {resetResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <p className={`text-xs font-medium ${resetResult.success ? "text-emerald-300" : "text-red-300"}`}>
                  {resetResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}