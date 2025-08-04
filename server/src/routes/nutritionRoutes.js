/**
 * @swagger
 * /api/nutrition/analyze:
 *   post:
 *     summary: Analyze a meal from user input
 *     tags: [Nutrition]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt, userId, date]
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: I want to have pulav in lunch
 *               userId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-04
 *     responses:
 *       200:
 *         description: Meal created
 */

/**
 * @swagger
 * /api/nutrition/meals/{userId}:
 *   get:
 *     summary: Get meals by user ID
 *     tags: [Nutrition]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: A list of meals grouped by date
 */

/**
 * @swagger
 * /api/nutrition/meals/{mealId}:
 *   put:
 *     summary: Update a meal
 *     tags: [Nutrition]
 *     parameters:
 *       - name: mealId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               when:
 *                 type: string
 *                 example: lunch
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *               macronutrients:
 *                 type: object
 *                 properties:
 *                   calories_kcal:
 *                     type: number
 *                   protein_g:
 *                     type: number
 *                   fat_g:
 *                     type: number
 *                   carbs_g:
 *                     type: number
 *     responses:
 *       200:
 *         description: Meal updated successfully
 */


const express = require('express');
const { analyzeNutrition , getMeals ,updateMeal } = require('../controllers/nutritionController');


const router = express.Router();

router.post('/analyze', analyzeNutrition);
router.get('/meals/:userId', getMeals);
router.put('/meals/:id', updateMeal);

module.exports = router;



