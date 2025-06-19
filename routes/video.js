import express from 'express';
const router = express.Router();

// Example: Create a video meeting
router.post('/create', (req, res) => {
  res.json({ meetingUrl: 'https://video.provider/meeting/xyz' });
});

export default router;
