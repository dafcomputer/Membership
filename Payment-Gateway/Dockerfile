FROM node:18

WORKDIR /app

# Copy application files
COPY . .

# Copy your SSL/TLS certificate and private key to the container
COPY cert.pem /app/
COPY key.pem /app/

# Install dependencies
RUN npm install

# Expose the desired HTTPS port
EXPOSE 8443

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8443
ENV HTTPS=true
ENV SSL_CERT_FILE=/app/cert.pem
ENV SSL_KEY_FILE=/app/key.pem

# Specify the startup command
CMD ["node", "index.js"]
