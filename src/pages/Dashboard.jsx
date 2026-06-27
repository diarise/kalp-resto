import React, { useState, useCallback, useMemo, useEffect } from "react";
import { getInitialTables } from "@/lib/menuData";
import StatusHeader from "@/components/pos/StatusHeader";
import FloorPlan from "@/components/pos/FloorPlan";
import MenuGrid from "@/components/pos/MenuGrid";
import TicketSidebar from "@/components/pos/TicketSidebar";
import KitchenSuccessModal from "@/components/pos/KitchenSuccessModal";
import CashierModal from "@/components/pos/CashierModal";

export default function Dashboard() {
  const [tables, setTables] = useState(() => getInitialTables());
  const [activeTableId, setActiveTableId] = useState(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCashierModal, setShowCashierModal] = useState(false);

  const activeTable = useMemo(
    () => tables.find((t) => t.id === activeTableId) || null,
    [tables, activeTableId]
  );

  const handleSelectTable = useCallback((id) => {
    setActiveTableId(id);
  }, []);

  const handleBackToFloor = useCallback(() => {
    setActiveTableId(null);
  }, []);

  const handleAddItem = useCallback(
    (menuItem) => {
      if (!activeTableId) return;
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== activeTableId) return table;
          const existing = table.currentTicket.find((i) => i.id === menuItem.id);
          const updatedTicket = existing
            ? table.currentTicket.map((i) =>
                i.id === menuItem.id ? { ...i, qty: i.qty + 1 } : i
              )
            : [
                ...table.currentTicket,
                {
                  id: menuItem.id,
                  name: menuItem.name,
                  qty: 1,
                  price: menuItem.price,
                  category: menuItem.category,
                },
              ];
          return { ...table, currentTicket: updatedTicket };
        })
      );
    },
    [activeTableId]
  );

  const handleUpdateQty = useCallback(
    (itemId, newQty) => {
      if (!activeTableId) return;
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== activeTableId) return table;
          return {
            ...table,
            currentTicket: table.currentTicket.map((i) =>
              i.id === itemId ? { ...i, qty: newQty } : i
            ),
          };
        })
      );
    },
    [activeTableId]
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      if (!activeTableId) return;
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== activeTableId) return table;
          return {
            ...table,
            currentTicket: table.currentTicket.filter((i) => i.id !== itemId),
          };
        })
      );
    },
    [activeTableId]
  );

  const handleSendKitchen = useCallback(() => {
    if (!activeTableId) return;
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== activeTableId) return table;
        return { ...table, status: "occupee" };
      })
    );
    setShowKitchenModal(true);
  }, [activeTableId]);

  const handleCloseKitchenModal = useCallback(() => {
    setShowKitchenModal(false);
    setActiveTableId(null);
  }, []);

  // Auto-dismiss kitchen modal after 2s and return to floor plan
  useEffect(() => {
    if (!showKitchenModal) return;
    const timer = setTimeout(() => {
      setShowKitchenModal(false);
      setActiveTableId(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showKitchenModal]);

  const handleCashOut = useCallback(() => {
    if (!activeTableId) return;
    setShowCashierModal(true);
  }, [activeTableId]);

  const handleCashierValidate = useCallback(() => {
    if (!activeTableId) return;
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== activeTableId) return table;
        return { ...table, status: "libre", currentTicket: [] };
      })
    );
    setShowCashierModal(false);
    setActiveTableId(null);
  }, [activeTableId]);

  const handleCloseCashierModal = useCallback(() => {
    setShowCashierModal(false);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <StatusHeader />

      <div className="flex-1 flex min-h-0">
        {/* ZONE A: Left workspace — 65% */}
        <div className="flex-1" style={{ flexBasis: "65%" }}>
          {activeTable ? (
            <MenuGrid
              activeTable={activeTable}
              onBack={handleBackToFloor}
              onAddItem={handleAddItem}
            />
          ) : (
            <FloorPlan tables={tables} onSelectTable={handleSelectTable} />
          )}
        </div>

        {/* ZONE B: Right sidebar — 35% */}
        <div className="shrink-0" style={{ flexBasis: "35%", maxWidth: "35%" }}>
          <TicketSidebar
            activeTable={activeTable}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onSendKitchen={handleSendKitchen}
            onCashOut={handleCashOut}
          />
        </div>
      </div>

      {showKitchenModal && (
        <KitchenSuccessModal table={activeTable} onClose={handleCloseKitchenModal} />
      )}
      {showCashierModal && (
        <CashierModal
          table={activeTable}
          total={activeTable?.currentTicket.reduce((sum, i) => sum + i.qty * i.price, 0) || 0}
          onClose={handleCloseCashierModal}
          onValidate={handleCashierValidate}
        />
      )}
    </div>
  );
}