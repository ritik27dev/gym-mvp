FROM node:18

# Set the working directory where package.json is
WORKDIR /app

# Copy the correct package.json from backend/server/
COPY ../../package*.json ./

# Install dependencies (including Prisma and nodemon)
RUN npm install

# Copy the whole server code (everything in backend/server)
COPY ../../ ./

RUN npx prisma generate --schema=src/db/prisma/schema.prisma

# Set working directory to src where index.js lives
WORKDIR /app/src

# Start with npx to avoid missing nodemon
CMD ["npx", "nodemon", "index.js"]
