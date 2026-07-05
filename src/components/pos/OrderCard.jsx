import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import OrderStepper from "@/components/pos/OrderStepper";

function getModifierText(item) {
  const mods = [item.piment, item.cuisson, item.boisson].filter(Boolean);
  return mods.length > 0 ? mods.join(", ") : null;
}

function getRelativeTime(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "Reçu à l'instant";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `Reçu il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `Reçu il y a ${hrs}h ${mins % 60}min`;
}

export default function OrderCard({ order, onAdvance }) {
  const [, setTick] = useState(0);
  const isCancelled = order.cancelled;

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = Math.floor((Date.now() - order.timestamp) / 1000);
  const isUrgent = elapsed >= 900; // 15+ minutes

  const STATUS_BORDER_COLOR = {
    pending: "#0096D6",
    preparing: "#F59E0B",
    ready: "#00A859",
    served: "#6B7280",
  };
  const orderStatus = order.status || "pending";
  const borderColor = STATUS_BORDER_COLOR[orderStatus];

  return (
    <div className={`bg-slate-900 rounded-2xl border-4 flex flex-col overflow-hidden min-w-[320px] relative ${isCancelled ? "border-rose-500 animate-pulse" : "border-slate-800"}`}>
      {/* Status top-border line */}
      <div className="h-1.5 w-full" style={{ backgroundColor: isCancelled ? "#ef4444" : borderColor }} />

      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between ${isCancelled ? "bg-rose-600 animate-pulse" : isUrgent ? "bg-rose-600" : "bg-slate-800"}`}>
        <span className="text-2xl font-extrabold text-white tracking-tight">{order.tableName}</span>
        {isCancelled ? (
          <span className="text-sm font-extrabold text-white">*** ANNULÉE ***</span>
        ) : (
          <div className="flex items-center gap-1.5 text-white/90">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold">{getRelativeTime(order.timestamp)}</span>
          </div>
        )}
      </div>
      {isCancelled && (
        <div className="px-5 py-3 bg-rose-900/50 border-b border-rose-500 text-center">
          <p className="text-lg font-extrabold text-rose-300">⚠ COMMANDE ANNULÉE</p>
          <p className="text-xs text-rose-400 mt-1">Veuillez ignorer cette commande</p>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="px-5 pt-3 pb-2.5 bg-slate-950/50 border-b border-slate-800">
        <OrderStepper status={orderStatus} variant="kitchen" />
      </div>

      {/* Items */}
      <div className="flex-1 px-5 py-4 space-y-3">
        {order.items.map((item, idx) => {
          const modText = getModifierText(item);
          return (
            <div key={idx} className={`border-b border-slate-800 last:border-0 pb-3 last:pb-0 ${isCancelled ? "opacity-50 line-through" : ""}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl font-extrabold text-slate-100 shrink-0 leading-none">{item.qty}x</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-slate-100 leading-tight">{item.name}</p>
                  {modText && (
                    <p className="text-base italic text-amber-400 font-medium mt-1">→ {modText}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action — 3-stage state machine */}
      <div className="px-4 pb-4">
        {isCancelled ? (
          <button
            onClick={() => onAdvance(order.id)}
            className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ backgroundColor: "#6B7280" }}
          >
            ✓ Confirmer l'annulation
          </button>
        ) : orderStatus === "preparing" ? (
          <button
            onClick={() => onAdvance(order.id)}
            className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:brightness-110"
            style={{ backgroundColor: "#F59E0B" }}
          >
            ⏳ Marquer comme Prêt
          </button>
        ) : orderStatus === "ready" ? (
          <button
            onClick={() => onAdvance(order.id)}
            className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:brightness-110"
            style={{ backgroundColor: "#00A859" }}
          >
            🍽️ Confirmer la Livraison
          </button>
        ) : (
          <button
            onClick={() => onAdvance(order.id)}
            className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:brightness-110"
            style={{ backgroundColor: "#0096D6" }}
          >
            👨‍🍳 Commencer la préparation
          </button>
        )}
      </div>
    </div>
  );
}