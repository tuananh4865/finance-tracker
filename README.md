# Personal Finance Tracker

A web app to track personal finances — income, expenses, budgets, and visualizations.

## Features

- **Dashboard** — Balance overview, income/expense summary, category breakdown
- **Transactions** — List with filters by type, category, and date range
- **Categories** — Create, edit, and delete categories with custom colors and icons
- **Budgets** — Set spending limits per category with progress tracking
- **Recurring** — Schedule recurring transactions with automatic next-run calculation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via Prisma ORM
- **Styling**: Inline CSS (no external dependencies)

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Seed with sample data
npx prisma db seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── dashboard/route.ts
│   │   ├── transactions/route.ts
│   │   ├── categories/route.ts
│   │   ├── categories/[id]/route.ts
│   │   ├── budgets/route.ts
│   │   └── recurring/route.ts
│   ├── page.tsx              # Dashboard
│   ├── transactions/page.tsx
│   ├── categories/page.tsx
│   ├── budgets/page.tsx
│   └── recurring/page.tsx
├── components/
│   └── Navbar.tsx
└── lib/
    └── prisma.ts
```

## Database Schema

- **Transaction** — Individual income/expense records
- **Category** — Labels with color and icon
- **Budget** — Spending limits per category/period
- **RecurringTransaction** — Scheduled recurring items

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Balance, income, expenses, category breakdown |
| GET | `/api/transactions` | List with filters (type, category, date) |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/[id]` | Update category |
| DELETE | `/api/categories/[id]` | Delete category |
| GET | `/api/budgets` | List budgets with current spending |
| POST | `/api/budgets` | Create budget |
| GET | `/api/recurring` | List recurring transactions |
| POST | `/api/recurring` | Create recurring transaction |
