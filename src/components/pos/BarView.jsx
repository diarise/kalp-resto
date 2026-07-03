import React from "react";
import { Wine, PackageOpen } from "lucide-react";
import OrderCard from "@/components/pos/OrderCard";

export default function BarView({ orders, onAdvance }) {
  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="shrink-0 px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Wine className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Écran Bar</h2>
            <p className="text-xs text-slate-500">Boissons à préparer</p>
          </div>
        </div>
        <span className="text-sm text-slate-400">
          {orders.length} commande{orders.length > 1 ? "s" : ""} en cours
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <PackageOpen className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">Aucune commande en attente au bar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onAdvance={onAdvance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}