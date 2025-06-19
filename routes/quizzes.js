import express from 'express';
import { Quiz, Question, Answer, Result } from '../models/index.js';

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz by id with questions and answers
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: {
        model: Question,
        include: [Answer]
      }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz result
router.post('/:id/submit', async (req, res) => {
  try {
    const userId = req.user.id; // assuming authentication middleware
    const { score } = req.body;
    const result = await Result.create({
      userId,
      quizId: req.params.id,
      score,
      completedAt: new Date()
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
