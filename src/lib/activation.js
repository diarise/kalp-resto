export function checkActivationStatus() {
  try {
    return localStorage.getItem("kalpe_pos_activated") === "true";
  } catch (e) {
    return false;
  }
}

export function activateApp(pinOrKey) {
  // Master Activation Key — used for first-launch unlock on each client terminal.
  if (pinOrKey === "KALPE-99X7-SECURE") {
    try {
      localStorage.setItem("kalpe_pos_activated", "true");
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}