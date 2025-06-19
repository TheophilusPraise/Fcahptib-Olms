import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { ensureAuthenticated } from '../middleware/auth.js';
import { User, Role } from '../models/index.js'; // <-- Updated import

const router = express.Router();

// Multer config for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join('public', 'uploads', 'profile_pics');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET profile page (with settings)
router.get('/profile', ensureAuthenticated, async (req, res) => {
  // Fetch user with their role
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Role, attributes: ['name'] }]
  });

  // Pass the role name to the template as user.role
  res.render('profile', {
    user: {
      ...user.toJSON(),
      role: user.Role ? user.Role.name : ''
    },
    error: null,
    success: null
  });
});

// POST update email and password
router.post('/profile/update', ensureAuthenticated, async (req, res) => {
  const { email, currentPassword, newPassword, newPasswordConfirm } = req.body;
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Role, attributes: ['name'] }]
  });

  // Update email
  if (email && email !== user.email) {
    user.email = email;
  }

  // Update password
  if (currentPassword && newPassword) {
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.render('profile', {
        user: {
          ...user.toJSON(),
          role: user.Role ? user.Role.name : ''
        },
        error: 'Current password is incorrect.',
        success: null
      });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.render('profile', {
        user: {
          ...user.toJSON(),
          role: user.Role ? user.Role.name : ''
        },
        error: 'New passwords do not match.',
        success: null
      });
    }
    user.password_hash = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  // Refetch to get updated info and role
  const updatedUser = await User.findByPk(req.user.id, {
    include: [{ model: Role, attributes: ['name'] }]
  });
  res.render('profile', {
    user: {
      ...updatedUser.toJSON(),
      role: updatedUser.Role ? updatedUser.Role.name : ''
    },
    error: null,
    success: 'Profile updated successfully.'
  });
});

// POST update profile picture
router.post('/profile/picture', ensureAuthenticated, upload.single('profilePic'), async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Role, attributes: ['name'] }]
  });
  if (req.file) {
    user.profilePic = '/uploads/profile_pics/' + req.file.filename;
    await user.save();
    // Refetch to get updated info and role
    const updatedUser = await User.findByPk(req.user.id, {
      include: [{ model: Role, attributes: ['name'] }]
    });
    return res.render('profile', {
      user: {
        ...updatedUser.toJSON(),
        role: updatedUser.Role ? updatedUser.Role.name : ''
      },
      error: null,
      success: 'Profile picture updated.'
    });
  }
  // If no file was uploaded
  res.render('profile', {
    user: {
      ...user.toJSON(),
      role: user.Role ? user.Role.name : ''
    },
    error: 'No file uploaded.',
    success: null
  });
});

export default router;
