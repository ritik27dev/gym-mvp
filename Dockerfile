FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Generate Prisma client inside the container
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

CMD ["npx", "nodemon", "index.js"]