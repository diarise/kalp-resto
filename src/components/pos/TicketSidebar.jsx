import React, { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Send, CreditCard, Printer, ChevronDown, Ban, Pencil, Check, X } from "lucide-react";
import PrintReceiptModal from "@/components/pos/PrintReceiptModal";
import OrderStepper from "@/components/pos/OrderStepper";

export default function TicketSidebar({
  activeTable,
  onUpdateQty,
  onRemoveItem,
  onSetModifier,
  onSendKitchen,
  onCashOut,
  onPrintReceipt,
  onCancelOrder,
  onValidateModification,
  orderSent,
  orderStatus,
}) {
  const total = useMemo(() => {
    if (!activeTable) return 0;
    return activeTable.currentTicket.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [activeTable]);

  const formatPrice = (price) => price.toLocaleString("fr-FR") + " CFA";

  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalTicket, setOriginalTicket] = useState(null);

  const handleEnterEdit = () => {
    setOriginalTicket(activeTable.currentTicket.map((i) => ({ ...i })));
    setEditMode(true);
  };

  const handleValidateModification = () => {
    if (onValidateModification && originalTicket) {
      onValidateModification(originalTicket, activeTable.currentTicket);
    }
    setEditMode(false);
    setOriginalTicket(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setOriginalTicket(null);
  };

  const PIMENT_OPTIONS = ["Sans piment", "Peu pimenté", "Bien pimenté"];
  const CUISSON_OPTIONS = ["À point", "Bien cuit"];
  const BOISSON_OPTIONS = ["Glace", "Sans glace"];
  const SUCRE_OPTIONS = ["Avec Sucre", "Sans Sucre"];
  const LAIT_OPTIONS = ["Avec Lait", "Sans Lait"];

  const getItemModifiers = (item) => {
    const parts = [];
    if (item.piment) parts.push(item.piment);
    if (item.cuisson) parts.push(item.cuisson);
    if (item.boisson) parts.push(item.boisson);
    if (item.sucre) parts.push(item.sucre);
    if (item.lait) parts.push(item.lait);
    return parts.join(", ");
  };

  const handleRowClick = (itemId) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-slate-800">
        {activeTable ? (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Ticket Global</p>
            <p className="text-lg font-bold text-slate-100 mt-0.5">{activeTable.name}</p>
            {orderStatus && orderStatus !== "served" && activeTable.currentTicket.length > 0 && (
              <div className="mt-4 py-3 px-2 rounded-xl bg-slate-800/50">
                <OrderStepper status={orderStatus} variant="sidebar" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <ShoppingBag className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Sélectionnez une table pour commencer</p>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {activeTable && activeTable.currentTicket.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Aucun article sur ce ticket. Touchez le menu à gauche pour ajouter.
            </p>
          </div>
        )}

        {activeTable && activeTable.currentTicket.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isColdDrink = item.category === "boissons";
          const isHotDrink = item.category === "boissons_chaudes";
          const isBoisson = isColdDrink || isHotDrink;
          const modifierText = getItemModifiers(item);

          return (
            <div key={item.id} className="py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleRowClick(item.id)}>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-slate-100 truncate">{item.name}</p>
                    <ChevronDown className={`w-3 h-3 text-slate-500 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                  {modifierText ? (
                    <p className="text-xs italic text-slate-500 mt-0.5">→ {modifierText}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">{formatPrice(item.price)} / unité</p>
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
                    style={editMode ? { backgroundColor: "#c2410c" } : undefined}
                    className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 active:scale-90 transition-all"
                  >
                    {item.qty <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-slate-100">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 active:scale-90 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-sm font-semibold text-slate-100 w-20 text-right shrink-0">
                  {formatPrice(item.qty * item.price)}
                </span>
              </div>

              {/* Modifier tray */}
              {isExpanded && (
                <div className="mt-2.5 pl-1 space-y-2">
                  {isColdDrink ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Boisson:</span>
                      {BOISSON_OPTIONS.map((opt) => {
                        const isActive = item.boisson === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => onSetModifier(item.id, "boisson", isActive ? "" : opt)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                              isActive
                                ? "bg-slate-100 text-slate-900"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : isHotDrink ? (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Sucre:</span>
                        {SUCRE_OPTIONS.map((opt) => {
                          const isActive = item.sucre === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => onSetModifier(item.id, "sucre", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                                isActive
                                  ? "bg-slate-100 text-slate-900"
                                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Lait:</span>
                        {LAIT_OPTIONS.map((opt) => {
                          const isActive = item.lait === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => onSetModifier(item.id, "lait", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                                isActive
                                  ? "bg-slate-100 text-slate-900"
                                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Piment:</span>
                        {PIMENT_OPTIONS.map((opt) => {
                          const isActive = item.piment === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => onSetModifier(item.id, "piment", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                                isActive
                                  ? "bg-slate-100 text-slate-900"
                                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Cuisson:</span>
                        {CUISSON_OPTIONS.map((opt) => {
                          const isActive = item.cuisson === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => onSetModifier(item.id, "cuisson", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                                isActive
                                  ? "bg-slate-100 text-slate-900"
                                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total + Actions */}
      <div className="shrink-0 border-t border-slate-800">
        {activeTable && (
          <>
            <div className="px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-extrabold text-white">{formatPrice(total)}</span>
            </div>

            {/* Edit Mode Banner */}
            {editMode && (
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-3">
                  <Pencil className="w-4 h-4 text-orange-400 shrink-0" />
                  <p className="text-xs font-medium text-orange-300">Mode Modification — ajustez les quantités, puis validez</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 h-12 rounded-xl font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-800 hover:bg-slate-700"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                  <button
                    onClick={handleValidateModification}
                    className="flex-1 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500"
                  >
                    <Check className="w-4 h-4" />
                    Valider
                  </button>
                </div>
              </div>
            )}

            {/* Split Actions: Modify + Cancel */}
            {orderSent && !editMode && (
              <div className="px-5 pb-3 flex gap-3">
                <button
                  onClick={handleEnterEdit}
                  className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10"
                >
                  <Pencil className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={onCancelOrder}
                  className="flex-1 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 bg-rose-600 hover:bg-rose-500"
                >
                  <Ban className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            )}
            {/* ENVOYER — primary action */}
            <div className="px-5 pb-3">
              <button
                onClick={onSendKitchen}
                disabled={activeTable.currentTicket.length === 0}
                className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-500"
              >
                <Send className="w-4 h-4" />
                ENVOYER
              </button>
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setShowPrintModal(true);
                  if (onPrintReceipt) onPrintReceipt();
                }}
                disabled={activeTable.currentTicket.length === 0}
                className="flex-1 h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-500"
              >
                <Printer className="w-4 h-4" />
                Imprimer TICKET
              </button>
              <button
                onClick={onCashOut}
                disabled={activeTable.currentTicket.length === 0}
                className="flex-1 h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500"
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