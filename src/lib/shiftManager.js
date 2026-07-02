/**
 * Shift Session Manager
 * Isolates sales records by active shift sessions.
 * When a team member logs in, a shift starts. When they run a Z-Report
 * and close the shift, that period's totals are calculated and archived
 * before clearing for the next user.
 */
const SHIFT_KEY = "kalpe_active_shift";
const SHIFTS_ARCHIVE_KEY = "kalpe_shifts_archive";

export function startShift(staff) {
  // If a shift is already active (e.g. same machine, different login), keep it
  const existing = getActiveShift();
  if (existing) return existing;

  const shift = {
    id: `shift-${Date.now()}`,
    cashier_id: staff?.id || "unknown",
    cashier_name: staff?.name || "Caissier",
    start_time: new Date().toISOString(),
    end_time: null,
    total_amount: 0,
    transaction_count: 0,
    by_method: {},
    status: "active",
  };
  localStorage.setItem(SHIFT_KEY, JSON.stringify(shift));
  return shift;
}

export function getActiveShift() {
  try {
    const s = localStorage.getItem(SHIFT_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function endShift(summary) {
  const shift = getActiveShift();
  if (!shift) return null;

  shift.end_time = new Date().toISOString();
  shift.status = "closed";
  shift.total_amount = summary?.total_amount || 0;
  shift.transaction_count = summary?.transaction_count || 0;
  shift.by_method = summary?.by_method || {};

  // Archive the closed shift
  const archive = getArchivedShifts();
  archive.push(shift);
  localStorage.setItem(SHIFTS_ARCHIVE_KEY, JSON.stringify(archive));

  // Clear active shift so the next login starts fresh
  localStorage.removeItem(SHIFT_KEY);

  return shift;
}

export function getArchivedShifts() {
  try {
    const s = localStorage.getItem(SHIFTS_ARCHIVE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}