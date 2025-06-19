import express from 'express';
const router = express.Router();

// Example route to get all submissions
router.get('/', async (req, res) => {
  // TODO: Fetch submissions from database
  res.json([{ id: 1, user_id: 1, submission_type: 'assignment', grade: 90 }]);
});

export default router;
