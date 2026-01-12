# Use the official Puppeteer image (has Chrome pre-installed)
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install your app dependencies
USER root

WORKDIR /app

# Copy package files and install (skips Chromium download automatically)
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Switch back to the secure puppeteer user
USER pptruser

# Start the app
CMD ["node", "server.js"]
