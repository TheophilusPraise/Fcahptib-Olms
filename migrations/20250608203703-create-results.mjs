'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('results', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quizzes', key: 'id' },
        onDelete: 'CASCADE'
      },
      score: { type: Sequelize.FLOAT, allowNull: false },
      completedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('results');
  }
};
