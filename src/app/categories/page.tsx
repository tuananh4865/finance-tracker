"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}

const TYPE_COLORS: Record<string, string> = {
  income: "#10b981",
  expense: "#ef4444",
  both: "#6366f1",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "expense", color: "#6366f1", icon: "📦" });
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create");
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", type: "expense", color: "#6366f1", icon: "📦" });
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, type: cat.type, color: cat.color, icon: cat.icon });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", type: "expense", color: "#6366f1", icon: "📦" });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "0.5rem 1rem",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#fef2f2", color: "#dc2626", borderRadius: "0.5rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Color</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  style={{ width: "3rem", height: "2rem", borderRadius: "0.25rem", border: "1px solid #e5e7eb" }}
                />
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{form.color}</span>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Icon</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="emoji"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              />
            </div>
          </div>
          <button type="submit" style={{ padding: "0.5rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer" }}>
            {editingId ? "Update" : "Create"} Category
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280", background: "white", borderRadius: "0.75rem" }}>No categories yet</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ background: "white", borderRadius: "0.75rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "semibold" }}>{cat.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "capitalize" }}>{cat.type}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => startEdit(cat)} style={{ flex: 1, padding: "0.375rem", background: "#f3f4f6", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}>Edit</button>
                <button onClick={() => handleDelete(cat.id)} style={{ flex: 1, padding: "0.375rem", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
