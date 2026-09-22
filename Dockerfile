# Stage 1 — build client
FROM node:20 AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ .
RUN npm run build

# Stage 2 — install server deps
FROM node:20 AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps

# Stage 3 — runtime image
FROM node:20-slim AS release
WORKDIR /app
ENV NODE_ENV=production
# bring server node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules
# copy server source
COPY server/ ./server
# copy built client into /app/client/build so server can serve it
COPY --from=client-builder /app/client/build ./client/build
# ensure uploads dir exists
RUN mkdir -p /app/uploads
EXPOSE 5001
WORKDIR /app/server
CMD ["node", "src/server.js"]