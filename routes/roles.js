import express from 'express';
const router = express.Router();

// Example route to get all roles
router.get('/', async (req, res) => {
  // Fetch roles from DB and send response
  res.json([{ id: 1, name: 'admin' }, { id: 2, name: 'student' }]);
});

export default router;
