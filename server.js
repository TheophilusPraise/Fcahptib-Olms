import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import httpModule from 'http';                    // [1]
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import flash from 'connect-flash';
import connectSessionSequelize from 'connect-session-sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { Meeting, sequelize, User } from './models/index.js';
import initializePassport from './config/passport.js';
import passport from 'passport';
import crypto from 'crypto';
import methodOverride from 'method-override';
import multer from 'multer';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import bbb from 'bigbluebutton-js';
import expressLayouts from 'express-ejs-layouts';
import { Strategy as LocalStrategy } from 'passport-local';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const BBB_URL    = process.env.BBB_URL;          
const BBB_SECRET = process.env.BBB_SECRET;      

const api     = bbb.api(BBB_URL, BBB_SECRET);    // [2]
const bbbHttp = bbb.http;                        // [2]

// Create HTTP server using Node.js module
const server = httpModule.createServer(app);     // [3]
import { Server as SocketIO } from 'socket.io';  // [4]
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


// Set view engine for EJS templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/css', express.static(path.join(process.cwd(), 'css')));
app.use('/js', express.static(path.join(process.cwd(), 'js')));

// Security middleware
app.use(helmet());
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session store backed by Sequelize
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  store: sessionStore,           // Ensure this is properly configured
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // false in dev, true in prod with HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  },
}));

// Passport initialization
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Correct middleware: Set user only if authenticated, else null
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.user = (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) ? req.user : null;
  next();
});


// Set a default activePage for all views to avoid undefined errors
app.use((req, res, next) => {
  res.locals.activePage = ''; // default empty string or you can set 'home'
  next();
});

// Role-based authorization middleware with improved checks and JSON response
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (typeof req.isAuthenticated !== 'function' || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }
    next();
  };
}

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}


// Import routes
import { checkRole } from './middleware/roleCheck.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import assignmentRoutes from './routes/assignments.js';
import admindashboard from './routes/Admindashboard.js';
import quizRoutes from './routes/quizzes.js';
import quizQuestionRoutes from './routes/quizQuestions.js';
import quizAnswerRoutes from './routes/quizAnswers.js';
import submissionRoutes from './routes/submissions.js';
import attendanceRoutes from './routes/attendance.js';
import badgeRoutes from './routes/badges.js';
import userBadgeRoutes from './routes/userBadges.js';
import chatRoutes from './routes/chat.js';
import chatGroupRoutes from './routes/chatGroups.js';
import groupMemberRoutes from './routes/groupMembers.js';
import messageRoutes from './routes/messages.js';
import messageAttachmentRoutes from './routes/messageAttachments.js';
import notificationRoutes from './routes/notifications.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminLogRoutes from './routes/adminLogs.js';
import lecturerLogRoutes from './routes/lecturerLogs.js';
import studentLogRoutes from './routes/studentLogs.js';
import superLogRoutes from './routes/superLogs.js';
import botRoutes from './routes/bots.js';
import aiRoutes from './routes/ai.js';
import routes from './routes/index.js';
import {  Course, Group, /* other models */ } from './models/index.js';
import { getCourseEnrollmentsForStudent } from './models/courseEnrollment.js'; 
import dashboardRouter from './routes/dashboard.js';
import studentRoutes from './routes/student.js';
import lecturerRoutes from './routes/lecturer.js';
import { Chat} from './models/index.js';  // adjust path as needed
import { UserGroup } from './models/index.js';
import { Message } from './models/index.js';
import GroupMember from './models/groupMember.js'; 
// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-questions', quizQuestionRoutes);
app.use('/api/quiz-answers', quizAnswerRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/user-badges', userBadgeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-groups', chatGroupRoutes);
app.use('/api/group-members', groupMemberRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/message-attachments', messageAttachmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/logs/admin', adminLogRoutes);
app.use('/api/logs/lecturer', lecturerLogRoutes);
app.use('/api/logs/student', studentLogRoutes);
app.use('/api/logs/super', superLogRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', admindashboard);
app.use('/auth', authRoutes);
app.use('/', studentRoutes);
app.use('/', dashboardRouter);
app.use('/', lecturerRoutes);


app.get('/', (req, res) => {
  res.render('index.ejs', { 
       title: 'Welcome',
    error: null,
    successMessage: null,
  });
});

// Later in the file:
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.ejs'));
});


// GET /auth/login - Render login page or redirect if already authenticated
app.get('/auth/login', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Redirect based on role
    const role = req.user.role;
    switch (role) {
      case 'admin':
        return res.redirect('/dashboard/admin');
      case 'lecturer':
        return res.redirect('/dashboard/lecturer');
      case 'student':
        return res.redirect('/dashboard/student');
      default:
        return res.redirect('/dashboard');
    }
  }
  // If not authenticated, render login page with flash error messages
  const flashErrors = req.flash('error');
  res.render('auth/login', {
    title: 'Login',
    error: flashErrors.length > 0 ? flashErrors : null
  });
});

// POST /auth/login - Authenticate user and handle errors
app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('auth/login', { 
        error: info.message || 'Invalid email or password. Please try again.', 
        user: null 
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      switch(user.role) {
        case 'admin':
          return res.redirect('/dashboard/admin');
        case 'lecturer':
          return res.redirect('/dashboard/lecturer');
        case 'student':
          return res.redirect('/dashboard/student');
        default:
          return res.redirect('/');
      }
    });
  })(req, res, next);
});

// server.js (Updated Routes)

  const getAvailableCourses = async (studentId) => {
  return await Course.findAll({
    include: [{
      model: User,
      as: 'Lecturer',
      attributes: ['id', 'fullname'] // Use 'fullname'
    }],
    where: {
      id: {
        [Op.notIn]: literal(
          `(SELECT courseId FROM Enrollments WHERE userId = ${studentId})`
        )
      }
    }
  });
};

app.get('/dashboard/lecturer', ensureAuthenticated, async (req, res) => {
  try {
    // Only allow lecturers to access this dashboard
    if (req.user.role !== 'lecturer') {
      return res.status(403).send('Unauthorized');
    }

    // Fetch courses for the current lecturer, with student counts
    const courses = await Course.findAll({
      where: { lecturerId: req.user.id },
      include: [{
        model: User,
        as: 'Students', // Ensure this matches your association
        attributes: [],
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'title',
        'description',
        'category',
        'start_date',
        'end_date',
        [Sequelize.fn('COUNT', Sequelize.col('Students.id')), 'studentCount']
      ],
      group: [
        'Course.id',
        'Course.title',
        'Course.description',
        'Course.category',
        'Course.start_date',
        'Course.end_date'
      ]
    });

    // Render the dashboard with all relevant data
    res.render('dashboard/lecturer', {
      user: req.user,
      title: 'Lecturer Dashboard',
      activePage: 'lecturer-dashboard',
      courses: courses.map(c => ({
        id: c.id,
        name: c.title,
        description: c.description,
        category: c.category,
        start_date: c.start_date,
        end_date: c.end_date,
        lecturerId: c.lecturerId,
        studentCount: c.get('studentCount')
      })),
      success: req.flash ? req.flash('success') : (req.query.success || null),
      error: req.flash ? req.flash('error') : (req.query.error || null)
    });
  } catch (error) {
    console.error('Lecturer dashboard error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/lecturer/courses/:id', ensureAuthenticated, async (req, res) => {
  try {
    const courseId = req.params.id;
    // Optionally, check if req.user is the course's lecturer
    await Course.update(
      {
        title: req.body.title,
        code: req.body.code,
        description: req.body.description,
        category: req.body.category,
        start_date: req.body.start_date,
        end_date: req.body.end_date
      },
      { where: { id: courseId, lecturerId: req.user.id } }
    );
    req.flash('success', 'Course updated successfully!');
    res.redirect('/dashboard/lecturer');
  } catch (error) {
    console.error('Error updating course:', error);
    req.flash('error', 'Failed to update course.');
    res.redirect('/dashboard/lecturer');
  }
});



// Route for register page
app.get('/auth/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null,
    successMessage: null,
    fullname: '',
    id: '',
    email: '',
    role: ''
  });
});

// Reset password request page (GET)
app.get('/auth/reset-password', (req, res) => {
  res.render('auth/reset-password', {
    title: 'Reset Password',
    error: null,
    message: null,
    email: ''
  });
});

// Reset password POST route (send reset link)
app.post('/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.render('auth/reset-password', {
      title: 'Reset Password',
      error: ['Please enter your email'],
      message: null,
      email
    });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/reset-password', {
        title: 'Reset Password',
        error: ['No account found with that email'],
        message: null,
        email
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour expiry

    user.reset_token = token;
    user.reset_token_expiry = expiry;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    res.render('auth/reset-password', {
      title: 'Reset Password',
      error: null,
      message: `Click <a href="${resetUrl}">here</a> to reset your password.`,
      email: ''
    });
  } catch (err) {
    console.error('Reset password request error:', err);
    res.render('auth/reset-password', {
      title: 'Reset Password',
      error: ['Failed to generate reset link'],
      message: null,
      email
    });
  }
});

// Render new password form if token is valid
app.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.render('auth/reset-password', {
        title: 'Reset Password',
        error: ['Invalid or expired token'],
        message: null,
        email: ''
      });
    }

    res.render('auth/reset-password-new', {
      title: 'Set New Password',
      error: null,
      token
    });
  } catch (err) {
  console.error('Reset password token error:', err);
  res.render('auth/reset-password', {
    title: 'Reset Password',
    error: ['An error occurred'],
    message: null,
    email: ''
  });
}
});
// POST route to handle new password submission with token in URL
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return res.render('auth/reset-password-new', {
      title: 'Set New Password',
      error: ['Please fill in all fields'],
      token
    });
  }

  if (password !== passwordConfirm) {
    return res.render('auth/reset-password-new', {
      title: 'Set New Password',
      error: ['Passwords do not match'],
      token
    });
  }
  try {
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.render('auth/reset-password-result', {
        success: false,
        message: 'Invalid or expired token. Please try setting your password again.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    user.reset_token = null;
    user.reset_token_expiry = null;

    await user.save();

    return res.render('auth/reset-password-result', {
      success: true,
      message: 'Password changed successfully! You will be redirected to login shortly.'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return res.render('auth/reset-password-result', {
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
  
});


app.post('/groups/create', async (req, res) => {
  try {
    const { groupName, courseId } = req.body;
    if (!groupName || !courseId) {
      return res.status(400).send('Group name and courseId are required.');
    }
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.redirect('/messaging?error=Selected course does not exist.');
    }
    
    // Create group
    const group = await Group.create({ name: groupName, courseId });
    
    // Determine role based on user type
    const role = req.user.role === 'lecturer' ? 'lecturer' : 'student';
    
    await GroupMember.create({
      userId: req.user.id,
      groupId: group.id,
      role: role
    });
    
    res.redirect('/messaging?success=Group created');
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Registration POST route with success message and title
app.post('/auth/register', async (req, res) => {
  const { fullname, id, email, role, password, passwordConfirm } = req.body;
  // Basic validation
  if (!fullname || !id || !email || !role || !password || !passwordConfirm) {
    return res.render('auth/register', {
      error: ['Please fill in all fields'],
      successMessage: null,
      title: 'Register',
      fullname, id, email, role
    });
  }

  if (password !== passwordConfirm) {
    return res.render('auth/register', {
      error: ['Passwords do not match'],
      successMessage: null,
      title: 'Register',
      fullname, id, email, role
    });
  }

  // Validate role
  const allowedRoles = ['student', 'lecturer', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.render('auth/register', {
      error: ['Invalid role selected'],
      successMessage: null,
      title: 'Register',
      fullname, id, email, role
    });
  }
  try {
    // Check if user already exists by email or id
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { email },
          { matric_number: role === 'student' ? id : null },
          { staff_id: role !== 'student' ? id : null }
        ]
      }
    });

    if (existingUser) {
      return res.render('auth/register', {
        error: ['User with this email or ID already exists'],
        successMessage: null,
        title: 'Register',
        fullname, id, email, role
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user record
    await User.create({
      fullname,
      email,
      password_hash: hashedPassword,
      role,
      matric_number: role === 'student' ? id : null,
      staff_id: role !== 'student' ? id : null,
    });

    // Show success message on registration page
    const successMessage = `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`;
    res.render('auth/register', {
      error: null,
      successMessage,
      title: 'Register',
      fullname: '',
      id: '',
      email: '',
      role: ''
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.render('auth/register', {
      error: ['Registration failed. Please try again.'],
      successMessage: null,
      title: 'Register',
      fullname, id, email, role
    });
  }
});

app.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) { // fix here
    return res.redirect('/auth/login');
  }

  const { role, id: userId } = req.user;
  console.log('User accessing dashboard:', req.user);

  try {
    if (role === 'student') {
      // ... student data fetch and render
    } else if (role === 'lecturer') {
      // ... lecturer data fetch and render
    } else if (role === 'admin') {
      // ... admin data fetch and render
    } else {
      res.status(403).send('Unauthorized');
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Lecturer messages route
app.get('/lecturer/messages', checkRole(['lecturer']), async (req, res) => {
  try {
    // Fetch courses taught by the lecturer
    const courses = await Course.findAll({ where: { lecturerId: req.user.id } });
    const courseIds = courses.map(course => course.id);

    // Fetch groups for these courses including members with profilePic
const groups = await Group.findAll({
  where: { courseId: courseIds },
  include: [{
    model: User,
    as: 'members',  // Must match association alias in Group model
    attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
  }],
});


    // Fetch all users except the current user for private messaging
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'fullname', 'email', 'profilePic'],
      order: [['fullname', 'ASC']],
    });

    // Placeholder arrays for chat data; replace with real queries as needed
    const privateChats = allUsers.map(u => ({
      id: u.id,
      participantName: u.fullname || u.email,
      participantProfilePic: u.profilePic
    }));

    const privateMessages = [];
    const groupMessages = [];

    // Fetch all meetings (for all lecturers)
    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']]
    });

    const selectedRecipientId = req.query.selectedRecipientId || '';
    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('lecturer/messages', {
      user: req.user,
      activePage: 'lecturer-groups',
      groups,
      courses,
      allUsers,
      privateChats,
      privateMessages,
      groupMessages,
      selectedRecipientId,
      meetings, // Pass meetings array
      success,
      error
    });
  } catch (error) {
    console.error('Error fetching lecturer messages:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Private message sending route
app.post('/messages/private/send', async (req, res) => {
  try {
    // Save message to DB logic here...
    // After successful save:
    res.redirect('/messaging?success=Message+sent+successfully');
  } catch (err) {
    console.error(err);
    res.redirect('/messaging?error=Failed+to+send+message');
  }
});

// Student messages route
app.get('/student/messages', checkRole(['student']), async (req, res) => {
  try {
    // Get recipient ID from query parameters
    const selectedRecipientId = req.query.selectedRecipientId || null;
    const selectedGroupId = req.query.groupId || null;

    // Fetch courses the student is enrolled in
    const courses = await Course.findAll({
      include: [{
        model: UserCourse,
        where: { userId: req.user.id }
      }]
    });
    const courseIds = courses.map(course => course.id);

    // Fetch groups for these courses including their members with profilePic
   const groups = await Group.findAll({
  where: { courseId: courseIds },
  include: [{
    model: User,
    as: 'members',  // Must match association alias in Group model
    attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
  }],
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

    // Pass success and error messages from query parameters
    const success = req.query.success || null;
    const error = req.query.error || null;
console.log('selectedRecipientId:', selectedRecipientId);

    // Render the messaging page with all data
    res.render('student/messages', {
      user: req.user,
      activePage: 'student-messages',
      groups,
      courses,
      allUsers,
      privateChats,
      privateMessages,
      groupMessages,
      selectedRecipientId,  // Now properly defined
      selectedGroupId,
      Meeting,
      success,
      error
    });
  } catch (err) {
    console.error('Error fetching student messages:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/messages', checkRole(['admin']), async (req, res) => {
  try {
    // Fetch all courses (or all relevant data)
    const courses = await Course.findAll();

    // Fetch all groups with members
const groups = await Group.findAll({
  where: { courseId: courseIds },
  include: [{
    model: User,
    as: 'members',  // Must match association alias in Group model
    attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
  }],
});

    // Fetch all users except current admin for messaging
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'fullname', 'email'],
      order: [['fullname', 'ASC']],
    });

    // Placeholder chat data; replace with real queries
    const privateChats = [];
    const privateMessages = [];
    const groupMessages = [];

    const selectedRecipientId = req.query.selectedRecipientId || '';

    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('admin/messages', {
      user: req.user,
      activePage: 'admin-messages',
      groups,
      courses,
      allUsers,
      privateChats,
      privateMessages,
      groupMessages,
      selectedRecipientId,
      success,
      error,
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'id', // matches your login form input name
    passwordField: 'password'
  },
  async (id, password, done) => {
    try {
      // Find user by matric_number or staff_id
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { matric_number: id },
            { staff_id: id }
          ]
        }
      });

      if (!user) {
        // User not found
        return done(null, false, { message: 'Incorrect ID or password.' });
      }

      // Validate password using bcrypt
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return done(null, false, { message: 'Incorrect ID or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Role, attributes: ['name'] }]
    });
    if (!user) return done(null, false);
    user.role = user.Role ? user.Role.name : null;
    done(null, user);
  } catch (err) {
    done(err);
  }
});
// --- Multer File Upload Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/messages/'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });




app.get('/chat/:chatId', async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user.id;
    // Find chat participants (assuming a 1-1 chat)
    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participant', attributes: ['id', 'fullname', 'profilePic'] }
      ]
    });
    if (!chat) return res.status(404).send('Chat not found');

    // Fetch messages for this chat
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: chat.participant.id },
          { senderId: chat.participant.id, receiverId: userId }
        ]
      },
      include: [{ model: User, as: 'sender', attributes: ['id', 'fullname', 'profilePic'] }],
      order: [['createdAt', 'ASC']]
    });

    res.render('chat', {
      chatId,
      chat,
      messages,
      currentUser: req.user
    });
  } catch (error) {
    console.error('Error loading chat:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --- Real-time Chat (Socket.io) Integration ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User authentication for socket
  socket.on('authenticate', (userData) => {
    socket.userId = userData.userId;
    socket.username = userData.username;
    socket.join(`user:${socket.userId}`);
    console.log(`User ${socket.username} authenticated`);
  });

  // Join a private chat (room is user:<userId>)
  socket.on('joinPrivateChat', ({ otherUserId }) => {
    socket.join(`user:${otherUserId}`);
  });

  // Private message (text, file, voice, etc.)
  socket.on('privateMessage', async (data) => {
    const receiverRoom = `user:${data.receiverId}`;
    // Save message to DB as needed
    const savedMessage = await Message.create({
      senderId: socket.userId,
      receiverId: data.receiverId,
      content: data.content,
      messageType: data.messageType || 'text',
      fileName: data.fileName || null,
      createdAt: new Date()
    });
    io.to(receiverRoom).emit('newPrivateMessage', {
      ...data,
      senderId: socket.userId,
      senderName: socket.username,
      timestamp: new Date()
    });
    socket.emit('newPrivateMessage', {
      ...data,
      senderId: socket.userId,
      senderName: socket.username,
      timestamp: new Date()
    });
  });

  // File message (for file attachments)
  socket.on('fileMessage', (data) => {
    const receiverRoom = `user:${data.receiverId}`;
    io.to(receiverRoom).emit('newPrivateMessage', {
      ...data,
      senderId: socket.userId,
      senderName: socket.username,
      timestamp: new Date()
    });
    socket.emit('newPrivateMessage', {
      ...data,
      senderId: socket.userId,
      senderName: socket.username,
      timestamp: new Date()
    });
  });

  // Video call signaling (WebRTC)
  socket.on('callUser', (data) => {
    io.to(`user:${data.userToCall}`).emit('incomingCall', {
      signal: data.signalData,
      from: socket.userId,
      name: socket.username
    });
  });

  socket.on('answerCall', (data) => {
    io.to(`user:${data.to}`).emit('callAccepted', data.signal);
  });

  // Group chat join and messaging
  socket.on('joinGroup', async ({ groupId }) => {
    socket.join(groupId);
    try {
      const messages = await Message.findAll({
        where: { chatGroupId: groupId },
        include: [{ model: User, as: 'sender', attributes: ['fullname'] }],
        order: [['createdAt', 'ASC']]
      });
      socket.emit('previousMessages', messages);
    } catch (error) {
      socket.emit('error', { message: 'Failed to load messages.' });
    }
  });

  socket.on('sendMessage', async ({ groupId, message, senderId, messageType }) => {
    try {
      const savedMessage = await Message.create({
        chatGroupId: groupId,
        senderId,
        content: message,
        messageType: messageType || 'text',
        createdAt: new Date()
      });
      const sender = await User.findByPk(senderId);
      io.to(groupId).emit('receiveMessage', {
        id: savedMessage.id,
        chatGroupId: groupId,
        senderId,
        senderName: sender ? sender.fullname : 'Unknown',
        content: message,
        messageType: savedMessage.messageType,
        createdAt: savedMessage.createdAt
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.userId) {
      socket.broadcast.emit('userOffline', {
        userId: socket.userId,
        timestamp: new Date()
      });
    }
  });
});
// ... (previous code remains unchanged until messaging endpoints)

// --- Messaging Endpoints ---

// File upload for private messages
app.post('/messages/private/upload', upload.array('files'), async (req, res) => {
  try {
    const selectedRecipientId = req.body.selectedRecipientId;
    const userId = req.user.id;
    const files = req.files;
    for (const file of files) {
      await Message.create({
        senderId: userId,
        receiverId: selectedRecipientId,
        content: `/uploads/messages/${file.filename}`,
        messageType: 'file',
        fileName: file.originalname,
      });
    }
    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.get('/messaging', checkRole(['lecturer', 'student', 'admin']), async (req, res) => {
  try {
    const { selectedRecipientId, groupId } = req.query;
    // Fetch all users except current user
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'fullname', 'email', 'profilePic'],
      order: [['fullname', 'ASC']],
    });

    // Fetch private chats
    const privateChats = await Chat.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { participantId: req.user.id }
        ]
      },
      include: [{
        model: User,
        as: 'participant',
        attributes: ['id', 'fullname', 'profilePic']
      }]
    });

    // Fetch private messages (if recipient selected)
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

    // Get course IDs based on user role
    let courseIds = [];
    if (req.user.role === 'student') {
      const courses = await Course.findAll({
        include: [{
          model: UserCourse,
          where: { userId: req.user.id }
        }]
      });
      courseIds = courses.map(course => course.id);
    } else if (req.user.role === 'lecturer') {
      const courses = await Course.findAll({ 
        where: { lecturerId: req.user.id } 
      });
      courseIds = courses.map(course => course.id);
    }

    // Fetch groups and their members
    const groups = await Group.findAll({
      where: courseIds.length > 0 ? { courseId: { [Op.in]: courseIds } } : {},
      include: [{
        model: User,
        as: 'members',
        attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
      }]
    });

    // Fetch group messages (if group selected)
    let groupMessages = [];
    if (groupId) {
      groupMessages = await Message.findAll({
        where: { chatGroupId: groupId },
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'fullname', 'profilePic']
        }],
        order: [['createdAt', 'ASC']]
      });
    }

    // Fetch managed groups (optional, for lecturer/student)
    let managedGroups = [];
    if (['lecturer', 'student'].includes(req.user.role)) {
      managedGroups = await Group.findAll({
        where: courseIds.length > 0 ? { courseId: { [Op.in]: courseIds } } : {},
        include: [{
          model: User,
          as: 'members',
          attributes: ['id', 'fullname', 'matric_number', 'profilePic']
        }]
      });
    }

    // Fetch courses for group creation dropdown
    const courses = await Course.findAll();

    // Fetch meetings
    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Render the messaging page with all data
    res.render('messaging', {
      user: req.user,
      allUsers,
      privateChats: privateChats.map(chat => ({
        id: chat.participant.id,
        participantName: chat.participant.fullname,
        participantDp: chat.participant.profilePic,
      })),
      privateMessages: privateMessages.map(msg => ({
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.fullname,
        senderDp: msg.sender.profilePic,
        createdAt: msg.createdAt,
        messageType: msg.messageType,
        fileName: msg.fileName
      })),
      groups: groups.map(group => ({
        id: group.id,
        name: group.name,
        groupDp: group.profilePic,
        members: group.members.map(m => ({
          id: m.id,
          name: m.fullname,
          matricNo: m.matric_number,
          profilePic: m.profilePic
        }))
      })),
      groupMessages: groupMessages.map(msg => ({
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.fullname,
        senderDp: msg.sender.profilePic,
        createdAt: msg.createdAt,
        messageType: msg.messageType,
        fileName: msg.fileName
      })),
      managedGroups: managedGroups.map(group => ({
        id: group.id,
        name: group.name,
        groupDp: group.profilePic,
        members: group.members.map(m => ({
          id: m.id,
          name: m.fullname,
          matricNo: m.matric_number,
          profilePic: m.profilePic
        }))
      })),
      courses,
      meetings,
      selectedRecipientId: selectedRecipientId || '',
      selectedGroupId: groupId || '',
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error('Error loading messaging page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// File upload for group messages
app.post('/messages/group/upload', upload.array('files'), async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.user.id;
    const files = req.files;
    for (const file of files) {
      await Message.create({
        senderId: userId,
        chatGroupId: groupId,
        content: `/uploads/messages/${file.filename}`,
        messageType: 'file',
        fileName: file.originalname,
      });
    }
    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (err) {
    console.error('Group file upload error:', err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get group messages
app.get('/groups/:groupId/messages', checkRole(['lecturer', 'student', 'admin']), async (req, res) => {
  const { groupId } = req.params;
  const messages = await Message.findAll({
    where: { chatGroupId: groupId },
    include: [{ model: User, as: 'sender', attributes: ['id', 'fullname', 'profilePic'] }],
    order: [['createdAt', 'ASC']],
  });
  res.json(messages);
});

// Get private messages
app.get('/private/:otherUserId/messages', checkRole(['lecturer', 'student', 'admin']), async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.otherUserId, 10);
  
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    include: [{ model: User, as: 'sender', attributes: ['id', 'fullname', 'profilePic'] }],
    order: [['createdAt', 'ASC']],
  });
  res.json(messages);
});
// Messaging page (render EJS)
app.get('/messaging', checkRole(['lecturer', 'student', 'admin']), async (req, res) => {
  try {
    const { selectedRecipientId, groupId } = req.query;
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'fullname', 'email', 'profilePic'],
      order: [['fullname', 'ASC']],
    });

    const privateChats = await Chat.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { participantId: req.user.id }
        ]
      },
      include: [{
        model: User,
        as: 'participant',
        attributes: ['id', 'fullname', 'profilePic']
      }]
    });

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

    // Get course IDs based on user role
    let courseIds = [];
    if (req.user.role === 'student') {
      const courses = await Course.findAll({
        include: [{
          model: UserCourse,
          where: { userId: req.user.id }
        }]
      });
      courseIds = courses.map(course => course.id);
    } else if (req.user.role === 'lecturer') {
      const courses = await Course.findAll({ 
        where: { lecturerId: req.user.id } 
      });
      courseIds = courses.map(course => course.id);
    }

    const groups = await Group.findAll({
      where: courseIds.length > 0 ? { courseId: { [Op.in]: courseIds } } : {},
      include: [{
        model: User,
        as: 'members',
        attributes: ['id', 'fullname', 'matric_number', 'email', 'profilePic']
      }]
    });

    let groupMessages = [];
    if (groupId) {
      groupMessages = await Message.findAll({
        where: { chatGroupId: groupId },
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'fullname', 'profilePic']
        }],
        order: [['createdAt', 'ASC']]
      });
    }

    let managedGroups = [];
    if (['lecturer', 'student'].includes(req.user.role)) {
      managedGroups = await Group.findAll({
        where: courseIds.length > 0 ? { courseId: { [Op.in]: courseIds } } : {},
        include: [{
          model: User,
          as: 'members',
          attributes: ['id', 'fullname', 'matric_number', 'profilePic']
        }]
      });
    }

    // Fetch courses for the group creation dropdown
    const courses = await Course.findAll();

    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('messaging', {
      user: req.user,
      allUsers,
      privateChats: privateChats.map(chat => ({
        id: chat.participant.id,
        participantName: chat.participant.fullname,
        participantDp: chat.participant.profilePic,
      })),
      privateMessages: privateMessages.map(msg => ({
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.fullname,
        senderDp: msg.sender.profilePic,
        createdAt: msg.createdAt,
        messageType: msg.messageType,
        fileName: msg.fileName
      })),
      groups: groups.map(group => ({
        id: group.id,
        name: group.name,
        groupDp: group.profilePic
      })),
      groupMessages: groupMessages.map(msg => ({
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.fullname,
        senderDp: msg.sender.profilePic,
        createdAt: msg.createdAt,
        messageType: msg.messageType,
        fileName: msg.fileName
      })),
      managedGroups: managedGroups.map(group => ({
        id: group.id,
        name: group.name,
        groupDp: group.profilePic,
        members: group.members.map(m => ({
          id: m.id,
          name: m.fullname,
          matricNo: m.matric_number,
          profilePic: m.profilePic
        }))
      })),
      courses,
      meetings, // Pass meetings as a top-level property
      selectedRecipientId: selectedRecipientId || '',
      selectedGroupId: groupId || '',
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error('Error loading messaging page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ... (remaining code remains unchanged)

app.post('/lecturer/courses', async (req, res) => {
  try {
    // Extract data from request body
    const { title, code, category, start_date, description, end_date } = req.body; // Adjust fields as needed

    // Create a new course in the database
    const newCourse = await Course.create({
      title,
      code,
      category,
      start_date,
      description,
      end_date,
       lecturerId: req.user.id 
    });

    // Respond with success
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/dashboard/student', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch enrolled courses for the student
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Course,
        include: [{ model: User, as: 'Lecturer', attributes: ['fullname'] }]
      }]
    });

    // Transform data for EJS
    const enrolledCourses = enrollments.map(e => ({
      id: e.Course.id,
      name: e.Course.title,
      lecturerFullname: e.Course.Lecturer?.fullname || 'Unknown Lecturer',
      status: e.status || 'Enrolled',
      grade: e.grade || 'N/A'
    }));

    res.render('dashboard/student', {
      user: req.user,
     enrolledCourses: enrolledCourses || [],
     selectedRecipientId: selectedRecipientId || [],
      // ...other variables as needed
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve your static files or routes here
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.get('/lecturer/courses/:id/students', ensureAuthenticated, async (req, res) => {
  const courseId = req.params.id;
  // Fetch students for this course (adjust as needed for your associations)
  const course = await Course.findByPk(courseId, {
    include: [{
      model: User,
      as: 'Students'
    }]
  });
  if (!course) return res.status(404).send('Course not found');
  res.render('lecturer/course_students', {
    course,
    students: course.Students
  });
});

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// BigBlueButton meeting creation route
app.post('/meetings/create', ensureAuthenticated, authorizeRoles('lecturer', 'student'), async (req, res) => {
  const { name, duration } = req.body;
  const meetingID = `m${Date.now()}`;
  const attendeePW = crypto.randomBytes(4).toString('hex');
  const moderatorPW = crypto.randomBytes(4).toString('hex');

  try {
    const url = api.administration.create(name, meetingID, {
      attendeePW,
      moderatorPW,
      duration: duration || 60,
      welcome: `Welcome to ${name}`
    });
    const result = await bbbHttp(url);

    if (result.returncode === 'SUCCESS') {
      await Meeting.create({
        meetingId: meetingID,
        name,
        attendeePassword: attendeePW,
        moderatorPassword: moderatorPW,
        duration: duration || 60
      });
      req.flash('success', 'Meeting created successfully');
    } else {
      req.flash('error', 'Failed to create meeting');
    }
  } catch (error) {
    console.error('BBB create error:', error);
    req.flash('error', 'Error creating meeting');
  }
  res.redirect('/dashboard');
});
app.get('/meetings/join', ensureAuthenticated, async (req, res) => {
  const { id, role } = req.query;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      req.flash('error', 'Meeting not found');
      return res.redirect('/dashboard');
    }
    const pw = role === 'moderator' ? meeting.moderatorPassword : meeting.attendeePassword;
    const joinUrl = api.administration.join(req.user.fullname, meeting.meetingId, pw);
    res.redirect(joinUrl);
  } catch (error) {
    console.error('Join meeting error:', error);
    req.flash('error', 'Error joining meeting');
    res.redirect('/dashboard');
  }
});

// Delete a meeting
app.delete('/meetings/:id', ensureAuthenticated, authorizeRoles('lecturer', 'student'), async (req, res) => {
  const { id } = req.params;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      req.flash('error', 'Meeting not found');
      return res.redirect('/dashboard');
    }
    await meeting.destroy();
    req.flash('success', 'Meeting deleted successfully');
  } catch (err) {
    console.error('Error deleting meeting:', err);
    req.flash('error', 'Failed to delete meeting');
  }
  res.redirect('/dashboard');
});

app.post('/send-message', async (req, res) => {
  try {
    const { content, receiverId, messageType = 'text', chatGroupId = null } = req.body;
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      chatGroupId,
      messageType,
      content,
    });
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Message not saved' });
  }
});

// DELETE route to remove group members
app.delete('/groups/:groupId/members/:memberId', async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    
    // Check permissions
    const isAdminOrLecturer = await GroupMember.findOne({
      where: {
        groupId: parseInt(groupId),
        userId: req.user.id,
        role: ['lecturer', 'admin']
      }
    });

    if (!isAdminOrLecturer) {
      return res.status(403).send('Permission denied');
    }

    // Remove member
    await GroupMember.destroy({
      where: {
        groupId: parseInt(groupId),
        userId: parseInt(memberId)
      }
    });

    res.redirect('back');
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route to remove a group
app.delete('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Check permissions
    const isAdminOrLecturer = await GroupMember.findOne({
      where: {
        groupId: parseInt(groupId),
        userId: req.user.id,
        role: ['lecturer', 'admin']
      }
    });

    if (!isAdminOrLecturer) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Delete group (cascade handled by association)
    await Group.destroy({
      where: { id: parseInt(groupId) }
    });

    res.redirect('/messaging?success=Group deleted');
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Start server and connect to DB
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully.');
    
    // Disable dangerous auto-alter in production
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false }
      : { alter: false }; // Disable for development too for safety

    await sequelize.sync(syncOptions);
    console.log('Database tables synchronized');
    console.log(`Server running on port http://localhost:${PORT}/`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
