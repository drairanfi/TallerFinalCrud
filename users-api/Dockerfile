FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 build-essential --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=8080
ENV DATABASE_FILE=/app/data/database.sqlite

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["node", "index.js"]
