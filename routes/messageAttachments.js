import express from 'express';
const router = express.Router();

// Example route to get message attachments
router.get('/', async (req, res) => {
  // TODO: Fetch message attachments from database
  res.json([{ id: 1, message_id: 1, file_url: 'https://example.com/file.pdf', file_type: 'pdf' }]);
});

export default router;
