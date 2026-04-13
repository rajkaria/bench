FROM node:22-alpine

RUN npm install -g pnpm@10

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy package.json files for all workspace packages
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/
COPY packages/db/package.json packages/db/tsconfig.json packages/db/
COPY packages/attestor/package.json packages/attestor/tsconfig.json packages/attestor/tsup.config.ts packages/attestor/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared/src packages/shared/src
COPY packages/db/src packages/db/src
COPY packages/db/migrations packages/db/migrations
COPY packages/attestor/src packages/attestor/src

# Build all three packages in order
RUN pnpm --filter @bench/shared build && \
    pnpm --filter @bench/db build && \
    pnpm --filter @bench/attestor build

EXPOSE 3001

CMD ["node", "packages/attestor/dist/server.js"]
