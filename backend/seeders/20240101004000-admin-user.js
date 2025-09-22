'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Administrador',
        email: 'admin@businessforward.com',
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@businessforward.com' });
  }
};
