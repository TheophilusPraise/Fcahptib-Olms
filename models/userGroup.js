import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserGroup = sequelize.define('UserGroup', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'groupmembers',
    timestamps: false,
    id: false,
  });

  UserGroup.associate = (models) => {
    UserGroup.belongsTo(models.User, { foreignKey: 'userId' });
    UserGroup.belongsTo(models.Group, { foreignKey: 'groupId' });
  };

  return UserGroup;
};
