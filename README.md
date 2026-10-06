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

## CI/CD (`.github/workflows/ci-cd.yml`)

- **Pull request / push:** lint → migrations → tests, against a throwaway PostgreSQL.
- **Push to `main` (after tests pass):** build image → push to ECR `todo-backend`
  (`:latest` and `:<commit sha>`) → run `deploy.sh backend` on the EC2 server via AWS SSM.

`deploy/` holds the server-side files (`docker-compose.yml`, `deploy.sh`,
`backend.env.example`); they live in `/home/ubuntu/app` on the EC2 server.
