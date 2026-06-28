import React from "react";

const STAGES = [
  { key: "pending", label: "Reçu", emoji: "📋" },
  { key: "preparing", label: "En Cuisine", emoji: "👨‍🍳" },
  { key: "ready", label: "Prêt à servir", emoji: "🍽️" },
  { key: "served", label: "Livré", emoji: "✅" },
];

const STAGE_ORDER = ["pending", "preparing", "ready", "served"];

export default function OrderStepper({ status = "pending" }) {
  const currentIdx = Math.max(0, STAGE_ORDER.indexOf(status));

  return (
    <div className="flex items-center w-full">
      {STAGES.map((stage, idx) => {
        const isComplete = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isUpcoming = idx > currentIdx;

        return (
          <React.Fragment key={stage.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isComplete
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-gray-900 text-white ring-4 ring-gray-900/10"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isComplete ? "✓" : <span className="text-[10px]">{stage.emoji}</span>}
              </div>
              <span
                className={`mt-1 text-[9px] font-semibold leading-tight text-center w-14 transition-colors duration-300 ${
                  isActive
                    ? "text-gray-900"
                    : isComplete
                    ? "text-emerald-600"
                    : "text-gray-300"
                }`}
              >
                {stage.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STAGES.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 -mt-3.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    idx < currentIdx ? "w-full bg-emerald-500" : "w-0"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}