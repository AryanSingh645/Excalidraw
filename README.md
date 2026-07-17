# Excalidraw (Monorepo)

A real-time collaborative drawing application built as a pnpm + Turborepo monorepo.
Users sign up / sign in, create drawing "rooms", and collaborate live over WebSockets
while the web frontend renders the shared canvas.

> Note: This repo started from the Turborepo starter template, but the boilerplate
> apps (`docs`, `web`) have been replaced with a custom HTTP auth backend, a
> WebSocket collaboration backend, and a Next.js frontend.

## Tech Stack

- **Monorepo**: [Turborepo](https://turborepo.dev/) + [pnpm workspaces](https://pnpm.io/workspaces)
- **Language**: 100% [TypeScript](https://www.typescriptlang.org/)
- **HTTP backend**: [Express](https://expressjs.com/) 5 (REST auth + room APIs)
- **Realtime backend**: [ws](https://github.com/websockets/ws) (WebSocket server)
- **Frontend**: [Next.js](https://nextjs.org/) 16 + [React](https://react.dev/) 19
- **Validation**: [Zod](https://zod.dev/) (shared request schemas)
- **Auth**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT-based)
- **Lint / Format**: ESLint 9 + Prettier

## What's inside?

This monorepo includes the following packages/apps:

### Apps

- `apps/web` — Next.js 16 frontend (the drawing canvas UI). Runs on port **3000**.
- `apps/http-backend` — Express 5 REST API for auth and room management. Runs on port **3000**.
  - `POST /signup` — register a user (validated with `CreateUserSchema`)
  - `POST /signin` — authenticate and receive a JWT
  - `POST /room` — create a room (protected by `authMiddleware`)
  - `authMiddleware` — verifies the `Authorization` header JWT and attaches `req.userId`
- `apps/ws-backend` — WebSocket server for realtime collaboration. Runs on port **8080**.
  - Authenticates connections via a `?token=<jwt>` query param
  - Closes the socket if the token is missing/invalid or has no `userId`

### Packages

- `@repo/common` — shared Zod schemas and TypeScript types
  (`CreateUserSchema`, `SignInSchema`, `CreateRoomSchema`)
- `@repo/backend-common` — shared backend config, exports `JWT_SECRET`
  (reads `process.env.JWT_SECRET`, falls back to a dev default)
- `@repo/ui` — shared React component library (`Button`, `Card`, `Code`, …) used by `apps/web`
- `@repo/eslint-config` — shared ESLint presets (base / next / react-internal)
- `@repo/typescript-config` — shared `tsconfig.json` bases (base / react-library / nextjs)

## Project Structure

```
.
├── apps/
│   ├── web/            # Next.js 16 frontend
│   ├── http-backend/   # Express 5 REST API (auth + rooms)
│   └── ws-backend/     # WebSocket realtime server
├── packages/
│   ├── common/         # Shared Zod schemas + types
│   ├── backend-common/ # Shared backend config (JWT_SECRET)
│   ├── ui/             # Shared React UI components
│   ├── eslint-config/  # Shared ESLint configs
│   └── typescript-config/ # Shared tsconfig bases
├── package.json        # Root scripts (turbo run ...)
├── pnpm-workspace.yaml # Workspace globs
├── turbo.json          # Turborepo task pipeline
└── pnpm-lock.yaml
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9 (`npm i -g pnpm`)

### Install dependencies

```sh
pnpm install
```

### Environment

The HTTP and WebSocket backends read `JWT_SECRET` from the environment
(defaults to a dev fallback if unset — set it for any non-local use):

```sh
export JWT_SECRET="your-secret-here"
```

## Build

Build all apps and packages:

```sh
pnpm build          # turbo run build
```

Build a single app/package with a filter:

```sh
pnpm exec turbo build --filter=http-backend
```

## Develop

Run all apps in development mode (Turborepo keeps these persistent/watch):

```sh
pnpm dev            # turbo run dev
```

Run a single app:

```sh
pnpm exec turbo dev --filter=web
```

Individual app commands (run from each app directory):

```sh
# Web frontend
cd apps/web && pnpm dev          # next dev --port 3000

# HTTP backend
cd apps/http-backend && pnpm dev # build + node ./dist/index.js (port 3000)

# WebSocket backend
cd apps/ws-backend && pnpm dev   # build + node ./dist/index.js (port 8080)
```

## Lint & Format

```sh
pnpm lint           # turbo run lint
pnpm format         # prettier --write "**/*.{ts,tsx,md}"
pnpm check-types    # turbo run check-types
```

## Status / TODO

This is an early-stage scaffold. The following are stubbed and not yet implemented:

- Database calls for user registration / verification (currently hardcoded/mocked)
- Room persistence and membership
- Actual canvas drawing broadcast logic over the WebSocket connection
- Frontend canvas integration with the backends

## Useful Links

- [Turborepo Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Turborepo Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Turborepo Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Turborepo Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
