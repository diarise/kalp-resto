import React, { useState } from "react";
import { X, Banknote, Smartphone, CreditCard, CheckCircle } from "lucide-react";
import { offlineTransaction } from "@/lib/offlineDB";
import { getCurrentStaff } from "@/lib/staffSession";
import { getActiveShift } from "@/lib/shiftManager";
import { generateInvoiceNumber } from "@/lib/sariExport";
import { generateReceiptHtml, printThermalReceipt } from "@/lib/thermalReceipt";

const PAYMENT_METHODS = [
  { id: "especes", label: "Espèces", icon: Banknote, activeBg: "bg-emerald-500", activeBorder: "border-emerald-500", iconColor: "text-emerald-600", hoverBg: "hover:border-emerald-300" },
  { id: "wave", label: "Wave", icon: Smartphone, activeBg: "bg-cyan-500", activeBorder: "border-cyan-500", iconColor: "text-cyan-600", hoverBg: "hover:border-cyan-300" },
  { id: "orange_money", label: "Orange Money", icon: Smartphone, activeBg: "bg-orange-500", activeBorder: "border-orange-500", iconColor: "text-orange-600", hoverBg: "hover:border-orange-300" },
  { id: "carte", label: "Carte", icon: CreditCard, activeBg: "bg-blue-500", activeBorder: "border-blue-500", iconColor: "text-blue-600", hoverBg: "hover:border-blue-300" },
];

export default function CashierModal({ table, total, onClose, onValidate }) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price) => price.toLocaleString("fr-FR") + " CFA";

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const currentStaff = getCurrentStaff();
    const items = table?.currentTicket || [];
    const invoiceNumber = generateInvoiceNumber();
    if (items.length > 0) {
      try {
        const activeShift = getActiveShift();
        await offlineTransaction.create({
          invoice_number: invoiceNumber,
          timestamp: new Date().toISOString(),
          cashier_id: currentStaff?.id || "unknown",
          cashier_name: currentStaff?.name || "Caissier",
          total_amount: total,
          items_snapshot: JSON.stringify(items),
          payment_method: selected,
          table_name: table?.name || "Table",
          shift_id: activeShift?.id || null,
        });
      } catch (e) {}
      // Auto-print thermal receipt after transaction is recorded
      const html = generateReceiptHtml({ table, staff: currentStaff, invoiceNumber, paymentMethod: selected });
      printThermalReceipt(html);
    }
    setSubmitting(false);
    onValidate(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
        style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">Encaissement</h2>
          <p className="text-sm text-gray-400 mb-5">{table?.name}</p>

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total à payer</span>
            <span className="text-2xl font-extrabold text-gray-900">{formatPrice(total)}</span>
          </div>

          {/* Payment Methods */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Mode de paiement
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isActive = selected === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelected(method.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 ${
                    isActive
                      ? `${method.activeBorder} ${method.activeBg} text-white`
                      : `border-gray-100 bg-white text-gray-700 ${method.hoverBg}`
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "text-white" : method.iconColor}`} />
                  <span className="text-xs font-semibold">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Validate */}
          <button
            onClick={handleSubmit}
            disabled={!selected || submitting}
            className="h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#00A859" }}
          >
            <CheckCircle className="w-5 h-5" />
            {submitting ? "Enregistrement..." : "Valider l'encaissement"}
          </button>
        </div>
      </div>
    </div>
  );
}