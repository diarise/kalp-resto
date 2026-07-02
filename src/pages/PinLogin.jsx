import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { offlineStaff } from "@/lib/offlineDB";
import { setCurrentStaff, ROLE_LABELS } from "@/lib/staffSession";
import { startShift } from "@/lib/shiftManager";
import { UtensilsCrossed, Delete, Lock } from "lucide-react";

export default function PinLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDigit = (d) => {
    if (pin.length < 6) {
      setPin(pin + d);
      setError("");
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleSubmit = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    setError("");
    try {
      const results = await offlineStaff.filter({ pin, active: true });
      if (results && results.length > 0) {
        const staff = results[0];
        setCurrentStaff(staff);
        startShift(staff);
        navigate("/dashboard");
      } else {
        setError("PIN invalide");
        setPin("");
      }
    } catch (e) {
      setError("Erreur de connexion — réessayez");
      setPin("");
    }
    setLoading(false);
  };

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Kalpé Resto</h1>
          <p className="text-sm text-gray-400 mt-1">Entrez votre PIN pour continuer</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* PIN dots */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i < pin.length ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 font-medium mb-4">{error}</p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {KEYS.map((key, i) => {
              if (key === "") return <div key={i} />;
              if (key === "del")
                return (
                  <button
                    key={i}
                    onClick={handleDelete}
                    className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all active:scale-95"
                  >
                    <Delete className="w-5 h-5 text-gray-500" />
                  </button>
                );
              return (
                <button
                  key={i}
                  onClick={() => handleDigit(key)}
                  disabled={loading}
                  className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xl font-semibold text-gray-800 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={pin.length < 4 || loading}
            className="w-full h-13 mt-4 py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0096D6" }}
          >
            <Lock className="w-4 h-4" />
            {loading ? "Connexion..." : "Valider"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          {Object.values(ROLE_LABELS).join(" · ")}
        </p>
      </div>
    </div>
  );
}