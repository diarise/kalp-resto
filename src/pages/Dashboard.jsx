import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getInitialTables, MENU_ITEMS } from "@/lib/menuData";
import StatusHeader from "@/components/pos/StatusHeader";
import FloorPlan from "@/components/pos/FloorPlan";
import MenuGrid from "@/components/pos/MenuGrid";
import TicketSidebar from "@/components/pos/TicketSidebar";
import KitchenSuccessModal from "@/components/pos/KitchenSuccessModal";
import CashierModal from "@/components/pos/CashierModal";
import KitchenView from "@/components/pos/KitchenView";
import BarView from "@/components/pos/BarView";
import ActivityReport from "@/components/pos/ActivityReport";
import MenuManagement from "@/components/pos/MenuManagement";
import TransactionLedger from "@/components/pos/TransactionLedger";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getCurrentStaff, clearStaff } from "@/lib/staffSession";
import { generateInvoiceNumber } from "@/lib/sariExport";

const STORAGE_KEY = "kalpe_menu_items";

function loadMenuItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // If cached menu is missing new categories (outdated), refresh from latest code
      if (!parsed.some((i) => i.category === "chichas") || !parsed.some((i) => i.category === "poulet") || !parsed.some((i) => i.category === "sale")) {
        return MENU_ITEMS;
      }
      return parsed;
    }
  } catch (e) {}
  return MENU_ITEMS;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const staff = getCurrentStaff();
  const [tables, setTables] = useState(() => getInitialTables());
  const [activeTableId, setActiveTableId] = useState(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showMenuConfig, setShowMenuConfig] = useState(false);
  const [currentView, setCurrentView] = useState("server");
  const [kitchenOrders, setKitchenOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("kalpe_kitchen_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });
  const [barOrders, setBarOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("kalpe_bar_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });
  const [menuItems, setMenuItems] = useState(() => loadMenuItems());
  const tablesRef = useRef(tables);
  tablesRef.current = tables;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem("kalpe_kitchen_orders", JSON.stringify(kitchenOrders));
    } catch (e) {}
  }, [kitchenOrders]);

  useEffect(() => {
    try {
      localStorage.setItem("kalpe_bar_orders", JSON.stringify(barOrders));
    } catch (e) {}
  }, [barOrders]);

  const handleMenuChange = useCallback((updated) => {
    setMenuItems(updated);
  }, []);

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

    // Split items by category — liquids & lounge route to Bar, all else to Cuisine
    const barItems = table.currentTicket.filter(
      (i) => i.category === "boissons" || i.category === "chichas"
    );
    const cuisineItems = table.currentTicket.filter(
      (i) => i.category !== "boissons" && i.category !== "chichas"
    );

    if (cuisineItems.length > 0) {
      setKitchenOrders((prev) => [
        ...prev,
        {
          id: `k-${now}`,
          tableName,
          timestamp: now,
          items: cuisineItems,
          status: "pending",
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
          status: "pending",
        },
      ]);
    }

    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        return { ...t, status: "occupee" };
      })
    );
    // Keep ticket intact but deselect table so server returns to floor plan
    setShowKitchenModal(true);
  }, [activeTableId, tables]);

  const handleCloseKitchenModal = useCallback(() => {
    setShowKitchenModal(false);
    // Deselect table so server returns to floor plan for next customer
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

  const handleCashierValidate = useCallback(async (paymentMethod) => {
    if (!activeTableId) return;
    const table = tables.find((t) => t.id === activeTableId);
    if (table && table.currentTicket.length > 0) {
      const invoice_number = generateInvoiceNumber();
      const total_amount = table.currentTicket.reduce((sum, i) => sum + i.qty * i.price, 0);
      try {
        await base44.entities.Transaction.create({
          invoice_number,
          timestamp: new Date().toISOString(),
          cashier_id: staff?.id || "",
          cashier_name: staff?.name || "",
          waiter_id: "",
          waiter_name: "",
          total_amount,
          items_snapshot: JSON.stringify(table.currentTicket),
          payment_method: paymentMethod || "",
          table_name: table.name,
        });
      } catch (e) {}
    }
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== activeTableId) return table;
        return { ...table, status: "libre", currentTicket: [] };
      })
    );
    setShowCashierModal(false);
    setActiveTableId(null);
  }, [activeTableId, tables, staff]);

  const handleCloseCashierModal = useCallback(() => {
    setShowCashierModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearStaff();
    navigate("/");
  }, [navigate]);

  // 3-stage state machine: pending -> preparing -> ready -> served
  const handleAdvanceOrder = useCallback((orderId) => {
    setKitchenOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order) return prev;
      const tableName = order.tableName;
      const currentStatus = order.status || "pending";
      const nextStatus =
        currentStatus === "pending"
          ? "preparing"
          : currentStatus === "preparing"
          ? "ready"
          : currentStatus === "ready"
          ? "served"
          : currentStatus;

      if (nextStatus === "preparing") {
        setTables((tables) =>
          tables.map((t) =>
            t.name === tableName ? { ...t, status: "attente" } : t
          )
        );
        return prev.map((o) =>
          o.id === orderId ? { ...o, status: "preparing" } : o
        );
      }

      if (nextStatus === "ready") {
        setTables((tables) =>
          tables.map((t) =>
            t.name === tableName ? { ...t, status: "pret" } : t
          )
        );
        return prev.map((o) =>
          o.id === orderId ? { ...o, status: "ready" } : o
        );
      }

      // served — remove from kitchen grid, mark table occupied or libre
      setTables((tables) =>
        tables.map((t) => {
          if (t.name !== tableName) return t;
          return t.currentTicket.length === 0
            ? { ...t, status: "libre" }
            : { ...t, status: "occupee" };
        })
      );
      return prev.filter((o) => o.id !== orderId);
    });
  }, []);

  // Waiter quick-action from floor plan: mark a "pret" table as served
  const handleMarkTableServed = useCallback((tableId) => {
    const table = tablesRef.current.find((t) => t.id === tableId);
    if (!table) return;
    const tableName = table.name;
    setKitchenOrders((prev) =>
      prev.filter(
        (o) => !(o.tableName === tableName && (o.status || "pending") === "ready")
      )
    );
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return t.currentTicket.length === 0
          ? { ...t, status: "libre" }
          : { ...t, status: "occupee" };
      })
    );
  }, []);

  // 3-stage state machine for bar orders: pending -> preparing -> ready -> served
  const handleAdvanceBarOrder = useCallback((orderId) => {
    setBarOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order) return prev;
      const currentStatus = order.status || "pending";
      const nextStatus =
        currentStatus === "pending"
          ? "preparing"
          : currentStatus === "preparing"
          ? "ready"
          : currentStatus === "ready"
          ? "served"
          : currentStatus;

      if (nextStatus === "served") {
        return prev.filter((o) => o.id !== orderId);
      }
      return prev.map((o) =>
        o.id === orderId ? { ...o, status: nextStatus } : o
      );
    });
  }, []);

  useEffect(() => {
    if (!staff) navigate("/");
  }, [staff, navigate]);

  if (!staff) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <StatusHeader currentView={currentView} onViewChange={setCurrentView} onOpenMenuConfig={() => setShowMenuConfig(true)} staff={staff} onLogout={handleLogout} />

      {currentView === "kitchen" ? (
        <KitchenView orders={kitchenOrders} onAdvance={handleAdvanceOrder} />
      ) : currentView === "bar" ? (
        <BarView orders={barOrders} onAdvance={handleAdvanceBarOrder} />
      ) : currentView === "report" ? (
        <ActivityReport />
      ) : currentView === "ledger" ? (
        <TransactionLedger />
      ) : (
        <div className="flex-1 flex min-h-0 min-w-0">
          <div className="flex-1 min-w-0" style={{ flexBasis: "65%" }}>
            {activeTable ? (
              <MenuGrid
                activeTable={activeTable}
                onBack={handleBackToFloor}
                onAddItem={handleAddItem}
                menuItems={menuItems}
              />
            ) : (
              <FloorPlan
                tables={tables}
                onSelectTable={handleSelectTable}
                onUpdateTableStatus={handleUpdateTableStatus}
                onMarkServed={handleMarkTableServed}
              />
            )}
          </div>

          <div className="shrink-0 min-w-0" style={{ flexBasis: "35%", maxWidth: "35%" }}>
            <TicketSidebar
              activeTable={activeTable}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onSetModifier={handleSetModifier}
              onSendKitchen={handleSendKitchen}
              onCashOut={handleCashOut}
              onPrintReceipt={handlePrintReceipt}
              orderStatus={
                activeTable
                  ? (kitchenOrders.find(
                      (o) => o.tableName === activeTable.name
                    )?.status || null)
                  : null
              }
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
      {showMenuConfig && (
        <MenuManagement
          items={menuItems}
          onChange={handleMenuChange}
          onClose={() => setShowMenuConfig(false)}
        />
      )}
    </div>
  );
}