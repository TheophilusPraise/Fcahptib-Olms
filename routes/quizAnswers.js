import express from 'express';
const router = express.Router();

// Example route: Get all quiz answers
router.get('/', async (req, res) => {
  // TODO: Replace with actual DB query
  res.json([{ id: 1, submission_id: 1, question_id: 1, selected_option: 'A', is_correct: true }]);
});

export default router;
