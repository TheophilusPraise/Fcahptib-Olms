import express from 'express';
const router = express.Router();

// Example: Get chat history
router.get('/', (req, res) => {
  res.json({ message: 'Chat history (implement logic)' });
});

export default router;
