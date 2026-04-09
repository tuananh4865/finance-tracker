"use client";

import { useEffect, useState, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  category: Category | null;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    try {
      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setPagination(data.pagination || null);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter, startDate, endDate]);

  useEffect(() => {
    // Fetch categories for filter dropdown
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const loadMore = async () => {
    if (!pagination?.hasMore) return;

    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("offset", String(pagination.offset + pagination.limit));

    const res = await fetch(`/api/transactions?${params.toString()}`);
    const data = await res.json();
    setTransactions((prev) => [...prev, ...(data.transactions || [])]);
    setPagination(data.pagination);
  };

  const clearFilters = () => {
    setTypeFilter("");
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Transactions
      </h1>

      {/* Filters */}
      <div
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}
            >
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}
            >
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}
            >
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}
            >
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <button
            onClick={clearFilters}
            style={{
              padding: "0.5rem 1rem",
              background: "#f3f4f6",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {loading && transactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Loading transactions...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>{error}</div>
      ) : transactions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#6b7280",
            background: "white",
            borderRadius: "0.75rem",
          }}
        >
          No transactions found
        </div>
      ) : (
        <>
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: index < transactions.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.5rem",
                      background: tx.category?.color || "#6366f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    {tx.category?.icon || "📦"}
                  </div>
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
                    fontSize: "1rem",
                    color: tx.type === "income" ? "#10b981" : "#ef4444",
                  }}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>

          {pagination?.hasMore && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={loadMore}
                style={{
                  padding: "0.5rem 2rem",
                  background: "#6366f1",
                  color: "white",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Load More
              </button>
            </div>
          )}

          {pagination && (
            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "0.875rem",
              }}
            >
              Showing {transactions.length} of {pagination.total} transactions
            </div>
          )}
        </>
      )}
    </div>
  );
}
