FROM ghcr.io/puppeteer/puppeteer:latest

# Keep this to make deployments fast (skips downloading Chrome again)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# --- CRITICAL CHANGE: WE REMOVED THE EXECUTABLE_PATH LINE ---
# The base image already sets this variable automatically. 
# Overriding it caused the crash.

USER root
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

USER pptruser
CMD ["node", "server.js"]
