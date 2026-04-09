"use client";

import { useEffect, useState } from "react";

interface RecurringTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  frequency: string;
  startDate: string;
  nextRun: string;
  active: boolean;
  category: { name: string; icon: string; color: string } | null;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "expense", amount: "", description: "", categoryId: "", frequency: "monthly", startDate: "" });
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recurring");
      const data = await res.json();
      setItems(data.recurring || []);
    } catch {
      setError("Failed to load recurring transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create");
      setShowForm(false);
      setForm({ type: "expense", amount: "", description: "", categoryId: "", frequency: "monthly", startDate: "" });
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/recurring/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recurring transaction?")) return;
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Recurring Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.5rem 1rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer" }}
        >
          {showForm ? "Cancel" : "+ Add Recurring"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#fef2f2", color: "#dc2626", borderRadius: "0.5rem", marginBottom: "1rem" }}>{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                min="0"
                step="0.01"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" style={{ padding: "0.5rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer" }}>
            Create Recurring Transaction
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280", background: "white", borderRadius: "0.75rem" }}>
          No recurring transactions yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: "white", borderRadius: "0.75rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", opacity: item.active ? 1 : 0.5 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: item.category?.color || "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                    {item.category?.icon || "🔄"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "semibold" }}>{item.description}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {FREQUENCY_LABELS[item.frequency]} • Next: {formatDate(item.nextRun)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontWeight: "semibold", color: item.type === "income" ? "#10b981" : "#ef4444" }}>
                    {item.type === "income" ? "+" : "-"}{formatCurrency(item.amount)}
                  </div>
                  <button
                    onClick={() => toggleActive(item.id, item.active)}
                    style={{ padding: "0.25rem 0.75rem", background: item.active ? "#10b981" : "#6b7280", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}
                  >
                    {item.active ? "Active" : "Paused"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: "0.25rem 0.5rem", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
