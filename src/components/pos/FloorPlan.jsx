import React, { useState, useMemo } from "react";
import { Users, Clock, CheckCircle, Bookmark, Wrench } from "lucide-react";
import TableStatusMenu from "@/components/pos/TableStatusMenu";

const ZONES = [
  { id: "salle", label: "Rez-de-chaussée", emoji: "🛋️" },
  { id: "etage", label: "1er Étage", emoji: "🏢" },
  { id: "terrasse", label: "Terrasse", emoji: "🌿" },
];

const STATUS_CONFIG = {
  libre: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    label: "Libre",
    icon: CheckCircle,
    disabled: false,
  },
  occupee: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
    label: "Occupée",
    icon: Users,
    disabled: false,
  },
  attente: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    label: "En attente",
    icon: Clock,
    disabled: false,
  },
  reservee: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-600",
    dot: "bg-purple-500",
    label: "Réservée",
    icon: Bookmark,
    disabled: false,
  },
  horsService: {
    bg: "bg-gray-100",
    border: "border-gray-200",
    text: "text-gray-500",
    badge: "bg-gray-200 text-gray-500",
    dot: "bg-gray-400",
    label: "Hors service",
    icon: Wrench,
    disabled: true,
  },
  pret: {
    bg: "bg-teal-50",
    border: "border-teal-300",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
    dot: "bg-teal-500",
    label: "Prêt à servir",
    icon: CheckCircle,
    disabled: false,
  },
};

export default function FloorPlan({ tables, onSelectTable, onUpdateTableStatus, onMarkServed }) {
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
        <h2 className="text-lg font-semibold text-gray-800">Plan de Salle</h2>
        <p className="text-sm text-gray-400 mt-0.5">Sélectionnez une table pour prendre commande</p>
      </div>

      {/* Zone Switcher */}
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1 mb-4 w-fit">
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-sm">{zone.emoji}</span>
              <span>{zone.label}</span>
              <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {zoneCounts[zone.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = zoneTables.filter((t) => t.status === key).length;
          return (
            <div key={key} className="flex items-center gap-2 text-xs text-gray-500">
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

          const cardClasses = `${cfg.bg} ${cfg.border} border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
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
                  <span className={`text-sm font-semibold ${cfg.text}`}>{table.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onSelectTable(table.id)}
                  className={`w-full ${cardClasses} active:scale-95 hover:shadow-md`}
                  style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                >
                  <Icon className={`w-5 h-5 ${cfg.text}`} />
                  <span className={`text-sm font-semibold ${cfg.text}`}>{table.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
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