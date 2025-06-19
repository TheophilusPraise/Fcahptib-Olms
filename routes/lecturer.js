import express from 'express';
import { checkRole } from '../middleware/roleCheck.js';
import { Op } from 'sequelize';
import { Course, Group, User } from '../models/index.js';

const router = express.Router();

// Existing routes
router.get('/lecturer/courses/new', checkRole(['lecturer']), (req, res) => {
  res.render('lecturer/createCourse', { user: req.user });
});

router.get('/lecturer/courses/:id/edit', checkRole(['lecturer']), async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findOne({
      where: { id: courseId, lecturerId: req.user.id }
    });

    if (!course) {
      return res.status(404).send('Course not found or you do not have permission to edit it.');
    }

    res.render('lecturer/editCourse', { user: req.user, course });
  } catch (error) {
    console.error('Error fetching course for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --- New Group Management Routes ---

// List groups for a course
router.get('/lecturer/courses/:courseId/groups', checkRole(['lecturer']), async (req, res) => {
  const { courseId } = req.params;
  try {
    const groups = await Group.findAll({
      where: { courseId },
      include: [{ model: User, as: 'members' }],
    });
    res.render('lecturer/groups', { groups, courseId, user: req.user });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Show form to create a new group
router.get('/lecturer/courses/:courseId/groups/new', checkRole(['lecturer']), (req, res) => {
  res.render('lecturer/newGroup', { courseId: req.params.courseId });
});

// Create a new group
router.post('/lecturer/courses/:courseId/groups', checkRole(['lecturer']), async (req, res) => {
  const { courseId } = req.params;
  const { name } = req.body;
  try {
    await Group.create({ name, courseId });
    res.redirect(`/lecturer/courses/${courseId}/groups`);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add student to group by matricNo or email
router.post('/lecturer/courses/:courseId/groups/:groupId/members', checkRole(['lecturer']), async (req, res) => {
  const { groupId, courseId } = req.params;
  const { search } = req.body; // matricNo or email

  try {
    const student = await User.findOne({
      where: {
        role_id: 3, // Adjust if your student role ID differs
        [Op.or]: [{ matricNo: search }, { email: search }],
      },
    });

    if (!student) {
      // You can use flash messages or pass error to template
      return res.status(404).send('Student not found');
    }

    const group = await Group.findByPk(groupId);
    await group.addMember(student);

    res.redirect(`/lecturer/courses/${courseId}/groups`);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Remove student from group
router.delete('/lecturer/courses/:courseId/groups/:groupId/members/:userId', checkRole(['lecturer']), async (req, res) => {
  const { groupId, userId, courseId } = req.params;
  try {
    const group = await Group.findByPk(groupId);
    await group.removeMember(userId);
    res.redirect(`/lecturer/courses/${courseId}/groups`);
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete group
router.delete('/lecturer/courses/:courseId/groups/:groupId', checkRole(['lecturer']), async (req, res) => {
  try {
    await Group.destroy({ where: { id: req.params.groupId } });
    res.redirect(`/lecturer/courses/${req.params.courseId}/groups`);
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
