// models/studentDashboardData.js

export async function getCourseEnrollmentsForStudent(studentId) {
  return [
    { course_id: 1, course_title: 'Introduction to Computer Science', status: 'Enrolled', grade: 'A', lecturer: 'Dr. Jane Smith' },
    { course_id: 2, course_title: 'Calculus I', status: 'Completed', grade: 'B+', lecturer: 'Prof. John Doe' }
  ];
}

export async function getAssignmentsForStudent(studentId) {
  return [
    { id: 1, title: 'Essay on AI', due_date: '2025-06-15', status: 'Pending', grade: null },
    { id: 2, title: 'Math Homework', due_date: '2025-06-20', status: 'Submitted', grade: 'A-' }
  ];
}

export async function getAttendanceForStudent(studentId) {
  return [
    { lesson_id: 101, attended_at: '2025-06-01T09:00:00Z' },
    { lesson_id: 102, attended_at: '2025-06-05T09:00:00Z' }
  ];
}

export async function getBadgesForStudent(studentId) {
  return [
    { name: 'Top Performer', description: 'Awarded for excellent grades', icon_url: '/images/badges/top-performer.png' },
    { name: 'Perfect Attendance', description: 'No missed classes', icon_url: '/images/badges/perfect-attendance.png' }
  ];
}

export async function getMessagesForStudent(studentId) {
  return [
    { sender_id: 10, message: 'Don’t forget the assignment deadline!', created_at: '2025-06-07T14:00:00Z' },
    { sender_id: 15, message: 'Meeting rescheduled to Friday.', created_at: '2025-06-06T10:30:00Z' }
  ];
}

export async function getChatGroupsForStudent(studentId) {
  return [
    { group_name: 'Math Study Group', description: 'Group for calculus discussions' },
    { group_name: 'CS Project Team', description: 'Team for final year project' }
  ];
}
export async function getenrolledCoursesForStudent(studentId) {
  // Replace this mock data with a real DB query as needed
  return [
    { course_id: 1, course_title: 'Introduction to Computer Science', status: 'Enrolled', grade: 'A', lecturer: 'Dr. Jane Smith' },
    { course_id: 2, course_title: 'Calculus I', status: 'Completed', grade: 'B+', lecturer: 'Prof. John Doe' }
  ];
}


