"use client";

import { useEffect, useState } from "react";

interface Budget {
  id: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string | null;
  spent: number;
  remaining: number;
  category: { name: string; icon: string; color: string } | null;
}

const PERIOD_LABELS: Record<string, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  yearly: "Yearly",
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoryId: "", amount: "", period: "monthly", startDate: "" });
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create");
      setShowForm(false);
      setForm({ categoryId: "", amount: "", period: "monthly", startDate: "" });
      fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const getProgressPercent = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getProgressColor = (budget: Budget) => {
    const percent = (budget.spent / budget.amount) * 100;
    if (percent >= 100) return "#ef4444";
    if (percent >= 80) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.5rem 1rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer" }}
        >
          {showForm ? "Cancel" : "+ Add Budget"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#fef2f2", color: "#dc2626", borderRadius: "0.5rem", marginBottom: "1rem" }}>{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Category (optional)</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Budget Amount</label>
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
              <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ padding: "0.5rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer" }}>
            Create Budget
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading...</div>
      ) : budgets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280", background: "white", borderRadius: "0.75rem" }}>
          No budgets yet. Create one to start tracking your spending limits.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {budgets.map((budget) => {
            const progress = getProgressPercent(budget);
            const color = getProgressColor(budget);
            return (
              <div key={budget.id} style={{ background: "white", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{budget.category?.icon || "📊"}</span>
                    <div>
                      <div style={{ fontWeight: "semibold" }}>{budget.category?.name || "All Categories"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{PERIOD_LABELS[budget.period]} budget</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Spent</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "medium" }}>{formatCurrency(budget.spent)}</span>
                  </div>
                  <div style={{ height: "0.5rem", background: "#e5e7eb", borderRadius: "9999px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: color, borderRadius: "9999px", transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>of {formatCurrency(budget.amount)}</span>
                    <span style={{ fontSize: "0.75rem", color: budget.remaining < 0 ? "#ef4444" : "#10b981" }}>
                      {budget.remaining >= 0 ? `${formatCurrency(budget.remaining)} left` : `${formatCurrency(Math.abs(budget.remaining))} over`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
