const { Sequelize } = require('sequelize');
const {mySql} = require('./index');


const db = new Sequelize(`postgres://${mySql.MYSQL_DB_USERNAME}:${mySql.MYSQL_DB_PASSWORD}@${mySql.MYSQL_HOST}:${mySql.MYSQL_PORT}/${mySql.MYSQL_DB_NAME}`)

module.exports = db;