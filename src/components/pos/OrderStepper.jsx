import React from "react";

const STAGES = [
  { key: "pending", label: "Reçu", emoji: "📋" },
  { key: "preparing", label: "En Cuisine", emoji: "👨‍🍳" },
  { key: "ready", label: "Prêt à servir", emoji: "🍽️" },
  { key: "served", label: "Livré", emoji: "✅" },
];

const STAGE_ORDER = ["pending", "preparing", "ready", "served"];

const STAGE_COLORS = {
  pending: "#0096D6",
  preparing: "#F59E0B",
  ready: "#00A859",
  served: "#6B7280",
};

export default function OrderStepper({ status = "pending", variant = "kitchen" }) {
  const currentIdx = Math.max(0, STAGE_ORDER.indexOf(status));
  const activeColor = STAGE_COLORS[status] || STAGE_COLORS.pending;
  const isSidebar = variant === "sidebar";

  return (
    <div className={`flex items-center w-full ${isSidebar ? "px-1" : ""}`}>
      {STAGES.map((stage, idx) => {
        const isComplete = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isUpcoming = idx > currentIdx;

        const circleSize = isSidebar ? "w-8 h-8" : "w-6 h-6";
        const checkSize = isSidebar ? "text-sm" : "text-[11px]";

        return (
          <React.Fragment key={stage.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`${circleSize} rounded-full flex items-center justify-center font-bold ${checkSize} transition-all duration-300 ${
                  isComplete
                    ? "text-white shadow-sm"
                    : isActive
                    ? "text-white shadow-md ring-4"
                    : isUpcoming
                    ? "bg-transparent border-2 border-gray-200 text-transparent opacity-40"
                    : "bg-gray-100 text-gray-400"
                }`}
                style={{
                  backgroundColor: (isComplete || isActive) ? activeColor : undefined,
                  // ring color uses opacity of the active color
                  boxShadow: isActive ? `0 0 0 4px ${activeColor}1A` : undefined,
                }}
              >
                {isComplete ? "✓" : isActive ? stage.emoji : "·"}
              </div>
              {isSidebar && (
                <span
                  className={`mt-1.5 text-[10px] font-semibold leading-tight text-center transition-colors duration-300 ${
                    isActive
                      ? "text-gray-900"
                      : isComplete
                      ? "text-gray-600"
                      : "text-gray-300 opacity-40"
                  }`}
                >
                  {stage.label}
                </span>
              )}
            </div>

            {/* Connector line */}
            {idx < STAGES.length - 1 && (
              <div
                className={`flex-1 ${isSidebar ? "h-1" : "h-0.5"} mx-1.5 rounded-full overflow-hidden ${
                  isSidebar ? "" : "-mt-4"
                }`}
                style={{ backgroundColor: isSidebar ? "#F3F4F6" : "#F3F4F6" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: idx < currentIdx ? "100%" : "0%",
                    backgroundColor: idx < currentIdx ? activeColor : "transparent",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}