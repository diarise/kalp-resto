const PRINTER_CONFIG_KEY = "kalpe_printer_config";

export function getPrinterConfig() {
  try {
    const s = localStorage.getItem(PRINTER_CONFIG_KEY);
    return s ? JSON.parse(s) : { kitchen: "", bar: "" };
  } catch {
    return { kitchen: "", bar: "" };
  }
}

export function setPrinterConfig(kitchen, bar) {
  localStorage.setItem(PRINTER_CONFIG_KEY, JSON.stringify({ kitchen, bar }));
}

export function getKitchenPrinter() {
  return getPrinterConfig().kitchen || "";
}

export function getBarPrinter() {
  return getPrinterConfig().bar || "";
}