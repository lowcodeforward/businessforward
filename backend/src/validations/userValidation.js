const { body, param } = require('express-validator');

const createUserValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Perfil inválido')
];

const updateUserValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('name').optional().notEmpty().withMessage('Nome é obrigatório'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Perfil inválido')
];

module.exports = {
  createUserValidation,
  updateUserValidation
};
