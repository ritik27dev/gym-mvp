const express = require('express');
const { analyzeNutrition } = require('../controllers/nutritionController');
const { getMealsByUser } = require('../controllers/nutritionController')
const { updateMeal } = require('../controllers/nutritionController')

const router = express.Router();

router.post('/analyze', analyzeNutrition);

router.get('/meals/:userId', getMealsByUser);
router.put('/meals/:id', updateMeal);

module.exports = router;