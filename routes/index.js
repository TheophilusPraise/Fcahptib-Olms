// routes/index.js
import express from 'express';
import userRoutes from './users.js';
import quizAnswerRoutes from './quizAnswers.js';
import submissionRoutes from './submissions.js';
import attendanceRoutes from './attendance.js';
import userBadgeRoutes from './userBadges.js';
import chatGroupRoutes from './chatGroups.js';
import groupMemberRoutes from './groupMembers.js';
import messageRoutes from './messages.js';
import messageAttachmentRoutes from './messageAttachments.js';
import adminLogRoutes from './adminLogs.js';
import lecturerLogRoutes from './lecturerLogs.js';
import studentLogRoutes from './studentLogs.js';
import superLogRoutes from './superLogs.js';
import authRoutes from './auth.js';  // Import auth routes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/quiz-answers', quizAnswerRoutes);
router.use('/submissions', submissionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/user-badges', userBadgeRoutes);
router.use('/chat-groups', chatGroupRoutes);
router.use('/group-members', groupMemberRoutes);
router.use('/messages', messageRoutes);
router.use('/message-attachments', messageAttachmentRoutes);
router.use('/logs/admin', adminLogRoutes);
router.use('/logs/lecturer', lecturerLogRoutes);
router.use('/logs/student', studentLogRoutes);
router.use('/logs/super', superLogRoutes);

router.use('/auth', authRoutes);  // Mount auth routes at /auth

export default router;
