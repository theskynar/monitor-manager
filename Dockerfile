# Node.js (latest lts version)
FROM node:10-stretch-slim AS release

# Setup directory
WORKDIR /usr/bin/monitor-manager/
COPY . .

# Install dependencies
RUN npm install --only=production

# Set timezone
ENV TZ=America/Sao_Paulo

# Expose volumes
VOLUME ["/var/log/monitor-manager/"]

# Start application
CMD ["node", "/usr/bin/monitor-manager/src/index.js"]