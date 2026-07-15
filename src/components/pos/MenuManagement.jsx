import React, { useState, useMemo } from "react";
import { X, Search, Plus, Trash2, Upload, Link2 } from "lucide-react";
import { getSortedCategories } from "@/lib/menuData";
import CategoryManager from "@/components/pos/CategoryManager";

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MenuManagement({ items, categories, onChange, onCategoriesChange, onClose }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("articles");
  const sortedCategories = getSortedCategories(categories);
  const firstCatId = sortedCategories[0]?.id || "plats";
  const [newItem, setNewItem] = useState({ name: "", price: "", category: firstCatId, image: "", sari_code: "" });

  const handleNewImageUpload = async (file) => {
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    setNewItem((prev) => ({ ...prev, image: base64 }));
  };

  const handleEditImageUpload = async (id, file) => {
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    updateField(id, "image", base64);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.category || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const updateField = (id, field, value) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleAdd = () => {
    if (!newItem.name.trim()) return;
    const price = parseInt(newItem.price, 10);
    if (isNaN(price)) return;
    const created = {
      id: `custom-${Date.now()}`,
      name: newItem.name.trim().toUpperCase(),
      price,
      category: newItem.category,
      image: newItem.image.trim() || undefined,
      sari_code: newItem.sari_code.trim() || undefined,
    };
    onChange([...items, created]);
    setNewItem({ name: "", price: "", category: firstCatId, image: "", sari_code: "" });
  };

  const handleDelete = (id) => {
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-5xl mx-4 h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Gestion du Menu Kalpé Resto</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tab === "articles"
                ? `${items.length} articles · modifications en temps réel`
                : `${sortedCategories.length} catégories · ordre des onglets`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tab toggle */}
        <div className="shrink-0 px-6 pt-3 border-b border-slate-800">
          <div className="flex gap-1">
            <button
              onClick={() => setTab("articles")}
              className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-colors ${
                tab === "articles" ? "bg-slate-950/50 text-slate-100 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setTab("categories")}
              className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-colors ${
                tab === "categories" ? "bg-slate-950/50 text-slate-100 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Catégories
            </button>
          </div>
        </div>

        {tab === "categories" ? (
          <CategoryManager categories={categories} items={items} onChange={onCategoriesChange} />
        ) : (
          <>
            {/* Create form */}
            <div className="shrink-0 px-6 py-4 bg-slate-950/50 border-b border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Créer un Article</p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Nom de l'article"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1 min-w-[180px] h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Prix (FCFA)"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-36 h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {sortedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Code SARI (SAGE)"
                  value={newItem.sari_code}
                  onChange={(e) => setNewItem({ ...newItem, sari_code: e.target.value })}
                  className="w-36 h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Image URL (optionnel)"
                  value={newItem.image && !newItem.image.startsWith("data:") ? newItem.image : ""}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="flex-1 min-w-[120px] h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <label className="h-10 px-4 rounded-lg border border-slate-700 bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  {newItem.image && newItem.image.startsWith("data:") ? "Image ✓" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleNewImageUpload(e.target.files?.[0])}
                  />
                </label>
                <button
                  onClick={handleAdd}
                  className="h-10 px-5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="shrink-0 px-6 py-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Items table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3 font-semibold">Nom</th>
                    <th className="px-3 py-3 font-semibold w-32">Prix (FCFA)</th>
                    <th className="px-3 py-3 font-semibold w-44">Catégorie</th>
                    <th className="px-3 py-3 font-semibold w-32">Code SARI</th>
                    <th className="px-3 py-3 font-semibold">Image URL</th>
                    <th className="px-3 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    return (
                      <tr key={item.id} className={`border-b border-slate-800 ${idx % 2 === 0 ? "bg-slate-900" : "bg-slate-900/50"} hover:bg-slate-800/50`}>
                        <td className="px-6 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateField(item.id, "name", e.target.value)}
                            className="w-full h-9 px-2 rounded-lg border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-slate-100 bg-transparent"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateField(item.id, "price", parseInt(e.target.value, 10) || 0)}
                            className="w-full h-9 px-2 rounded-lg border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-200 bg-transparent"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={item.category}
                            onChange={(e) => updateField(item.id, "category", e.target.value)}
                            className="w-full h-9 px-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            {sortedCategories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Auto"
                            value={item.sari_code || ""}
                            onChange={(e) => updateField(item.id, "sari_code", e.target.value || undefined)}
                            className="w-full h-9 px-2 rounded-lg border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-300 bg-transparent placeholder:text-slate-600"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {item.image && item.image.startsWith("data:") ? (
                              <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            ) : (
                              <input
                                type="text"
                                placeholder="URL ou upload"
                                value={item.image || ""}
                                onChange={(e) => updateField(item.id, "image", e.target.value || undefined)}
                                className="w-full h-9 px-2 rounded-lg border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs text-slate-400 bg-transparent placeholder:text-slate-600"
                              />
                            )}
                            <label className="w-9 h-9 shrink-0 rounded-lg border border-slate-700 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-all">
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleEditImageUpload(item.id, e.target.files?.[0])}
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 rounded-lg hover:bg-rose-500/10 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-sm text-slate-500">
                        Aucun article trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="shrink-0 px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <p className="text-xs text-slate-500">Les changements sont appliqués immédiatement au terminal de commande.</p>
          <button
            onClick={onClose}
            className="h-10 px-6 rounded-lg font-semibold text-white transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-500"
          >
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}