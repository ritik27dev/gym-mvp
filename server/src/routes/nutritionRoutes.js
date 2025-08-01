const express = require('express');
const { analyzeNutrition , getMeals ,updateMeal } = require('../controllers/nutritionController');


const router = express.Router();

router.post('/analyze', analyzeNutrition);
router.get('/meals/:userId', getMeals);
router.put('/meals/:id', updateMeal);

module.exports = router;