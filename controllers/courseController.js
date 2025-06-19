const { Course } = require('../models');

exports.getAllCourses = async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
};

exports.createCourse = async (req, res) => {
  const { title, description, category, start_date, end_date } = req.body;
  const course = await Course.create({ title, description, category, start_date, end_date });
  res.status(201).json(course);
};
