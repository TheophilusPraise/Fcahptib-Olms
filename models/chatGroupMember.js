import { DataTypes } from 'sequelize';

export default function ChatGroupMemberModel(sequelize) {
  return sequelize.define('ChatGroupMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chatGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'chat_group_members',
    timestamps: false
  });
}
