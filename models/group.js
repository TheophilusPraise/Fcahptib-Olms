import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Group extends Model {}

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true,
  });

  Group.associate = (models) => {
    Group.belongsTo(models.Course, { foreignKey: 'courseId' });
// models/index.js or models/group.js
Group.belongsToMany(User, { through: UserGroup, as: 'members', foreignKey: 'groupId', otherKey: 'userId' });
User.belongsToMany(Group, { through: UserGroup, as: 'groups', foreignKey: 'userId', otherKey: 'groupId' });

    Group.hasMany(models.UserGroup, { foreignKey: 'groupId' });
  };

  return Group;
};
