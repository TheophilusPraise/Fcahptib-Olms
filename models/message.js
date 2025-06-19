import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chatGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'text',
    }
  }, {
    tableName: 'messages',
    timestamps: true,
  });

  return Message;
};
