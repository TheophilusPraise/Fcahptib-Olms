import express from 'express';
const router = express.Router();

// Example: AI endpoint
router.post('/ask', (req, res) => {
  res.json({ answer: 'AI answer (implement logic)' });
});

export default router;
