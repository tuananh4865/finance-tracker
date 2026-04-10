# Personal Finance Tracker

A web app to track personal finances — income, expenses, budgets, and visualizations.

## Features

- **Dashboard** — Balance overview, income/expense summary, category breakdown
- **Transactions** — List with filters by type, category, and date range
- **Categories** — Create, edit, and delete categories with custom colors and icons
- **Budgets** — Set spending limits per category with progress tracking
- **Recurring** — Schedule recurring transactions with automatic next-run calculation
- **Sentry** — Error tracking and performance monitoring (when configured)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via Prisma ORM
- **Persistence**: Turso/libSQL (for Vercel deployment)
- **Monitoring**: Sentry (optional)
- **Styling**: Inline CSS (no external dependencies)

## Deployment to Vercel

The app uses Turso (libSQL) for persistent database on Vercel. Local development uses SQLite.

### Setup Turso Database

1. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Create database:
   ```bash
   turso db create financetracker --group finance-tracker
   ```

3. Get database URL:
   ```bash
   turso db show financetracker --url
   ```

4. Get auth token:
   ```bash
   turso auth api-tokens mint my-token
   ```

### Configure Environment Variables

**Vercel Project Settings → Environment Variables:**
- `TURSO_DATABASE_URL` = your Turso database URL
- `TURSO_AUTH_TOKEN` = your Turso auth token
- `AUTH_SECRET` = generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` = https://your-app.vercel.app

### Push Schema to Turso

```bash
export TURSO_DATABASE_URL="libsql://your-db.turso.io"
export TURSO_AUTH_TOKEN="your-token"
npx prisma db push
```

## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Set up database (SQLite for local)
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

## Related Concepts

- [[database]] — Database architecture and schema design
- [[ci-cd]] — CI/CD pipeline for the finance tracker
