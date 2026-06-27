import React from "react";
import { Users, Clock, CheckCircle, Bookmark, Wrench } from "lucide-react";
import TableStatusMenu from "@/components/pos/TableStatusMenu";

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
};

export default function FloorPlan({ tables, onSelectTable, onUpdateTableStatus }) {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Plan de Salle</h2>
        <p className="text-sm text-gray-400 mt-0.5">Sélectionnez une table pour prendre commande</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = tables.filter((t) => t.status === key).length;
          return (
            <div key={key} className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span>{cfg.label} ({count})</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 content-start">
        {tables.map((table) => {
          const cfg = STATUS_CONFIG[table.status];
          const Icon = cfg.icon;
          const itemCount = table.currentTicket.length;

          const showMenu =
            onUpdateTableStatus &&
            (table.status === "libre" ||
              table.status === "reservee" ||
              table.status === "horsService");

          const cardClasses = `${cfg.bg} ${cfg.border} border-2 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 transition-all duration-200`;

          return (
            <div key={table.id} className="relative">
              {showMenu && (
                <TableStatusMenu table={table} onUpdateStatus={onUpdateTableStatus} />
              )}
              {cfg.disabled ? (
                <div
                  className={`${cardClasses} opacity-60 cursor-not-allowed`}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}