// models/courseEnrollment.js

// Sequelize model
export default (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'enrolled'
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  return Enrollment;
};

// Helper function (optional)
export async function getCourseEnrollmentsForStudent(studentId) {
  // Replace this mock data with real DB queries later
  return [
    { course_id: 1, course_title: 'Introduction to Computer Science', status: 'Enrolled', grade: 'A', lecturer: 'Eng. Timothy Dada' },
    { course_id: 2, course_title: 'Calculus I', status: 'Completed', grade: 'B+', lecturer: 'Prof. John Doe' }
  ];
}


