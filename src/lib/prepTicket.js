/**
 * 80mm Thermal Prep Ticket Generator (EPSON TM-T20x — Kitchen & Bar)
 * Optimized strictly for 80mm thermal paper — 42 characters max per line.
 * Quantity pinned to the absolute left edge with prominent spacing,
 * ensuring the digit is never clipped by the feed gear.
 * Crisp system monospace fonts, uniform 42-hyphen text dividers, 12px L/R margin buffer.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDateTime(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 80mm EPSON TM-T20x → 42 chars max per line
const CHARS_PER_LINE = 42;
const DIVIDER_CHARS = "-".repeat(CHARS_PER_LINE);
const DIVIDER = `<div class="divider">${DIVIDER_CHARS}</div>`;

const ZONE_LABELS = {
  salle: "SALLE",
  terrasse: "TERRASSE",
  etage: "ETAGE",
};

function getTableDisplayValue(table, headerValue) {
  if (headerValue) return headerValue;
  const zoneLabel = table?.zone ? (ZONE_LABELS[table.zone] || String(table.zone).toUpperCase()) : null;
  const tableCode = table?.subLabel || table?.name;
  return zoneLabel ? `${tableCode} — ${zoneLabel}` : tableCode;
}

/**
 * Builds the destination header block at the top of prep tickets.
 * - Dine-In (default): "Zone: SALLE | Table: 05"
 * - Delivery: bold "TYPE: LIVRAISON" (headerValue overrides to customer name)
 * - Takeout: bold "TYPE: À EMPORTER"
 */
function buildDestinationHeader(table, headerLabel, headerValue) {
  // Delivery orders pass a headerValue (customer label) — render the TYPE banner
  if (headerValue && headerLabel === "Client:") {
    return `<div class="row"><span class="bold">TYPE:</span><span class="xl bold">LIVRAISON</span></div>`;
  }
  if (headerValue && headerLabel === "Type:") {
    return `<div class="row"><span class="bold">TYPE:</span><span class="xl bold">${headerValue}</span></div>`;
  }
  // Dine-in: Zone + Table side-by-side
  const zoneLabel = table?.zone ? (ZONE_LABELS[table.zone] || String(table.zone).toUpperCase()) : "—";
  const tableCode = table?.subLabel || table?.name || "—";
  return `<div class="row"><span class="bold">Zone: ${zoneLabel}</span><span class="bold">Table: ${tableCode}</span></div>`;
}

/**
 * Wraps item names to 42 chars, leaving the quantity pinned at the left
 * on continuation lines (indented to align under the name column).
 */
function wrapText(text, maxChars) {
  if (!text) return [""];
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current);
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

const QTY_WIDTH = "28px"; // fixed slot for qty digit — never clipped by feed gear

const PREP_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 80mm !important;
    padding: 0 16px !important;
    margin: 0 !important;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #000;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .lg { font-size: 17px; font-weight: 700; }
  .xl { font-size: 22px; font-weight: 700; }
  .sm { font-size: 11px; font-weight: 700; }
  .divider {
    text-align: center;
    margin: 6px 0;
    font-weight: 700;
    white-space: pre;
    overflow: hidden;
    letter-spacing: 0;
  }
  .row { display: flex; justify-content: space-between; font-weight: 700; }
  .item-line {
    display: flex;
    align-items: baseline;
    margin-bottom: 4px;
    font-weight: 700;
  }
  .item-qty {
    flex: 0 0 ${QTY_WIDTH};
    font-weight: 700;
    font-size: 16px;
  }
  .item-name {
    flex: 1;
    font-weight: 700;
    word-break: break-word;
  }
  .item-cont {
    padding-left: ${QTY_WIDTH};
    font-weight: 700;
  }
  .item-mod {
    font-size: 12px;
    padding-left: calc(${QTY_WIDTH} + 6px);
    font-weight: 700;
    margin-top: 2px;
    margin-bottom: 6px;
  }
  .mt { margin-top: 8px; }
  .mb { margin-bottom: 8px; }
  @media print {
    body { color: #000; width: 80mm !important; padding: 0 16px !important; margin: 0 !important; }
    * { color: #000 !important; }
  }
`;

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PREP_CSS}</style></head><body>${body}</body></html>`;
}

/**
 * Builds an item line with qty pinned to the absolute left edge.
 * Long names wrap onto continuation lines, indented to align under the name.
 *   e.g.  "2  THIEBOU DIEUNE BLANC"
 *         "   RIZ COULI BASMATI"
 */
function buildItemLine(qty, name) {
  const qtyLabel = `${qty}x`;
  const nameLines = wrapText(name, CHARS_PER_LINE - 4); // leave room for qty column
  const firstLine = nameLines[0] || "";
  const contLines = nameLines.slice(1);
  const contHtml = contLines.map((l) => `<div class="item-cont">${l}</div>`).join("");
  return `
    <div class="item-line">
      <span class="item-qty">${qtyLabel}</span>
      <span class="item-name">${firstLine}</span>
    </div>
    ${contHtml}
  `;
}

function buildItemsHtml(items) {
  return items.map((item) => {
    const mods = [item.piment, item.cuisson, item.boisson, item.sucre, item.lait].filter(Boolean);
    return `
      ${buildItemLine(item.qty, item.name)}
      ${mods.length > 0 ? `<div class="item-mod">→ ${mods.join(", ")}</div>` : ""}
    `;
  }).join("");
}

function buildMetaRow(label, value) {
  return `<div class="row"><span>${label}</span><span class="bold">${value || "—"}</span></div>`;
}

export function generateKitchenPrepHtml({ table, staff, items, headerLabel, headerValue }) {
  const now = new Date();
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** CUISINE ***</div>
    </div>
    ${DIVIDER}
    ${buildDestinationHeader(table, headerLabel, headerValue)}
    ${buildMetaRow("Serveur:", staff?.name)}
    ${buildMetaRow("Heure:", formatDateTime(now))}
    ${DIVIDER}
    ${buildItemsHtml(items)}
    ${DIVIDER}
    <div class="center sm mt">--- Ticket Préparation ---</div>
  `);
}

export function generateBarPrepHtml({ table, staff, items, headerLabel, headerValue }) {
  const now = new Date();
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** BAR ***</div>
    </div>
    ${DIVIDER}
    ${buildDestinationHeader(table, headerLabel, headerValue)}
    ${buildMetaRow("Serveur:", staff?.name)}
    ${buildMetaRow("Heure:", formatDateTime(now))}
    ${DIVIDER}
    ${buildItemsHtml(items)}
    ${DIVIDER}
    <div class="center sm mt">--- Ticket Préparation ---</div>
  `);
}

/**
 * Cancellation slip — fired when a cashier cancels an already-sent order.
 * Prominent "*** ANNULATION COMMANDE ***" header, lists all affected items.
 */
export function generateCancellationHtml({ table, staff, items, headerLabel, headerValue }) {
  const now = new Date();
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** ANNULATION ***</div>
      <div class="xl bold">COMMANDE</div>
    </div>
    ${DIVIDER}
    ${buildDestinationHeader(table, headerLabel, headerValue)}
    ${buildMetaRow("Serveur:", staff?.name)}
    ${buildMetaRow("Heure:", formatDateTime(now))}
    ${DIVIDER}
    ${buildItemsHtml(items)}
    ${DIVIDER}
    <div class="center sm mt">--- ANNULATION COMMANDE ---</div>
  `);
}

/**
 * Modification slip — fired when a cashier modifies an already-sent order
 * (quantity decreased or item removed). Lists exactly what was subtracted.
 * @param modifications - array of { name, qty } representing removed/subtracted items
 */
export function generateModificationHtml({ table, staff, modifications, headerLabel, headerValue }) {
  const now = new Date();
  const modItemsHtml = (modifications || []).map((m) => buildItemLine(`-${m.qty}`, m.name)).join("");
  return wrapHtml(`
    <div class="center mb">
      <div class="xl bold">*** MODIFICATION ***</div>
      <div class="xl bold">COMMANDE</div>
    </div>
    ${DIVIDER}
    ${buildDestinationHeader(table, headerLabel, headerValue)}
    ${buildMetaRow("Serveur:", staff?.name)}
    ${buildMetaRow("Heure:", formatDateTime(now))}
    ${DIVIDER}
    ${modItemsHtml}
    ${DIVIDER}
    <div class="center sm mt">--- MODIFICATION COMMANDE ---</div>
  `);
}