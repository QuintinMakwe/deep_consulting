'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    
      return Promise.all([
        queryInterface.dropTable('logs'),
        queryInterface.dropTable('products')
      ])
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

     return queryInterface.changeColumn('products', 'qty', { type: Sequelize.INTEGER});
  }
};
