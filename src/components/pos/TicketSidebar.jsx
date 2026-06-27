import React, { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Send, CreditCard, Printer, ChevronDown } from "lucide-react";
import PrintReceiptModal from "@/components/pos/PrintReceiptModal";

export default function TicketSidebar({
  activeTable,
  onUpdateQty,
  onRemoveItem,
  onSetComment,
  onSendKitchen,
  onCashOut,
}) {
  const total = useMemo(() => {
    if (!activeTable) return 0;
    return activeTable.currentTicket.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [activeTable]);

  const formatPrice = (price) => price.toLocaleString("fr-FR") + " CFA";

  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const getModifierOptions = (category) => {
    if (category === "boissons") return ["Glace", "Sans glace"];
    return ["Sans piment", "Peu pimenté", "Bien cuit"];
  };

  const handleRowClick = (itemId) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-100">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-gray-100">
        {activeTable ? (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Ticket Global</p>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{activeTable.name}</p>
          </div>
        ) : (
          <div className="text-center py-2">
            <ShoppingBag className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sélectionnez une table pour commencer</p>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {activeTable && activeTable.currentTicket.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Aucun article sur ce ticket. Touchez le menu à gauche pour ajouter.
            </p>
          </div>
        )}

        {activeTable && activeTable.currentTicket.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const modifiers = getModifierOptions(item.category);

          return (
            <div key={item.id} className="py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleRowClick(item.id)}>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <ChevronDown className={`w-3 h-3 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                  {item.comment ? (
                    <p className="text-xs italic text-gray-400 mt-0.5">→ {item.comment}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)} / unité</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      if (item.qty <= 1) {
                        onRemoveItem(item.id);
                      } else {
                        onUpdateQty(item.id, item.qty - 1);
                      }
                    }}
                    className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-90 transition-all"
                  >
                    {item.qty <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-800">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-90 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-sm font-semibold text-gray-800 w-20 text-right shrink-0">
                  {formatPrice(item.qty * item.price)}
                </span>
              </div>

              {/* Modifier tray */}
              {isExpanded && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1">
                  {modifiers.map((opt) => {
                    const isActive = item.comment === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => onSetComment(item.id, isActive ? "" : opt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                          isActive
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total + Actions */}
      <div className="shrink-0 border-t border-gray-100">
        {activeTable && (
          <>
            <div className="px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">{formatPrice(total)}</span>
            </div>

            {/* Print Receipt button */}
            <div className="px-5 pb-3">
              <button
                onClick={() => setShowPrintModal(true)}
                className="w-full h-11 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ backgroundColor: "#0096D6" }}
              >
                <Printer className="w-4 h-4" />
                Imprimer Note
              </button>
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={onSendKitchen}
                disabled={activeTable.currentTicket.length === 0}
                className="flex-1 h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0096D6" }}
              >
                <Send className="w-4 h-4" />
                ENVOYER CUISINE
              </button>
              <button
                onClick={onCashOut}
                disabled={activeTable.currentTicket.length === 0}
                className="flex-1 h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#00A859" }}
              >
                <CreditCard className="w-4 h-4" />
                ENCAISSER
              </button>
            </div>
          </>
        )}

        {showPrintModal && activeTable && (
          <PrintReceiptModal table={activeTable} onClose={() => setShowPrintModal(false)} />
        )}
      </div>
    </div>
  );
}