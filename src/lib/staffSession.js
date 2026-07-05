const STAFF_KEY = "kalpe_current_staff";

export function getCurrentStaff() {
  try {
    const s = localStorage.getItem(STAFF_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setCurrentStaff(staff) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function clearStaff() {
  localStorage.removeItem(STAFF_KEY);
}

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  gerante: "Gérante",
  caisse_matin: "Caisse Matin",
  caisse_soir: "Caisse Soir",
  serveur: "Serveur",
};

export const ROLE_PERMISSIONS = {
  super_admin: ["server", "kitchen", "bar", "report", "ledger", "menu_config", "z_report", "printer_config", "delivery", "tech_zone"],
  gerante: ["server", "kitchen", "bar", "report", "ledger", "menu_config", "z_report", "printer_config", "delivery"],
  caisse_matin: ["server", "kitchen", "bar", "ledger", "z_report", "delivery"],
  caisse_soir: ["server", "kitchen", "bar", "ledger", "z_report", "delivery"],
  serveur: ["server", "kitchen", "bar"],
};

export function canAccess(role, view) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(view);
}