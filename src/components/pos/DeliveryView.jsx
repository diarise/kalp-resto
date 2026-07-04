import React from "react";
import { Truck, Plus, ArrowLeft, Phone, MapPin, X } from "lucide-react";

const DELIVERY_STATUS = {
  preparing: { label: "En préparation", badge: "bg-amber-500/10 text-amber-400" },
  ready: { label: "Prêt", badge: "bg-teal-500/10 text-teal-400" },
  shipping: { label: "En livraison", badge: "bg-sky-500/10 text-sky-400" },
  delivered: { label: "Livré", badge: "bg-emerald-500/10 text-emerald-400" },
};

const PAYMENT_STATUS = {
  pending: { label: "Impayé", badge: "bg-rose-500/10 text-rose-400" },
  paid: { label: "Payé", badge: "bg-emerald-500/10 text-emerald-400" },
};

const STATUS_ORDER = ["preparing", "ready", "shipping", "delivered"];

const formatPrice = (price) => (price || 0).toLocaleString("fr-FR") + " CFA";

export default function DeliveryView({ deliveries, onNew, onSelect, onBack, onUpdateStatus, onCloseDelivery }) {
  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour au Plan
          </button>
          <div className="h-5 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Truck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Livraisons</h2>
              <p className="text-xs text-slate-500">Commandes téléphone et livraison</p>
            </div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: "#0096D6" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle Livraison
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mb-4">Aucune livraison active</p>
          <button onClick={onNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#0096D6" }}>
            <Plus className="w-4 h-4" />
            Créer une livraison
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start overflow-y-auto">
          {deliveries.map((del) => {
            const total = (del.currentTicket || []).reduce((sum, i) => sum + i.qty * i.price, 0);
            const dStatus = DELIVERY_STATUS[del.delivery_status] || DELIVERY_STATUS.preparing;
            const pStatus = PAYMENT_STATUS[del.payment_status] || PAYMENT_STATUS.pending;
            const statusIdx = STATUS_ORDER.indexOf(del.delivery_status || "preparing");
            const nextStatus = statusIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[statusIdx + 1] : null;

            return (
              <div key={del.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(del.id)}>
                    <p className="text-sm font-bold text-slate-100 truncate">{del.customer_name || "Client non renseigné"}</p>
                    {del.customer_phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {del.customer_phone}
                      </p>
                    )}
                    {del.customer_address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0" /> {del.customer_address}
                      </p>
                    )}
                  </div>
                  <button onClick={() => onCloseDelivery(del.id)} className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0">
                    <X className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dStatus.badge}`}>{dStatus.label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pStatus.badge}`}>{pStatus.label}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="text-lg font-extrabold text-white">{formatPrice(total)}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <button onClick={() => onSelect(del.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all">
                      Ouvrir
                    </button>
                    {nextStatus && (
                      <button
                        onClick={() => onUpdateStatus(del.id, nextStatus)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-all"
                      >
                        → {DELIVERY_STATUS[nextStatus].label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}