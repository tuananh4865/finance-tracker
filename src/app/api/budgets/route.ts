import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: { category: true },
      orderBy: { startDate: "desc" },
    });

    // Calculate current period spending for each budget
    const now = new Date();
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        let startDate: Date;
        let endDate: Date = now;

        if (budget.period === "monthly") {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (budget.period === "weekly") {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
        } else {
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
        }

        const transactions = await prisma.transaction.findMany({
          where: {
            type: "expense",
            categoryId: budget.categoryId,
            date: { gte: startDate, lte: endDate },
          },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
        };
      })
    );

    return NextResponse.json({ budgets: budgetsWithSpending });
  } catch (error) {
    console.error("Budgets API error:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, amount, period, startDate, endDate } = body;

    if (!amount || !period || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        categoryId: categoryId || null,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Create budget error:", error);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
