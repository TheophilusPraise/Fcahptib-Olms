import express from 'express';
import { ChatGroup, ChatGroupMember, Message, User } from '../models/index.js';
import { ensureAuthenticated } from '../middleware/auth.js'; // Adjust path as needed

const router = express.Router();

// Get all chat groups the user is a member of
router.get('/groups', ensureAuthenticated, async (req, res) => {
  try {
    const groups = await ChatGroup.findAll({
      include: [{
        model: ChatGroupMember,
        where: { userId: req.user.id }
      }]
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages for a chat group
router.get('/groups/:groupId/messages', ensureAuthenticated, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatGroupId: req.params.groupId },
      include: [{ model: User, as: 'sender', attributes: ['fullname'] }],
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message to a chat group
router.post('/groups/:groupId/messages', ensureAuthenticated, async (req, res) => {
  try {
    const { message, messageType } = req.body;
    const newMessage = await Message.create({
      chatGroupId: req.params.groupId,
      senderId: req.user.id,
      message,
      messageType: messageType || 'text',
      createdAt: new Date()
    });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
