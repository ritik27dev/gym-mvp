const express = require("express");
const { addMoodEntry, listMoodEntries } = require("../controllers/moodController");
const router = express.Router();

/**
 * @swagger
 * /api/moods/addMoods:
 *   post:
 *     summary: Add a mood entry
 *     tags: [Moods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, type, mood]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [DAILY_CHECKIN, POST_WORKOUT, POST_MEDITATION]
 *               mood:
 *                 type: string
 *                 enum: [HAPPY, CONTENT, NEUTRAL, STRESSED, SAD, ANGRY]
 *     responses:
 *       200:
 *         description: Mood entry added successfully
 */

/**
 * @swagger
 * /api/moods/getMoods:
 *   post:
 *     summary: Get all mood entries for a user
 *     tags: [Moods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, fromDate, toDate]
 *             properties:
 *               userId:
 *                 type: integer
 *               fromDate:
 *                 type: string
 *                 format: date
 *               toDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: List of mood entries
 */


router.post("/addMoods", addMoodEntry);
router.post("/getMoods", listMoodEntries);

module.exports = router;