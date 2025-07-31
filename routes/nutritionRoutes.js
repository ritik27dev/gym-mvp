const express = require('express');
const { analyzeNutrition } = require('../controllers/nutritionController');

const router = express.Router();

router.post('/analyze', analyzeNutrition);

// router.get('/history/:userId', async (req, res) => {
//   const meals = await prisma.meal.findMany({
//     where: { userId: req.params.userId },
//     orderBy: { createdAt: 'desc' },
//   });
//   res.json(meals);
// });

module.exports = router;