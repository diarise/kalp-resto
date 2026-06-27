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
  return [
    { id: 1, name: "Table 1", status: "libre", currentTicket: [] },
    {
      id: 2,
      name: "Table 2",
      status: "occupee",
      currentTicket: [
        { id: "p1", name: "Thieboudienne Penda Mbaye", qty: 2, price: 2500, category: "plats" },
        { id: "b1", name: "Jus de Bissap Glacé", qty: 3, price: 500, category: "boissons" },
      ],
    },
    { id: 3, name: "Table 3", status: "libre", currentTicket: [] },
    { id: 4, name: "Table 4", status: "reservee", currentTicket: [] },
    {
      id: 5,
      name: "Table 5",
      status: "occupee",
      currentTicket: [
        { id: "p2", name: "Yassa Poulet", qty: 1, price: 2000, category: "plats" },
        { id: "p3", name: "Mafé Viande", qty: 1, price: 1800, category: "plats" },
        { id: "b3", name: "Gazelle", qty: 2, price: 1200, category: "boissons" },
      ],
    },
    { id: 6, name: "Table 6", status: "horsService", currentTicket: [] },
    {
      id: 7,
      name: "Table 7",
      status: "occupee",
      currentTicket: [
        { id: "g2", name: "Chawarma Viande", qty: 2, price: 1500, category: "grills" },
        { id: "b4", name: "Eau Minérale Kirène", qty: 1, price: 400, category: "boissons" },
      ],
    },
    {
      id: 8,
      name: "Table 8",
      status: "attente",
      currentTicket: [
        { id: "b2", name: "Jus de Bouye", qty: 1, price: 500, category: "boissons" },
      ],
    },
    { id: 9, name: "Table 9", status: "libre", currentTicket: [] },
    { id: 10, name: "Table 10", status: "libre", currentTicket: [] },
  ];
}