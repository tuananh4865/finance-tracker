"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  net: number;
  categoryBreakdown: Record<string, number>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    category: { name: string; icon: string; color: string } | null;
  }>;
  transactionCount: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error || "No data"}
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const topCategories = Object.entries(data.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Balance</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {formatCurrency(data.balance)}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Income</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {formatCurrency(data.income)}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Expenses</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {formatCurrency(data.expenses)}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Net</div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: data.net >= 0 ? "inherit" : "#fca5a5",
            }}
          >
            {formatCurrency(data.net)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Recent Transactions */}
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: "semibold",
              marginBottom: "1rem",
            }}
          >
            Recent Transactions
          </h2>

          {data.recentTransactions.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
              No transactions this month
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {data.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    background: "#f9fafb",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>
                      {tx.category?.icon || "📦"}
                    </span>
                    <div>
                      <div style={{ fontWeight: "medium" }}>{tx.description}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {tx.category?.name || "Uncategorized"} • {formatDate(tx.date)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "semibold",
                      color: tx.type === "income" ? "#10b981" : "#ef4444",
                    }}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: "semibold",
              marginBottom: "1rem",
            }}
          >
            Expenses by Category
          </h2>

          {topCategories.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
              No expense data
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {topCategories.map(([name, amount]) => {
                const percentage = (amount / data.expenses) * 100;
                return (
                  <div key={name}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ fontWeight: "medium" }}>{name}</span>
                      <span style={{ color: "#6b7280" }}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#6366f1",
                          borderRadius: "9999px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transaction count footer */}
      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "0.875rem",
        }}
      >
        {data.transactionCount} transaction{data.transactionCount !== 1 ? "s" : ""} this
        month
      </div>
    </div>
  );
}
