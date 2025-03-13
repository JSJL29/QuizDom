const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER,    
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    dialect: 'mysql'            
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

module.exports = sequelize;