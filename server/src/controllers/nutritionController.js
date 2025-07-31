const { getNutritionAnalysis } = require('../service/agent');
const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient();  


async function analyzeNutrition(req, res) {
  try {
    const { prompt, userId , date } = req.body;
    if (!prompt || !userId) {
      return res.status(400).json({ error: 'Prompt and userId are required' });
    }

    const result = await getNutritionAnalysis(prompt);

    // const meal = await createMeal({
    //   userId,
    //   when: result.when || 'unspecified',
    //   dishName: result.dish_name || 'unspecified',
    //   ingredients: result.ingredients,
    //   macronutrients: result.macronutrients,
    // });

    const meal = await prisma.meal.create({
      data: {
        userId,
        when: result.when || 'unspecified',
        dishName: result.dish_name || 'unspecified',
        ingredients: JSON.stringify(result.ingredients || []),
        macronutrients: JSON.stringify(result.macronutrients || {}),
        date: new Date(date),
      },
    });

    res.json({
      userId: meal.userId,
      createdAt: meal.createdAt,
      [`meal-time: ${meal.when}`]: {
        dishName: meal.dishName,
        ingredients: JSON.parse(meal.ingredients),
        macronutrients: JSON.parse(meal.macronutrients),
      },
    });

    // res.json(result);
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
}


async function getMealsByUser(req, res) {
  try {
    const { userId } = req.params;

    const meals = await prisma.meal.findMany({
      where: { userId: Number(userId) },
      orderBy: { date: 'asc' },
    });

    // Group meals by date
    const grouped = meals.reduce((acc, meal) => {
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

    res.json({ userId: Number(userId), meals: grouped });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
}

async function updateMeal(req, res) {
  try {
    const { id } = req.params;
    const { ingredients, macronutrients } = req.body;

    const meal = await prisma.meal.update({
      where: { id: Number(id) },
      data: {
        ingredients: JSON.stringify(ingredients),
        macronutrients: JSON.stringify(macronutrients),
      },
    });

    res.json({
      message: 'Meal updated successfully',
      meal: {
        id: meal.id,
        when: meal.when,
        dishName: meal.dishName,
        ingredients: JSON.parse(meal.ingredients),
        macronutrients: JSON.parse(meal.macronutrients),
        createdAt: meal.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
}


module.exports = { analyzeNutrition , getMealsByUser , updateMeal};