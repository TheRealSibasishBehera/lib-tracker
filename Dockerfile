FROM node:14 as frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build

FROM node:14

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 3000

CMD ["node", "index.js"]