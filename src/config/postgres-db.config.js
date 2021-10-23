const { Sequelize } = require('sequelize');
const {mySql} = require('./index');


// const db = new Sequelize(`postgres://${mySql.MYSQL_DB_USERNAME}:${mySql.MYSQL_DB_PASSWORD}@${mySql.MYSQL_HOST}:${mySql.MYSQL_PORT}/${mySql.MYSQL_DB_NAME}`)

const db = new Sequelize(`${mySql.MYSQL_DB_NAME}`, `${mySql.MYSQL_DB_USERNAME}`, `${mySql.MYSQL_DB_PASSWORD}`, {
    host: `${mySql.MYSQL_HOST}`, 
    dialect: 'postgres',
    dialectOptions: {
        multipleStatements: true
    }
})

module.exports = db;