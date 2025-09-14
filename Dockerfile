# Use official Node.js LTS base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app files
COPY . .

# Expose port (if your Express app runs on 3000, adjust if different)
EXPOSE 5055

# Start the app
CMD ["npm", "start"]
