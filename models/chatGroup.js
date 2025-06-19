import { DataTypes } from 'sequelize';

export default function ChatGroupModel(sequelize) {
  return sequelize.define('ChatGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'chat_groups',
    timestamps: true
  });
}
