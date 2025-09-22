# Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Default port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]