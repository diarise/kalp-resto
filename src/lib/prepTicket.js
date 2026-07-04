/**
 * 80mm Thermal Prep Ticket Generator (Kitchen & Bar)
 * Minimal layout: Table Number, Waiter Name, Timestamp, Quantity, Item Name.
 * No pricing — these are preparation tickets only.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDateTime(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const PREP_CSS = `
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
  .bold { font-weight: 900; }
  .lg { font-size: 17px; }
  .xl { font-size: 22px; }
  .sm { font-size: 11px; }
  .hr { border-top: 2px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; }
  .item-line { display: flex; margin-bottom: 3px; }
  .item-qty { width: 10mm; }
  .item-name { flex: 1; }
  .item-mod { font-size: 11px; padding-left: 10mm; font-style: italic; font-weight: bold; }
  .mt { margin-top: 8px; }
  .mb { margin-bottom: 8px; }
  @media print {
    body { color: #000; }
    * { color: #000 !important; }
  }
`;

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PREP_CSS}</style></head><body>${body}</body></html>`;
}

function buildItemsHtml(items) {
  return items.map((item) => {
    const mods = [item.piment, item.cuisson, item.boisson].filter(Boolean);
    return `
      <div class="item-line">
        <span class="item-qty">${item.qty}x</span>
        <span class="item-name">${item.name}</span>
      </div>
      ${mods.length > 0 ? `<div class="item-mod">→ ${mods.join(", ")}</div>` : ""}
    `;
  }).join("");
}

export function generateKitchenPrepHtml({ table, staff, items, headerLabel, headerValue }) {
  const now = new Date();
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** CUISINE ***</div>
    </div>
    <div class="hr"></div>
    <div class="row"><span>${headerLabel || "Table:"}</span><span class="bold">${headerValue || table?.name || "—"}</span></div>
    <div class="row"><span>Serveur:</span><span class="bold">${staff?.name || "—"}</span></div>
    <div class="row"><span>Heure:</span><span>${formatDateTime(now)}</span></div>
    <div class="hr"></div>
    ${buildItemsHtml(items)}
    <div class="hr"></div>
    <div class="center sm mt">--- Ticket Préparation ---</div>
  `);
}

export function generateBarPrepHtml({ table, staff, items, headerLabel, headerValue }) {
  const now = new Date();
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** BAR ***</div>
    </div>
    <div class="hr"></div>
    <div class="row"><span>${headerLabel || "Table:"}</span><span class="bold">${headerValue || table?.name || "—"}</span></div>
    <div class="row"><span>Serveur:</span><span class="bold">${staff?.name || "—"}</span></div>
    <div class="row"><span>Heure:</span><span>${formatDateTime(now)}</span></div>
    <div class="hr"></div>
    ${buildItemsHtml(items)}
    <div class="hr"></div>
    <div class="center sm mt">--- Ticket Préparation ---</div>
  `);
}