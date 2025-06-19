import express from 'express';
import { checkRole } from '../middleware/roleCheck.js';
import { Course, Assignment, SuperLog } from '../models/index.js';  // Adjust imports as needed

const router = express.Router();

// Mock implementations for student dashboard data fetching
// Replace with real DB queries as per your schema

async function getCourseEnrollmentsForStudent(studentId) {
  return [
    { course_id: 1, course_title: 'Introduction to Computer Science', status: 'Enrolled', grade: 'A', lecturer: 'Eng. Timothy Dada' },
    { course_id: 2, course_title: 'Calculus I', status: 'Completed', grade: 'B+', lecturer: 'Prof. John Doe' }
  ];
}

async function getAssignmentsForStudent(studentId) {
  return [
    { id: 1, title: 'Assignment 1', dueDate: '2025-06-20' },
    { id: 2, title: 'Assignment 2', dueDate: '2025-07-01' }
  ];
}

async function getAttendanceForStudent(studentId) {
  return [
    { course_id: 1, attendancePercent: 95 },
    { course_id: 2, attendancePercent: 88 }
  ];
}

async function getBadgesForStudent(studentId) {
  return [
    { id: 1, name: 'Excellent Participation', awardedDate: '2025-05-15' },
    { id: 2, name: 'Top Scorer', awardedDate: '2025-05-30' }
  ];
}

async function getMessagesForStudent(studentId) {
  return [
    { from: 'Lecturer', content: 'Welcome to the course!', date: '2025-06-01' },
    { from: 'Admin', content: 'System maintenance on Saturday.', date: '2025-06-05' }
  ];
}

async function getChatGroupsForStudent(studentId) {
  return [
    { id: 1, name: 'CS101 Study Group' },
    { id: 2, name: 'Math Enthusiasts' }
  ];
}

// Role-based dashboard redirect
router.get('/dashboard', (req, res) => {
  const role = req.user.role;
  switch (role) {
    case 'admin':
      return res.redirect('/dashboard/admin');
    case 'lecturer':
      return res.redirect('/dashboard/lecturer');
    case 'student':
      return res.redirect('/dashboard/student');
    default:
      return res.status(403).send('Role not recognized');
  }
});

// Admin dashboard route
router.get('/dashboard/admin', checkRole(['admin']), (req, res) => {
  res.render('dashboard/admin', { user: req.user });
});

// Lecturer dashboard with courses, assignments, and logs
router.get('/dashboard/lecturer', checkRole(['lecturer']), async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { lecturerId: req.user.id }
    });

    const courseIds = courses.map(course => course.id);

    const assignments = await Assignment.findAll({
      where: { courseId: courseIds }
    });

    const lecturerLogs = await SuperLog.findAll({
      where: { userId: req.user.id },
      order: [['timestamp', 'DESC']],
      limit: 20
    });

    res.render('dashboard/lecturer', {
      user: req.user,
      courses,
      assignments,
      lecturerLogs
    });
  } catch (error) {
    console.error('Error fetching data for lecturer dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Student dashboard with parallel data fetching
router.get('/dashboard/student', checkRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id;

    const [
      courseEnrollments,
      assignments,
      attendance,
      badges,
      messages,
      chatGroups
    ] = await Promise.all([
      getCourseEnrollmentsForStudent(studentId),
      getAssignmentsForStudent(studentId),
      getAttendanceForStudent(studentId),
      getBadgesForStudent(studentId),
      getMessagesForStudent(studentId),
      getChatGroupsForStudent(studentId)
    ]);

    res.render('dashboard/student', {
      user: req.user,
      courseEnrollments,
      assignments,
      attendance,
      badges,
      messages,
      chatGroups
    });
  } catch (error) {
    console.error('Error loading student dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
