import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getInitialTables, MENU_ITEMS, loadCategories, saveCategories } from "@/lib/menuData";
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
import PrinterConfigModal from "@/components/pos/PrinterConfigModal";
import TransactionLedger from "@/components/pos/TransactionLedger";
import ZReport from "@/components/pos/ZReport";
import DeliveryView from "@/components/pos/DeliveryView";
import DeliverySidebar from "@/components/pos/DeliverySidebar";
import SuperAdminPanel from "@/components/pos/SuperAdminPanel";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getCurrentStaff, clearStaff, canAccess } from "@/lib/staffSession";
import { generateInvoiceNumber } from "@/lib/sariExport";
import { getKitchenPrinter, getBarPrinter } from "@/lib/printerConfig";
import { generateKitchenPrepHtml, generateBarPrepHtml, generateCancellationHtml, generateModificationHtml } from "@/lib/prepTicket";

const STORAGE_KEY = "kalpe_menu_items";
const MENU_VERSION = "2026-07-07-v2";

// Hard cache eviction: flush stale menu cache so the latest MENU_ITEMS from source always load
(function evictStaleMenuCache() {
  try {
    const storedVersion = localStorage.getItem("kalpe_menu_version");
    if (storedVersion !== MENU_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("kalpe_menu_version", MENU_VERSION);
    }
  } catch (e) {}
})();

function loadMenuItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // If cached menu is missing any current categories (outdated), refresh from latest code
      if (
        !parsed.some((i) => i.category === "chichas") ||
        !parsed.some((i) => i.category === "poulet") ||
        !parsed.some((i) => i.category === "sale") ||
        !parsed.some((i) => i.category === "boissons_chaudes")
      ) {
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
  const [tables, setTables] = useState(() => {
    try {
      const stored = localStorage.getItem("kalpe_tables");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return getInitialTables();
  });
  const [activeTableId, setActiveTableId] = useState(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showMenuConfig, setShowMenuConfig] = useState(false);
  const [showPrinterConfig, setShowPrinterConfig] = useState(false);
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
  const [floorMode, setFloorMode] = useState("tables");
  const [deliveryOrders, setDeliveryOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("kalpe_delivery_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });
  const [activeDeliveryId, setActiveDeliveryId] = useState(null);
  const [menuItems, setMenuItems] = useState(() => loadMenuItems());
  const [categories, setCategories] = useState(() => loadCategories());
  const tablesRef = useRef(tables);
  tablesRef.current = tables;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {}
  }, [menuItems]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

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

  // Persist table states (orders, statuses) so data survives app restarts
  useEffect(() => {
    try {
      localStorage.setItem("kalpe_tables", JSON.stringify(tables));
    } catch (e) {}
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem("kalpe_delivery_orders", JSON.stringify(deliveryOrders));
    } catch (e) {}
  }, [deliveryOrders]);

  // Auto-archive: remove delivery orders that are both paid AND delivered
  useEffect(() => {
    setDeliveryOrders((prev) => {
      const active = prev.filter(
        (d) => !(d.payment_status === "paid" && d.delivery_status === "delivered")
      );
      return active.length !== prev.length ? active : prev;
    });
  }, [deliveryOrders]);

  // Auto-cleanup: remove cancelled kitchen/bar orders after 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setKitchenOrders((prev) => prev.filter((o) => !o.cancelled || now - (o.cancelledAt || 0) < 60000));
      setBarOrders((prev) => prev.filter((o) => !o.cancelled || now - (o.cancelledAt || 0) < 60000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuChange = useCallback((updated) => {
    setMenuItems(updated);
  }, []);

  const handleCategoriesChange = useCallback((updated) => {
    setCategories(updated);
  }, []);

  const activeTable = useMemo(
    () => tables.find((t) => t.id === activeTableId) || null,
    [tables, activeTableId]
  );

  const activeDelivery = useMemo(
    () => deliveryOrders.find((d) => d.id === activeDeliveryId) || null,
    [deliveryOrders, activeDeliveryId]
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
                i.id === menuItem.id
                  ? { ...i, qty: i.qty + 1, status: i.status === "sent" ? "pending" : i.status }
                  : i
              )
            : [
                ...table.currentTicket,
                {
                  id: menuItem.id,
                  name: menuItem.name,
                  qty: 1,
                  price: menuItem.price,
                  category: menuItem.category,
                  sari_code: menuItem.sari_code,
                  status: "pending",
                  sent_qty: 0,
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
            currentTicket: table.currentTicket.map((i) => {
              if (i.id !== itemId) return i;
              const wasSent = i.status === "sent";
              const clampedSent = Math.min(i.sent_qty || 0, newQty);
              return {
                ...i,
                qty: newQty,
                sent_qty: clampedSent,
                status: newQty > (i.sent_qty || 0) && wasSent ? "pending" : i.status,
              };
            }),
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

  const handleCancelOrder = useCallback(() => {
    if (!activeTableId) return;
    const table = tables.find((t) => t.id === activeTableId);
    if (!table) return;
    const tableName = table.name;
    const items = table.currentTicket;
    const barItems = items.filter((i) => i.category === "boissons" || i.category === "chichas");
    const cuisineItems = items.filter((i) => i.category !== "boissons" && i.category !== "chichas");
    // Fire ANNULATION slip to kitchen/bar printers
    if (window.electronAPI && typeof window.electronAPI.printSilent === "function") {
      const kitchenPrinter = getKitchenPrinter();
      const barPrinter = getBarPrinter();
      if (cuisineItems.length > 0 && kitchenPrinter) {
        const html = generateCancellationHtml({ table, staff, items: cuisineItems });
        window.electronAPI.printSilent(html, kitchenPrinter);
      }
      if (barItems.length > 0 && barPrinter) {
        const html = generateCancellationHtml({ table, staff, items: barItems });
        window.electronAPI.printSilent(html, barPrinter);
      }
    }
    // Mark kitchen/bar orders as cancelled for flash display on monitors
    setKitchenOrders((prev) => prev.map((o) => o.tableName === tableName ? { ...o, cancelled: true, cancelledAt: Date.now() } : o));
    setBarOrders((prev) => prev.map((o) => o.tableName === tableName ? { ...o, cancelled: true, cancelledAt: Date.now() } : o));
    // Clear table back to free
    setTables((prev) => prev.map((t) => t.id === activeTableId ? { ...t, status: "libre", currentTicket: [] } : t));
    setActiveTableId(null);
  }, [activeTableId, tables, staff]);

  const handleValidateModification = useCallback(
    (originalItems, currentItems) => {
      if (!activeTableId) return;
      const table = tables.find((t) => t.id === activeTableId);
      if (!table) return;

      // Compute deltas: items fully removed or quantities decreased
      const modifications = [];
      for (const orig of originalItems) {
        const curr = currentItems.find((i) => i.id === orig.id);
        if (!curr) {
          modifications.push({ ...orig, delta: orig.qty });
        } else if (curr.qty < orig.qty) {
          modifications.push({ ...orig, delta: orig.qty - curr.qty });
        }
      }

      if (modifications.length === 0) return;

      const tableName = table.name;
      const kitchenMods = modifications.filter((m) => m.category !== "boissons" && m.category !== "chichas");
      const barMods = modifications.filter((m) => m.category === "boissons" || m.category === "chichas");

      // Fire MODIFICATION slips to kitchen/bar printers
      if (window.electronAPI && typeof window.electronAPI.printSilent === "function") {
        const kitchenPrinter = getKitchenPrinter();
        const barPrinter = getBarPrinter();
        if (kitchenMods.length > 0 && kitchenPrinter) {
          const html = generateModificationHtml({
            table, staff,
            modifications: kitchenMods.map((m) => ({ name: m.name, qty: m.delta })),
          });
          window.electronAPI.printSilent(html, kitchenPrinter);
        }
        if (barMods.length > 0 && barPrinter) {
          const html = generateModificationHtml({
            table, staff,
            modifications: barMods.map((m) => ({ name: m.name, qty: m.delta })),
          });
          window.electronAPI.printSilent(html, barPrinter);
        }
      }

      // Update active kitchen/bar order cards dynamically to reflect new quantities
      setKitchenOrders((prev) => prev.map((o) => {
        if (o.tableName !== tableName || o.cancelled) return o;
        const updatedItems = o.items
          .map((item) => {
            const curr = currentItems.find((i) => i.id === item.id);
            if (!curr) return null;
            return { ...item, qty: curr.qty };
          })
          .filter(Boolean);
        return { ...o, items: updatedItems };
      }));
      setBarOrders((prev) => prev.map((o) => {
        if (o.tableName !== tableName || o.cancelled) return o;
        const updatedItems = o.items
          .map((item) => {
            const curr = currentItems.find((i) => i.id === item.id);
            if (!curr) return null;
            return { ...item, qty: curr.qty };
          })
          .filter(Boolean);
        return { ...o, items: updatedItems };
      }));
    },
    [activeTableId, tables, staff]
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
    const nowIso = new Date(now).toISOString();
    const tableName = table.name;

    // Order Rounds: isolate ONLY items with unsent (pending) quantity
    const pendingItems = table.currentTicket.filter(
      (i) => i.status !== "sent" && i.qty - (i.sent_qty || 0) > 0
    );
    if (pendingItems.length === 0) return;

    // Previously fired items — printed for chef recall (do NOT re-prepare)
    const previouslySent = table.currentTicket.filter((i) => (i.sent_qty || 0) > 0);
    const buildDelta = (i) => ({ ...i, qty: i.qty - (i.sent_qty || 0) });

    const cuisinePending = pendingItems.filter((i) => i.category !== "boissons" && i.category !== "chichas");
    const barPending = pendingItems.filter((i) => i.category === "boissons" || i.category === "chichas");
    const cuisineRecall = previouslySent.filter((i) => i.category !== "boissons" && i.category !== "chichas");
    const barRecall = previouslySent.filter((i) => i.category === "boissons" || i.category === "chichas");

    if (cuisinePending.length > 0) {
      setKitchenOrders((prev) => [...prev, { id: `k-${now}`, tableName, timestamp: now, items: cuisinePending.map(buildDelta), status: "pending" }]);
    }
    if (barPending.length > 0) {
      setBarOrders((prev) => [...prev, { id: `b-${now}`, tableName, timestamp: now, items: barPending.map(buildDelta), status: "pending" }]);
    }

    // Silent split-routing: print ONLY the new (pending) items to assigned hardware
    if (window.electronAPI && typeof window.electronAPI.printSilent === "function") {
      const kitchenPrinter = getKitchenPrinter();
      const barPrinter = getBarPrinter();
      if (cuisinePending.length > 0 && kitchenPrinter) {
        const html = generateKitchenPrepHtml({ table, staff, items: cuisinePending.map(buildDelta), previouslySent: cuisineRecall });
        window.electronAPI.printSilent(html, kitchenPrinter);
      }
      if (barPending.length > 0 && barPrinter) {
        const html = generateBarPrepHtml({ table, staff, items: barPending.map(buildDelta), previouslySent: barRecall });
        window.electronAPI.printSilent(html, barPrinter);
      }
    }

    // Mark the fired items as sent — status transitions pending → sent
    const firedIds = new Set(pendingItems.map((i) => i.id));
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        return {
          ...t,
          status: "occupee",
          currentTicket: t.currentTicket.map((i) =>
            firedIds.has(i.id) ? { ...i, status: "sent", sent_qty: i.qty, sent_at: nowIso } : i
          ),
        };
      })
    );

    setShowKitchenModal(true);
  }, [activeTableId, tables, staff]);

  const handleCloseKitchenModal = useCallback(() => {
    setShowKitchenModal(false);
    if (floorMode === "delivery") {
      setActiveDeliveryId(null);
    } else {
      setActiveTableId(null);
    }
  }, [floorMode]);



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

  const handleLogout = useCallback(() => {
    clearStaff();
    navigate("/terminal");
  }, [navigate]);

  // 3-stage state machine: pending -> preparing -> ready -> served
  const handleAdvanceOrder = useCallback((orderId) => {
    setKitchenOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order) return prev;
      if (order.cancelled) {
        return prev.filter((o) => o.id !== orderId);
      }
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
      if (order.cancelled) {
        return prev.filter((o) => o.id !== orderId);
      }
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

  // ===== DELIVERY WORKFLOW =====
  const handleEnterDelivery = useCallback(() => {
    setFloorMode("delivery");
    setActiveDeliveryId(null);
  }, []);

  const handleExitDelivery = useCallback(() => {
    setFloorMode("tables");
    setActiveDeliveryId(null);
  }, []);

  const handleNewDelivery = useCallback(() => {
    const newDelivery = {
      id: `del-${Date.now()}`,
      order_type: "delivery",
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      currentTicket: [],
      delivery_status: "preparing",
      payment_status: "pending",
      timestamp: Date.now(),
    };
    setDeliveryOrders((prev) => [...prev, newDelivery]);
    setActiveDeliveryId(newDelivery.id);
  }, []);

  const handleSelectDelivery = useCallback((id) => {
    setActiveDeliveryId(id);
  }, []);

  const handleBackToDeliveryList = useCallback(() => {
    setActiveDeliveryId(null);
  }, []);

  const handleAddDeliveryItem = useCallback(
    (menuItem) => {
      if (!activeDeliveryId) return;
      setDeliveryOrders((prev) =>
        prev.map((del) => {
          if (del.id !== activeDeliveryId) return del;
          const existing = del.currentTicket.find((i) => i.id === menuItem.id);
          const updatedTicket = existing
            ? del.currentTicket.map((i) => (i.id === menuItem.id ? { ...i, qty: i.qty + 1, status: i.status === "sent" ? "pending" : i.status } : i))
            : [...del.currentTicket, { id: menuItem.id, name: menuItem.name, qty: 1, price: menuItem.price, category: menuItem.category, sari_code: menuItem.sari_code, status: "pending", sent_qty: 0 }];
          return { ...del, currentTicket: updatedTicket };
        })
      );
    },
    [activeDeliveryId]
  );

  const handleUpdateDeliveryQty = useCallback(
    (itemId, newQty) => {
      if (!activeDeliveryId) return;
      setDeliveryOrders((prev) =>
        prev.map((del) => {
          if (del.id !== activeDeliveryId) return del;
          return {
            ...del,
            currentTicket: del.currentTicket.map((i) => {
              if (i.id !== itemId) return i;
              const wasSent = i.status === "sent";
              const clampedSent = Math.min(i.sent_qty || 0, newQty);
              return { ...i, qty: newQty, sent_qty: clampedSent, status: newQty > (i.sent_qty || 0) && wasSent ? "pending" : i.status };
            }),
          };
        })
      );
    },
    [activeDeliveryId]
  );

  const handleRemoveDeliveryItem = useCallback(
    (itemId) => {
      if (!activeDeliveryId) return;
      setDeliveryOrders((prev) =>
        prev.map((del) => {
          if (del.id !== activeDeliveryId) return del;
          return { ...del, currentTicket: del.currentTicket.filter((i) => i.id !== itemId) };
        })
      );
    },
    [activeDeliveryId]
  );

  const handleSetDeliveryModifier = useCallback(
    (itemId, field, value) => {
      if (!activeDeliveryId) return;
      setDeliveryOrders((prev) =>
        prev.map((del) => {
          if (del.id !== activeDeliveryId) return del;
          return { ...del, currentTicket: del.currentTicket.map((i) => (i.id === itemId ? { ...i, [field]: value || undefined } : i)) };
        })
      );
    },
    [activeDeliveryId]
  );

  const handleUpdateDeliveryCustomer = useCallback(
    (field, value) => {
      if (!activeDeliveryId) return;
      setDeliveryOrders((prev) =>
        prev.map((del) => (del.id === activeDeliveryId ? { ...del, [field]: value } : del))
      );
    },
    [activeDeliveryId]
  );

  const handleSendDeliveryKitchen = useCallback(() => {
    if (!activeDeliveryId) return;
    const delivery = deliveryOrders.find((d) => d.id === activeDeliveryId);
    if (!delivery) return;

    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const customerLabel = delivery.customer_name || "Client";
    const headerValue = `Livraison - ${customerLabel}`;

    // Order Rounds: isolate ONLY items with unsent (pending) quantity
    const pendingItems = delivery.currentTicket.filter((i) => i.status !== "sent" && i.qty - (i.sent_qty || 0) > 0);
    if (pendingItems.length === 0) return;

    const previouslySent = delivery.currentTicket.filter((i) => (i.sent_qty || 0) > 0);
    const buildDelta = (i) => ({ ...i, qty: i.qty - (i.sent_qty || 0) });

    const cuisinePending = pendingItems.filter((i) => i.category !== "boissons" && i.category !== "chichas");
    const barPending = pendingItems.filter((i) => i.category === "boissons" || i.category === "chichas");
    const cuisineRecall = previouslySent.filter((i) => i.category !== "boissons" && i.category !== "chichas");
    const barRecall = previouslySent.filter((i) => i.category === "boissons" || i.category === "chichas");

    if (cuisinePending.length > 0) {
      setKitchenOrders((prev) => [...prev, { id: `k-${now}`, tableName: headerValue, timestamp: now, items: cuisinePending.map(buildDelta), status: "pending" }]);
    }
    if (barPending.length > 0) {
      setBarOrders((prev) => [...prev, { id: `b-${now}`, tableName: headerValue, timestamp: now, items: barPending.map(buildDelta), status: "pending" }]);
    }

    const firedIds = new Set(pendingItems.map((i) => i.id));
    setDeliveryOrders((prev) => prev.map((d) => {
      if (d.id !== activeDeliveryId) return d;
      return {
        ...d,
        delivery_status: "preparing",
        currentTicket: d.currentTicket.map((i) => (firedIds.has(i.id) ? { ...i, status: "sent", sent_qty: i.qty, sent_at: nowIso } : i)),
      };
    }));

    if (window.electronAPI && typeof window.electronAPI.printSilent === "function") {
      const kitchenPrinter = getKitchenPrinter();
      const barPrinter = getBarPrinter();
      if (cuisinePending.length > 0 && kitchenPrinter) {
        const html = generateKitchenPrepHtml({ table: { name: customerLabel }, staff, items: cuisinePending.map(buildDelta), previouslySent: cuisineRecall, headerLabel: "Client:" });
        window.electronAPI.printSilent(html, kitchenPrinter);
      }
      if (barPending.length > 0 && barPrinter) {
        const html = generateBarPrepHtml({ table: { name: customerLabel }, staff, items: barPending.map(buildDelta), previouslySent: barRecall, headerLabel: "Client:" });
        window.electronAPI.printSilent(html, barPrinter);
      }
    }

    setShowKitchenModal(true);
  }, [activeDeliveryId, deliveryOrders, staff]);

  const handleDeliveryCashOut = useCallback(() => {
    if (!activeDeliveryId) return;
    setShowCashierModal(true);
  }, [activeDeliveryId]);

  const handleDeliveryValidate = useCallback(() => {
    if (!activeDeliveryId) return;
    setDeliveryOrders((prev) =>
      prev.map((d) => (d.id === activeDeliveryId ? { ...d, payment_status: "paid" } : d))
    );
    setShowCashierModal(false);
    setActiveDeliveryId(null);
  }, [activeDeliveryId]);

  const handleUpdateDeliveryStatus = useCallback((orderId, status) => {
    setDeliveryOrders((prev) => prev.map((d) => (d.id === orderId ? { ...d, delivery_status: status } : d)));
  }, []);

  const handleCloseDelivery = useCallback((orderId) => {
    setDeliveryOrders((prev) => prev.filter((d) => d.id !== orderId));
  }, []);

  useEffect(() => {
    if (!staff) navigate("/terminal");
  }, [staff, navigate]);

  if (!staff) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      <StatusHeader currentView={currentView} onViewChange={setCurrentView} onOpenMenuConfig={() => setShowMenuConfig(true)} onOpenPrinterConfig={() => setShowPrinterConfig(true)} staff={staff} onLogout={handleLogout} />

      {currentView === "kitchen" ? (
        <KitchenView orders={kitchenOrders} onAdvance={handleAdvanceOrder} />
      ) : currentView === "bar" ? (
        <BarView orders={barOrders} onAdvance={handleAdvanceBarOrder} />
      ) : currentView === "report" ? (
        <ActivityReport />
      ) : currentView === "ledger" ? (
        <TransactionLedger />
      ) : currentView === "z_report" ? (
        <ZReport />
      ) : currentView === "tech_zone" ? (
        <SuperAdminPanel onOpenPrinterConfig={() => setShowPrinterConfig(true)} />
      ) : (
        <div className="flex-1 flex min-h-0 min-w-0">
          <div className="flex-1 min-w-0" style={{ flexBasis: "65%" }}>
            {floorMode === "delivery" ? (
              activeDelivery ? (
                <MenuGrid
                  activeTable={{ name: `Livraison - ${activeDelivery.customer_name || "Nouvelle"}` }}
                  onBack={handleBackToDeliveryList}
                  onAddItem={handleAddDeliveryItem}
                  menuItems={menuItems}
                  categories={categories}
                />
              ) : (
                <DeliveryView
                  deliveries={deliveryOrders}
                  onNew={handleNewDelivery}
                  onSelect={handleSelectDelivery}
                  onBack={handleExitDelivery}
                  onUpdateStatus={handleUpdateDeliveryStatus}
                  onCloseDelivery={handleCloseDelivery}
                />
              )
            ) : activeTable ? (
              <MenuGrid
                activeTable={activeTable}
                onBack={handleBackToFloor}
                onAddItem={handleAddItem}
                menuItems={menuItems}
                categories={categories}
              />
            ) : (
              <FloorPlan
                tables={tables}
                onSelectTable={handleSelectTable}
                onUpdateTableStatus={handleUpdateTableStatus}
                onMarkServed={handleMarkTableServed}
                onEnterDelivery={handleEnterDelivery}
                showDeliveryToggle={canAccess(staff.role, "delivery")}
              />
            )}
          </div>

          <div className="shrink-0 min-w-0" style={{ flexBasis: "35%", maxWidth: "35%" }}>
            {floorMode === "delivery" && activeDelivery ? (
              <DeliverySidebar
                delivery={activeDelivery}
                onUpdateCustomer={handleUpdateDeliveryCustomer}
                onUpdateQty={handleUpdateDeliveryQty}
                onRemoveItem={handleRemoveDeliveryItem}
                onSetModifier={handleSetDeliveryModifier}
                onSendKitchen={handleSendDeliveryKitchen}
                onCashOut={handleDeliveryCashOut}
              />
            ) : (
              <TicketSidebar
                activeTable={activeTable}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onSetModifier={handleSetModifier}
                onSendKitchen={handleSendKitchen}
                onCashOut={handleCashOut}
                onPrintReceipt={handlePrintReceipt}
                onCancelOrder={handleCancelOrder}
                onValidateModification={handleValidateModification}
                orderSent={activeTable && activeTable.status !== "libre" && activeTable.currentTicket.length > 0}
                orderStatus={
                  activeTable
                    ? (kitchenOrders.find(
                        (o) => o.tableName === activeTable.name
                      )?.status || null)
                    : null
                }
              />
            )}
          </div>
        </div>
      )}

      {showKitchenModal && (
        <KitchenSuccessModal
          table={floorMode === "delivery" && activeDelivery ? { name: `Livraison - ${activeDelivery.customer_name || "Client"}` } : activeTable}
          onClose={handleCloseKitchenModal}
        />
      )}
      {showCashierModal && (
        <CashierModal
          table={floorMode === "delivery" && activeDelivery ? { name: activeDelivery.customer_name || "Livraison", currentTicket: activeDelivery.currentTicket } : activeTable}
          total={
            floorMode === "delivery" && activeDelivery
              ? (activeDelivery.currentTicket || []).reduce((sum, i) => sum + i.qty * i.price, 0)
              : (activeTable?.currentTicket.reduce((sum, i) => sum + i.qty * i.price, 0) || 0)
          }
          onClose={handleCloseCashierModal}
          onValidate={floorMode === "delivery" ? handleDeliveryValidate : handleCashierValidate}
          deliveryInfo={
            floorMode === "delivery" && activeDelivery
              ? {
                  customer_name: activeDelivery.customer_name,
                  customer_phone: activeDelivery.customer_phone,
                  customer_address: activeDelivery.customer_address,
                  delivery_status: activeDelivery.delivery_status,
                }
              : null
          }
        />
      )}
      {showMenuConfig && (
        <MenuManagement
          items={menuItems}
          categories={categories}
          onChange={handleMenuChange}
          onCategoriesChange={handleCategoriesChange}
          onClose={() => setShowMenuConfig(false)}
        />
      )}
      {showPrinterConfig && (
        <PrinterConfigModal onClose={() => setShowPrinterConfig(false)} />
      )}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500 border-t border-slate-900 bg-[#060913]">
        <p>
          © 2026 <span className="font-semibold text-slate-400">Kalpé Resto</span> • Propulsé par <span className="font-bold text-indigo-400">Daouda Dia (resto.kalpe.app)</span>
        </p>
      </footer>
    </div>
  );
}