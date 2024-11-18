FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]