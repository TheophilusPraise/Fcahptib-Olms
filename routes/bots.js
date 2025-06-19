import express from 'express';
const router = express.Router();

// Example: Get bots
router.get('/', (req, res) => {
  res.json({ message: 'Bots (implement logic)' });
});

export default router;
