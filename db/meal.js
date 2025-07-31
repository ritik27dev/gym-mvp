const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMeal(data) {
  return await prisma.meal.create({ data });
}

async function getMealsByUser(userId) {
  return await prisma.meal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  createMeal,
  getMealsByUser,
};