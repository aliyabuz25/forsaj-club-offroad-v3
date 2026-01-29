# Build Stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY json ./json
# Ensure uploads directory
RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "server.js"]
