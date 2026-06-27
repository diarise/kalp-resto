import React, { useState, useCallback, useMemo } from "react";
import { getInitialTables } from "@/lib/menuData";
import StatusHeader from "@/components/pos/StatusHeader";
import FloorPlan from "@/components/pos/FloorPlan";
import MenuGrid from "@/components/pos/MenuGrid";
import TicketSidebar from "@/components/pos/TicketSidebar";
import KitchenSuccessModal from "@/components/pos/KitchenSuccessModal";
import CashierModal from "@/components/pos/CashierModal";
import KitchenView from "@/components/pos/KitchenView";
import BarView from "@/components/pos/BarView";

export default function Dashboard() {
  const [tables, setTables] = useState(() => getInitialTables());
  const [activeTableId, setActiveTableId] = useState(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [currentView, setCurrentView] = useState("server");
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [barOrders, setBarOrders] = useState([]);

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

  const handleSetModifier = useCallback(
    (itemId, field, value) => {
      if (!activeTableId) return;
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== activeTableId) return table;
          return {
            ...table,
            currentTicket: table.currentTicket.map((i) =>
              i.id === itemId ? { ...i, [field]: value || undefined } : i
            ),
          };
        })
      );
    },
    [activeTableId]
  );

  const handleSendKitchen = useCallback(() => {
    if (!activeTableId) return;
    const table = tables.find((t) => t.id === activeTableId);
    if (!table) return;

    const now = Date.now();
    const tableName = table.name;

    // Split items by category
    const cuisineItems = table.currentTicket.filter(
      (i) => i.category === "plats" || i.category === "grills"
    );
    const barItems = table.currentTicket.filter((i) => i.category === "boissons");

    if (cuisineItems.length > 0) {
      setKitchenOrders((prev) => [
        ...prev,
        {
          id: `k-${now}`,
          tableName,
          timestamp: now,
          items: cuisineItems,
        },
      ]);
    }
    if (barItems.length > 0) {
      setBarOrders((prev) => [
        ...prev,
        {
          id: `b-${now}`,
          tableName,
          timestamp: now,
          items: barItems,
        },
      ]);
    }

    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        return { ...t, status: "occupee" };
      })
    );
    setShowKitchenModal(true);
  }, [activeTableId, tables]);

  const handleCloseKitchenModal = useCallback(() => {
    setShowKitchenModal(false);
    setActiveTableId(null);
  }, []);



  const handleCashOut = useCallback(() => {
    if (!activeTableId) return;
    setShowCashierModal(true);
  }, [activeTableId]);

  const handlePrintReceipt = useCallback(() => {
    if (!activeTableId) return;
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        return { ...t, status: "attente" };
      })
    );
  }, [activeTableId]);

  const handleUpdateTableStatus = useCallback((tableId, status) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  }, []);

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

  const handleMarkKitchenReady = useCallback((orderId) => {
    setKitchenOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const handleMarkBarReady = useCallback((orderId) => {
    setBarOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <StatusHeader currentView={currentView} onViewChange={setCurrentView} />

      {currentView === "kitchen" ? (
        <KitchenView orders={kitchenOrders} onMarkReady={handleMarkKitchenReady} />
      ) : currentView === "bar" ? (
        <BarView orders={barOrders} onMarkReady={handleMarkBarReady} />
      ) : (
        <div className="flex-1 flex min-h-0">
          <div className="flex-1" style={{ flexBasis: "65%" }}>
            {activeTable ? (
              <MenuGrid
                activeTable={activeTable}
                onBack={handleBackToFloor}
                onAddItem={handleAddItem}
              />
            ) : (
              <FloorPlan
                tables={tables}
                onSelectTable={handleSelectTable}
                onUpdateTableStatus={handleUpdateTableStatus}
              />
            )}
          </div>

          <div className="shrink-0" style={{ flexBasis: "35%", maxWidth: "35%" }}>
            <TicketSidebar
              activeTable={activeTable}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onSetModifier={handleSetModifier}
              onSendKitchen={handleSendKitchen}
              onCashOut={handleCashOut}
              onPrintReceipt={handlePrintReceipt}
            />
          </div>
        </div>
      )}

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