/**
 * Offline Data Engine
 * Wraps Staff and Transaction entities with a localStorage mirror.
 * If the network/API fails, reads and writes fall back to the local cache
 * so PIN login, cashiering, and table states remain 100% functional offline.
 */
import { base44 } from "@/api/base44Client";

const STAFF_CACHE_KEY = "kalpe_offline_staff";
const TX_CACHE_KEY = "kalpe_offline_transactions";

/**
 * Default staff roster — used to seed the local cache when the cloud API
 * is unreachable (e.g. Electron desktop app running via file:// protocol).
 * This ensures PIN login works 100% offline on first launch.
 */
const DEFAULT_STAFF = [
  { id: "staff-gerante", name: "Safietou", role: "gerante", pin: "4556", active: true },
  { id: "staff-caisse-matin", name: "Caisse Matin", role: "caisse_matin", pin: "3210", active: true },
  { id: "staff-caisse-soir", name: "Caisse Soir", role: "caisse_soir", pin: "8990", active: true },
  { id: "staff-serveur", name: "Aminata", role: "serveur", pin: "1234", active: true },
];

function ensureStaffSeed() {
  const cached = readCache(STAFF_CACHE_KEY);
  if (!cached || cached.length === 0) {
    writeCache(STAFF_CACHE_KEY, DEFAULT_STAFF);
    return DEFAULT_STAFF;
  }
  return cached;
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function matchesQuery(record, query) {
  if (!query) return true;
  for (const [key, value] of Object.entries(query)) {
    if (record[key] !== value) return false;
  }
  return true;
}

function sortBy(records, sortField) {
  if (!sortField) return records;
  const desc = sortField.startsWith("-");
  const field = desc ? sortField.slice(1) : sortField;
  const sorted = [...records].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return desc ? sorted.reverse() : sorted;
}

function genId() {
  return "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

/** Staff offline-aware data access */
export const offlineStaff = {
  async filter(query) {
    try {
      const results = await base44.entities.Staff.filter(query);
      if (results && results.length > 0) {
        writeCache(STAFF_CACHE_KEY, results);
      }
      return results || [];
    } catch {
      const cached = ensureStaffSeed();
      return cached.filter((r) => matchesQuery(r, query));
    }
  },

  async list(sort, limit) {
    try {
      const results = await base44.entities.Staff.list(sort, limit);
      if (results && results.length > 0) {
        writeCache(STAFF_CACHE_KEY, results);
      }
      return results || [];
    } catch {
      let cached = ensureStaffSeed();
      cached = sortBy(cached, sort);
      if (limit) cached = cached.slice(0, limit);
      return cached;
    }
  },
};

/** Transaction offline-aware data access */
export const offlineTransaction = {
  async create(data) {
    // Always write to local cache first so the record is never lost
    const localRecord = { id: genId(), created_date: new Date().toISOString(), ...data };
    const cached = readCache(TX_CACHE_KEY);
    cached.push(localRecord);
    writeCache(TX_CACHE_KEY, cached);

    try {
      // Attempt to persist to the cloud — best effort
      const remote = await base44.entities.Transaction.create(data);
      // Replace the local placeholder with the real record
      const updated = readCache(TX_CACHE_KEY).map((r) =>
        r.id === localRecord.id ? remote : r
      );
      writeCache(TX_CACHE_KEY, updated);
      return remote;
    } catch {
      // Offline — keep the local record
      return localRecord;
    }
  },

  async list(sort, limit) {
    try {
      const results = await base44.entities.Transaction.list(sort, limit);
      if (results) {
        // Merge: keep local-only records that haven't synced yet
        const cached = readCache(TX_CACHE_KEY);
        const remoteIds = new Set(results.map((r) => r.id));
        const localOnly = cached.filter((r) => !remoteIds.has(r.id));
        const merged = [...results, ...localOnly];
        writeCache(TX_CACHE_KEY, merged);
        let out = sortBy(merged, sort);
        if (limit) out = out.slice(0, limit);
        return out;
      }
      return readCache(TX_CACHE_KEY);
    } catch {
      let cached = readCache(TX_CACHE_KEY);
      cached = sortBy(cached, sort);
      if (limit) cached = cached.slice(0, limit);
      return cached;
    }
  },
};