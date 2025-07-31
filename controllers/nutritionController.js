const { getNutritionAnalysis } = require('../service/agent');




async function analyzeNutrition(req, res) {
  try {
    const { prompt, userId } = req.body;
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

    res.json(result);
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
}


module.exports = { analyzeNutrition };