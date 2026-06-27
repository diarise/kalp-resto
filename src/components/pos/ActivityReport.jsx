import React from "react";
import { TrendingUp, Receipt, ShoppingBag, Award, Trophy } from "lucide-react";

const STATS = [
  {
    label: "Ventes Totales",
    value: "345 500 CFA",
    icon: TrendingUp,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-700",
  },
  {
    label: "Tickets Ouverts",
    value: "5",
    icon: Receipt,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-blue-700",
  },
  {
    label: "Articles Vendus",
    value: "48",
    icon: ShoppingBag,
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-700",
  },
  {
    label: "Plat le Plus Populaire",
    value: "Yassa Poulet",
    icon: Award,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    valueColor: "text-purple-700",
  },
];

const TOP_ITEMS = [
  { name: "Yassa Poulet", qty: 14, revenue: 70000 },
  { name: "Thieboudienne", qty: 11, revenue: 66000 },
  { name: "Brochette de Boeuf", qty: 9, revenue: 45000 },
  { name: "Attiéké Poisson", qty: 7, revenue: 42000 },
  { name: "Mafé", qty: 5, revenue: 30000 },
  { name: "Jus de Bissap", qty: 18, revenue: 18000 },
];

const MAX_QTY = Math.max(...TOP_ITEMS.map((i) => i.qty));

export default function ActivityReport() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Rapport d'Activité</h2>
          <p className="text-sm text-gray-400 mt-1">
            Vue d'ensemble des ventes et performances — 27 Juin 2026
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-2xl p-5 border border-gray-100`}
                style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className={`text-xl font-extrabold ${stat.valueColor}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bar Graph */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-800">Top Articles Vendus</h3>
          </div>

          <div className="space-y-4">
            {TOP_ITEMS.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-32 shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>
                  <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                </div>
                <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-500"
                    style={{
                      width: `${(item.qty / MAX_QTY) * 100}%`,
                      background: idx === 0
                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : idx === 1
                        ? "linear-gradient(90deg, #0096D6, #38bdf8)"
                        : "linear-gradient(90deg, #64748b, #94a3b8)",
                    }}
                  >
                    <span className="text-xs font-bold text-white">{item.qty}</span>
                  </div>
                </div>
                <div className="w-24 shrink-0 text-right">
                  <span className="text-sm font-semibold text-gray-600">
                    {item.revenue.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-xs text-gray-400 ml-0.5">CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Données de démonstration — Kalpé Resto POS
        </p>
      </div>
    </div>
  );
}