import React, { useState, useCallback, useMemo } from "react";
import { getInitialTables } from "@/lib/menuData";
import StatusHeader from "@/components/pos/StatusHeader";
import FloorPlan from "@/components/pos/FloorPlan";
import MenuGrid from "@/components/pos/MenuGrid";
import TicketSidebar from "@/components/pos/TicketSidebar";

export default function Dashboard() {
  const [tables, setTables] = useState(() => getInitialTables());
  const [activeTableId, setActiveTableId] = useState(null);

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
  }, [activeTableId]);

  const handleCashOut = useCallback(() => {
    if (!activeTableId) return;
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== activeTableId) return table;
        return { ...table, status: "libre", currentTicket: [] };
      })
    );
    setActiveTableId(null);
  }, [activeTableId]);

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
    </div>
  );
}