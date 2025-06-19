'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_group_members', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      chatGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chat_groups', key: 'id' },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chat_group_members');
  }
};
