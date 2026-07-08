import React, { useState } from "react";
import { Delete, ChevronDown, ChevronUp } from "lucide-react";

const ALPHA_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
  ["w", "x", "c", "v", "b", "n"],
];

const NUM_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["+", "0"],
];

export default function VirtualKeyboard({ mode = "alpha", onKey, onBackspace, onClose }) {
  const [caps, setCaps] = useState(false);
  const rows = mode === "numeric" ? NUM_ROWS : ALPHA_ROWS;

  const handleKey = (key) => {
    onKey(caps ? key.toUpperCase() : key);
  };

  return (
    <div className="shrink-0 border-t border-slate-700 bg-slate-900 px-3 pt-2 pb-3 animate-fade-in">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
          {mode === "numeric" ? "Clavier Numérique" : "Clavier Virtuel"}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors active:scale-95"
        >
          <ChevronDown className="w-3 h-3" />
          Fermer
        </button>
      </div>
      <div className="space-y-1.5">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 justify-center">
            {row.map((key, keyIdx) => (
              <button
                key={keyIdx}
                onClick={() => handleKey(key)}
                className="h-10 flex-1 rounded-lg font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 active:scale-90 active:bg-slate-600 transition-all flex items-center justify-center text-sm"
              >
                {key.toUpperCase()}
              </button>
            ))}
            {rowIdx === rows.length - 1 && (
              <>
                {mode === "alpha" && (
                  <button
                    onClick={() => setCaps(!caps)}
                    className={`h-10 flex-1 rounded-lg font-semibold transition-all flex items-center justify-center active:scale-90 ${
                      caps ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onKey(" ")}
                  className="h-10 flex-[2] rounded-lg font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-90 transition-all flex items-center justify-center text-[10px]"
                >
                  ESPACE
                </button>
                <button
                  onClick={onBackspace}
                  className="h-10 flex-[1.5] rounded-lg font-semibold text-rose-300 bg-slate-800 hover:bg-rose-900/40 active:scale-90 transition-all flex items-center justify-center"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}