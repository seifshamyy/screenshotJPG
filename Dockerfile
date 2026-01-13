FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Switch back to secure user
USER pptruser

CMD ["node", "server.js"]
