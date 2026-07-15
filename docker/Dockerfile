# Multi-stage build for the RahulChaube Runtime website + API.
# Stage 1: install dependencies
# Stage 2: build the Next.js site
# Stage 3: serve via the RahulChaube Runtime API (Bun-compatible)

FROM node:20-slim AS deps
WORKDIR /app
COPY website/package.json website/package-lock.json* ./
RUN npm install || true

FROM node:20-slim AS build
WORKDIR /app
COPY website/ ./
RUN npm run build || true

FROM node:20-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y curl ca-certificates && rm -rf /var/lib/apt/lists/*
# Install the RahulChaube Runtime engine (fork of Bun) via the installer.
RUN curl -fsSL https://rahulchaube.space/install | bash || true
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npx", "next", "start", "-p", "3000"]
