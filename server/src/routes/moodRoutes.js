const express = require("express");
const { addMoodEntry, listMoodEntries } = require("../controllers/moodController");
const router = express.Router();

router.post("/addMoods", addMoodEntry);
router.post("/getMoods", listMoodEntries);

module.exports = router;