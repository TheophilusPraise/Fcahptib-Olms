// routes/superLogs.js
import express from 'express';
import { DataTypes } from 'sequelize';
import { sequelize } from '../models/index.js';  // Correct relative path to models/index.js

const router = express.Router();

// Define SuperLog model (you can move this to a separate file if preferred)
const SuperLog = sequelize.define('SuperLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'super_logs',
  timestamps: false,
});

// Sync model with DB (create table if not exists)
await SuperLog.sync();

// Route to get all super logs
router.get('/', async (req, res) => {
  try {
    const logs = await SuperLog.findAll({
      order: [['timestamp', 'DESC']],
      limit: 100,
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching super logs:', error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
});

export default router;
