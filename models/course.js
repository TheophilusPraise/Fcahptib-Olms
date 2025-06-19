import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      // Removed unique: true here to prevent automatic index creation
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lecturerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'courses',
    // Add named indexes here to prevent duplicates
    indexes: [
      {
        unique: true,
        name: 'unique_code', // Fixed name prevents duplicate indexes
        fields: ['code']
      }
    ]
  });

  // Add association to User (Lecturer)
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'Lecturer',
      foreignKey: 'lecturerId'
    });
    
    // Add students association (many-to-many)
    Course.belongsToMany(models.User, {
      through: 'CourseStudents',
      as: 'Students',
      foreignKey: 'courseId'
    });
  };

  return Course;
};
