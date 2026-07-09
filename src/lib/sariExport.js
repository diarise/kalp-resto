/**
 * Sage SARI Export Utility
 * Format: [typeDoc];[invoiceNumber];[dateSage];[codeCaisse];[methodLabel];[articleCode];[cleanName];[qtyInt];[priceInt]
 * Example: 6;FA000003;080726;CS01;especes;1007;THIEBOU YAAP;2;6000
 */

const JOURNAL_CODE = "6";

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return dd + mm + yy;
}

export function formatSariRow(transaction, item) {
  // Extract proper string representation of payment mode (e.g., wave, orange_money, especes)
  const paymentMode = (transaction.payment_method || "especes").toLowerCase();

  // Explicitly grab the functional product/article identifier code key
  const articleCode = item.code || item.sku || item.id || "0000";

  const row = [
    "6",                                    // Col 1: Record Type
    transaction.invoice_number,             // Col 2: Invoice
    formatDate(transaction.timestamp),      // Col 3: Date
    transaction.table_name || "CS00",       // Col 4: Table Location Code
    paymentMode,                            // Col 5: Dynamic Payment Method (Fixes hardcoding)
    articleCode,                            // Col 6: Functional Article SKU Code (Fixes indexing)
    item.name,                              // Col 7: Item Designation Text
    Math.floor(item.qty || 1).toString(),   // Col 8: Pure Integer Quantity
    Math.floor(item.price || 0).toString()  // Col 9: Pure Integer Unit Price
  ];
  return row.join(";");
}

export function exportTransactionsToSari(transactions) {
  const lines = [];
  // Sort chronologically by timestamp to ensure a precise sales sequence
  const sorted = [...transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  for (const t of sorted) {
    let items = t.items_snapshot;
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        items = [];
      }
    }
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      lines.push(formatSariRow(t, item));
    }
  }
  return lines.join("\n");
}

/**
 * Downloads the SARI export file.
 * If running inside the Electron container, writes directly to the native
 * filesystem (C:/KalpeResto/SageExports/ on Windows, ~/KalpeResto/SageExports/
 * on macOS/Linux) using fs.writeFileSync via the preload IPC bridge, creating
 * the directory silently if it doesn't exist.
 * Falls back to a standard browser anchor download when not in Electron.
 */
export function downloadSariFile(content, filename) {
  // Electron native path — exposed via preload contextBridge
  if (window.electronAPI && typeof window.electronAPI.writeSariFile === "function") {
    window.electronAPI.writeSariFile(content, filename);
    return;
  }

  // Browser fallback
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Derives the shift label ("Matin" or "Soir") from the active staff role.
 * Falls back to time-of-day if the role is not a cashier shift (e.g. admin/gerante).
 */
export function getShiftLabel(staff) {
  const role = staff?.role;
  if (role === "caisse_matin") return "Matin";
  if (role === "caisse_soir") return "Soir";
  const hour = new Date().getHours();
  return hour < 12 ? "Matin" : "Soir";
}

/**
 * Builds a SARI export filename including the shift label and invoice number.
 * Example: SARI_Export_Matin_FA000005.csv
 */
export function generateSariFilename(invoiceNumber, staff) {
  const shiftLabel = getShiftLabel(staff);
  return `SARI_Export_${shiftLabel}_${invoiceNumber}.csv`;
}

/**
 * Generates and downloads a SARI export for a single transaction immediately
 * after encaissement (payment completion).
 * Returns { content, filename } for caller reference.
 */
export function exportTransactionSari(transaction, staff) {
  const content = exportTransactionsToSari([transaction]);
  const filename = generateSariFilename(transaction.invoice_number, staff);
  downloadSariFile(content, filename);
  return { content, filename };
}

export function generateInvoiceNumber() {
  const counterKey = "kalpe_invoice_counter";
  let counter = parseInt(localStorage.getItem(counterKey) || "0", 10);
  counter += 1;
  localStorage.setItem(counterKey, String(counter));
  return "FA" + String(counter).padStart(6, "0");
}