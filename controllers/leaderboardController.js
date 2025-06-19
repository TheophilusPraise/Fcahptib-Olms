const { Leaderboard, User } = require('../models');
exports.getLeaderboard = async (req, res) => {
  const leaderboard = await Leaderboard.findAll({ include: User, order: [['points', 'DESC']] });
  res.json(leaderboard);
};
