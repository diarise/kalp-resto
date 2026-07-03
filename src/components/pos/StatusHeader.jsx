import React from "react";
import { UtensilsCrossed, ChefHat, Wine, LayoutGrid, BarChart3, Settings, LogOut, Receipt, FileBarChart, Printer } from "lucide-react";
import { ROLE_LABELS, canAccess } from "@/lib/staffSession";
import { PRODUCT_BRAND, LICENSEE_NAME } from "@/lib/branding";

const ALL_VIEWS = [
  { id: "server", label: "Serveur", icon: LayoutGrid },
  { id: "kitchen", label: "Cuisine", icon: ChefHat },
  { id: "bar", label: "Bar", icon: Wine },
  { id: "report", label: "Rapport", icon: BarChart3 },
  { id: "ledger", label: "Caisse", icon: Receipt },
  { id: "z_report", label: "Contrôle de caisse", icon: FileBarChart },
];

export default function StatusHeader({ currentView, onViewChange, onOpenMenuConfig, onOpenPrinterConfig, staff, onLogout }) {
  const views = ALL_VIEWS.filter((v) => !staff || canAccess(staff.role, v.id));

  return (
    <div className="h-14 shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
          <UtensilsCrossed className="w-4 h-4 text-slate-900" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white tracking-tight">{PRODUCT_BRAND}</span>
          <span className="text-xs text-slate-400 font-medium">{LICENSEE_NAME}</span>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-400 hover:text-slate-200"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Config Menu</span>
          </button>
        )}
        {onOpenPrinterConfig && (!staff || canAccess(staff.role, "printer_config")) && (
          <button
            onClick={onOpenPrinterConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimantes</span>
          </button>
        )}
        {staff && (
          <div className="flex items-center gap-2 text-sm">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-slate-200 leading-tight">{staff.name}</p>
              <p className="text-xs text-slate-500 leading-tight">{ROLE_LABELS[staff.role] || staff.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-bold">
              {staff.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors group"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}