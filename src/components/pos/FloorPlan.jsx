import React, { useState, useMemo } from "react";
import { Users, Clock, CheckCircle, Bookmark, Wrench, Truck } from "lucide-react";
import TableStatusMenu from "@/components/pos/TableStatusMenu";

const ZONES = [
  { id: "salle", label: "SALLE", emoji: "🛋️" },
  { id: "terrasse", label: "TERRASSE", emoji: "🌿" },
  { id: "etage", label: "ETAGE", emoji: "🏢" },
];

const STATUS_CONFIG = {
  libre: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
    label: "Libre",
    icon: CheckCircle,
    disabled: false,
  },
  occupee: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-400",
    dot: "bg-rose-400",
    label: "Occupée",
    icon: Users,
    disabled: false,
  },
  attente: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
    label: "En attente",
    icon: Clock,
    disabled: false,
  },
  reservee: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400",
    dot: "bg-purple-400",
    label: "Réservée",
    icon: Bookmark,
    disabled: false,
  },
  horsService: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-slate-500",
    badge: "bg-slate-700/50 text-slate-400",
    dot: "bg-slate-500",
    label: "Hors service",
    icon: Wrench,
    disabled: true,
  },
  pret: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-teal-400",
    badge: "bg-teal-500/10 text-teal-400",
    dot: "bg-teal-400",
    label: "Prêt à servir",
    icon: CheckCircle,
    disabled: false,
  },
};

export default function FloorPlan({ tables, onSelectTable, onUpdateTableStatus, onMarkServed, onEnterDelivery, showDeliveryToggle }) {
  const [activeZone, setActiveZone] = useState("salle");

  const zoneTables = useMemo(
    () => tables.filter((t) => t.zone === activeZone),
    [tables, activeZone]
  );

  const zoneCounts = useMemo(
    () =>
      ZONES.reduce((acc, z) => {
        acc[z.id] = tables.filter((t) => t.zone === z.id).length;
        return acc;
      }, {}),
    [tables]
  );

  // Dense grid for 30-table zones; standard for 15-table zone
  const gridCols =
    activeZone === "salle"
      ? "grid-cols-2 md:grid-cols-5"
      : "grid-cols-3 md:grid-cols-6";

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Plan de Salle</h2>
        <p className="text-sm text-slate-500 mt-0.5">Sélectionnez une table pour prendre commande</p>
      </div>

      {/* Zone Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-900 rounded-xl p-1 mb-4 w-fit border border-slate-800">
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-sm">{zone.emoji}</span>
              <span>{zone.label}</span>
              <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? "bg-white text-slate-900" : "bg-slate-800 text-slate-400"
              }`}>
                {zoneCounts[zone.id]}
              </span>
            </button>
          );
        })}
        {showDeliveryToggle && (
          <button
            onClick={onEnterDelivery}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 ml-1 border-l border-slate-800 pl-3"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Livraison</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = zoneTables.filter((t) => t.status === key).length;
          return (
            <div key={key} className="flex items-center gap-2 text-xs text-slate-500">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span>{cfg.label} ({count})</span>
            </div>
          );
        })}
      </div>

      <div className={`grid ${gridCols} gap-3 flex-1 content-start overflow-y-auto`}>
        {zoneTables.map((table) => {
          const cfg = STATUS_CONFIG[table.status];
          const Icon = cfg.icon;
          const itemCount = table.currentTicket.length;

          const showMenu =
            onUpdateTableStatus &&
            (table.status === "libre" ||
              table.status === "reservee" ||
              table.status === "horsService");

          const cardClasses = `bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
            activeZone === "salle" ? "h-32" : "h-24"
          }`;

          return (
            <div key={table.id} className="relative">
              {showMenu && (
                <TableStatusMenu table={table} onUpdateStatus={onUpdateTableStatus} />
              )}
              {cfg.disabled ? (
                <div
                  className={`${cardClasses} opacity-60 cursor-not-allowed pointer-events-none`}
                >
                  <Icon className={`w-5 h-5 ${cfg.text}`} />
                  <span className={`text-sm font-semibold text-slate-100`}>{table.name}</span>
                  {table.subLabel && (
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{table.subLabel}</span>
                  )}
                  <span className={`text-base px-2.5 py-0.5 rounded-full font-bold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onSelectTable(table.id)}
                  className={`w-full ${cardClasses} active:scale-95 hover:border-slate-700 hover:bg-slate-800/80`}
                >
                  <Icon className={`w-5 h-5 ${cfg.text}`} />
                  <span className={`text-sm font-semibold text-slate-100`}>{table.name}</span>
                  {table.subLabel && (
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{table.subLabel}</span>
                  )}
                  <span className={`text-base px-2.5 py-0.5 rounded-full font-bold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  {itemCount > 0 && (
                    <span className="text-xs text-gray-400">
                      {itemCount} article{itemCount > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              )}
              {table.status === "pret" && onMarkServed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkServed(table.id);
                  }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-md z-10"
                >
                  ✓ Servi
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}