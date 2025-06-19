import { DataTypes } from 'sequelize';

export default function QuizModel(sequelize) {
  return sequelize.define('Quiz', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    }
  }, {
    tableName: 'quizzes',
    timestamps: true
  });
}
