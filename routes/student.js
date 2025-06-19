import express from 'express';
import { checkRole } from '../middleware/roleCheck.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import { User, Meeting, Enrollment, Course, Message, Group, UserGroup} from '../models/index.js';
import { Op, literal } from 'sequelize';
import {
  getCourseEnrollmentsForStudent,
  getAssignmentsForStudent,
  getAttendanceForStudent,
  getBadgesForStudent,
  getMessagesForStudent,
  getChatGroupsForStudent,
  getenrolledCoursesForStudent
} from '../models/studentDashboardData.js';

const router = express.Router();

// --- Student Dashboard Route ---
router.get('/dashboard/student', checkRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id;

    const [
      courseEnrollments,
      assignments,
      attendance,
      badges,
      messages,
      chatGroups,
      enrolledCourses
    ] = await Promise.all([
      getCourseEnrollmentsForStudent(studentId),
      getAssignmentsForStudent(studentId),
      getAttendanceForStudent(studentId),
      getBadgesForStudent(studentId),
      getMessagesForStudent(studentId),
      getChatGroupsForStudent(studentId),
      getenrolledCoursesForStudent(studentId)
    ]);

    // Fetch all meetings for the dashboard
    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('dashboard/student', {
      user: req.user,
      courseEnrollments: courseEnrollments || [],
      assignments: assignments || [],
      attendance: attendance || [],
      badges: badges || [],
      messages: messages || [],
      chatGroups: chatGroups || [],
      enrolledCourses: enrolledCourses || [],
      selectedRecipientId: null,
      meetings: meetings || []
    });
  } catch (error) {
    console.error('Error loading student dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --- Student Courses Route ---
router.get('/student/courses',
  ensureAuthenticated,
  checkRole(['student']),
  async (req, res) => {
    try {
      const enrollments = await Enrollment.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Course,
          include: [{ model: User, as: 'Lecturer', attributes: ['fullname'] }]
        }]
      });

      const availableCoursesRaw = await Course.findAll({
        include: [{ model: User, as: 'Lecturer', attributes: ['fullname'] }],
        where: {
          id: {
            [Op.notIn]: literal(`(SELECT courseId FROM Enrollments WHERE userId = ${req.user.id})`)
          }
        }
      });

      const enrolledCourses = enrollments.map(e => ({
        id: e.Course.id,
        name: e.Course.title,
        lecturerFullname: e.Course.Lecturer?.fullname || 'Unknown Lecturer',
        status: e.status || 'Enrolled',
        grade: e.grade || 'N/A'
      }));

      const availableCourses = availableCoursesRaw.map(c => ({
        id: c.id,
        name: c.title,
        description: c.category,
        lecturerFullname: c.Lecturer?.fullname || 'Unknown Lecturer'
      }));

      res.render('student/courses', {
        user: req.user,
        title: 'Student Dashboard',
        activePage: 'student-dashboard',
        enrolledCourses,
        availableCourses
      });
    } catch (error) {
      console.error('Student courses error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

// --- Student Assignments Route ---
router.get('/student/assignments', checkRole(['student']), async (req, res) => {
  try {
    const assignments = [];
    res.render('student/assignments', { user: req.user, assignments });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Student Course Details Route ---
router.get('/student/courses/:courseId', checkRole(['student']), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    res.render('student/courseDetail', { courseId, user: req.user });
  } catch (err) {
    console.error('Error fetching course details:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Student Assignment Details Route ---
router.get('/student/assignments/:assignmentId', checkRole(['student']), async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    res.render('student/assignmentDetail', { assignmentId, user: req.user });
  } catch (err) {
    console.error('Error fetching assignment details:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Student Messages Route ---
router.get('/student/messages', checkRole(['student']), async (req, res) => {
  try {
    const selectedRecipientId = req.query.selectedRecipientId || null;
    const selectedGroupId = req.query.groupId || null;

    // Fetch courses the student is enrolled in
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Course,
        attributes: ['id', 'title']
      }]
    });
    const courses = enrollments.map(e => e.Course);
    const courseIds = courses.map(course => course.id);

    // Fetch groups for these courses including their members with profilePic

 const groups = await Group.findAll({
  include: [{
    model: User,
    as: 'members',
    attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
  }]
});


    // Fetch all users except current student for messaging, include profilePic
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'fullname', 'email', 'profilePic'],
      order: [['fullname', 'ASC']],
    });

    // Private chats: show users the student has chatted with
    const privateChats = allUsers.map(u => ({
      id: u.id,
      participantName: u.fullname || u.email,
      participantProfilePic: u.profilePic
    }));

    // Private messages with selected recipient
    let privateMessages = [];
    if (selectedRecipientId) {
      privateMessages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: req.user.id, receiverId: selectedRecipientId },
            { senderId: selectedRecipientId, receiverId: req.user.id }
          ]
        },
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'fullname', 'profilePic']
        }],
        order: [['createdAt', 'ASC']]
      });
    }

    // Group messages: for selected group
    let groupMessages = [];
    if (selectedGroupId) {
      groupMessages = await Message.findAll({
        where: { chatGroupId: selectedGroupId },
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'fullname', 'profilePic']
        }],
        order: [['createdAt', 'ASC']]
      });
      groupMessages = groupMessages.map(msg => ({
        id: msg.id,
        senderName: msg.sender.fullname,
        senderProfilePic: msg.sender.profilePic,
        content: msg.content
      }));
    }

    // Fetch all meetings for the messaging page
    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Pass success and error messages from query parameters
    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('student/messages', {
      user: req.user,
      activePage: 'student-messages',
      groups,
      courses,
      allUsers,
      privateChats,
      privateMessages,
      groupMessages,
      selectedRecipientId,
      selectedGroupId,
      meetings, // Now always defined
      success,
      UserGroup,
      error
    });
  } catch (err) {
    console.error('Error fetching student messages:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Post new message (communication) ---
router.post('/student/messages', checkRole(['student']), async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    // Implement message sending logic here
    res.redirect('/student/messages?success=Message sent successfully');
  } catch (err) {
    console.error('Error sending message:', err);
    res.redirect('/student/messages?error=Failed to send message');
  }
});

// --- Certificates page ---
router.get('/student/certificates', checkRole(['student']), async (req, res) => {
  try {
    const certificates = [];
    res.render('student/certificates', { user: req.user, certificates });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Profile page ---
router.get('/profile', async (req, res) => {
  try {
    if (!req.user) return res.redirect('/auth/login');
    res.render('profile', { user: req.user, error: null, success: null });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Internal Server Error');
  }
});

// --- Logout route ---
router.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/auth/login');
  });
});

// --- Chat groups page - list groups and messages ---
router.get('/student/chat-groups', checkRole(['student']), async (req, res) => {
  try {
    const chatGroups = [];
    res.render('student/chatGroups', { user: req.user, chatGroups });
  } catch (err) {
    console.error('Error fetching chat groups:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
