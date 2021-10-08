const Sequelize = require('sequelize');
const db = require('../config/postgres-db.config') 
const Product = require('./product.model');

const Log = db.define('log', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    }, 
    expirationTime: {
        type: Sequelize.INTEGER, 
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

Log.belongsTo(Product);

module.exports = Log;