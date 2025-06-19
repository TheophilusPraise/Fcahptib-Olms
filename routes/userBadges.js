import express from 'express';
const router = express.Router();

// Example route to get user badges
router.get('/', async (req, res) => {
  // TODO: Fetch user badges from database
  res.json([{ id: 1, user_id: 1, badge_id: 2, awarded_at: '2025-06-07T10:00:00Z' }]);
});

export default router;
