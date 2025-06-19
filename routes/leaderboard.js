import express from 'express';
import { LeaderboardEntry, User } from '../models/index.js';

const router = express.Router();

// Get leaderboard sorted by rank or score
router.get('/', async (req, res) => {
  try {
    const leaderboard = await LeaderboardEntry.findAll({
      include: [{ model: User, attributes: ['fullname', 'email'] }],
      order: [['rank', 'ASC']]
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
