import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Salary" },
      update: {},
      create: { name: "Salary", type: "income", color: "#10b981", icon: "💰" },
    }),
    prisma.category.upsert({
      where: { name: "Freelance" },
      update: {},
      create: { name: "Freelance", type: "income", color: "#3b82f6", icon: "💻" },
    }),
    prisma.category.upsert({
      where: { name: "Food & Dining" },
      update: {},
      create: { name: "Food & Dining", type: "expense", color: "#f97316", icon: "🍜" },
    }),
    prisma.category.upsert({
      where: { name: "Transportation" },
      update: {},
      create: { name: "Transportation", type: "expense", color: "#6366f1", icon: "🚗" },
    }),
    prisma.category.upsert({
      where: { name: "Shopping" },
      update: {},
      create: { name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️" },
    }),
    prisma.category.upsert({
      where: { name: "Entertainment" },
      update: {},
      create: { name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "🎬" },
    }),
    prisma.category.upsert({
      where: { name: "Utilities" },
      update: {},
      create: { name: "Utilities", type: "expense", color: "#14b8a6", icon: "💡" },
    }),
    prisma.category.upsert({
      where: { name: "Rent" },
      update: {},
      create: { name: "Rent", type: "expense", color: "#f59e0b", icon: "🏠" },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  const salaryCat = categories[0];
  const foodCat = categories[2];
  const transportCat = categories[3];
  const shoppingCat = categories[4];
  const entertainmentCat = categories[5];

  // Create sample transactions for April 2026
  const now = new Date();
  const transactions = await Promise.all([
    // Income
    prisma.transaction.create({
      data: {
        type: "income",
        amount: 5000,
        description: "Monthly salary",
        date: new Date(2026, 3, 1),
        categoryId: salaryCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "income",
        amount: 800,
        description: "Freelance project",
        date: new Date(2026, 3, 5),
        categoryId: categories[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "income",
        amount: 300,
        description: "Side consulting",
        date: new Date(2026, 3, 12),
        categoryId: categories[1].id,
      },
    }),
    // Expenses
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 1200,
        description: "April rent",
        date: new Date(2026, 3, 2),
        categoryId: categories[7].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 450,
        description: "Grocery shopping",
        date: new Date(2026, 3, 8),
        categoryId: foodCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 85,
        description: "Gas station",
        date: new Date(2026, 3, 10),
        categoryId: transportCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 220,
        description: "New clothes",
        date: new Date(2026, 3, 14),
        categoryId: shoppingCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 65,
        description: "Netflix + Spotify",
        date: new Date(2026, 3, 15),
        categoryId: entertainmentCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 120,
        description: "Electric bill",
        date: new Date(2026, 3, 18),
        categoryId: categories[6].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 180,
        description: "Restaurant dinner",
        date: new Date(2026, 3, 20),
        categoryId: foodCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 95,
        description: "Uber rides",
        date: new Date(2026, 3, 22),
        categoryId: transportCat.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "expense",
        amount: 340,
        description: "Electronics",
        date: new Date(2026, 3, 25),
        categoryId: shoppingCat.id,
      },
    }),
  ]);

  console.log(`Created ${transactions.length} transactions`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
