'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      chatGroupId: {
        type: Sequelize.INTEGER,
        allowNull: true,  // nullable because private messages won't have this
        references: { model: 'chat_groups', key: 'id' },
        onDelete: 'CASCADE'
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: true,  // nullable for group messages
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      content: {  // renamed from 'message' for clarity
        type: Sequelize.TEXT,
        allowNull: false
      },
      messageType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'text'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('messages');
  }
};
