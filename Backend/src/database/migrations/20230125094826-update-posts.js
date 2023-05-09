'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('posts', 'postBody', 'post_body');
    await queryInterface.renameColumn('posts', 'totalLikes', 'total_likes');
  },

  async down (queryInterface, Sequelize) {
    // return queryInterface.removeColumn(
    //   'posts',
    //   'postBody'
    // );
  }
};
