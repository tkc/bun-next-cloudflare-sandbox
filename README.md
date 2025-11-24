# Bun + Next.js + Cloudflare Workers Sandbox

A sandbox project exploring the integration of Bun, Next.js (App Router), and Cloudflare Workers using OpenNext and Drizzle ORM.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (Local), Cloudflare Workers (Production)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Adapter**: [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) (SQLite / Cloudflare D1)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Cloudflare Account (for deployment)

### Installation

```bash
bun install
```

### Local Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Local Worker Preview

To preview the application running in the Cloudflare Workers environment locally:

```bash
bun run dev:worker
```

## Database

This project uses Drizzle ORM with SQLite.

- **Local**: `better-sqlite3` (stored in `local.db`)
- **Production**: Cloudflare D1

### Migrations

```bash
# Generate migrations
bun run db:generate

# Apply to Production D1
bun run db:migrate:prod
```

## Deployment

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

For detailed deployment instructions and environment setup, see [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md).

## Quality & Testing

```bash
# Lint & Format (Biome)
bun run check

# Type Check
bun run type-check

# Test
bun test
```

## Documentation

- [Architecture](docs/architecture.md)
- [Cloudflare Deployment](docs/cloudflare-deployment.md)
- [Quick Start](docs/quick-start.md)

