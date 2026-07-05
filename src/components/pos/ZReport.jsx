import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { offlineTransaction } from "@/lib/offlineDB";
import { generateZReportHtml, printThermalReceipt } from "@/lib/thermalReceipt";
import { getCurrentStaff } from "@/lib/staffSession";
import { getActiveShift, endShift } from "@/lib/shiftManager";
import { exportTransactionsToSari, downloadSariFile } from "@/lib/sariExport";
import { Calendar, Printer, FileBarChart, TrendingUp, Receipt, ShoppingBag, Clock, Download } from "lucide-react";

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

  const [sariExported, setSariExported] = useState(false);

  const handleCloseShift = async () => {
    setPrinting(true);
    setSariExported(false);
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

    // Print closure Z-report
    const html = generateZReportHtml({
      date: reportDate,
      transactions: shiftTx,
      cashierName: activeShift?.cashier_name,
    });
    await printThermalReceipt(html);

    // Auto-compile SARI ledger and trigger download
    if (shiftTx.length > 0) {
      const sariContent = exportTransactionsToSari(shiftTx);
      const shiftDate = new Date().toISOString().slice(0, 10);
      const cashierSlug = (activeShift?.cashier_name || "caisse").replace(/\s+/g, "_").toLowerCase();
      downloadSariFile(sariContent, `sari_cloture_${shiftDate}_${cashierSlug}.txt`);
      setSariExported(true);
    }

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
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <FileBarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Contrôle de caisse</h2>
              <p className="text-sm text-slate-500">Clôture de journée — {reportDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="text-sm text-slate-300 bg-transparent outline-none"
              />
            </div>
            <button
              onClick={handlePrint}
              disabled={printing || loading || txCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: "#0096D6" }}
            >
              <Printer className="w-4 h-4" />
              {printing ? "Impression..." : "Imprimer la clôture"}
            </button>
          </div>
        </div>

        {activeShift && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">Shift Actif — {activeShift.cashier_name}</p>
                <p className="text-xs text-slate-500">
                  Débuté le {new Date(activeShift.start_time).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseShift}
              disabled={printing || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-40"
            >
              <FileBarChart className="w-4 h-4" />
              {printing ? "Clôture..." : "Clôturer le shift"}
            </button>
            {sariExported && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
                <Download className="w-3.5 h-3.5" />
                Export SARI téléchargé
              </div>
            )}
          </div>
        )}
        {!activeShift && !loading && (
          <div className="bg-amber-500/10 rounded-2xl p-5 mb-6 border border-amber-500/20">
            <p className="text-sm font-medium text-amber-400">
              Aucun shift actif. Les ventes ne sont pas isolées par session. Reconnectez-vous pour démarrer un nouveau shift.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-slate-800 border-t-slate-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total</p>
                <p className="text-xl font-extrabold text-emerald-400">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3">
                  <Receipt className="w-5 h-5 text-sky-400" />
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Transactions</p>
                <p className="text-xl font-extrabold text-sky-400">{txCount}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Articles Vendus</p>
                <p className="text-xl font-extrabold text-amber-400">{totalItemsSold}</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Payment Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Par Mode de Paiement</h3>
                {Object.keys(byMethod).length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucune transaction ce jour</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(byMethod).map(([method, data]) => (
                      <div key={method} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                        <div>
                          <span className="text-sm font-medium text-slate-300">{METHOD_LABELS[method] || method}</span>
                          <span className="text-xs text-slate-600 ml-2">({data.count} tx)</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-100">{formatPrice(data.total)}</span>
                      </div>
                    ))}

                  </div>
                )}
              </div>

              {/* Top Items */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Top Articles</h3>
                {topItems.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucun article vendu ce jour</p>
                ) : (
                  <div className="space-y-2">
                    {topItems.map(([name, data], idx) => (
                      <div key={name} className="flex items-center gap-3 py-1.5">
                        <span className="text-xs font-bold text-slate-600 w-4">{idx + 1}</span>
                        <span className="text-sm font-medium text-slate-300 flex-1 truncate">{name}</span>
                        <span className="text-xs text-slate-500">{data.qty}x</span>
                        <span className="text-sm font-semibold text-slate-300 w-24 text-right">{formatPrice(data.revenue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {txCount === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-600">Aucune transaction enregistrée pour cette date.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}