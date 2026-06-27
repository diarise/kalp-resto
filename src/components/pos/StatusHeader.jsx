import React from "react";
import { UtensilsCrossed, User } from "lucide-react";

export default function StatusHeader() {
  return (
    <div className="h-14 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-6"
         style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-semibold text-gray-800 tracking-tight">
          Kalpé Resto
        </span>
        <span className="text-xs text-gray-400 font-medium ml-1">dashboard</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <User className="w-4 h-4" />
        <span>Serveur: <span className="font-medium text-gray-700">Aminata</span></span>
      </div>
    </div>
  );
}