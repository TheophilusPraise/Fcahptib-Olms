import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AdminLog = sequelize.define('AdminLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Add other fields as needed
  }, {
    tableName: 'admin_logs',
    timestamps: false,
  });

  return AdminLog;
};
