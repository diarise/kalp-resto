import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal scrollable category tab strip with hidden native scrollbars,
 * smooth touch scrolling, and dynamic SaaS-style left/right arrow buttons.
 */
export default function CategoryTabBar({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Left gradient fade */}
      {showLeft && (
        <div
          className="absolute left-0 top-0 bottom-2 z-[5] pointer-events-none w-12"
          style={{ background: "linear-gradient(to right, #0f172a 30%, transparent)" }}
        />
      )}

      {/* Left arrow */}
      {showLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-90 shadow-lg backdrop-blur-sm"
          style={{
            position: "absolute",
            left: "4px",
            zIndex: 10,
            background: "rgb(30 41 59) !important",
            border: "1px solid rgb(51 65 85) !important",
            outline: "none !important",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3) !important",
            padding: "0 !important",
          }}
          aria-label="Catégories précédentes"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-none w-full gap-1 border-b border-slate-800 pb-2"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      {showRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-90 shadow-lg backdrop-blur-sm"
          style={{
            position: "absolute",
            right: "4px",
            zIndex: 10,
            background: "rgb(30 41 59) !important",
            border: "1px solid rgb(51 65 85) !important",
            outline: "none !important",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3) !important",
            padding: "0 !important",
          }}
          aria-label="Catégories suivantes"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Right gradient fade */}
      {showRight && (
        <div
          className="absolute right-0 top-0 bottom-2 z-[5] pointer-events-none w-12"
          style={{ background: "linear-gradient(to left, #0f172a 30%, transparent)" }}
        />
      )}
    </div>
  );
}