import express from 'express';
import { Message, User } from '../models/index.js';
import { Op } from 'sequelize';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Messages page: list all users, private chats, and messages with a selected recipient
router.get('/', checkRole(['student', 'lecturer', 'admin']), async (req, res) => {
  try {
    const userId = req.user.id;
    const selectedRecipientId = req.query.selectedRecipientId || null;

    // Fetch all users except the current user (for chat selection)
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: userId } },
      attributes: ['id', 'fullname', 'email'],
      order: [['fullname', 'ASC']]
    });

    // Construct privateChats array for chat list UI
    const privateChats = allUsers.map(user => ({
      id: user.id,
      participantName: user.fullname || user.email
    }));

    // Fetch private messages between current user and selected recipient (if any)
    let privateMessages = [];
    if (selectedRecipientId) {
      privateMessages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId, receiverId: selectedRecipientId },
            { senderId: selectedRecipientId, receiverId: userId }
          ]
        },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'fullname', 'email'] },
          { model: User, as: 'receiver', attributes: ['id', 'fullname', 'email'] }
        ],
        order: [['createdAt', 'ASC']]
      });
    }

    res.render('student/messages', {
      user: req.user,
      allUsers,
      privateChats,
      privateMessages,
      selectedRecipientId,
      UserCourse,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
