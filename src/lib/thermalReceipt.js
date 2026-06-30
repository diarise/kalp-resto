/**
 * 80mm Thermal Receipt Generator
 * Produces compact HTML formatted for 80mm thermal printers (~48 chars wide).
 * Used by both customer receipts and Z-Reports.
 */

const RESTAURANT_NAME = "KALPÉ RESTO";
const RESTAURANT_ADDR = "Dakar, Sénégal";
const RESTAURANT_PHONE = "+221 77 000 00 00";
const TVA_RATE = 0.18;

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
    font-size: 12px;
    color: #000;
    line-height: 1.4;
  }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .lg { font-size: 16px; }
  .xl { font-size: 20px; }
  .sm { font-size: 10px; }
  .hr { border-top: 1px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; }
  .items-header { display: flex; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 3px; }
  .item-line { display: flex; margin-bottom: 2px; }
  .item-qty { width: 8mm; }
  .item-name { flex: 1; }
  .item-price { width: 22mm; text-align: right; }
  .item-mod { font-size: 10px; padding-left: 8mm; font-style: italic; }
  .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 4px; }
  .mt { margin-top: 8px; }
  .mb { margin-bottom: 8px; }
`;

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${THERMAL_CSS}</style></head><body>${body}</body></html>`;
}

export function generateReceiptHtml({ table, staff, invoiceNumber, paymentMethod }) {
  const now = new Date();
  const items = table?.currentTicket || [];
  const sousTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tva = Math.round(sousTotal * TVA_RATE);
  const totalNet = sousTotal + tva;

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
    <div class="row"><span>Sous-total</span><span>${formatCFA(sousTotal)}</span></div>
    <div class="row"><span>TVA (18%)</span><span>${formatCFA(tva)}</span></div>
    <div class="total-row"><span>TOTAL NET</span><span>${formatCFA(totalNet)}</span></div>
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

  const dayTx = transactions.filter((t) => {
    const td = new Date(t.timestamp);
    return td.toDateString() === reportDate.toDateString();
  });

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

  const totalTVA = Math.round(totalRevenue * TVA_RATE / 1.18);
  const totalHT = totalRevenue - totalTVA;

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
    <div class="row"><span>Total HT</span><span>${formatCFA(totalHT)}</span></div>
    <div class="row"><span>Total TVA (18%)</span><span>${formatCFA(totalTVA)}</span></div>
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
      <div>Kalpé Resto POS</div>
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