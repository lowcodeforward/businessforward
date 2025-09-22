const { body, param } = require('express-validator');

const createProductValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser positivo'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Estoque deve ser positivo')
];

const updateProductValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('name').optional().notEmpty().withMessage('Nome é obrigatório'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço deve ser positivo'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Estoque deve ser positivo')
];

module.exports = {
  createProductValidation,
  updateProductValidation
};
