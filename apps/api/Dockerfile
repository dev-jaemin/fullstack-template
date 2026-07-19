ARG BUN_VERSION=1.3.14

FROM oven/bun:${BUN_VERSION} AS build
ARG PARTNER_PHASE=release
ENV NODE_ENV=production
WORKDIR /workspace

COPY . .
RUN bun install --frozen-lockfile
RUN bun run build:modules
RUN bun run --filter @repo/api build

FROM oven/bun:${BUN_VERSION} AS runtime
ARG PARTNER_PHASE=release
ENV NODE_ENV=production
WORKDIR /workspace

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/package.json ./package.json
COPY --from=build /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=build /workspace/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /workspace/apps/api/dist ./apps/api/dist
COPY --from=build /workspace/modules/order/package.json ./modules/order/package.json
COPY --from=build /workspace/modules/order/node_modules ./modules/order/node_modules
COPY --from=build /workspace/modules/order/dist ./modules/order/dist
COPY --from=build /workspace/modules/product/package.json ./modules/product/package.json
COPY --from=build /workspace/modules/product/node_modules ./modules/product/node_modules
COPY --from=build /workspace/modules/product/dist ./modules/product/dist
COPY --from=build /workspace/packages/platform/package.json ./packages/platform/package.json
COPY --from=build /workspace/packages/platform/src ./packages/platform/src

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["bun", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["bun", "apps/api/dist/main.js"]
