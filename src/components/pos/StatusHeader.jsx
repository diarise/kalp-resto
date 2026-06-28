import React from "react";
import { UtensilsCrossed, User, ChefHat, Wine, LayoutGrid, BarChart3, Settings } from "lucide-react";

const VIEWS = [
  { id: "server", label: "Vue Serveur", icon: LayoutGrid },
  { id: "kitchen", label: "Écran Cuisine", icon: ChefHat },
  { id: "bar", label: "Écran Bar", icon: Wine },
  { id: "report", label: "Rapport d'activité", icon: BarChart3 },
];

export default function StatusHeader({ currentView, onViewChange, onOpenMenuConfig }) {
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
        <span className="text-xs text-gray-400 font-medium ml-1 hidden sm:inline">dashboard</span>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {onOpenMenuConfig && (
          <button
            onClick={onOpenMenuConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Config Menu</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Serveur: <span className="font-medium text-gray-700">Aminata</span></span>
        </div>
      </div>
    </div>
  );
}