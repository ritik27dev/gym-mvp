const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMoodEntry(userId, type, mood) {
  // Compute today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Check for an existing entry
  const existing = await prisma.moodEntry.findFirst({
    where: {
      userId,
      type,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (existing) {
    throw new Error("Mood entry for this type already exists today");
  }

  return prisma.moodEntry.create({
    data: {
      userId,
      type,
      mood,
    },
  });
}

async function getMoodEntries(userId, fromDate, toDate) {
  return prisma.moodEntry.findMany({
    where: {
      userId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

module.exports = { createMoodEntry, getMoodEntries };