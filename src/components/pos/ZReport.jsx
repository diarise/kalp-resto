import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { offlineTransaction } from "@/lib/offlineDB";
import { generateZReportHtml, printThermalReceipt } from "@/lib/thermalReceipt";
import { getCurrentStaff } from "@/lib/staffSession";
import { getActiveShift, endShift } from "@/lib/shiftManager";
import { Calendar, Printer, FileBarChart, TrendingUp, Receipt, ShoppingBag, Clock } from "lucide-react";

export default function ZReport() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [printing, setPrinting] = useState(false);
  const [activeShift, setActiveShift] = useState(() => getActiveShift());

  useEffect(() => {
    if (!getCurrentStaff()) navigate("/");
  }, [navigate]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const all = await offlineTransaction.list("-timestamp", 1000);
      setTransactions(all || []);
    } catch {
      setTransactions([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // When an active shift exists, isolate sales by shift_id; otherwise fall back to date
  const dayTx = activeShift
    ? transactions.filter((t) => t.shift_id === activeShift.id)
    : transactions.filter((t) => {
        if (!t.timestamp) return false;
        const d = new Date(t.timestamp);
        return d.toISOString().slice(0, 10) === reportDate;
      });

  const totalRevenue = dayTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const txCount = dayTx.length;

  const byMethod = {};
  for (const t of dayTx) {
    const m = t.payment_method || "autre";
    if (!byMethod[m]) byMethod[m] = { count: 0, total: 0 };
    byMethod[m].count++;
    byMethod[m].total += t.total_amount || 0;
  }

  const itemMap = {};
  let totalItemsSold = 0;
  for (const t of dayTx) {
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
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 8);

  const TVA_RATE = 0.18;
  const totalTVA = Math.round(totalRevenue * TVA_RATE / 1.18);
  const totalHT = totalRevenue - totalTVA;

  const formatPrice = (price) => (price || 0).toLocaleString("fr-FR") + " CFA";

  const handlePrint = async () => {
    setPrinting(true);
    const html = generateZReportHtml({
      date: reportDate,
      transactions: dayTx,
      cashierName: activeShift?.cashier_name || getCurrentStaff()?.name,
    });
    await printThermalReceipt(html);
    setPrinting(false);
  };

  const handleCloseShift = async () => {
    setPrinting(true);
    const shiftTx = transactions.filter((t) => t.shift_id === activeShift?.id);
    const totalRevenue = shiftTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    const byMethod = {};
    for (const t of shiftTx) {
      const m = t.payment_method || "autre";
      if (!byMethod[m]) byMethod[m] = { count: 0, total: 0 };
      byMethod[m].count++;
      byMethod[m].total += t.total_amount || 0;
    }
    endShift({
      total_amount: totalRevenue,
      transaction_count: shiftTx.length,
      by_method: byMethod,
    });
    const html = generateZReportHtml({
      date: reportDate,
      transactions: shiftTx,
      cashierName: activeShift?.cashier_name,
    });
    await printThermalReceipt(html);
    setActiveShift(null);
    setPrinting(false);
  };

  const METHOD_LABELS = {
    especes: "Espèces",
    wave: "Wave",
    orange_money: "Orange Money",
    carte: "Carte",
    autre: "Autre",
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <FileBarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Rapport Z</h2>
              <p className="text-sm text-gray-400">Clôture de journée — {reportDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none"
              />
            </div>
            <button
              onClick={handlePrint}
              disabled={printing || loading || txCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: "#0096D6" }}
            >
              <Printer className="w-4 h-4" />
              {printing ? "Impression..." : "Imprimer Z"}
            </button>
          </div>
        </div>

        {activeShift && (
          <div className="bg-slate-800 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Shift Actif — {activeShift.cashier_name}</p>
                <p className="text-xs text-slate-400">
                  Débuté le {new Date(activeShift.start_time).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseShift}
              disabled={printing || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-40"
            >
              <FileBarChart className="w-4 h-4" />
              {printing ? "Clôture..." : "Clôturer le shift"}
            </button>
          </div>
        )}
        {!activeShift && !loading && (
          <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-200">
            <p className="text-sm font-medium text-amber-700">
              Aucun shift actif. Les ventes ne sont pas isolées par session. Reconnectez-vous pour démarrer un nouveau shift.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-gray-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total TTC</p>
                <p className="text-xl font-extrabold text-emerald-700">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Transactions</p>
                <p className="text-xl font-extrabold text-blue-700">{txCount}</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Articles Vendus</p>
                <p className="text-xl font-extrabold text-amber-700">{totalItemsSold}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center mb-3">
                  <FileBarChart className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total HT</p>
                <p className="text-xl font-extrabold text-slate-700">{formatPrice(totalHT)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Payment Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Par Mode de Paiement</h3>
                {Object.keys(byMethod).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Aucune transaction ce jour</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(byMethod).map(([method, data]) => (
                      <div key={method} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <span className="text-sm font-medium text-gray-700">{METHOD_LABELS[method] || method}</span>
                          <span className="text-xs text-gray-400 ml-2">({data.count} tx)</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{formatPrice(data.total)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-800">Total TVA (18%)</span>
                      <span className="text-sm font-bold text-gray-600">{formatPrice(totalTVA)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Items */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)" }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top Articles</h3>
                {topItems.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Aucun article vendu ce jour</p>
                ) : (
                  <div className="space-y-2">
                    {topItems.map(([name, data], idx) => (
                      <div key={name} className="flex items-center gap-3 py-1.5">
                        <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>
                        <span className="text-sm font-medium text-gray-700 flex-1 truncate">{name}</span>
                        <span className="text-xs text-gray-400">{data.qty}x</span>
                        <span className="text-sm font-semibold text-gray-600 w-24 text-right">{formatPrice(data.revenue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {txCount === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-300">Aucune transaction enregistrée pour cette date.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}