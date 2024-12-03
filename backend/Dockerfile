
FROM node:14 AS backend
COPY . /app
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]

FROM cypress/included:12.0.0

WORKDIR /e2e
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "cypress", "run"]
