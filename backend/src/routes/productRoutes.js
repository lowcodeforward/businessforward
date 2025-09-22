const express = require('express');
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createProductValidation, updateProductValidation } = require('../validations/productValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestão de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Listar produtos
 *     security:
 *       - bearerAuth: []
 */
router.get('/', productController.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obter produto
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', productController.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Criar produto (admin)
 *     security:
 *       - bearerAuth: []
 */
router.post('/', roleMiddleware('admin'), createProductValidation, validateRequest, productController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Atualizar produto (admin)
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', roleMiddleware('admin'), updateProductValidation, validateRequest, productController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Remover produto (admin)
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', roleMiddleware('admin'), productController.remove);

module.exports = router;
