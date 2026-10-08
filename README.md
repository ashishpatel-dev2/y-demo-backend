# Todo backend (Node.js + Express + PostgreSQL)

REST API for the todo app. Schema is managed with Sequelize migrations.

## Local development

```bash
cp .env.example .env          # point DB_* at your local PostgreSQL, DB_SSL=false
npm install
npm run db:setup              # create the database + run migrations
npm run dev                   # http://localhost:5000/api/health
```

| Script | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm test` | API tests (needs a database and `npm run db:setup` first) |
| `npm run db:setup` | Create the database if missing, then run pending migrations |
| `npm run db:migrate:undo` | Roll back the last migration |

New migration: `npx sequelize-cli migration:generate --name <name>`, then rename the file to `.cjs`.

## CI (`.github/workflows/ci.yml`)

On every pull request and push to `main`: lint → migrations → tests, against a
throwaway PostgreSQL. (Deployment is not set up yet.)

`deploy/` holds server-side files (`docker-compose.yml`, `deploy.sh`,
`backend.env.example`) for a future EC2 deployment; CI doesn't use them.
