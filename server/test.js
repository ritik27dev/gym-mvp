const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(Object.keys(prisma)); // should include 'moodEntry'
}

main();