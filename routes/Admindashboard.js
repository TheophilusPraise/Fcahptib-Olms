import express from 'express';
import { AdminLog, User, Course } from '../models/index.js'; // Sequelize models
import { authorizeRoles } from '../middleware/auth.js'; // Your role middleware

const router = express.Router();

router.get('/dashboard', authorizeRoles('admin'), async (req, res) => {
  try {
    // Fetch counts
    const totalUsers = await User.count();
   const studentRole = await Role.findOne({ where: { name: 'student' } });
const totalStudents = await User.count({ where: { role_id: studentRole.id } });
    const totalCourses = await Course.count();
    const openCourses = await Course.count({ where: { is_open: true } });

    // Recent admin logs (last 10)
    const recentLogs = await AdminLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 10,
      include: [{ model: User, as: 'adminUser', attributes: ['fullname', 'email'] }]
    });

    res.render('dashboard/admin', {
      title: 'Admin Dashboard',
      user: req.user,
      stats: {
        totalUsers,
        totalStudents,
        totalLecturers,
        totalCourses,
        openCourses
      },
      recentLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
