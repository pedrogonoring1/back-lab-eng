FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY @types ./@types
COPY src ./src

RUN npm install
RUN npm run build

FROM node:16-alpine as runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production
COPY --chown=node:node --from=builder /app/dist ./dist
RUN chown -R node:node /app

EXPOSE 3000
USER node

CMD ["node", "./dist/server.js"]
