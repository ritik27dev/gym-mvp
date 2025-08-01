const { getNutritionAnalysis } = require('../service/agent');
const { createMeal, getMealsByUserId, updateMealById } = require('../db/prisma/functions/meal');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// async function analyzeNutrition(req, res) {
//   try {
//     const { prompt, userId, date } = req.body;
//     if (!prompt || !userId) {
//       return res.status(400).json({ error: 'Prompt and userId are required' });
//     }

//     const result = await getNutritionAnalysis(prompt);

//     const meal = await createMeal({
//       userId,
//       when: result.when || 'unspecified',
//       dishName: result.dish_name || 'unspecified',
//       ingredients: result.ingredients || [],
//       macronutrients: result.macronutrients || {},
//       date,
//     });

//    res.json({
//     userId: meal.userId,
//     createdAt: meal.createdAt,
//     [`meal-time: ${meal.when}`]: {
//       dishName: meal.dishName,
//       ingredients: JSON.parse(meal.ingredients),
//       macronutrients: JSON.parse(meal.macronutrients),
//     },
// });
//   } catch (error) {
//     console.error('Error analyzing nutrition:', error);
//     res.status(500).json({ error: 'Failed to analyze nutrition' });
//   }
// }


async function analyzeNutrition(req, res) {
  try {
    const { prompt, userId, date } = req.body;

    // Validate inputs
    if (!prompt || !userId || !date) {
      return res.status(400).json({ error: 'Prompt, userId, and date are required' });
    }

    // Validate userId is a valid number
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      return res.status(400).json({ error: 'Invalid userId: must be a positive number' });
    }

    // Validate date is a valid ISO string or Date
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date: must be a valid date string (e.g., YYYY-MM-DD)' });
    }
    mealDate.setUTCHours(0, 0, 0, 0); // Normalize to start of the day

    const result = await getNutritionAnalysis(prompt);

    // Query existing meal
    const existingMeal = await prisma.meal.findFirst({
      where: {
        userId: parsedUserId,
        when: result.when || 'unspecified',
        date: {
          gte: mealDate,
          lt: new Date(mealDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingMeal) {
      return res.status(400).json({
        error: `You have already logged ${result.when} for this date.`,
      });
    }

    // Create new meal
    const meal = await createMeal({
      userId: parsedUserId,
      when: result.when || 'unspecified',
      dishName: result.dish_name || 'unspecified',
      ingredients: result.ingredients || [],
      macronutrients: result.macronutrients || {},
      date: mealDate,
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
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
}


async function getMeals(req, res) {
  try {
    const { userId } = req.params;
    const groupedMeals = await getMealsByUserId(userId);
    res.json({ userId: Number(userId), meals: groupedMeals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
}

async function updateMeal(req, res) {
  try {
    const { id } = req.params;
    const { userId, when, ingredients, macronutrients } = req.body;

    // Validate required fields
    if (!userId || !when) {
      return res.status(400).json({ error: 'userId and when are required to update meal' });
    }

    const meal = await updateMealById(id, {
      userId,
      when,
      ingredients: ingredients || [],
      macronutrients: macronutrients || {},
    });

    res.json({
      message: 'Meal updated successfully',
      meal,
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
}

module.exports = { analyzeNutrition, getMeals, updateMeal };