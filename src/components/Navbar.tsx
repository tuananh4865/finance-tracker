"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
  { href: "/budgets", label: "Budgets", icon: "📈" },
  { href: "/recurring", label: "Recurring", icon: "🔄" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav
      style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "1rem 0",
                borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                color: isActive ? "#6366f1" : "#6b7280",
                textDecoration: "none",
                fontWeight: isActive ? "semibold" : "normal",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          {session?.user && (
            <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              {session.user.name || session.user.email}
            </span>
          )}
          {session?.user ? (
            <button
              onClick={handleSignOut}
              style={{
                padding: "0.5rem 1rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                padding: "0.5rem 1rem",
                background: "#6366f1",
                color: "white",
                borderRadius: "0.375rem",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
