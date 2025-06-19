import express from 'express';
const router = express.Router();

// Example route to get admin logs
router.get('/', async (req, res) => {
  // TODO: Fetch admin logs from database
  res.json([{ id: 1, admin_user_id: 1, action: 'Created user', timestamp: new Date() }]);
});

export default router;
