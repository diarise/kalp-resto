import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { offlineTransaction } from "@/lib/offlineDB";
import { exportTransactionsToSari, downloadSariFile } from "@/lib/sariExport";
import { getCurrentStaff } from "@/lib/staffSession";
import { Search, Download, FileText, Receipt } from "lucide-react";

export default function TransactionLedger() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "", waiter: "", invoice: "" });

  useEffect(() => {
    if (!getCurrentStaff()) navigate("/");
  }, [navigate]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const all = await offlineTransaction.list("-timestamp", 500);
      setTransactions(all || []);
    } catch (e) {
      setTransactions([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = transactions.filter((t) => {
    if (filters.date) {
      const d = new Date(t.timestamp);
      const local = d.toLocaleDateString("fr-CA");
      if (local !== filters.date) return false;
    }
    if (filters.waiter && !(t.waiter_name || t.cashier_name || "").toLowerCase().includes(filters.waiter.toLowerCase()))
      return false;
    if (filters.invoice && !(t.invoice_number || "").toLowerCase().includes(filters.invoice.toLowerCase()))
      return false;
    return true;
  });

  const totalSum = filtered.reduce((sum, t) => sum + (t.total_amount || 0), 0);

  const handleExport = () => {
    if (filtered.length === 0) return;
    const content = exportTransactionsToSari(filtered);
    const today = new Date().toISOString().slice(0, 10);
    downloadSariFile(content, `sari_export_${today}.txt`);
  };

  const formatPrice = (price) => (price || 0).toLocaleString("fr-FR") + " CFA";
  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Journal des Transactions</h2>
            <p className="text-xs text-slate-500">{filtered.length} transaction{filtered.length > 1 ? "s" : ""} · Total: {formatPrice(totalSum)}</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: "#0096D6" }}
        >
          <Download className="w-4 h-4" />
          Export SARI
        </button>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="text-sm text-slate-300 bg-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par serveur..."
            value={filters.waiter}
            onChange={(e) => setFilters({ ...filters, waiter: e.target.value })}
            className="text-sm text-slate-300 bg-transparent outline-none flex-1 placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="N° facture..."
            value={filters.invoice}
            onChange={(e) => setFilters({ ...filters, invoice: e.target.value })}
            className="text-sm text-slate-300 bg-transparent outline-none flex-1 placeholder:text-slate-600"
          />
        </div>
        {(filters.date || filters.waiter || filters.invoice) && (
          <button
            onClick={() => setFilters({ date: "", waiter: "", invoice: "" })}
            className="text-xs text-slate-500 hover:text-slate-300 font-medium"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-slate-800 border-t-slate-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Facture</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Caissier</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Table</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Paiement</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Montant</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-200">{t.invoice_number}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{formatTime(t.timestamp)}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{t.cashier_name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{t.table_name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{t.payment_method || "—"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-100 text-right">{formatPrice(t.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}