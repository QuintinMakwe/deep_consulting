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
    expirationtime: {
        type: Sequelize.BIGINT, 
        allowNull: false
    }, 
    qty: {
        type: Sequelize.INTEGER, 
        allowNull: false
    },
    soldqty: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        defaultValue: 0
    }, 
    state: {
        type: Sequelize.ENUM('sold', 'instock'),
        allowNull: true,
        defaultValue: "instock"
    } 
})



module.exports = Log;