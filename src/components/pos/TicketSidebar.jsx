import React, { useMemo } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Send, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TicketSidebar({
  activeTable,
  onUpdateQty,
  onRemoveItem,
  onSendKitchen,
  onCashOut,
}) {
  const { toast } = useToast();

  const total = useMemo(() => {
    if (!activeTable) return 0;
    return activeTable.currentTicket.reduce((sum, item) => sum + item.qty * item.price, 0);
  }, [activeTable]);

  const formatPrice = (price) => price.toLocaleString("fr-FR") + " CFA";

  const handleSendKitchen = () => {
    if (!activeTable || activeTable.currentTicket.length === 0) return;

    const hasPlats = activeTable.currentTicket.some((i) => i.category === "plats" || i.category === "grills");
    const hasBoissons = activeTable.currentTicket.some((i) => i.category === "boissons");

    const parts = [];
    if (hasPlats) parts.push("Plats envoyés en Cuisine!");
    if (hasBoissons) parts.push("Boissons envoyées au Bar!");

    toast({
      title: "✅ Commande envoyée",
      description: parts.join(" ") || "Commande transmise!",
    });

    onSendKitchen();
  };

  const handleCashOut = () => {
    if (!activeTable || activeTable.currentTicket.length === 0) return;

    toast({
      title: "💰 Encaissement réussi",
      description: `${activeTable.name} — Total: ${formatPrice(total)}. Table libérée.`,
    });

    onCashOut();
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

        {activeTable && activeTable.currentTicket.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)} / unité</p>
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
        ))}
      </div>

      {/* Total + Actions */}
      <div className="shrink-0 border-t border-gray-100">
        {activeTable && (
          <>
            <div className="px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">{formatPrice(total)}</span>
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={handleSendKitchen}
                disabled={activeTable.currentTicket.length === 0}
                className="flex-1 h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0096D6" }}
              >
                <Send className="w-4 h-4" />
                ENVOYER CUISINE
              </button>
              <button
                onClick={handleCashOut}
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
      </div>
    </div>
  );
}