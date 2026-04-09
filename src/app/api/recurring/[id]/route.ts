import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { active, amount, description } = body;

    const updateData: Record<string, unknown> = {};
    if (typeof active === "boolean") updateData.active = active;
    if (amount) updateData.amount = parseFloat(amount);
    if (description) updateData.description = description;

    const recurring = await prisma.recurringTransaction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(recurring);
  } catch (error) {
    console.error("Recurring transaction PUT error:", error);
    return NextResponse.json({ error: "Failed to update recurring transaction" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.recurringTransaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Recurring transaction DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete recurring transaction" }, { status: 500 });
  }
}
