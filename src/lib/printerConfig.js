const PRINTER_CONFIG_KEY = "kalpe_printer_config";

export function getPrinterConfig() {
  try {
    const s = localStorage.getItem(PRINTER_CONFIG_KEY);
    return s ? JSON.parse(s) : { kitchen: "", bar: "", caisse: "" };
  } catch {
    return { kitchen: "", bar: "", caisse: "" };
  }
}

export function setPrinterConfig(kitchen, bar, caisse) {
  localStorage.setItem(PRINTER_CONFIG_KEY, JSON.stringify({ kitchen, bar, caisse: caisse || "" }));
}

export function getKitchenPrinter() {
  return getPrinterConfig().kitchen || "";
}

export function getBarPrinter() {
  return getPrinterConfig().bar || "";
}

export function getCaissePrinter() {
  return getPrinterConfig().caisse || "";
}