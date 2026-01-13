FROM ghcr.io/puppeteer/puppeteer:latest

# 1. TELL PUPPETEER TO SHUT UP AND NOT DOWNLOAD CHROME
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

USER root
WORKDIR /app

COPY package*.json ./
# 2. This install will now be 10x faster
RUN npm install

COPY . .

USER pptruser
CMD ["node", "server.js"]
