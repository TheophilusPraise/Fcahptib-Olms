'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('messages', 'messages_ibfk_185');
    } catch (error) {
      console.log('Constraint messages_ibfk_185 does not exist, skipping removal.');
    }

    await queryInterface.changeColumn('messages', 'chatGroupId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'chat_groups',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('messages', {
      fields: ['chatGroupId'],
      type: 'foreign key',
      name: 'messages_ibfk_185',
      references: {
        table: 'chat_groups',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('messages', 'messages_ibfk_185');
    } catch (error) {
      console.log('Constraint messages_ibfk_185 does not exist, skipping removal.');
    }

    await queryInterface.changeColumn('messages', 'chatGroupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'chat_groups',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('messages', {
      fields: ['chatGroupId'],
      type: 'foreign key',
      name: 'messages_ibfk_185',
      references: {
        table: 'chat_groups',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};
