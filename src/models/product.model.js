const Sequelize = require('sequelize');
const db = require('../config/postgres-db.config') 

const Product = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    }, 
    name: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    qty: {
        type: Sequelize.INTEGER, 
        allowNull: false
    },
    lowestTime: {
        type: Sequelize.INTEGER, 
        allowNull: true
    }, 
})

module.exports = Product;