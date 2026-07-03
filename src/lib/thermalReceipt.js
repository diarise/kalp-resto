/**
 * 80mm Thermal Receipt Generator
 * Produces compact HTML formatted for 80mm thermal printers (~48 chars wide).
 * Used by both customer receipts and Z-Reports.
 */

import { logoBase64 as restaurantLogo } from "@/assets/logoData";

const RESTAURANT_NAME = "SAPPHIRE RESTAURANT";
const RESTAURANT_ADDR = "Dakar, Sénégal";
const RESTAURANT_PHONE = "+221 77 000 00 00";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDateTime(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCFA(price) {
  return (price || 0).toLocaleString("fr-FR") + " CFA";
}

const THERMAL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 80mm;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    font-weight: bold;
    color: #000;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: 900; }
  .lg { font-size: 17px; }
  .xl { font-size: 22px; }
  .sm { font-size: 11px; font-weight: bold; }
  .hr { border-top: 2px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; font-weight: bold; }
  .items-header { display: flex; font-weight: 900; border-bottom: 2px solid #000; padding-bottom: 3px; margin-bottom: 3px; }
  .item-line { display: flex; margin-bottom: 2px; font-weight: bold; }
  .item-qty { width: 8mm; }
  .item-name { flex: 1; }
  .item-price { width: 22mm; text-align: right; }
  .item-mod { font-size: 11px; padding-left: 8mm; font-style: italic; font-weight: bold; }
  .total-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 17px; margin-top: 4px; }
  .mt { margin-top: 8px; }
  .mb { margin-bottom: 8px; }
  @media print {
    body { color: #000; }
    * { color: #000 !important; }
  }
`;

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${THERMAL_CSS}</style></head><body>${body}</body></html>`;
}

export function generateReceiptHtml({ table, staff, invoiceNumber, paymentMethod }) {
  const now = new Date();
  const items = table?.currentTicket || [];
  const sousTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const itemsHtml = items.map((item) => {
    const mods = [item.piment, item.cuisson, item.boisson].filter(Boolean);
    return `
      <div class="item-line">
        <span class="item-qty">${item.qty}x</span>
        <span class="item-name">${item.name}</span>
        <span class="item-price">${formatCFA(item.qty * item.price)}</span>
      </div>
      ${mods.length > 0 ? `<div class="item-mod">→ ${mods.join(", ")}</div>` : ""}
    `;
  }).join("");

  return wrapHtml(`
    <div class="center mb">
      <img src="${restaurantLogo}" alt="SAPPHIRE RESTAURANT Logo" style="width:130px;height:auto;display:block;margin:0 auto 4px;" />
      <div class="xl bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
      <div class="sm">${RESTAURANT_PHONE}</div>
    </div>
    <div class="hr"></div>
    <div class="row"><span>Facture:</span><span class="bold">${invoiceNumber || "—"}</span></div>
    <div class="row"><span>Table:</span><span class="bold">${table?.name || "—"}</span></div>
    <div class="row"><span>Caissier:</span><span>${staff?.name || "—"}</span></div>
    <div class="row"><span>Date:</span><span>${formatDateTime(now)}</span></div>
    <div class="hr"></div>
    <div class="items-header">
      <span class="item-qty">Qté</span>
      <span class="item-name">Article</span>
      <span class="item-price">Montant</span>
    </div>
    ${itemsHtml}
    <div class="hr"></div>
    <div class="total-row"><span>TOTAL</span><span>${formatCFA(sousTotal)}</span></div>
    <div class="hr"></div>
    <div class="row"><span>Paiement</span><span class="bold">${paymentMethod || "—"}</span></div>
    <div class="hr"></div>
    <div class="center sm mt">
      <div>Merci de votre visite!</div>
      <div>À très bientôt 🇸🇳</div>
    </div>
  `);
}

export function generateZReportHtml({ date, transactions, cashierName }) {
  const reportDate = date ? new Date(date) : new Date();
  const dayLabel = `${pad(reportDate.getDate())}/${pad(reportDate.getMonth() + 1)}/${reportDate.getFullYear()}`;

  // Caller is responsible for filtering (by date or by shift) — use transactions as-is
  const dayTx = transactions;

  const totalRevenue = dayTx.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const txCount = dayTx.length;

  const byMethod = {};
  for (const t of dayTx) {
    const m = t.payment_method || "autre";
    if (!byMethod[m]) byMethod[m] = { count: 0, total: 0 };
    byMethod[m].count++;
    byMethod[m].total += t.total_amount || 0;
  }

  // Aggregate items
  const itemMap = {};
  for (const t of dayTx) {
    let items = t.items_snapshot;
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch { items = []; }
    }
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const name = item.name || "Inconnu";
      if (!itemMap[name]) itemMap[name] = { qty: 0, revenue: 0 };
      itemMap[name].qty += item.qty || 0;
      itemMap[name].revenue += (item.qty || 0) * (item.price || 0);
    }
  }
  const topItems = Object.entries(itemMap)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 10);

  const methodRows = Object.entries(byMethod).map(([method, data]) => `
    <div class="row">
      <span>${method} (${data.count})</span>
      <span>${formatCFA(data.total)}</span>
    </div>
  `).join("");

  const topItemsRows = topItems.map(([name, data]) => `
    <div class="item-line">
      <span class="item-qty">${data.qty}x</span>
      <span class="item-name">${name}</span>
      <span class="item-price">${formatCFA(data.revenue)}</span>
    </div>
  `).join("");

  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">RAPPORT Z</div>
      <div class="lg bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
    </div>
    <div class="hr"></div>
    <div class="row"><span>Date:</span><span class="bold">${dayLabel}</span></div>
    <div class="row"><span>Caissier:</span><span>${cashierName || "—"}</span></div>
    <div class="row"><span>Édité le:</span><span>${formatDateTime(new Date())}</span></div>
    <div class="hr"></div>
    <div class="center bold lg">RÉCAPITULATIF</div>
    <div class="row mt"><span>Nombre de transactions</span><span class="bold">${txCount}</span></div>
    <div class="total-row"><span>TOTAL TTC</span><span>${formatCFA(totalRevenue)}</span></div>
    <div class="hr"></div>
    <div class="center bold mt mb">PAR MODE DE PAIEMENT</div>
    ${methodRows || '<div class="center sm">Aucune transaction</div>'}
    <div class="hr"></div>
    <div class="center bold mt mb">TOP ARTICLES</div>
    <div class="items-header">
      <span class="item-qty">Qté</span>
      <span class="item-name">Article</span>
      <span class="item-price">CA</span>
    </div>
    ${topItemsRows || '<div class="center sm">Aucun article</div>'}
    <div class="hr"></div>
    <div class="center sm mt">
      <div>*** Fin du Rapport Z ***</div>
      <div>SAPPHIRE RESTAURANT POS</div>
    </div>
  `);
}

/**
 * Sends HTML to the thermal printer via Electron IPC.
 * Falls back to opening a print dialog in the browser.
 */
export function printThermalReceipt(htmlContent) {
  if (window.electronAPI && typeof window.electronAPI.printReceipt === "function") {
    return window.electronAPI.printReceipt(htmlContent);
  }
  // Browser fallback — open print window
  const printWin = window.open("", "_blank", "width=400,height=600");
  if (printWin) {
    printWin.document.write(htmlContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  }
  return Promise.resolve({ success: false, fallback: true });
}