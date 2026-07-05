import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menuData";
import CategoryTabBar from "@/components/pos/CategoryTabBar";

const CATEGORY_PLACEHOLDERS = {
  plats: { bg: "bg-slate-800", emoji: "🍛" },
  grills: { bg: "bg-slate-800", emoji: "🔥" },
  poulet: { bg: "bg-slate-800", emoji: "🍗" },
  poisson: { bg: "bg-slate-800", emoji: "🐟" },
  mer: { bg: "bg-slate-800", emoji: "🍤" },
  pates: { bg: "bg-slate-800", emoji: "🍝" },
  accompagnement: { bg: "bg-slate-800", emoji: "🍟" },
  supplements: { bg: "bg-slate-800", emoji: "➕" },
  boissons: { bg: "bg-slate-800", emoji: "🥤" },
  entrees: { bg: "bg-slate-800", emoji: "🥗" },
  desserts: { bg: "bg-slate-800", emoji: "🍰" },
  fast_food: { bg: "bg-slate-800", emoji: "🍔" },
  chichas: { bg: "bg-slate-800", emoji: "💨" },
  sale: { bg: "bg-slate-800", emoji: "🍖" },
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
      <div className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Plan
          </button>
          <div className="h-5 w-px bg-slate-700" />
          <span className="text-sm font-semibold text-slate-100">
            Commande — {activeTable.name}
          </span>
        </div>

        {/* Category Pills — scrollable carousel with arrow nav */}
        <CategoryTabBar
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onAddItem(item)}
              className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden text-left transition-all duration-200 hover:border-slate-700 active:scale-95"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-800">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${CATEGORY_PLACEHOLDERS[item.category]?.bg || "bg-slate-800"}`}>
                    <span className="text-5xl select-none">{CATEGORY_PLACEHOLDERS[item.category]?.emoji || "🍽️"}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-slate-900" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-100 leading-tight truncate">
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                )}
                <p className="text-sm font-bold text-slate-200 mt-1.5">
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