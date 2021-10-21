const Sequelize = require('sequelize');
const db = require('../config/postgres-db.config') 
const Log = require('./log.model');

const Product = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false
    }, 
    name: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
    }, 
    qty: {
        type: Sequelize.INTEGER, 
        allowNull: false
    },
    lowestTime: {
        type: Sequelize.BIGINT, 
        allowNull: false
    }, 
})


Product.hasMany(Log, { foreignKey: { allowNull: false}});
Log.belongsTo(Product);

module.exports = Product;