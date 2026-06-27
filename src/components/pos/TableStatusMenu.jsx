import React, { useState, useEffect, useRef } from "react";
import { Settings, Bookmark, Wrench, CheckCircle } from "lucide-react";

export default function TableStatusMenu({ table, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSelect = (status) => {
    onUpdateStatus(table.id, status);
    setOpen(false);
  };

  const options =
    table.status === "reservee"
      ? [{ label: "Libérer la table", icon: CheckCircle, status: "libre", color: "text-emerald-600" }]
      : [
          { label: "Réserver", icon: Bookmark, status: "reservee", color: "text-purple-600" },
          { label: "Hors service", icon: Wrench, status: "horsService", color: "text-gray-600" },
        ];

  return (
    <div className="absolute top-1.5 right-1.5" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white transition-colors shadow-sm"
        aria-label="Options de la table"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.status);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}