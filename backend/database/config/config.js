<<<<<<< HEAD
module.exports ={
  "development": {
    "username": "root",
    "password":"ftcbp183",
    "database": "bd_service_desk_2.0",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password":"ftcbp183",
    "database": "bd_service_desk_2.0",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password":"ftcbp183",
    "database": "bd_service_desk_2.0",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
=======
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
     timezone: '-03:00'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
   dialect: process.env.DIALECT,
     timezone: '-03:00'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
     timezone: '-03:00'
  }
};
>>>>>>> versao2.1
