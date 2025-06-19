import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Chat = sequelize.define('Chat', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'chats',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'participantId'],
        name: 'unique_chat_pair'
      }
    ]
  });

  // Do NOT define associations here that reference other models directly.
  // Associations should be set up in models/index.js after all models are initialized.

  return Chat;
};
