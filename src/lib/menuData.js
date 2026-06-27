export const MENU_CATEGORIES = [
  { id: "plats", label: "Plats" },
  { id: "boissons", label: "Boissons" },
  { id: "grills", label: "Grills / Entrées" },
];

export const MENU_ITEMS = [
  // Plats (Local Food)
  {
    id: "p1",
    name: "Thieboudienne Penda Mbaye",
    subtitle: "Riz au Poisson",
    price: 2500,
    category: "plats",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop",
  },
  {
    id: "p2",
    name: "Yassa Poulet",
    price: 2000,
    category: "plats",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=400&fit=crop",
  },
  {
    id: "p3",
    name: "Mafé Viande",
    price: 1800,
    category: "plats",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop",
  },
  {
    id: "p4",
    name: "Dibi Mouton",
    subtitle: "Portion",
    price: 3500,
    category: "plats",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
  },
  // Boissons (Drinks)
  {
    id: "b1",
    name: "Jus de Bissap Glacé",
    price: 500,
    category: "boissons",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
  },
  {
    id: "b2",
    name: "Jus de Bouye",
    price: 500,
    category: "boissons",
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop",
  },
  {
    id: "b3",
    name: "Gazelle",
    subtitle: "Bière locale",
    price: 1200,
    category: "boissons",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop",
  },
  {
    id: "b4",
    name: "Eau Minérale Kirène",
    subtitle: "1.5L",
    price: 400,
    category: "boissons",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
  },
  // Grills / Entrées
  {
    id: "g1",
    name: "Portion Pastels",
    subtitle: "10 pcs",
    price: 1000,
    category: "grills",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
  },
  {
    id: "g2",
    name: "Chawarma Viande",
    price: 1500,
    category: "grills",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop",
  },
];

export function getInitialTables() {
  // Zone configs: [zoneKey, startId, count]
  const ZONES = [
    { zone: "salle", startId: 1, count: 15 },
    { zone: "etage", startId: 16, count: 30 },
    { zone: "terrasse", startId: 46, count: 30 },
  ];

  // Scattered demo statuses by table id to make the floor look active
  const DEMO_STATUSES = {
    2: "occupee",
    4: "reservee",
    5: "occupee",
    6: "horsService",
    7: "occupee",
    8: "attente",
    18: "occupee",
    20: "reservee",
    23: "attente",
    27: "horsService",
    31: "occupee",
    35: "reservee",
    40: "attente",
    48: "occupee",
    52: "reservee",
    55: "horsService",
    60: "attente",
    65: "occupee",
    70: "reservee",
  };

  const DEMO_TICKETS = {
    2: [
      { id: "p1", name: "Thieboudienne Penda Mbaye", qty: 2, price: 2500, category: "plats" },
      { id: "b1", name: "Jus de Bissap Glacé", qty: 3, price: 500, category: "boissons" },
    ],
    5: [
      { id: "p2", name: "Yassa Poulet", qty: 1, price: 2000, category: "plats" },
      { id: "p3", name: "Mafé Viande", qty: 1, price: 1800, category: "plats" },
      { id: "b3", name: "Gazelle", qty: 2, price: 1200, category: "boissons" },
    ],
    7: [
      { id: "g2", name: "Chawarma Viande", qty: 2, price: 1500, category: "grills" },
      { id: "b4", name: "Eau Minérale Kirène", qty: 1, price: 400, category: "boissons" },
    ],
    8: [
      { id: "b2", name: "Jus de Bouye", qty: 1, price: 500, category: "boissons" },
    ],
    18: [
      { id: "p4", name: "Dibi Mouton", qty: 1, price: 3500, category: "plats" },
      { id: "b1", name: "Jus de Bissap Glacé", qty: 2, price: 500, category: "boissons" },
    ],
    48: [
      { id: "p2", name: "Yassa Poulet", qty: 2, price: 2000, category: "plats" },
      { id: "g1", name: "Portion Pastels", qty: 1, price: 1000, category: "grills" },
    ],
    65: [
      { id: "p3", name: "Mafé Viande", qty: 1, price: 1800, category: "plats" },
      { id: "b3", name: "Gazelle", qty: 1, price: 1200, category: "boissons" },
    ],
  };

  const tables = [];
  for (const z of ZONES) {
    for (let i = 0; i < z.count; i++) {
      const id = z.startId + i;
      const status = DEMO_STATUSES[id] || "libre";
      tables.push({
        id,
        name: `Table ${id}`,
        zone: z.zone,
        status,
        currentTicket: DEMO_TICKETS[id] || [],
      });
    }
  }
  return tables;
}