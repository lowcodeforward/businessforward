const express = require('express');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createUserValidation, updateUserValidation } = require('../validations/userValidation');

const router = express.Router();

router.use(roleMiddleware('admin'));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de usuários (apenas administradores)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuários
 *     security:
 *       - bearerAuth: []
 */
router.get('/', userController.list);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obter usuário pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Criar novo usuário
 *     security:
 *       - bearerAuth: []
 */
router.post('/', createUserValidation, validateRequest, userController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Atualizar usuário
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', updateUserValidation, validateRequest, userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Remover usuário
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', userController.remove);

module.exports = router;
