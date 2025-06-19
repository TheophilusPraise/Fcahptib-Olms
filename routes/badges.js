import express from 'express';
const router = express.Router();

// Example: Get badges
router.get('/', (req, res) => {
  res.json({ message: 'Badges (implement logic)' });
});

export default router;
