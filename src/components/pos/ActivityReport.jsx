import React, { useState, useEffect } from "react";
import { TrendingUp, Receipt, ShoppingBag, Award, Trophy } from "lucide-react";
import { offlineTransaction } from "@/lib/offlineDB";

function formatCFA(price) {
  return (price || 0).toLocaleString("fr-FR") + " CFA";
}

export default function ActivityReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const all = await offlineTransaction.list("-timestamp", 1000);
        if (!cancelled) setTransactions(all || []);
      } catch {
        if (!cancelled) setTransactions([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Compute live stats from transactions
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const txCount = transactions.length;

  // Aggregate items sold
  const itemMap = {};
  let totalItemsSold = 0;
  for (const t of transactions) {
    let items = t.items_snapshot;
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch { items = []; }
    }
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const name = item.name || "Inconnu";
      if (!itemMap[name]) itemMap[name] = { qty: 0, revenue: 0 };
      itemMap[name].qty += item.qty || 0;
      itemMap[name].revenue += (item.qty || 0) * (item.price || 0);
      totalItemsSold += item.qty || 0;
    }
  }

  const topItems = Object.entries(itemMap)
    .sort((a, b) => b[1].qty - a[1].qty);
  const maxQty = topItems.length > 0 ? topItems[0][1].qty : 1;
  const mostPopular = topItems.length > 0 ? topItems[0][0] : "—";

  const STATS = [
    {
      label: "Ventes Totales",
      value: formatCFA(totalRevenue),
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },
    {
      label: "Tickets Fermés",
      value: String(txCount),
      icon: Receipt,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      label: "Articles Vendus",
      value: String(totalItemsSold),
      icon: ShoppingBag,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
    },
    {
      label: "Plat le Plus Populaire",
      value: mostPopular,
      icon: Award,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
  ];

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Rapport d'Activité</h2>
          <p className="text-sm text-gray-400 mt-1">
            Vue d'ensemble des ventes et performances — {today}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-gray-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
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
                    <p className={`text-xl font-extrabold ${stat.valueColor} ${stat.value.length > 12 ? "text-base" : ""}`}>
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

              {topItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Aucune vente enregistrée pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {topItems.map(([name, data], idx) => (
                    <div key={name} className="flex items-center gap-4">
                      <div className="w-32 shrink-0 flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>
                        <span className="text-sm font-medium text-gray-700 truncate">{name}</span>
                      </div>
                      <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                        <div
                          className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-500"
                          style={{
                            width: `${(data.qty / maxQty) * 100}%`,
                            background: idx === 0
                              ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                              : idx === 1
                              ? "linear-gradient(90deg, #0096D6, #38bdf8)"
                              : "linear-gradient(90deg, #64748b, #94a3b8)",
                          }}
                        >
                          <span className="text-xs font-bold text-white">{data.qty}</span>
                        </div>
                      </div>
                      <div className="w-24 shrink-0 text-right">
                        <span className="text-sm font-semibold text-gray-600">
                          {data.revenue.toLocaleString("fr-FR")}
                        </span>
                        <span className="text-xs text-gray-400 ml-0.5">CFA</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}