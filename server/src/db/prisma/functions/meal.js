const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a meal
 */
async function createMeal({ userId, when, dishName, ingredients, macronutrients, date }) {
  return prisma.meal.create({
    data: {
      userId,
      when,
      dishName,
      ingredients: JSON.stringify(ingredients),
      macronutrients: JSON.stringify(macronutrients),
      date: new Date(date),
    },
  });
}


async function getMealsByUserId(userId) {
  const meals = await prisma.meal.findMany({
    where: { userId: Number(userId) },
    orderBy: { date: 'asc' },
  });

  return meals.reduce((acc, meal) => {
    const dateKey = meal.date.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push({
      id: meal.id,
      when: meal.when,
      dishName: meal.dishName,
      ingredients: JSON.parse(meal.ingredients),
      macronutrients: JSON.parse(meal.macronutrients),
      createdAt: meal.createdAt,
    });
    return acc;
  }, {});
}


async function updateMealById(id, { userId, when, ingredients, macronutrients }) {
  const meal = await prisma.meal.updateMany({
    where: {
      id: Number(id),
      userId: Number(userId),
      when: when,
    },
    data: {
      ingredients: JSON.stringify(ingredients),
      macronutrients: JSON.stringify(macronutrients),
    },
  });

  // If no rows updated, throw an error
  if (meal.count === 0) {
    throw new Error('Meal not found or you are not allowed to update it');
  }

  // Fetch the updated meal
  const updated = await prisma.meal.findUnique({
    where: { id: Number(id) },
  });

  return {
    id: updated.id,
    when: updated.when,
    dishName: updated.dishName,
    ingredients: JSON.parse(updated.ingredients),
    macronutrients: JSON.parse(updated.macronutrients),
    createdAt: updated.createdAt,
  };
}


module.exports = {
  createMeal,
  getMealsByUserId,
  updateMealById,
};