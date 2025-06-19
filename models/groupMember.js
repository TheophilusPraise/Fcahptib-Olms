import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const GroupMember = sequelize.define('GroupMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'groupmembers',
    timestamps: true,
  });

  return GroupMember;
};
