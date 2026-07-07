// ==========================================
// SYSTEM MENU CONFIGURATION — VER: 2026-07-07-v2
// LAST UPDATED: COLD & HOT DRINK SEPARATION
// SYNC PING: 2026-07-07T23:59:00Z
// ==========================================
export const MENU_CATEGORIES = [
  { id: "plats", label: "Plats" },
  { id: "boissons", label: "Boissons Fraîches" },
  { id: "boissons_chaudes", label: "Boissons Chaudes" },
  { id: "entrees", label: "Entrée" },
  { id: "desserts", label: "Dessert" },
  { id: "chichas", label: "Chicha et Lounge" },
  { id: "sale", label: "Plats Salés" },
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
  { id: "dibi-plat-1", name: "Plateau Dibi Salé (Petit)", price: 15000, category: "grills" },
  { id: "dibi-plat-2", name: "Plateau Dibi Salé (Grand)", price: 25000, category: "grills" },
  { id: "dibi-sale-15", name: "Plateau Dibi Salé", price: 15000, category: "sale" },
  { id: "dibi-sale-25", name: "Grand Plateau Dibi Salé", price: 25000, category: "sale" },

  // POULET
  { id: "chk-1", name: "Choukouya de Poulet", price: 6000, category: "poulet" },
  { id: "chk-2", name: "Demi Poulet Grillé", price: 5500, category: "poulet" },

  // POISSON
  { id: "fish-1", name: "Poisson Carpe Braisé", price: 7000, category: "poisson" },
  { id: "fish-2", name: "Brochettes de Lotte", price: 8000, category: "poisson" },

  // ACCOMPAGNEMENTS
  { id: "acc-1", name: "Portion d'Alloco", price: 1500, category: "accompagnement" },
  { id: "acc-2", name: "Frites Maison", price: 1500, category: "accompagnement" },
  { id: "acc-3", name: "Riz Blanc Parfumé", price: 1000, category: "accompagnement" },

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

  // ==================== 🥤 BOISSONS FRAÎCHES (Category: "boissons") ====================
  { id: "bois-1", name: "BISSAP CLASSIQUE", price: 2000, category: "boissons" },
  { id: "bois-2", name: "BISSAP GINGEMBRE MENTHE", price: 2500, category: "boissons" },
  { id: "bois-3", name: "BOUYE CLASSIQUE", price: 2000, category: "boissons" },
  { id: "bois-4", name: "BOUYE ANANAS", price: 2500, category: "boissons" },
  { id: "bois-5", name: "BOUYE PASSION", price: 3000, category: "boissons" },
  { id: "bois-6", name: "DITAKH", price: 2500, category: "boissons" },
  { id: "bois-7", name: "COROSSOL", price: 3500, category: "boissons" },
  { id: "bois-8", name: "COCA COLA", price: 1500, category: "boissons" },
  { id: "bois-9", name: "COCA ZERO", price: 1500, category: "boissons" },
  { id: "bois-10", name: "FANTA ORANGE", price: 1500, category: "boissons" },
  { id: "bois-11", name: "SPRITE", price: 1500, category: "boissons" },
  { id: "bois-12", name: "SCHWEPPES TONIC", price: 1500, category: "boissons" },
  { id: "bois-13", name: "MALTINA", price: 1500, category: "boissons" },
  { id: "bois-14", name: "EAU PETITE KIRENE", price: 1000, category: "boissons" },
  { id: "bois-15", name: "EAU GRANDE KIRENE", price: 1500, category: "boissons" },
  { id: "bois-16", name: "EAU GAZEUSE CASAMANCE", price: 1500, category: "boissons" },
  { id: "bois-21", name: "EAU GAZEUSE / PERRIER", price: 2000, category: "boissons" },

  // ==================== ☕ BOISSONS CHAUDES (Category: "boissons_chaudes") ====================
  { id: "bch-1", name: "Café au lait", price: 2500, category: "boissons_chaudes" },
  { id: "bch-2", name: "Chocolat chaud", price: 3000, category: "boissons_chaudes" },
  { id: "bch-3", name: "Cappuccino", price: 2500, category: "boissons_chaudes" },
  { id: "bch-4", name: "Infusion (Damman-frère)", price: 2000, category: "boissons_chaudes" },
  { id: "bch-5", name: "Grog Sapphire", price: 3000, category: "boissons_chaudes" },
  { id: "bch-6", name: "Nespresso", price: 2500, category: "boissons_chaudes" },
  { id: "bch-7", name: "Expresso (Café Ely)", price: 2000, category: "boissons_chaudes" },

  // ENTRÉES
  { id: "ent-1", name: "Salade Exotique Sucrée-Salée", price: 6000, category: "entrees" },
  { id: "ent-2", name: "Salade Végétarienne Froide", price: 6000, category: "entrees" },
  { id: "ent-3", name: "Salade Piémontaise", price: 6000, category: "entrees" },
  { id: "ent-4", name: "Salade Sapphire", price: 8000, category: "entrees" },
  { id: "ent-5", name: "Tartare de Crevettes à l'Avocat", price: 8000, category: "entrees" },
  { id: "ent-6", name: "Salade Végétarienne Chaude", price: 7000, category: "entrees" },
  { id: "ent-7", name: "Crevettes Sautées à l'Ail", price: 7000, category: "entrees" },
  { id: "ent-8", name: "Tapas du Chef", price: 6000, category: "entrees" },

  // DESSERTS
  { id: "des-1", name: "Fondant Chocolat / Caramel", price: 6000, category: "desserts" },
  { id: "des-2", name: "Tarte aux Pommes", price: 6000, category: "desserts" },
  { id: "des-3", name: "Pain Perdu Gourmand", price: 6000, category: "desserts" },
  { id: "des-4", name: "White Lady (Kinder/Oreo)", price: 6000, category: "desserts" },
  { id: "des-5", name: "Assiette de Fruits Frais", price: 6000, category: "desserts" },

  // FAST FOOD
  { id: "ff-1", name: "Pizza Sapphire", price: 8500, category: "fast_food" },
  { id: "ff-2", name: "Pizza Reine", price: 8000, category: "fast_food" },
  { id: "ff-3", name: "Pizza Margarita", price: 7000, category: "fast_food" },
  { id: "ff-4", name: "Pizza Sam (Fruits de Mer)", price: 11000, category: "fast_food" },
  { id: "ff-5", name: "Pizza Adiza", price: 9000, category: "fast_food" },
  { id: "ff-6", name: "Burger Sapphire", price: 6000, category: "fast_food" },
  { id: "ff-7", name: "Sandwich Poulet", price: 5000, category: "fast_food" },
  { id: "ff-8", name: "Sandwich Viande", price: 5000, category: "fast_food" },

  // CHICHAS & LOUNGE
  { id: "ch-1", name: "Chicha Menthe Classique", price: 7000, category: "chichas" },
  { id: "ch-2", name: "Chicha Mi Amor", price: 10000, category: "chichas" },
  { id: "ch-3", name: "Chicha Double Melon", price: 10000, category: "chichas" },
  { id: "ch-4", name: "Chicha Hawaï", price: 10000, category: "chichas" },
  { id: "ch-5", name: "Chicha Love 66", price: 10000, category: "chichas" },
  { id: "ch-6", name: "Chicha Jibiar Dejavu", price: 10000, category: "chichas" },
  { id: "ch-7", name: "Chicha Jibiar Enjoy", price: 10000, category: "chichas" },
  { id: "ch-8", name: "Cocktail Fruits sur Vases", price: 15000, category: "chichas" },
  { id: "ch-9", name: "Chicha Mojito Exotique", price: 15000, category: "chichas" },
  { id: "ch-10", name: "Chicha Royale Ananas", price: 20000, category: "chichas" },
  { id: "ch-11", name: "Chicha Royale Melon", price: 20000, category: "chichas" },
];

export function getInitialTables() {
  const ZONES = [
    { zone: "salle", count: 20, prefix: "CS" },
    { zone: "terrasse", count: 50, prefix: "CT" },
    { zone: "etage", count: 30, prefix: "CE" },
  ];

  // Production mode: all tables start as 'Libre' (Free) with empty tickets
  // Each zone restarts numbering at 01; global id stays unique for lookups
  const tables = [];
  let globalId = 1;
  for (const z of ZONES) {
    for (let i = 1; i <= z.count; i++) {
      const num = String(i).padStart(2, "0");
      tables.push({
        id: globalId++,
        name: `Table ${num}`,
        subLabel: `${z.prefix}${num}`,
        zone: z.zone,
        status: "libre",
        currentTicket: [],
      });
    }
  }
  return tables;
}