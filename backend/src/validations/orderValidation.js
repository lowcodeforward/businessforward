const { body, param } = require('express-validator');

const createOrderValidation = [
  body('userId').optional().isUUID().withMessage('Usuário inválido'),
  body('items').isArray({ min: 1 }).withMessage('É necessário informar ao menos um item'),
  body('items.*.productId').isUUID().withMessage('Produto inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser pelo menos 1')
];

const updateOrderValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled']).withMessage('Status inválido')
];

module.exports = {
  createOrderValidation,
  updateOrderValidation
};
