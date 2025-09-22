'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('products', [
      {
        id: uuidv4(),
        name: 'Plano Corporativo',
        description: 'Solução completa para empresas com suporte dedicado.',
        price: 499.9,
        stock: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Consultoria Premium',
        description: 'Consultoria estratégica para impulsionar negócios.',
        price: 799.0,
        stock: 25,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
