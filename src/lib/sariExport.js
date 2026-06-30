/**
 * Sage SARI Export Utility
 * Format: [JournalCode];[InvoiceNum];[DDMMYY];[AccountNum];[Status];[ItemCode];[ItemName];[Qty:4 Decimals];[Price:6 Decimals]
 * Example: 6;FA000107;270626;41100046;PAYE;3027;BISSAP;1,0000;2000,000000
 */

const JOURNAL_CODE = "6";
const ACCOUNT_NUM = "41100046";
const STATUS = "PAYE";

function formatDecimal(value, decimals) {
  const num = Number(value || 0);
  const fixed = num.toFixed(decimals);
  return fixed.replace(".", ",");
}

function formatDateDDMMYY(timestamp) {
  const d = new Date(timestamp);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return dd + mm + yy;
}

export function formatSariLine(transaction, item) {
  const invoiceNum = transaction.invoice_number;
  const date = formatDateDDMMYY(transaction.timestamp);
  const itemCode = item.id || item.code || "";
  const itemName = (item.name || "").toUpperCase();
  const qty = formatDecimal(item.qty, 4);
  const price = formatDecimal(item.price, 6);
  return [JOURNAL_CODE, invoiceNum, date, ACCOUNT_NUM, STATUS, itemCode, itemName, qty, price].join(";");
}

export function exportTransactionsToSari(transactions) {
  const lines = [];
  for (const t of transactions) {
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
      lines.push(formatSariLine(t, item));
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
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateInvoiceNumber() {
  const counterKey = "kalpe_invoice_counter";
  let counter = parseInt(localStorage.getItem(counterKey) || "0", 10);
  counter += 1;
  localStorage.setItem(counterKey, String(counter));
  return "FA" + String(counter).padStart(6, "0");
}