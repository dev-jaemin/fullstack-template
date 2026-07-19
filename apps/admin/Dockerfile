ARG BUN_VERSION=1.3.14

FROM oven/bun:${BUN_VERSION} AS build
ARG PARTNER_PHASE=release
ENV NODE_ENV=production
WORKDIR /workspace

COPY . .
RUN bun install --frozen-lockfile
RUN bun run --filter @repo/admin build

FROM nginx:1.27-alpine AS runtime
ARG PARTNER_PHASE=release
COPY --from=build /workspace/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD ["wget", "--spider", "--quiet", "http://127.0.0.1/"]
