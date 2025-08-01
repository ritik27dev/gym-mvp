const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function parseGeminiResponse(response) {
  try {
    // Extract text from the response structure
    let text = '';
    
    // Handle the nested response structure
    if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.response.candidates[0].content.parts[0].text;
    } else if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text;
    } else if (typeof response === 'string') {
      text = response;
    } else {
      throw new Error('Invalid response structure');
    }

    // Clean up the text
    text = text.trim();
    
    // Remove code fences (multiple patterns)
    if (text.includes('```')) {
      // Remove opening code fence
      text = text.replace(/^```(?:json|javascript|js)?\s*/i, '');
      // Remove closing code fence
      text = text.replace(/\s*```\s*$/i, '');
      text = text.trim();
    }
    
    // Handle cases where response might have extra text before/after JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    // Parse JSON with error handling
    const parsedData = JSON.parse(text);
    
    // Validate expected structure (optional - customize based on your needs)
    if (!parsedData.ingredients || !parsedData.macronutrients) {
      console.warn('Response missing expected fields:', parsedData);
    }
    
    return parsedData;
    
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError.message);
    console.error('Raw text:', text);
    
    // Fallback: try to extract JSON from any position in the text
    try {
      const jsonRegex = /\{(?:[^{}]|{[^{}]*})*\}/g;
      const matches = text.match(jsonRegex);
      
      if (matches && matches.length > 0) {
        // Try parsing each match
        for (const match of matches) {
          try {
            const parsed = JSON.parse(match);
            console.log('Recovered JSON from fallback parsing');
            return parsed;
          } catch (e) {
            continue;
          }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError.message);
    }
    
    // Final fallback: return a default structure
    console.error('All parsing attempts failed. Returning default structure.');
    return {
      ingredients: [],
      macronutrients: {
        calories_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0
      },
      error: 'Failed to parse AI response',
      raw_response: text
    };
  }
}



async function getNutritionAnalysis(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const systemPrompt = `
You are a professional nutritionist and dietitian. 
Given a description of food eaten by ONE person (for a single meal), you must:
- Detect and include the eating occasion if present (breakfast, lunch, dinner, snack, pre-workout, post-workout).
- Extract the main dish name from the description (e.g., "Butter Chicken", "Oats with Milk").
- Assume typical Indian or global recipe standards if dish details are vague.
- Break down the meal into its main ingredients with approximate **quantities in grams** (raw weight).
- Include ALL major ingredients such as oil, butter, cream, spices, rice, bread, etc.
- Estimate macronutrients (calories, protein, fat, carbs) realistically for that meal.

Return ONLY JSON with the following format:
{
  "when": "dinner",
  "dish_name": "Butter Chicken",
  "ingredients": [
    { "name": "IngredientName", "quantity_g": 0 }
  ],
  "macronutrients": {
    "calories_kcal": 0,
    "protein_g": 0,
    "fat_g": 0,
    "carbs_g": 0
  }
}
Do not include any explanation or text outside the JSON.
`;
  try {
    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${prompt}`);
    
          
    // Handle different response formats
    let responseData;
    if (result.response) {
      responseData = result; // Your current format
    } else if (result.candidates) {
      responseData = { response: result }; // Alternative format
    } else {
      responseData = result; // Direct format
    }
    
    return parseGeminiResponse(responseData);
    
  } catch (error) {
    console.error('Model generation failed:', error);
    
    // Return fallback structure
    return {
      ingredients: [],
      macronutrients: {
        calories_kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0
      },
      error: 'Model generation failed',
      details: error.message
    };
  }
}

module.exports = { getNutritionAnalysis };
