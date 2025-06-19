import dotenv from 'dotenv';
dotenv.config();
console.log('DB ENV:', process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_HOST);
