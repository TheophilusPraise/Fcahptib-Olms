import express from 'express';
const router = express.Router();

// Example route to get attendance records
router.get('/', async (req, res) => {
  // TODO: Fetch attendance data from database
  res.json([{ id: 1, user_id: 1, lesson_id: 2, attended_at: '2025-06-07T10:00:00Z' }]);
});

export default router;
