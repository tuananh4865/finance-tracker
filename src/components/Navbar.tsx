"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
  { href: "/budgets", label: "Budgets", icon: "📈" },
  { href: "/recurring", label: "Recurring", icon: "🔄" },
];

export default function Navbar() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
