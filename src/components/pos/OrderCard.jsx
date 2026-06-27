import React from "react";
import { Clock, CheckCircle } from "lucide-react";

function formatTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getModifierText(item) {
  const mods = [item.piment, item.cuisson, item.boisson].filter(Boolean);
  return mods.length > 0 ? mods.join(", ") : null;
}

export default function OrderCard({ order, onMarkReady }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
         style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{order.tableName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-300">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{formatTime(new Date(order.timestamp))}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 space-y-2">
        {order.items.map((item, idx) => {
          const modText = getModifierText(item);
          return (
            <div key={idx} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-gray-800 shrink-0">{item.qty}x</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{item.name}</p>
                  {modText && (
                    <p className="text-xs italic text-gray-400 mt-0.5">→ {modText}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onMarkReady(order.id)}
          className="w-full h-11 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: "#00A859" }}
        >
          <CheckCircle className="w-4 h-4" />
          Marquer comme Prêt
        </button>
      </div>
    </div>
  );
}