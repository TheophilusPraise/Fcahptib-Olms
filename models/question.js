import { DataTypes } from 'sequelize';

export default function QuestionModel(sequelize) {
  return sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING, // e.g., 'multiple-choice', 'true-false'
      allowNull: false
    }
  }, {
    tableName: 'questions',
    timestamps: true
  });
}
