import React, { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";

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

export default function OrderCard({ order, onMarkReady }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = Math.floor((Date.now() - order.timestamp) / 1000);
  const isUrgent = elapsed >= 900; // 15+ minutes

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md flex flex-col overflow-hidden min-w-[320px]"
         style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between ${isUrgent ? "bg-rose-600" : "bg-gray-800"}`}>
        <span className="text-2xl font-extrabold text-white tracking-tight">{order.tableName}</span>
        <div className="flex items-center gap-1.5 text-white/90">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold">{getRelativeTime(order.timestamp)}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-5 py-4 space-y-3">
        {order.items.map((item, idx) => {
          const modText = getModifierText(item);
          return (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="flex items-start gap-3">
                <span className="text-3xl font-extrabold text-gray-900 shrink-0 leading-none">{item.qty}x</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-gray-800 leading-tight">{item.name}</p>
                  {modText && (
                    <p className="text-base italic text-amber-600 font-medium mt-1">→ {modText}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onMarkReady(order.id)}
          className="w-full h-16 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2.5 transition-all active:scale-95"
          style={{ backgroundColor: "#00A859" }}
        >
          <CheckCircle className="w-6 h-6" />
          ✓ Prêt à servir
        </button>
      </div>
    </div>
  );
}