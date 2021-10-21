const Sequelize = require('sequelize');
const db = require('../config/postgres-db.config') 
const Product = require('./product.model');

const Log = db.define('log', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false
    }, 
    expirationTime: {
        type: Sequelize.BIGINT, 
        allowNull: false
    }, 
    qty: {
        type: Sequelize.INTEGER, 
        allowNull: false
    },
    soldQty: { 
        type: Sequelize.INTEGER, 
        allowNull: true
    }, 
    state: {
        type: Sequelize.ENUM('sold', 'instock'),
        allowNull: true
    } 
})



module.exports = Log;