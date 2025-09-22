const express = require('express');
const orderController = require('../controllers/orderController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createOrderValidation, updateOrderValidation } = require('../validations/orderValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestão de pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Listar pedidos (admin vê todos, usuário vê seus)
 *     security:
 *       - bearerAuth: []
 */
router.get('/', orderController.list);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obter pedido
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', orderController.getById);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Criar pedido
 *     security:
 *       - bearerAuth: []
 */
router.post('/', createOrderValidation, validateRequest, orderController.create);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Atualizar status do pedido (admin)
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', roleMiddleware('admin'), updateOrderValidation, validateRequest, orderController.update);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Remover pedido (admin)
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', roleMiddleware('admin'), orderController.remove);

module.exports = router;
