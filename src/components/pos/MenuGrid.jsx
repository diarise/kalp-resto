import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menuData";

const CATEGORY_PLACEHOLDERS = {
  plats: { bg: "bg-amber-50", emoji: "🍛" },
  grills: { bg: "bg-rose-50", emoji: "🔥" },
  poulet: { bg: "bg-orange-50", emoji: "🍗" },
  poisson: { bg: "bg-cyan-50", emoji: "🐟" },
  mer: { bg: "bg-blue-50", emoji: "🍤" },
  pates: { bg: "bg-orange-50", emoji: "🍝" },
  accompagnement: { bg: "bg-stone-50", emoji: "🍟" },
  supplements: { bg: "bg-gray-50", emoji: "➕" },
  boissons: { bg: "bg-cyan-50", emoji: "🥤" },
  entrees: { bg: "bg-emerald-50", emoji: "🥗" },
  desserts: { bg: "bg-pink-50", emoji: "🍰" },
  fast_food: { bg: "bg-amber-50", emoji: "🍔" },
  chichas: { bg: "bg-purple-50", emoji: "💨" },
  sale: { bg: "bg-red-50", emoji: "🍖" },
};

export default function MenuGrid({ activeTable, onBack, onAddItem, menuItems }) {
  const [activeCategory, setActiveCategory] = useState("plats");

  const items = menuItems || MENU_ITEMS;
  const filteredItems = items.filter((item) => item.category === activeCategory);

  const formatPrice = (price) => {
    return price.toLocaleString("fr-FR") + " CFA";
  };

  return (
    <div className="h-full flex flex-col w-full min-w-0">
      {/* Header */}
      <div className="shrink-0 px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Plan
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-800">
            Commande — {activeTable.name}
          </span>
        </div>

        {/* Category Pills — premium horizontal tab strip */}
        <div className="flex flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-none w-full gap-1 border-b border-gray-100 pb-2 -mx-1 px-1">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onAddItem(item)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden text-left transition-all duration-200 hover:shadow-lg active:scale-95"
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${CATEGORY_PLACEHOLDERS[item.category]?.bg || "bg-gray-50"}`}>
                    <span className="text-5xl select-none">{CATEGORY_PLACEHOLDERS[item.category]?.emoji || "🍽️"}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-gray-800" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                )}
                <p className="text-sm font-bold text-gray-900 mt-1.5">
                  {formatPrice(item.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}