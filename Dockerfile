# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (default Next.js port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
