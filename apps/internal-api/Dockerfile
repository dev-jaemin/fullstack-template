ARG BUN_VERSION=1.3.14

FROM oven/bun:${BUN_VERSION} AS build
ARG PARTNER_PHASE=release
ENV NODE_ENV=production
WORKDIR /workspace

COPY . .
RUN bun install --frozen-lockfile
RUN bun run build:modules
RUN bun run --filter @repo/internal-api build

FROM oven/bun:${BUN_VERSION} AS runtime
ARG PARTNER_PHASE=release
ENV NODE_ENV=production
ENV PUBLIC_API_ORIGIN=http://api:3000
WORKDIR /workspace

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/package.json ./package.json
COPY --from=build /workspace/apps/internal-api/package.json ./apps/internal-api/package.json
COPY --from=build /workspace/apps/internal-api/node_modules ./apps/internal-api/node_modules
COPY --from=build /workspace/apps/internal-api/dist ./apps/internal-api/dist
COPY --from=build /workspace/modules/order/package.json ./modules/order/package.json
COPY --from=build /workspace/modules/order/node_modules ./modules/order/node_modules
COPY --from=build /workspace/modules/order/src/contract ./modules/order/src/contract
COPY --from=build /workspace/packages/platform/package.json ./packages/platform/package.json
COPY --from=build /workspace/packages/platform/src ./packages/platform/src

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["bun", "-e", "fetch('http://127.0.0.1:3001/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["bun", "apps/internal-api/dist/main.js"]
