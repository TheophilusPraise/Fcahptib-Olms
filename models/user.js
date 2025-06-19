import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    fullname: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: { notEmpty: true }
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: { isEmail: true, notEmpty: true }
    },
    password_hash: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: { notEmpty: true }
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'roles', key: 'id' }
    },
    matric_number: { 
      type: DataTypes.STRING, 
      allowNull: true,
      validate: { len: [0, 50] }
    },
    staff_id: { 
      type: DataTypes.STRING, 
      allowNull: true,
      validate: { len: [0, 50] }
    },
    reset_token: { type: DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: DataTypes.DATE, allowNull: true },
    profilePic: { 
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/uploads/profile_pics/default.png'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: false,
    indexes: [
      { unique: true, fields: ['email'], name: 'unique_user_email' },
      { unique: true, fields: ['matric_number'], name: 'unique_user_matric_number' },
      { unique: true, fields: ['staff_id'], name: 'unique_user_staff_id' }
    ]
  });

  // Association definitions
  User.associate = (models) => {
    // User belongs to Role
    User.belongsTo(models.Role, { foreignKey: 'role_id' });

    // User belongs to many Groups through UserGroup
    User.belongsToMany(models.Group, {
      through: models.UserGroup,
      foreignKey: 'userId',
      otherKey: 'groupId',
      as: 'groups',
    });

    // User has many UserGroup entries
    User.hasMany(models.UserGroup, { foreignKey: 'userId' });

    // User has many Chats (as participant)
    User.hasMany(models.Chat, {
      as: 'chats',
      foreignKey: 'participantId',
    });
  };
  return User;
};
