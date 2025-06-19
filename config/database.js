import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('olmsdatabase', 'OLMS', 'Theophilus@123', {
  host: 'localhost',
  dialect: 'mysql', // or your DB dialect
  logging: false,
});

export default sequelize;
