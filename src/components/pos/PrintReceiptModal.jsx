import React from "react";
import { X, Printer } from "lucide-react";

const RESTAURANT_NAME = "KALPÉ RESTO";
const RESTAURANT_ADDR = "Dakar, Sénégal";
const SERVER_NAME = "Aminata";
const TVA_RATE = 0.18;

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function formatCFA(price) {
  return price.toLocaleString("fr-FR") + " CFA";
}

export default function PrintReceiptModal({ table, onClose }) {
  const now = new Date();
  const sousTotal = table.currentTicket.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tva = Math.round(sousTotal * TVA_RATE);
  const totalNet = sousTotal + tva;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8">
      <div className="relative w-full max-w-sm mx-4">
        {/* Close button outside the paper */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Paper slip */}
        <div
          className="bg-white text-gray-800 shadow-2xl mx-auto"
          style={{
            maxWidth: "320px",
            fontFamily: "'Courier New', monospace",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            maskImage: "linear-gradient(to bottom, #000 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 92%, transparent 100%)",
          }}
        >
          {/* Zigzag top */}
          <div
            className="h-3"
            style={{
              backgroundColor: "#FFFFFF",
              maskImage:
                "linear-gradient(135deg, transparent 50%, #000 50%), linear-gradient(45deg, transparent 50%, #000 50%)",
              WebkitMaskImage:
                "linear-gradient(135deg, transparent 50%, #000 50%), linear-gradient(45deg, transparent 50%, #000 50%)",
              maskSize: "12px 12px",
              WebkitMaskSize: "12px 12px",
              maskRepeat: "repeat-x",
              WebkitMaskRepeat: "repeat-x",
              maskPosition: "top",
              WebkitMaskPosition: "top",
            }}
          />

          <div className="px-6 py-8">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-base font-bold tracking-wide">{RESTAURANT_NAME}</h2>
              <p className="text-[11px] text-gray-500">{RESTAURANT_ADDR}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Tél: +221 77 000 00 00</p>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Metadata */}
            <div className="text-[11px] space-y-0.5 mb-2">
              <div className="flex justify-between">
                <span>Table:</span>
                <span className="font-semibold">{table.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Serveur:</span>
                <span className="font-semibold">{SERVER_NAME}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold">{formatDate(now)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Items header */}
            <div className="text-[11px] font-semibold grid grid-cols-12 gap-1 pb-1">
              <span className="col-span-2">Qté</span>
              <span className="col-span-6">Article</span>
              <span className="col-span-4 text-right">Montant</span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-1" />

            {/* Items */}
            <div className="text-[11px] space-y-1">
              {table.currentTicket.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1">
                  <span className="col-span-2">{item.qty}x</span>
                  <div className="col-span-6">
                    <div>{item.name}</div>
                    {(() => {
                      const mods = [item.piment, item.cuisson, item.boisson].filter(Boolean);
                      if (mods.length > 0) {
                        return (
                          <div className="italic text-gray-400 text-[10px]">→ {mods.join(", ")}</div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <span className="col-span-4 text-right">
                    {formatCFA(item.qty * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Totals */}
            <div className="text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatCFA(sousTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (18%)</span>
                <span>{formatCFA(tva)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-2" />

            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL NET</span>
              <span>{formatCFA(totalNet)}</span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4" />

            {/* Footer */}
            <div className="text-center text-[11px] text-gray-500">
              <p>Merci de votre visite!</p>
              <p className="mt-1">À très bientôt 🇸🇳</p>
            </div>
          </div>

          {/* Bottom action buttons */}
          <div className="px-6 pb-6 pt-2 space-y-2 bg-white" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
            <button
              onClick={handlePrint}
              className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ backgroundColor: "#0096D6" }}
            >
              <Printer className="w-4 h-4" />
              Lancer l'impression
            </button>
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}