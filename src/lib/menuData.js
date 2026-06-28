export const MENU_CATEGORIES = [
  { id: "plats", label: "Plats du Jour" },
  { id: "grills", label: "Grillades & Dibi" },
  { id: "pates", label: "Pâtes" },
  { id: "mer", label: "Fruits de Mer" },
  { id: "supplements", label: "Suppléments" },
];

export const MENU_ITEMS = [
  // PLATS DU JOUR
  { id: "plat-1", name: "C BON", price: 6000, category: "plats" },
  { id: "plat-2", name: "THIEBOU DJEUNE DIAGA", price: 6000, category: "plats" },
  { id: "plat-3", name: "THIEBOU DJEUNE BLANC", price: 6000, category: "plats" },
  { id: "plat-4", name: "MBAXXALOU SALOUM", price: 6000, category: "plats" },
  { id: "plat-5", name: "YASSA", price: 6000, category: "plats" },
  { id: "plat-6", name: "THIOU CARRY", price: 6000, category: "plats" },
  { id: "plat-7", name: "THIEBOU YAAP", price: 6000, category: "plats" },
  { id: "plat-8", name: "DOMODA", price: 6000, category: "plats" },
  { id: "plat-9", name: "SOULOUXXOU", price: 6000, category: "plats" },
  { id: "plat-10", name: "MAFE", price: 6000, category: "plats" },
  { id: "plat-11", name: "THIERE TAMXAARIT", price: 8000, category: "plats" },
  { id: "plat-12", name: "THIERE MBOUM", price: 7000, category: "plats" },
  { id: "plat-13", name: "THIEBOU NAAR", price: 8000, category: "plats" },
  { id: "plat-14", name: "THIEBOU NIEBE", price: 6000, category: "plats" },

  // GRILLADES & DIBI LOCAL
  { id: "grill-1", name: "DIBI GRILLE", price: 11000, category: "grills" },
  { id: "grill-2", name: "DIBI DE POULET", price: 10000, category: "grills" },
  { id: "grill-3", name: "DIBI SAAF", price: 11000, category: "grills" },
  { id: "grill-4", name: "FILET DE BŒUF VIANDE IMPORTEE (BRESIL)", price: 13000, category: "grills" },
  { id: "grill-5", name: "SAPPHIRE GRILLE (PLAQUE CHAUFFANTE Max 4 pers)", price: 70000, category: "grills" },
  { id: "grill-6", name: "SAPPHIRE DEL MAR (PLAQUE CHAUFFANTE Max 4 pers)", price: 60000, category: "grills" },
  { id: "grill-7", name: "CASCADE SAPPHIRE (Max 4 personnes)", price: 35000, category: "grills" },
  { id: "grill-8", name: "DEGUSTATION DE VIANDE (PLAQUE CHAUFFANTE Max 2 pers)", price: 40000, category: "grills" },
  { id: "grill-9", name: "ENTRECOTE IMPORTEE (BRESIL)", price: 18000, category: "grills" },
  { id: "grill-10", name: "COTELETTES D'AGNEAU (BRESIL)", price: 15000, category: "grills" },
  { id: "grill-11", name: "POULET ROTI AU FOUR", price: 10000, category: "grills" },
  { id: "grill-12", name: "POULET BRAISE", price: 10000, category: "grills" },
  { id: "grill-13", name: "BROCHETTES DE POULET A LA PLANCHA", price: 9000, category: "grills" },
  { id: "grill-14", name: "POULET DU PAYS", price: 13000, category: "grills" },
  { id: "grill-15", name: "PIGEON", price: 10000, category: "grills" },
  { id: "grill-16", name: "THIOF A LA PLANCHA", price: 19000, category: "grills" },
  { id: "grill-17", name: "DORADE BRAISEE", price: 17000, category: "grills" },
  { id: "grill-18", name: "SOLE MEUNIERE", price: 12000, category: "grills" },

  // PATES
  { id: "pate-1", name: "TAGLIATELLES AUX GAMBAS / SAUCE ROUGE OU BLANCHE", price: 8000, category: "pates" },
  { id: "pate-2", name: "TAGLIATELLES AUX POULETS ET CHAMPIGNONS", price: 8000, category: "pates" },
  { id: "pate-3", name: "TAGLIATELLES AUX FRUITS DE MER", price: 8000, category: "pates" },

  // FRUITS DE MER
  { id: "mer-1", name: "GAMBAS SAUTEES OU CRISPY", price: 12000, category: "mer" },
  { id: "mer-2", name: "BROCHETTES DE GAMBAS x2 (Acc.)", price: 13000, category: "mer" },
  { id: "mer-3", name: "MOULES SAUTEES AUX AROMATES", price: 7000, category: "mer" },

  // SUPPLEMENTS
  { id: "supp-1", name: "SUPPLEMENT", price: 1000, category: "supplements" },
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