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

  // Kitchen variant: compact, no labels
  if (!isSidebar) {
    return (
      <div className="flex items-center w-full">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isUpcoming = idx > currentIdx;
          return (
            <React.Fragment key={stage.key}>
              <div className="shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all duration-300 ${
                    isComplete
                      ? "text-white shadow-sm"
                      : isActive
                      ? "text-white shadow-md"
                      : isUpcoming
                      ? "bg-transparent border-2 border-gray-200 text-transparent opacity-40"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  style={{
                    backgroundColor: (isComplete || isActive) ? activeColor : undefined,
                    boxShadow: isActive ? `0 0 0 4px ${activeColor}1A` : undefined,
                  }}
                >
                  {isComplete ? "✓" : isActive ? stage.emoji : "·"}
                </div>
              </div>
              {idx < STAGES.length - 1 && (
                <div className="flex-1 h-0.5 mx-1.5 rounded-full bg-gray-100 overflow-hidden">
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

  // Sidebar variant: two-row layout (circles+lines aligned, labels centered below)
  return (
    <div className="flex flex-col w-full">
      {/* Circle + connector row — perfectly vertically centered */}
      <div className="flex items-center w-full">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isUpcoming = idx > currentIdx;
          return (
            <React.Fragment key={stage.key}>
              <div className="shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isComplete
                      ? "text-white shadow-sm"
                      : isActive
                      ? "text-white shadow-md"
                      : isUpcoming
                      ? "bg-transparent border-2 border-gray-200 text-transparent opacity-40"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  style={{
                    backgroundColor: (isComplete || isActive) ? activeColor : undefined,
                    boxShadow: isActive ? `0 0 0 4px ${activeColor}1A` : undefined,
                  }}
                >
                  {isComplete ? "✓" : isActive ? stage.emoji : "·"}
                </div>
              </div>
              {idx < STAGES.length - 1 && (
                <div className="flex-1 h-1 mx-1.5 rounded-full bg-gray-100 overflow-hidden">
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

      {/* Label row — each label centered under its circle */}
      <div className="flex w-full mt-1.5">
        {STAGES.map((stage, idx) => {
          const isActive = idx === currentIdx;
          const isComplete = idx < currentIdx;
          const isUpcoming = idx > currentIdx;
          return (
            <React.Fragment key={stage.key}>
              <div className="shrink-0 w-8 flex justify-center">
                <span
                  className={`text-[10px] font-semibold leading-tight text-center transition-colors duration-300 ${
                    isActive
                      ? "text-gray-900"
                      : isComplete
                      ? "text-gray-600"
                      : "text-gray-300 opacity-40"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {idx < STAGES.length - 1 && <div className="flex-1" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}