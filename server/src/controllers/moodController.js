const { createMoodEntry, getMoodEntries } = require("../db/prisma/functions/mood");

const VALID_MOOD_TYPES = ["DAILY_CHECKIN", "POST_WORKOUT", "POST_MEDITATION"];
const VALID_MOOD_VALUES = ["HAPPY", "CONTENT", "NEUTRAL", "STRESSED", "SAD", "ANGRY"];


async function addMoodEntry(req, res) {
  try {
    const { userId, type, mood } = req.body;

    if (!userId || !type || !mood) {
      return res.status(400).json({ error: "Pass all the data" });
    }

    if (!VALID_MOOD_TYPES.includes(type)) {
      return res.status(400).json({ error: `Invalid type. Must be one of: ${VALID_MOOD_TYPES.join(", ")}` });
    }

    if (!VALID_MOOD_VALUES.includes(mood)) {
      return res.status(400).json({ error: `Invalid mood. Must be one of: ${VALID_MOOD_VALUES.join(", ")}` });
    }

    const entry = await createMoodEntry(Number(userId), type, mood);
    res.json({ message: "Mood entry added successfully", entry });

  } catch (err) {
    console.error(err);

    if (err.message.includes("already exists today")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

async function listMoodEntries(req, res) {
  try {
    const { userId, fromDate, toDate } = req.body;

    const entries = await getMoodEntries(
      Number(userId),
      new Date(fromDate),
      new Date(toDate)
    );

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

module.exports = { addMoodEntry, listMoodEntries };