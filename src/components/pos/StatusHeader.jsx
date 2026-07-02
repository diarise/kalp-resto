import React from "react";
import { UtensilsCrossed, ChefHat, Wine, LayoutGrid, BarChart3, Settings, LogOut, Receipt, FileBarChart } from "lucide-react";
import { ROLE_LABELS, canAccess } from "@/lib/staffSession";

const ALL_VIEWS = [
  { id: "server", label: "Serveur", icon: LayoutGrid },
  { id: "kitchen", label: "Cuisine", icon: ChefHat },
  { id: "bar", label: "Bar", icon: Wine },
  { id: "report", label: "Rapport", icon: BarChart3 },
  { id: "ledger", label: "Caisse", icon: Receipt },
  { id: "z_report", label: "Rapport Z", icon: FileBarChart },
];

export default function StatusHeader({ currentView, onViewChange, onOpenMenuConfig, staff, onLogout }) {
  const views = ALL_VIEWS.filter((v) => !staff || canAccess(staff.role, v.id));

  return (
    <div className="h-14 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-6"
         style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-semibold text-gray-800 tracking-tight">
          SAPPHIRE RESTAURANT
        </span>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {views.map((view) => {
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
        {onOpenMenuConfig && (!staff || canAccess(staff.role, "menu_config")) && (
          <button
            onClick={onOpenMenuConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Config Menu</span>
          </button>
        )}
        {staff && (
          <div className="flex items-center gap-2 text-sm">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-700 leading-tight">{staff.name}</p>
              <p className="text-xs text-gray-400 leading-tight">{ROLE_LABELS[staff.role] || staff.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              {staff.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}