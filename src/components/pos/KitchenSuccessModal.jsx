import React from "react";
import { X, CheckCircle, ChefHat, Wine } from "lucide-react";

export default function KitchenSuccessModal({ table, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
        style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">Commande envoyée!</h2>
          <p className="text-sm text-gray-400 mb-6">{table?.name}</p>

          <div className="flex gap-3 w-full">
            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-4 flex flex-col items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 text-center">
                Plats envoyés en Cuisine!
              </span>
            </div>
            <div className="flex-1 bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex flex-col items-center gap-2">
              <Wine className="w-6 h-6 text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-700 text-center">
                Boissons envoyées au Bar!
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-5">Fermeture automatique…</p>
        </div>
      </div>
    </div>
  );
}