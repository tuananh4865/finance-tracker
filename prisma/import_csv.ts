import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CsvRow {
  date: string;
  type: string;
  amount: string;
  description: string;
  category: string;
}

async function parseCsv(content: string): Promise<CsvRow[]> {
  const lines = content.trim().split("\n");
  const rows: CsvRow[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length >= 4) {
      rows.push({
        date: cols[0],
        type: cols[1].toLowerCase(),
        amount: cols[2],
        description: cols[3],
        category: cols[4] || "",
      });
    }
  }

  return rows;
}

async function importCsv(csvPath: string) {
  const fs = await import("fs");
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = await parseCsv(content);

  console.log(`Found ${rows.length} rows to import`);

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    try {
      // Find or create category
      let categoryId: string | null = null;
      if (row.category) {
        const existing = await prisma.category.findFirst({
          where: { name: row.category },
        });
        if (existing) {
          categoryId = existing.id;
        } else {
          const created = await prisma.category.create({
            data: {
              name: row.category,
              type: row.type === "income" ? "income" : "expense",
              color: "#6366f1",
              icon: "📦",
            },
          });
          categoryId = created.id;
        }
      }

      await prisma.transaction.create({
        data: {
          type: row.type === "income" ? "income" : "expense",
          amount: parseFloat(row.amount),
          description: row.description,
          date: new Date(row.date),
          categoryId,
        },
      });
      imported++;
    } catch (err) {
      console.error(`Failed to import row: ${JSON.stringify(row)}`, err);
      skipped++;
    }
  }

  console.log(`\nImport complete: ${imported} imported, ${skipped} skipped`);
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: npx tsx prisma/import_csv.ts <path-to-csv.csv>");
  console.error("\nCSV format:");
  console.error("date,type,amount,description,category");
  console.error("2026-04-01,income,5000,Monthly salary,Salary");
  console.error("2026-04-02,expense,100,Rent,Rent");
  process.exit(1);
}

importCsv(csvPath)
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
