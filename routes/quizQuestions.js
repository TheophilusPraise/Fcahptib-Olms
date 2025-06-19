import express from 'express';
const router = express.Router();

// Example route to get all quiz questions
router.get('/', async (req, res) => {
  // TODO: Fetch quiz questions from database
  res.json([{ id: 1, question: 'Sample question?' }]);
});

export default router;
