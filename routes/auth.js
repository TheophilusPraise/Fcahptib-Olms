import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import crypto from 'crypto';
import { User } from '../models/index.js'; // Adjust path if needed
import { Op } from 'sequelize';

const router = express.Router();

// Role mapping: adjust IDs to match your roles table
const ROLE_MAP = {
  student: 1,
  lecturer: 2,
  admin: 3
};

// Render registration form
router.get('/register', (req, res) => {
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

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { fullname, id, email, role, password, passwordConfirm } = req.body;

  if (!fullname || !id || !email || !role || !password || !passwordConfirm) {
    return res.render('auth/register', {
      error: ['Please fill in all fields'],
      successMessage: null,
      title: 'Register',
      fullname,
      id,
      email,
      role
    });
  }

  if (password !== passwordConfirm) {
    return res.render('auth/register', {
      error: ['Passwords do not match'],
      successMessage: null,
      title: 'Register',
      fullname,
      id,
      email,
      role
    });
  }

  const allowedRoles = ['student', 'lecturer', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.render('auth/register', {
      error: ['Invalid role selected'],
      successMessage: null,
      title: 'Register',
      fullname,
      id,
      email,
      role
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('auth/register', {
        error: ['Email already registered'],
        successMessage: null,
        title: 'Register',
        fullname,
        id,
        email,
        role
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password_hash: hashedPassword,
      role_id: ROLE_MAP[role],
      matric_number: role === 'student' ? id : null,
      staff_id: role !== 'student' ? id : null,
    });

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
      fullname,
      id,
      email,
      role
    });
  }
});

// Render login form
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: req.flash('error')
  });
});

// Handle login with Passport.js
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: true,
}), (req, res) => {
  if (req.user.role === 'student') return res.redirect('/dashboard/student');
  if (req.user.role === 'lecturer') return res.redirect('/dashboard/lecturer');
  if (req.user.role === 'admin') return res.redirect('/dashboard/admin');
  res.redirect('/dashboard');
});

// Render reset password request form
router.get('/reset-password', (req, res) => {
  res.render('auth/reset-password', {
    title: 'Reset Password',
    error: null,
    message: null,
    email: ''
  });
});

// Handle reset password request (generate token and show link)
router.post('/reset-password', async (req, res) => {
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
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    user.reset_token = token;
    user.reset_token_expiry = expiry;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;

    // Show reset link on page (no email sending)
    res.render('auth/reset-password', {
      title: 'Reset Password',
      error: null,
      message: [`Click <a href="${resetUrl}">here</a> to reset your password.`],
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
router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [Op.gt]: new Date() }
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

// Handle new password submission
router.post('/reset-password/:token', async (req, res) => {
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
      return res.render('auth/reset-password', {
        title: 'Reset Password',
        error: ['Invalid or expired token'],
        message: null,
        email: ''
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    res.redirect('/auth/login');
  } catch (err) {
    console.error('Reset password update error:', err);
    res.render('auth/reset-password-new', {
      title: 'Set New Password',
      error: ['Failed to reset password. Please try again.'],
      token
    });
  }
});

export default router;
