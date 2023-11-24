'use strict';
const fs= require('fs')
const bcryptjs = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let salt = bcryptjs.genSaltSync(8)

    let data = JSON.parse(fs.readFileSync('./data/dataUser.json', 'utf-8'))
    .map(el =>{
     el.password = bcryptjs.hashSync(`${el.password}`,salt)
     el.createdAt = new Date()
     el.updatedAt = new Date()
     return el
    })
    await queryInterface.bulkInsert('Users', data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
   await queryInterface.bulkDelete('Users', null, {})

  }
};
