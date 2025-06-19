'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leaderboard_entries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      totalScore: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      rank: { type: Sequelize.INTEGER, allowNull: true }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('leaderboard_entries');
  }
};
