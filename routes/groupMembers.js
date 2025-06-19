import express from 'express';
const router = express.Router();

// Example route to get group members
router.get('/', async (req, res) => {
  // TODO: Fetch group members from database
  res.json([{ id: 1, group_id: 1, user_id: 2, role: 'member', joined_at: '2025-06-07T10:00:00Z' }]);
});

export default router;
