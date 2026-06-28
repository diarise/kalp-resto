import React from "react";
import { ChefHat, PackageOpen } from "lucide-react";
import OrderCard from "@/components/pos/OrderCard";

export default function KitchenView({ orders, onAdvance }) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="shrink-0 px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Écran Cuisine</h2>
            <p className="text-xs text-gray-400">Commandes en préparation</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {orders.length} commande{orders.length > 1 ? "s" : ""} en cours
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">Aucune commande en attente en cuisine</p>
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {orders.map((order) => (
              <div key={order.id} className="snap-start">
                <OrderCard order={order} onAdvance={onAdvance} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}