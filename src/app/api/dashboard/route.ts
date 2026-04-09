import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all transactions this month
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate totals
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Get category breakdown for expenses
    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense" && t.category)
      .reduce((acc, t) => {
        const name = t.category?.name || "Uncategorized";
        acc[name] = (acc[name] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);

    return NextResponse.json({
      balance,
      income,
      expenses,
      net: income - expenses,
      categoryBreakdown,
      recentTransactions,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
