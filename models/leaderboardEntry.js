import { DataTypes } from 'sequelize';

export default function LeaderboardEntryModel(sequelize) {
  return sequelize.define('LeaderboardEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'leaderboard_entries',
    timestamps: false
  });
}
