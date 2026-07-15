import React, { useState } from "react";
import { Plus, ChevronUp, ChevronDown, Trash2, FolderPlus } from "lucide-react";
import { createCategory, moveCategory, getSortedCategories } from "@/lib/menuData";

export default function CategoryManager({ categories, items, onChange }) {
  const [newCatName, setNewCatName] = useState("");
  const sorted = getSortedCategories(categories);

  const handleAdd = () => {
    const name = newCatName.trim();
    if (!name) return;
    onChange([...categories, createCategory(name, categories)]);
    setNewCatName("");
  };

  const handleDelete = (cat) => {
    const count = items.filter((i) => i.category === cat.id).length;
    if (count > 0) {
      alert(`Impossible de supprimer « ${cat.name} » : ${count} article(s) y sont rattachés.`);
      return;
    }
    onChange(categories.filter((c) => c.id !== cat.id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Add form */}
      <div className="max-w-2xl mx-auto mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nouvelle Catégorie</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Menu Fêtes, Plats du Jour..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            disabled={!newCatName.trim()}
            className="h-10 px-5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Catégories actives · {sorted.length}
        </p>
        <div className="space-y-2">
          {sorted.map((cat, idx) => {
            const count = items.filter((i) => i.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 hover:border-slate-700 transition-colors"
              >
                <span className="text-xs font-mono text-slate-600 w-6 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{cat.name}</p>
                  <p className="text-xs text-slate-500">{count} article{count !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onChange(moveCategory(categories, cat.id, -1))}
                    disabled={idx === 0}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                    title="Monter"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onChange(moveCategory(categories, cat.id, 1))}
                    disabled={idx === sorted.length - 1}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                    title="Descendre"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-90"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">
              <FolderPlus className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              Aucune catégorie. Créez-en une ci-dessus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}