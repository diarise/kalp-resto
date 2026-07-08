/**
 * 58mm Thermal Receipt Generator (Built-in Cashier Printer)
 * Optimized strictly for 58mm thermal paper — 32 characters max per line.
 * Stacked item layout: Name on line 1, [Qty x Unit Price] → [Total] on line 2.
 * Crisp system monospace fonts, uniform 32-hyphen dividers, 12px L/R margin buffer.
 */

import { logoBase64 as restaurantLogo } from "@/assets/logoData";
import { getCaissePrinter } from "@/lib/printerConfig";
import { getShiftLabel } from "@/lib/sariExport";

const RESTAURANT_NAME = "SAPPHIRE RESTAURANT";
const RESTAURANT_ADDR = "BOURGUIBA ENFACE ECOLE POLICE";
const RESTAURANT_PHONE = "78 442 24 24";
const RESTAURANT_PHONE_2 = "78 440 05 05";

const PAYMENT_LABELS = {
  especes: "Espèces",
  wave: "Wave",
  orange_money: "Orange Money",
  carte: "Carte",
};

const ZONE_LABELS = {
  salle: "SALLE",
  terrasse: "TERRASSE",
  etage: "ETAGE",
};

// 58mm paper → 32 chars max per line
const CHARS_PER_LINE = 32;
const DIVIDER_CHARS = "-".repeat(CHARS_PER_LINE);
const DIVIDER = `<div class="divider">${DIVIDER_CHARS}</div>`;

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDateTime(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCFA(price) {
  return (price || 0).toLocaleString("fr-FR") + " CFA";
}

/**
 * Wraps text to a max character width, returning an array of lines.
 * Used to prevent product names from overflowing the 32-char boundary.
 */
function wrapText(text, maxChars) {
  if (!text) return [""];
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current);
      // Hard-break very long single words
      if (word.length > maxChars) {
        let chunk = word;
        while (chunk.length > maxChars) {
          lines.push(chunk.slice(0, maxChars));
          chunk = chunk.slice(maxChars);
        }
        current = chunk;
      } else {
        current = word;
      }
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

const THERMAL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 48mm !important; /* Narrower print zone to keep text safely inside the paper roll */
    max-width: 200px;
    padding-left: 6mm !important; /* Explicitly pushes text out of the left clipping zone */
    padding-right: 2mm !important;
    margin: 0 !important;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #000;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: 700; }
  .lg { font-size: 14px; font-weight: 700; }
  .xl { font-size: 17px; font-weight: 700; }
  .sm { font-size: 9px; font-weight: 700; }
  .divider {
    text-align: center;
    margin: 4px 0;
    font-weight: 700;
    white-space: pre;
    overflow: hidden;
    letter-spacing: 0;
  }
  .row { display: flex; justify-content: space-between; font-weight: 700; }
  .meta-row { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; margin-bottom: 1px; }
  .item-block { margin-bottom: 4px; }
  .item-name { font-weight: 700; word-break: break-word; }
  .item-sub { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; margin-top: 1px; }
  .item-mod { font-size: 9px; font-weight: 700; margin-top: 1px; }
  .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; margin-top: 4px; }
  .mt { margin-top: 6px; }
  .mb { margin-bottom: 6px; }
  @media print {
    body { color: #000; width: 48mm !important; max-width: 200px; padding-left: 6mm !important; padding-right: 2mm !important; margin: 0 !important; }
    * { color: #000 !important; }
  }
`;

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${THERMAL_CSS}</style></head><body>${body}</body></html>`;
}

/**
 * Builds a stacked item block for 58mm paper:
 *   Line 1: Product Name (wrapped if > 32 chars)
 *   Line 2:   [Qty] x [Unit Price]  -------->  [Total Price]
 */
function buildItemBlock(item) {
  const nameLines = wrapText(item.name, CHARS_PER_LINE);
  const nameHtml = nameLines.map((l) => `<div class="item-name">${l}</div>`).join("");
  return `
    <div class="item-block">
      ${nameHtml}
      <div class="item-sub">
        <span>${item.qty} x ${formatCFA(item.price)}</span>
        <span>${formatCFA(item.qty * item.price)}</span>
      </div>
    </div>
  `;
}

export function generateReceiptHtml({ table, staff, invoiceNumber, paymentMethod, deliveryInfo }) {
  const now = new Date();
  const items = table?.currentTicket || [];
  const sousTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const shiftLabel = getShiftLabel(staff);
  const zoneLabel = table?.zone ? (ZONE_LABELS[table.zone] || String(table.zone).toUpperCase()) : "—";
  const tableCode = table?.subLabel || table?.name || "—";

  const itemsHtml = items.map(buildItemBlock).join("");

  const deliveryRows = deliveryInfo
    ? `
      <div class="meta-row"><span>Client:</span><span class="bold">${deliveryInfo.customer_name || "—"}</span></div>
      ${deliveryInfo.customer_phone ? `<div class="meta-row"><span>Tél:</span><span class="bold">${deliveryInfo.customer_phone}</span></div>` : ""}
      ${deliveryInfo.customer_address ? `<div class="meta-row"><span>Adresse:</span><span class="bold">${deliveryInfo.customer_address}</span></div>` : ""}
    `
    : "";

  return wrapHtml(`
    <div class="center mb">
      <img src="${restaurantLogo}" alt="Logo" style="width:100px;height:auto;display:block;margin:0 auto 4px;" />
      <div class="xl bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
      <div class="sm">TÉL: ${RESTAURANT_PHONE}</div>
      <div class="sm">     ${RESTAURANT_PHONE_2}</div>
    </div>
    ${DIVIDER}
    <div class="meta-row"><span>Zone:</span><span class="bold">${zoneLabel}</span></div>
    <div class="meta-row"><span>Table:</span><span class="bold">${tableCode}</span></div>
    <div class="meta-row"><span>Service:</span><span class="bold">${shiftLabel}</span></div>
    <div class="meta-row"><span>Facture:</span><span class="bold">${invoiceNumber || "—"}</span></div>
    ${deliveryRows}
    <div class="meta-row"><span>Caissier:</span><span class="bold">${staff?.name || "—"}</span></div>
    <div class="meta-row"><span>Date:</span><span>${formatDateTime(now)}</span></div>
    ${DIVIDER}
    ${itemsHtml}
    ${DIVIDER}
    <div class="total-row"><span>TOTAL</span><span>${formatCFA(sousTotal)}</span></div>
    ${DIVIDER}
    <div class="row"><span>Paiement</span><span class="bold">${PAYMENT_LABELS[paymentMethod] || paymentMethod || "—"}</span></div>
    ${DIVIDER}
    <div class="center sm mt">
      <div>Merci de votre visite!</div>
      <div>À très bientôt 🇸🇳</div>
    </div>
  `);
}

export function generateZReportHtml({ date, transactions, cashierName }) {
  const reportDate = date ? new Date(date) : new Date();
  const dayLabel = `${pad(reportDate.getDate())}/${pad(reportDate.getMonth() + 1)}/${reportDate.getFullYear()}`;

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

  const topItemsRows = topItems.map(([name, data]) => {
    const block = buildItemBlock({ name, qty: data.qty, price: 0 });
    // Override the sub-line to show revenue instead of unit price math
    return block.replace(
      /<div class="item-sub">[\s\S]*?<\/div>/,
      `<div class="item-sub"><span>${data.qty} x vente</span><span>${formatCFA(data.revenue)}</span></div>`
    );
  }).join("");

  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">RAPPORT Z</div>
      <div class="lg bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
    </div>
    ${DIVIDER}
    <div class="meta-row"><span>Date:</span><span class="bold">${dayLabel}</span></div>
    <div class="meta-row"><span>Caissier:</span><span>${cashierName || "—"}</span></div>
    <div class="meta-row"><span>Édité:</span><span>${formatDateTime(new Date())}</span></div>
    ${DIVIDER}
    <div class="center bold lg">RÉCAPITULATIF</div>
    <div class="row mt"><span>Transactions</span><span class="bold">${txCount}</span></div>
    <div class="total-row"><span>TOTAL</span><span>${formatCFA(totalRevenue)}</span></div>
    ${DIVIDER}
    <div class="center bold mt mb">PAR PAIEMENT</div>
    ${methodRows || '<div class="center sm">Aucune transaction</div>'}
    ${DIVIDER}
    <div class="center bold mt mb">TOP ARTICLES</div>
    ${topItemsRows || '<div class="center sm">Aucun article</div>'}
    ${DIVIDER}
    <div class="center sm mt">
      <div>*** Fin Rapport Z ***</div>
      <div>SAPPHIRE RESTAURANT POS</div>
    </div>
  `);
}

/**
 * Shift Closure Z-Report — "Rapport de Clôture"
 * Printed when the cashier closes their shift. Compact, professional layout.
 * Fields: Header + Date/Time, Gross Total, Payment Breakdown, Operational
 * Summary (items by category), Reconciliation (Total Attendu en Caisse).
 */
export function generateShiftClosureHtml({ transactions, cashierName, shiftInfo }) {
  const now = new Date();

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const txCount = transactions.length;

  const byMethod = {};
  for (const t of transactions) {
    const m = t.payment_method || "autre";
    if (!byMethod[m]) byMethod[m] = { count: 0, total: 0 };
    byMethod[m].count++;
    byMethod[m].total += t.total_amount || 0;
  }

  // Operational summary: count items sent to kitchen vs bar by category
  const categoryCounts = {};
  let kitchenItems = 0;
  let barItems = 0;
  for (const t of transactions) {
    let items = t.items_snapshot;
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch { items = []; }
    }
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const cat = item.category || "autre";
      const qty = item.qty || 0;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;
      if (cat === "boissons" || cat === "chichas" || cat === "boissons_chaudes") {
        barItems += qty;
      } else {
        kitchenItems += qty;
      }
    }
  }

  const CATEGORY_LABELS = {
    plats: "Plats",
    grills: "Grillades",
    poulet: "Poulet",
    poisson: "Poisson",
    accompagnement: "Accompagnements",
    pates: "Pâtes",
    mer: "Fruits de Mer",
    supplements: "Suppléments",
    boissons: "Boissons Fraîches",
    boissons_chaudes: "Boissons Chaudes",
    entrees: "Entrées",
    desserts: "Desserts",
    fast_food: "Fast Food",
    chichas: "Chicha & Lounge",
    sale: "Plats Salés",
    autre: "Autre",
  };

  const methodRows = Object.entries(byMethod).map(([method, data]) => `
    <div class="row">
      <span>${PAYMENT_LABELS[method] || method} (${data.count})</span>
      <span>${formatCFA(data.total)}</span>
    </div>
  `).join("");

  const categoryRows = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `
      <div class="row">
        <span>${CATEGORY_LABELS[cat] || cat}</span>
        <span>${count} art.</span>
      </div>
    `).join("");

  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">RAPPORT DE CLÔTURE</div>
      <div class="lg bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
    </div>
    ${DIVIDER}
    <div class="meta-row"><span>Caissier:</span><span class="bold">${cashierName || "—"}</span></div>
    <div class="meta-row"><span>Date:</span><span class="bold">${formatDateTime(now)}</span></div>
    ${shiftInfo ? `<div class="meta-row"><span>Service:</span><span class="bold">${shiftInfo.label || "—"}</span></div>` : ""}
    ${DIVIDER}
    <div class="center bold lg">RÉCAPITULATIF</div>
    <div class="row mt"><span>Transactions</span><span class="bold">${txCount}</span></div>
    <div class="total-row"><span>TOTAL BRUT</span><span>${formatCFA(totalRevenue)}</span></div>
    ${DIVIDER}
    <div class="center bold mt mb">PAR MODE DE PAIEMENT</div>
    ${methodRows || '<div class="center sm">Aucune transaction</div>'}
    ${DIVIDER}
    <div class="center bold mt mb">OPÉRATIONNEL</div>
    <div class="row"><span>Articles Cuisine</span><span class="bold">${kitchenItems}</span></div>
    <div class="row"><span>Articles Bar</span><span class="bold">${barItems}</span></div>
    ${categoryRows}
    ${DIVIDER}
    <div class="total-row"><span>TOTAL ATTENDU EN CAISSE</span><span>${formatCFA(totalRevenue)}</span></div>
    ${DIVIDER}
    <div class="center sm mt">
      <div>*** Fin de Clôture ***</div>
      <div>SAPPHIRE RESTAURANT POS</div>
    </div>
  `);
}

/**
 * Sends HTML to the thermal printer via Electron IPC.
 * Falls back to opening a print dialog in the browser.
 */
export function printThermalReceipt(htmlContent) {
  if (window.electronAPI && typeof window.electronAPI.printSilent === "function") {
    const caissePrinter = getCaissePrinter();
    return window.electronAPI.printSilent(htmlContent, caissePrinter || undefined);
  }
  return Promise.resolve({ success: false, error: "Impression silencieuse non disponible (Electron requis)" });
}

/**
 * Generates a DUPLICATA receipt from a historical transaction record.
 * Reconstructs the itemized ticket and stamps it with **DUPLICATA** + original timestamp.
 */
export function generateDuplicateReceiptHtml(transaction) {
  let items = transaction.items_snapshot;
  if (typeof items === "string") {
    try { items = JSON.parse(items); } catch { items = []; }
  }
  if (!Array.isArray(items)) items = [];

  const table = { name: transaction.table_name || "—", subLabel: transaction.table_code || "", currentTicket: items };
  const isDelivery = transaction.order_type === "delivery";
  const deliveryInfo = isDelivery
    ? {
        customer_name: transaction.customer_name,
        customer_phone: transaction.customer_phone,
        customer_address: transaction.customer_address,
      }
    : null;

  const now = new Date();
  const originalDate = new Date(transaction.timestamp);

  const itemsHtml = items.map(buildItemBlock).join("");

  const deliveryRows = deliveryInfo
    ? `
      <div class="meta-row"><span>Client:</span><span class="bold">${deliveryInfo.customer_name || "—"}</span></div>
      ${deliveryInfo.customer_phone ? `<div class="meta-row"><span>Tél:</span><span class="bold">${deliveryInfo.customer_phone}</span></div>` : ""}
      ${deliveryInfo.customer_address ? `<div class="meta-row"><span>Adresse:</span><span class="bold">${deliveryInfo.customer_address}</span></div>` : ""}
    `
    : "";

  const sousTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">** DUPLICATA **</div>
      <div class="sm">Copie de ticket</div>
    </div>
    ${DIVIDER}
    <div class="center mb">
      <img src="${restaurantLogo}" alt="Logo" style="width:100px;height:auto;display:block;margin:0 auto 4px;" />
      <div class="xl bold">${RESTAURANT_NAME}</div>
      <div class="sm">${RESTAURANT_ADDR}</div>
      <div class="sm">TÉL: ${RESTAURANT_PHONE}</div>
      <div class="sm">     ${RESTAURANT_PHONE_2}</div>
    </div>
    ${DIVIDER}
    <div class="meta-row"><span>Table:</span><span class="bold">${table.subLabel || table.name}</span></div>
    <div class="meta-row"><span>Facture:</span><span class="bold">${transaction.invoice_number || "—"}</span></div>
    ${deliveryRows}
    <div class="meta-row"><span>Caissier:</span><span class="bold">${transaction.cashier_name || "—"}</span></div>
    <div class="meta-row"><span>Date orig.:</span><span class="bold">${formatDateTime(originalDate)}</span></div>
    ${DIVIDER}
    ${itemsHtml}
    ${DIVIDER}
    <div class="total-row"><span>TOTAL</span><span>${formatCFA(sousTotal)}</span></div>
    ${DIVIDER}
    <div class="row"><span>Paiement</span><span class="bold">${PAYMENT_LABELS[transaction.payment_method] || transaction.payment_method || "—"}</span></div>
    ${DIVIDER}
    <div class="center sm mt">
      <div>** DUPLICATA — ${formatDateTime(originalDate)} **</div>
      <d