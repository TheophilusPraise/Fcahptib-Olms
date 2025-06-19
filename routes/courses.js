import express from 'express';
const router = express.Router();

// Example: Get all courses
router.get('/', (req, res) => {
  res.json({ message: 'List of courses (implement logic)' });
});

export default router;
