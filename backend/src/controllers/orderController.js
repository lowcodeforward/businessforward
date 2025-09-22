const { v4: uuidv4 } = require('uuid');
const { sequelize, Order, OrderItem, Product, User } = require('../models');

module.exports = {
  async list(req, res) {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const orders = await Order.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  },

  async getById(req, res) {
    const { id } = req.params;
    const where = { id };
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    const order = await Order.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.json(order);
  },

  async create(req, res) {
    const { items } = req.body;
    let targetUserId = req.user.id;
    if (req.user.role === 'admin' && req.body.userId) {
      const targetUser = await User.findByPk(req.body.userId);
      if (!targetUser) {
        return res.status(400).json({ message: 'Usuário informado não existe' });
      }
      targetUserId = targetUser.id;
    }

    const transaction = await sequelize.transaction();
    try {
      let total = 0;
      const orderId = uuidv4();
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
          await transaction.rollback();
          return res.status(400).json({ message: `Produto não encontrado: ${item.productId}` });
        }
        const quantity = item.quantity || 1;
        const price = Number(product.price);
        total += price * quantity;
        orderItems.push({
          id: uuidv4(),
          orderId,
          productId: product.id,
          quantity,
          price
        });
      }

      const totalValue = Number(total.toFixed(2));

      await Order.create(
        {
          id: orderId,
          userId: targetUserId,
          total: totalValue
        },
        { transaction }
      );

      await OrderItem.bulkCreate(orderItems, { transaction });
      await transaction.commit();

      const created = await Order.findByPk(orderId, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }]
          }
        ]
      });

      res.status(201).json(created);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    order.status = status || order.status;
    await order.save();
    res.json(order);
  },

  async remove(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    await order.destroy();
    res.status(204).send();
  }
};
