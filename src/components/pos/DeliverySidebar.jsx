import React, { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Send, CreditCard, ChevronDown, User, Phone, MapPin } from "lucide-react";
import VirtualKeyboard from "@/components/pos/VirtualKeyboard";

const PIMENT_OPTIONS = ["Sans piment", "Peu pimenté", "Bien pimenté"];
const CUISSON_OPTIONS = ["À point", "Bien cuit"];
const BOISSON_OPTIONS = ["Glace", "Sans glace"];
const SUCRE_OPTIONS = ["Avec Sucre", "Sans Sucre"];
const LAIT_OPTIONS = ["Avec Lait", "Sans Lait"];

export default function DeliverySidebar({
  delivery,
  onUpdateCustomer,
  onUpdateQty,
  onRemoveItem,
  onSetModifier,
  onSendKitchen,
  onCashOut,
}) {
  const total = useMemo(() => {
    if (!delivery) return 0;
    return (delivery.currentTicket || []).reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [delivery]);

  const formatPrice = (price) => price.toLocaleString("fr-FR") + " CFA";
  const hasPending = (delivery?.currentTicket || []).some((i) => i.status !== "sent");
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const handleKeyboardKey = (key) => {
    if (!activeField || !onUpdateCustomer) return;
    const currentValue = delivery[activeField] || "";
    onUpdateCustomer(activeField, currentValue + key);
  };

  const handleKeyboardBackspace = () => {
    if (!activeField || !onUpdateCustomer) return;
    const currentValue = delivery[activeField] || "";
    onUpdateCustomer(activeField, currentValue.slice(0, -1));
  };

  const handleCloseKeyboard = () => setActiveField(null);

  const keyboardMode = activeField === "customer_phone" ? "numeric" : "alpha";

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

  if (!delivery) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800">
        <div className="text-center py-8 px-5 border-b border-slate-800">
          <ShoppingBag className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Sélectionnez une livraison</p>
        </div>
      </div>
    );
  }

  const ticket = delivery.currentTicket || [];

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800">
      {/* Header — Customer Info */}
      <div className="shrink-0 px-5 py-4 border-b border-slate-800">
        <p className="text-xs text-sky-400 uppercase tracking-wider font-medium mb-2">Livraison</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={delivery.customer_name || ""}
              onChange={() => {}}
              onFocus={() => setActiveField("customer_name")}
              placeholder="Nom du client"
              readOnly
              className={`flex-1 h-9 rounded-lg bg-slate-950 border px-3 text-sm text-white outline-none transition-colors ${
                activeField === "customer_name" ? "border-sky-500" : "border-slate-800 focus:border-slate-600"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="tel"
              value={delivery.customer_phone || ""}
              onChange={() => {}}
              onFocus={() => setActiveField("customer_phone")}
              placeholder="Téléphone"
              readOnly
              className={`flex-1 h-9 rounded-lg bg-slate-950 border px-3 text-sm text-white outline-none transition-colors ${
                activeField === "customer_phone" ? "border-sky-500" : "border-slate-800 focus:border-slate-600"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={delivery.customer_address || ""}
              onChange={() => {}}
              onFocus={() => setActiveField("customer_address")}
              placeholder="Adresse de livraison"
              readOnly
              className={`flex-1 h-9 rounded-lg bg-slate-950 border px-3 text-sm text-white outline-none transition-colors ${
                activeField === "customer_address" ? "border-sky-500" : "border-slate-800 focus:border-slate-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {ticket.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Aucun article. Touchez le menu à gauche pour ajouter.
            </p>
          </div>
        )}

        {ticket.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isColdDrink = item.category === "boissons";
          const isHotDrink = item.category === "boissons_chaudes";
          const isChicha = item.category === "chichas";
          const isBoisson = isColdDrink || isHotDrink;
          const modifierText = getItemModifiers(item);

          return (
            <div key={item.id} className="py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleRowClick(item.id)}>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-slate-100 truncate">{item.name}</p>
                    {item.status === "sent" && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">Envoyé</span>
                    )}
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
                      if (item.qty <= 1) onRemoveItem(item.id);
                      else onUpdateQty(item.id, item.qty - 1);
                    }}
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

              {isExpanded && !isChicha && (
                <div className="mt-2.5 pl-1 space-y-2">
                  {isColdDrink ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Boisson:</span>
                      {BOISSON_OPTIONS.map((opt) => {
                        const isActive = item.boisson === opt;
                        return (
                          <button key={opt} onClick={() => onSetModifier(item.id, "boisson", isActive ? "" : opt)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${isActive ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
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
                            <button key={opt} onClick={() => onSetModifier(item.id, "sucre", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${isActive ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
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
                            <button key={opt} onClick={() => onSetModifier(item.id, "lait", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${isActive ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
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
                            <button key={opt} onClick={() => onSetModifier(item.id, "piment", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${isActive ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
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
                            <button key={opt} onClick={() => onSetModifier(item.id, "cuisson", isActive ? "" : opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${isActive ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
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

      {/* Virtual Keyboard */}
      {activeField && (
        <VirtualKeyboard
          mode={keyboardMode}
          onKey={handleKeyboardKey}
          onBackspace={handleKeyboardBackspace}
          onClose={handleCloseKeyboard}
        />
      )}

      {/* Total + Actions */}
      <div className="shrink-0 border-t border-slate-800">
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total</span>
          <span className="text-2xl font-extrabold text-white">{formatPrice(total)}</span>
        </div>

        <div className="px-5 pb-3">
          <button
            onClick={onSendKitchen}
            disabled={!hasPending}
            className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-500"
          >
            <Send className="w-4 h-4" />
            ENVOYER
          </button>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onCashOut}
            disabled={ticket.length === 0}
            className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500"
          >
            <CreditCard className="w-4 h-4" />
            ENCAISSER
          </button>
        </div>
      </div>
    </div>
  );
}