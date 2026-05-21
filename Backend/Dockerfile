FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Force port 80 for KUBEX compatibility
ENV PORT=80
EXPOSE 80

CMD ["node", "server.js"]
