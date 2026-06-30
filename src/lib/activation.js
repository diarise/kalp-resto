const STORAGE_KEY = "kalpe_is_activated";

// Master Activation PIN — used for first-launch unlock on each machine.
// In production, replace with a server-validated license check.
const MASTER_PIN = "7349-KALPE-RESTO-2024";

export function checkActivationStatus() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch (e) {
    return false;
  }
}

export function validateMasterPin(pin) {
  return pin === MASTER_PIN;
}

export function activateMachine() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
    return true;
  } catch (e) {
    return false;
  }
}