import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      include: { category: true },
      orderBy: { nextRun: "asc" },
    });

    return NextResponse.json({ recurring });
  } catch (error) {
    console.error("Recurring transactions API error:", error);
    return NextResponse.json({ error: "Failed to fetch recurring transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, description, categoryId, frequency, startDate } = body;

    if (!type || !amount || !description || !frequency || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const nextRun = calculateNextRun(new Date(startDate), frequency);

    const recurring = await prisma.recurringTransaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        categoryId: categoryId || null,
        frequency,
        startDate: new Date(startDate),
        nextRun,
      },
    });

    return NextResponse.json(recurring, { status: 201 });
  } catch (error) {
    console.error("Create recurring transaction error:", error);
    return NextResponse.json({ error: "Failed to create recurring transaction" }, { status: 500 });
  }
}

function calculateNextRun(startDate: Date, frequency: string): Date {
  const now = new Date();
  let next = new Date(startDate);

  while (next <= now) {
    switch (frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
    }
  }

  return next;
}
