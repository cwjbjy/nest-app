FROM node:18-alpine as base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/config/production.yml ./src/config/production.yml

EXPOSE 9000

ENV HOSTNAME="0.0.0.0"

# 运行 Nest.js 应用程序
CMD ["node", "dist/main"]
